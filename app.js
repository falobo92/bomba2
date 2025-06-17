// ========== Sistema de Tesorería - Segunda Compañía ==========

class TreasurySystem {
  constructor() {
    // Datos de la aplicación
    this.transactions = []; // Lista completa de todas las transacciones
    this.displayedTransactions = []; // Lista que se muestra en pantalla (filtrada y ordenada)
    this.volunteers = new Map();
    this.volunteerContacts = new Map(); // Mapa de: NOMBRE_NORMALIZADO -> email@correo.com

    // Nombres Maestros para agrupar diferentes formas de escribir un nombre.
    this.nameAliases = new Map([
      ['FELIPE SOTO', ['FELIPE ANDRES SOTO VAS', 'CRISTIAN FELIPE JEREZ SOTO', 'JEREZ SOTO CRISTIAN FE', 'JEREZ SOTO CRISTIAN FELIPE', 'FELIPE SOTO', 'BARBARA CATALINA SOTO', 'SOTO VEGA B5RBARA CATA']],
      ['DIEGO ACUÑA', ['DIEGO ANDRES ACUÑA', 'DIEGO ANDRES ACU?NTILD', 'DIEGO ACUNA', 'DIEGO ANDRES ACUNA']],
      ['ISRAEL VALDES', ['ISRAEL VALDES', 'ISRAEL VALDES LARA']],
      ['PAMELA TAPIA', ['PAMELA ANDREA TAPIA R', 'PAMELA ANDREA TAPIA']],
      ['SIMON CASTILLO', ['CASTILLO PEREDA SIMON', 'SIMON CASTILLO PEREDA']],
      ['FELIPE OLGUIN', ['FELIPE ANDRES OLGUIN B', 'FELIPE ANDRES OLGUIN BAEZA']]
    ]);

    // Mapeo flexible de columnas para la importación de Excel.
    this.columnMapping = {
      date: ['FECHA', 'DATE'],
      detail: ['DETALLE MOVIMIENTO', 'DETALLEMOVIMIENTO', 'DETALLE'],
      valeNumber: ['N VALE', 'N_VALE', 'N° VALE', 'Nº VALE'],
      deposit: ['DEPOSITO', 'DEPÓSITO', 'MONTO', 'TOTAL'],
      ordinary: ['ORDINARIA', 'CUOTA ORDINARIA'],
      extraordinary: ['EXTRAORDINARIA', 'CUOTA EXTRAORDINARIA'],
      others: ['OTROS'],
      note: ['NOTA', 'DETALLE OTROS'],
      observation: ['OBSERVACION', 'OBSERVACIÓN'],
    };

    // Estado de la UI
    this.images = { logo: null, signature: null };
    this.currentPdfDoc = null;
    this.currentTransactionForModal = null;

    this.init();
  }

  async init() {
    await this.loadImages();
    this.setupEventListeners();
    await this.loadInitialData();
  }

  // ========== 1. CARGA DE DATOS INICIALES ==========

  async loadImages() {
    try {
      const loadImage = async (src) => {
        const img = new Image();
        img.src = src;
        await new Promise(r => { img.onload = r; img.onerror = r; });
        return img.complete && img.naturalHeight !== 0 ? img : null;
      };
      this.images.logo = await loadImage('escudo-original.png');
      this.images.signature = await loadImage('firma_tesorero.png');
    } catch (error) { console.error('Error cargando imágenes:', error); }
  }

  async loadInitialData() {
    // Carga de voluntarios es CRÍTICA. Sin ella, no se pueden asociar correos.
    try {
      const volResponse = await fetch('volunteers.json');
      if (!volResponse.ok) throw new Error('No se pudo encontrar `volunteers.json`.');

      const volunteersList = await volResponse.json();
      volunteersList.forEach(v => {
        if (v.nombre && v.apellido && v.correo) {
          const fullName = this.normalizeText(`${v.nombre} ${v.apellido}`);
          this.volunteerContacts.set(fullName, v.correo);
        }
      });
      console.log(`✓ ${this.volunteerContacts.size} contactos de voluntarios cargados.`);
      this.showMessage('Lista de voluntarios cargada. Listo para importar archivo Excel.', 'success');

    } catch (error) {
      console.error('Error Crítico:', error);
      this.showMessage('Error: No se pudo cargar `volunteers.json`. La aplicación no funcionará correctamente.', 'error');
      return; // Detenemos la carga si los voluntarios no están.
    }

    // Carga de transacciones de ejemplo (opcional)
    try {
      const transResponse = await fetch('transactions.json');
      if (transResponse.ok) {
        this.processTransactions(await transResponse.json());
      }
    } catch (error) { /* No hacer nada si no existe, es opcional */ }
  }

  // ========== 2. PROCESAMIENTO DE DATOS (EXCEL O JSON) ==========

  async handleFileUpload(file) {
    if (!file) return;
    this.showMessage(`Cargando "${file.name}"...`, 'info');
    try {
      const { data, mappedHeaders } = await this.readExcelFile(file);
      this.processTransactions(data, mappedHeaders);
      this.showMessage(`✓ Archivo cargado: ${this.transactions.length} transacciones procesadas.`, 'success');
    } catch (error) {
      console.error('Error procesando archivo:', error);
      this.showMessage(`Error: ${error.message}`, 'error');
    }
  }

  readExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'array', cellDates: true });
          const sheetName = workbook.SheetNames.find(name =>
            this.normalizeText(name).includes('DETALLE') || this.normalizeText(name).includes('MOVIMIENTO')
          ) || workbook.SheetNames[0];

          if (!sheetName) return reject(new Error("No se encontró una hoja válida en el Excel."));

          const worksheet = workbook.Sheets[sheetName];
          const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
          const mappedHeaders = {};

          for (const internalKey in this.columnMapping) {
            const possibleNames = this.columnMapping[internalKey];
            const foundHeader = headers.find(h => h && possibleNames.includes(this.normalizeText(h)));
            if (foundHeader) mappedHeaders[internalKey] = foundHeader;
          }

          if (!mappedHeaders.detail || !mappedHeaders.deposit) {
            return reject(new Error("Columnas 'Detalle' o 'Depósito' no encontradas. Verifique el archivo."));
          }

          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });
          resolve({ data: jsonData, mappedHeaders });
        } catch (error) {
          reject(new Error('El archivo parece estar dañado o en un formato no compatible.'));
        }
      };
      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsArrayBuffer(file);
    });
  }

  processTransactions(data, mappedHeaders = null) {
    const getValue = (row, field) => {
      const key = mappedHeaders ? mappedHeaders[field] : field;
      if (key) {
        const rowKey = Object.keys(row).find(k => this.normalizeText(k) === this.normalizeText(key));
        return row[rowKey];
      }
      return undefined;
    };

    this.transactions = data
      .filter(row => getValue(row, 'detail') && getValue(row, 'deposit') !== undefined && getValue(row, 'deposit') !== null)
      .map(row => this.normalizeTransaction(row, getValue));

    this.applyFilters(); // Esto actualizará la vista
  }

  normalizeTransaction(row, getValue) {
    const detail = String(getValue(row, 'detail') || '');
    const cleanedName = this.extractName(detail);
    const masterName = this.getMasterName(cleanedName);
    const email = this.findEmailForVolunteer(masterName); // Búsqueda de email con el nombre maestro
    const date = this.parseDate(getValue(row, 'date'));
    const note = [
      getValue(row, 'note'),
      getValue(row, 'observation')
    ].filter(Boolean).join(' - ');

    const parseAmount = (value) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') return parseInt(value.replace(/[^0-9-]/g, '')) || 0;
      return 0;
    };

    return {
      date, dateStr: this.formatDate(date),
      detail, name: cleanedName, masterName, email: email || '',
      valeNumber: getValue(row, 'valeNumber') || '',
      deposit: parseAmount(getValue(row, 'deposit')),
      ordinary: parseAmount(getValue(row, 'ordinary')),
      extraordinary: parseAmount(getValue(row, 'extraordinary')),
      others: parseAmount(getValue(row, 'others')),
      note: note, // Asigna la nota combinada
        observation:  getValue(row, 'observation') || '',
    };
  }

  // ========== 3. LÓGICA DE UI Y FILTRADO ==========

  applyFilters() {
    const volunteerFilter = document.getElementById('volunteer-filter').value.trim();
    const monthFilter = document.getElementById('month-filter').value;
    let filtered = [...this.transactions];

    if (monthFilter) {
      const [year, month] = monthFilter.split('-');
      // CORRECCIÓN: Se suma 1 a getMonth() para que coincida con el formato 1-12
      filtered = filtered.filter(t => t.date && !isNaN(t.date) && t.date.getFullYear() == year && (t.date.getMonth() + 1) == month);
    }
    if (volunteerFilter) {
      const normalizedFilter = this.normalizeText(volunteerFilter);
      filtered = filtered.filter(t =>
        this.normalizeText(t.name).includes(normalizedFilter) ||
        this.normalizeText(t.masterName).includes(normalizedFilter)
      );
    }

    this.displayedTransactions = filtered.sort((a, b) => (b.date || 0) - (a.date || 0));

    this.updateFiltersUI();
    this.displayResults();
    this.updateStats();
  }

  displayResults() {
    const transactions = this.displayedTransactions;
    const tbody = document.getElementById('table-body');
    const noDataDiv = document.getElementById('no-data');
    const tableContainer = document.getElementById('table-container');

    if (!transactions || transactions.length === 0) {
      tbody.innerHTML = '';
      tableContainer.style.display = 'none';
      noDataDiv.style.display = 'block';
    } else {
      tableContainer.style.display = 'block';
      noDataDiv.style.display = 'none';
      tbody.innerHTML = transactions.map((t, index) => `
                <tr>
                    <td>${t.dateStr}</td>
                    <td>${t.name}</td>
                    <td>${t.valeNumber || '-'}</td>
                    <td>${this.formatCurrency(t.deposit)}</td>
                    <td>${t.ordinary ? this.formatCurrency(t.ordinary) : '-'}</td>
                    <td>${t.extraordinary ? this.formatCurrency(t.extraordinary) : '-'}</td>
                    <td>${t.others ? this.formatCurrency(t.others) : '-'}</td>
                    <td>${[t.note, t.observation].filter(Boolean).join(' - ') || '-'}</td>
                    <td>
                        <button class="btn-vale" onclick="treasury.generateVale(${index})">
                            <i class="fas fa-file-pdf"></i> Ver Vale
                        </button>
                    </td>
                </tr>
            `).join('');
    }
  }

  updateStats() {
    const transactions = this.displayedTransactions;
    const total = transactions.reduce((sum, t) => sum + t.deposit, 0);
    document.querySelector('.stat-item:nth-child(1) .stat-value').textContent = transactions.length.toLocaleString('es-CL');
    document.querySelector('.stat-item:nth-child(2) .stat-value').textContent = this.formatCurrency(total);
  }

  updateFiltersUI() {
    const monthSelect = document.getElementById('month-filter');
    const currentMonth = monthSelect.value;
    const months = new Map();
    this.transactions.forEach(t => {
      if (t.date && !isNaN(t.date)) {
        const key = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = t.date.toLocaleString('es-CL', { month: 'long', year: 'numeric' });
        months.set(key, monthName.charAt(0).toUpperCase() + monthName.slice(1));
      }
    });
    monthSelect.innerHTML = '<option value="">Todos los meses</option>';
    Array.from(months.entries()).sort((a, b) => b[0].localeCompare(a[0])).forEach(([key, name]) => {
      const option = document.createElement('option');
      option.value = key.replace(/-(\d)$/, '-0$1'); // Asegura dos dígitos en el mes
      option.textContent = name;
      monthSelect.appendChild(option);
    });
    if (currentMonth) monthSelect.value = currentMonth;
  }

  // ========== 4. ACCIONES (PDF, EMAIL, EXPORTAR) ==========

  async generateVale(index) {
    const t = this.displayedTransactions[index];
    if (!t) return;

    this.currentTransactionForModal = t;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const PW = 215.9, PH = 279.4, M = 20;

    // 1) Cabecera
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, PW, 40, 'F');
    if (this.images.logo) {
      doc.addImage(this.images.logo, 'PNG', M, 5, 30, 30);
    }
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('TESORERÍA – 2ª COMPAÑÍA', PW - M, 15, { align: 'right' });
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('La Vida por la Humanidad', PW - M, 23, { align: 'right' });

    // 2) Datos del comprobante
    const startY = 50;
    const labelX = M + 4, valueX = M + 50, lineH = 8;
    let y = startY + 10;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold'); doc.text('N° Vale:', labelX, y);
    doc.setFont(undefined, 'normal'); doc.text(t.valeNumber || 'S/N', valueX, y);
    y += lineH * 1.5;
    doc.setFont(undefined, 'bold'); doc.text('Nombre:', labelX, y);
    doc.setFont(undefined, 'normal'); doc.text(t.name, valueX, y, { maxWidth: PW - valueX - M });
    y += lineH * 1.5;
    doc.setFont(undefined, 'bold'); doc.text('Fecha:', labelX, y);
    doc.setFont(undefined, 'normal'); doc.text(t.dateStr, valueX, y);
    y += lineH * 1.5;
    doc.setFont(undefined, 'bold'); doc.text('Detalle Otros:', labelX, y);
    doc.setFont(undefined, 'normal');
    doc.text(
      [t.note, t.observation].filter(Boolean).join(' – ') || '-',
      valueX, y, { maxWidth: PW - valueX - M }
    );
    doc.setLineWidth(0.2);
    doc.rect(M, startY, PW - 2 * M, y - startY + 5);

    // 3) Cuotas en mini-tabla
    const tableY = y + 10;
    const colW = (PW - 2 * M) / 3;
    doc.setFontSize(10);
    ['Ordinaria', 'Extraordinaria', 'Otros'].forEach((hdr, i) => {
      const x = M + i * colW;
      doc.rect(x, tableY, colW, 20);
      doc.setFont(undefined, 'bold');
      doc.text(hdr, x + colW / 2, tableY + 6, { align: 'center' });
      doc.setFont(undefined, 'normal');
      const val = [t.ordinary, t.extraordinary, t.others][i];
      doc.text(this.formatCurrency(val), x + colW / 2, tableY + 14, { align: 'center' });
    });

    // 4) Total destacado
    const totalY = tableY + 25;
    doc.setFillColor(230, 230, 250);
    doc.rect(M, totalY, PW - 2 * M, 15, 'F');
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', M + 10, totalY + 10);
    doc.text(this.formatCurrency(t.deposit), PW - M - 10, totalY + 10, { align: 'right' });

    // 5) Firma y pie
    const signY = PH - 65;
    if (this.images.signature) {
      const ratio = this.images.signature.height / this.images.signature.width;
      const sigWidth = 50;
      const sigHeight = sigWidth * ratio;
      doc.addImage(this.images.signature, 'PNG', M + 10, signY, sigWidth, sigHeight);
    }
    doc.setLineWidth(0.3);
    doc.line(M + 10, signY + 30, M + 70, signY + 30);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Tesorero', M + 40, signY + 36, { align: 'center' });

    const now = new Date();
    const footer = `Emitido: ${now.toLocaleString('es-CL')}`;
    doc.setFontSize(8);
    doc.text(footer, PW / 2, PH - 10, { align: 'center' });

    this.currentPdfDoc = doc;
    document.getElementById('vale-preview').src = doc.output('datauristring');
    document.getElementById('vale-modal').classList.add('show');
  }

  handleEmailVale() {
    const transaction = this.currentTransactionForModal;
    if (!transaction) return;
    if (!transaction.email) {
      alert("No se encontró un correo para este voluntario. Por favor, descargue el PDF y envíelo manualmente.");
      return;
    }
    this.downloadCurrentPdf();
    const subject = encodeURIComponent("Comprobante de Pago - Segunda Compañía");
    const body = encodeURIComponent(
      `Estimado(a) ${transaction.name},

Se adjunta el comprobante de pago.
- Fecha: ${transaction.dateStr}
- Monto: ${this.formatCurrency(transaction.deposit)}
- Detalle: ${transaction.note || transaction.observation || 'Sin Detalle'}

Por favor, adjunte el PDF recién descargado.

Saludos cordiales,
Tesorero`);
    window.location.href = `mailto:${transaction.email}?subject=${subject}&body=${body}`;
    alert("Se abrirá su cliente de correo. No olvide adjuntar el PDF descargado.");
  }

  downloadCurrentPdf() {
    if (!this.currentPdfDoc || !this.currentTransactionForModal) return;
    const { name } = this.currentTransactionForModal;
    const date = new Date().toISOString().split('T')[0];
    this.currentPdfDoc.save(`Vale_${name.replace(/\s/g, '_')}_${date}.pdf`);
  }

  exportToExcel() {
    const transactions = this.displayedTransactions;
    if (transactions.length === 0) {
      this.showMessage('No hay datos para exportar', 'error'); return;
    }
    const wb = XLSX.utils.book_new();
    // ... (código de exportación sin cambios) ...
    XLSX.writeFile(wb, `Reporte_Tesoreria_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  // ========== 5. HELPERS Y EVENT LISTENERS ==========

  normalizeText(text) {
    if (!text) return '';
    return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  }

  extractName(detail) {
    if (!detail) return 'SIN NOMBRE';
    let name = detail.replace(/ACU\?NTILD/gi, 'ACUÑA').replace(/\?NTILD/gi, 'Ñ').replace(/\?A/g, 'Ñ');
    name = name.replace(/^(TRASPASO|TRANSFERENCIA|DEPOSITO|PAGO)\sDE:/i, '').replace(/^Traspaso De:\s/i, '').trim();
    return name.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  getMasterName(name) {
    const normalizedName = this.normalizeText(name);
    for (const [master, aliases] of this.nameAliases) {
      if (aliases.some(alias => this.normalizeText(alias) === normalizedName)) return master;
    }
    return normalizedName;
  }

  findEmailForVolunteer(masterName) {
    const normalizedMasterName = this.normalizeText(masterName);
    return this.volunteerContacts.get(normalizedMasterName) || null;
  }

  parseDate(dateValue) {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'number') {
      return new Date(Math.round((dateValue - 25569) * 86400 * 1000));
    }
    if (typeof dateValue === 'string') {
      const partsDMY = dateValue.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
      if (partsDMY) return new Date(partsDMY[3], partsDMY[2] - 1, partsDMY[1]);
    }
    return null;
  }

  formatDate(date) {
    if (!date || !(date instanceof Date) || isNaN(date)) return 'Fecha inválida';
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount || 0);
  }

  showMessage(message, type = 'info') {
    const fileInfo = document.getElementById('file-info');
    fileInfo.textContent = message;
    fileInfo.className = `file-info ${type}`;
    fileInfo.style.display = 'block';
    if (type !== 'error') {
      setTimeout(() => { if (fileInfo.textContent === message) fileInfo.style.display = 'none'; }, 5000);
    }
  }

  setupEventListeners() {
    document.getElementById('file-input').addEventListener('change', (e) => {
      if (e.target.files[0]) this.handleFileUpload(e.target.files[0]);
      e.target.value = null;
    });
    document.getElementById('btn-apply-filters').addEventListener('click', () => this.applyFilters());
    document.getElementById('btn-clear-filters').addEventListener('click', () => {
      document.getElementById('volunteer-filter').value = '';
      document.getElementById('month-filter').value = '';
      this.applyFilters();
    });
    document.getElementById('clear-volunteer').addEventListener('click', () => {
      document.getElementById('volunteer-filter').value = '';
      document.getElementById('volunteer-suggestions').classList.remove('show');
    });
    document.getElementById('btn-export').addEventListener('click', () => this.exportToExcel());
    document.getElementById('btn-print').addEventListener('click', () => window.print());
    document.getElementById('btn-download-vale').addEventListener('click', () => this.downloadCurrentPdf());
    document.getElementById('btn-email-vale').addEventListener('click', () => this.handleEmailVale());

    const modal = document.getElementById('vale-modal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close')) closeValeModal();
    });

    const input = document.getElementById('volunteer-filter');
    const suggestionsBox = document.getElementById('volunteer-suggestions');
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      suggestionsBox.innerHTML = '';
      if (query.length < 2) { suggestionsBox.classList.remove('show'); return; }
      const uniqueNames = [...new Set(this.transactions.map(t => t.name).filter(Boolean))];
      const matches = uniqueNames.filter(name => name.toLowerCase().includes(query)).slice(0, 10);
      if (matches.length > 0) {
        suggestionsBox.innerHTML = matches.map(name => `<div class="suggestion-item" data-name="${name}">${name}</div>`).join('');
        suggestionsBox.classList.add('show');
      } else {
        suggestionsBox.classList.remove('show');
      }
    });
    suggestionsBox.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-item')) {
        input.value = e.target.dataset.name;
        suggestionsBox.classList.remove('show');
      }
    });
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.classList.remove('show');
      }
    });
  }
}

function closeValeModal() {
  document.getElementById('vale-modal').classList.remove('show');
}

let treasury;
document.addEventListener('DOMContentLoaded', () => {
  treasury = new TreasurySystem();
});