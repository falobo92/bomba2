class TreasurySystem {
  constructor() {
    this.transactions = [];
    this.displayedTransactions = [];
    this.volunteerData = new Map();
    this.sentVales = new Set();
    this.nameAliases = new Map([
      ['FELIPE SOTO', ['FELIPE ANDRES SOTO VAS', 'FELIPE SOTO', 'ANDRES ALEJANDRO SOTO', 'FELIPE ANDRES SOTO SOTO', 'ANDRES ALEJANDRO SOTO NUNEZ']],
      ['CRISTIAN JEREZ SOTO', ['CRISTIAN FELIPE JEREZ SOTO', 'JEREZ SOTO CRISTIAN FE', 'JEREZ SOTO CRISTIAN FELIPE']],
      ['BARBARA SOTO', ['BARBARA CATALINA SOTO', 'SOTO VEGA B5RBARA CATA', 'SOTO VEGA B5RBARA CATALINA']],
      ['DIEGO ACUÑA', ['DIEGO ANDRES ACUÑA', 'DIEGO ANDRES ACU?NTILD', 'DIEGO ACUNA', 'DIEGO ANDRES ACUNA']],
      ['ISRAEL VALDES', ['ISRAEL VALDES', 'ISRAEL VALDES LARA']],
      ['PAMELA TAPIA', ['PAMELA ANDREA TAPIA R', 'PAMELA ANDREA TAPIA', 'PAMELA ANDREA TAPIA RETAMAL']],
      ['SIMON CASTILLO', ['CASTILLO PEREDA SIMON', 'SIMON CASTILLO PEREDA']],
      ['FELIPE OLGUIN', ['FELIPE ANDRES OLGUIN B', 'FELIPE ANDRES OLGUIN BAEZA']],
      ['FELIPE VALDERRAMA', ['FELIPE EDUARDO VALDERR', 'FELIPE EDUARDO VALDERRAMA S']],
      ['DOMINIQUE SAAVEDRA', ['DOMINIQUE PAOLA SAAVED']],
      ['JAVIERA INNOCENTI', ['JAVIERA FRANCISCA INNO']],
      ['THALIS FREITAS', ['THALIS STEFANE FREITAS']],
      ['VICENTE ROMO', ['ROMO FIGUEROA ANDRES E', 'ROMO PARDO VICENTE ANDRES']],
      ['EDUARDO LAZCANO', ['LAZCANO SALDIAS EDUARD', 'LAZCANO SALDIAS EDUARDO IGN']],
      ['CAMILA MUNOZ', ['CAMILA FERNANDA MUNOZ', 'CAMILA FERNANDA MUNOZ ALVIN']],
      ['SEBASTIAN MENA', ['SEBASTIAN IGNACIO MENA', 'SEBASTIAN IGNACIO MENA IGOR']],
      ['JAVIER LOBO', ['JAVIER LOBO BORIC']],
      ['ALVARO MONARES', ['MONARES GUAJARDO ALVAR', 'ALVARO JOSE MONARES GU', 'MONARES GUAJARDO ALVARO JOS']],
      ['MARIA FERNANDA SEYLER', ['MARIA FERNANDA SEYLER']],
      ['RICARDO LILLO', ['RICARDO FLAVIO LILLO', 'RICARDO FLAVIO LILLO GANTER']],
      ['SILVIA BRAVO', ['SILVIA ISABEL BRAVO DI', 'SILVIA ISABEL BRAVO DIAZ']],
      ['ISMAEL CARRENO', ['CARRENO URREJOLA ISMAE', 'CARRENO URREJOLA ISMAEL ALB']],
      ['EMILIO MONJE', ['EMILIO GONZALO JORGE M', 'EMILIO MONJE']],
      ['HUGO GUZMAN', ['HUGO GONZALO GUZMAN RA', 'HUGO GONZALO GUZMAN RAMBALDI']],
      ['JEANNETTE TAPIA', ['JEANNETTE LILIAN TAPIA', 'TAPIA RETAMAL JEANNETT', 'JEANNETTE LILIAN TAPIA RETA']],
      ['MANOLO VILLALTA', ['VILLALTA INOSTROZA MAN', 'VILLALTA INOSTROZA MANOLO A']],
      ['ESTEBAN GASCON', ['ESTEBAN MARTIN GASCON', 'ESTEBAN MARTIN GASCON OSORI']],
      ['CAMILO DIAZ', ['DIAZ PINTO CAMILO ANTO', 'DIAZ PINTO CAMILO ANTONIO']],
      ['ESAU OTERO', ['ESAU ARIEL OTERO REYES']],
      ['JONATHAN FAJARDO', ['FAJARDO VASQUEZ JONATH', 'FAJARDO VASQUEZ JONATHAN IS']],
      ['ESTEBAN TRONCOSO', ['TRONCOSO VILCHES ESTEB', 'TRONCOSO VILCHES ESTEBAN AN', 'TRONCOSO VILCHES ESTEBAN ANDRES']],
      ['MARCO SUBERCASEAUX', ['MARCO ALEJANDRO SUBERC']],
      ['MATIAS BELTRAN', ['MATIAS SANTIAGO BELTRA']],
      ['GASPAR MENDOZA', ['MENDOZA MAFFEI GASPAR']],
      ['RODRIGO DIAZ', ['RODRIGO ANDRES DIAZ ME']],
      ['CATALINA SILVA', ['CATALINA ANDREA SILVA', 'CATALINA ANDREA SILVA CAMPO']],
      ['RICARDO GONZALEZ', ['RICARDO DANIEL GONZALE']],
      ['MAXIMILIANO CONTRERAS', ['MAXIMILIANO ALBERTO CO']],
      ['MARIO TORREJON', ['MARIO EDGARDO TORREJON', 'MARIO EDGARDO TORREJON VALE', 'MARIO EDGARDO TORREJON VALENZUELA']],
      ['ALVARO LUCERO', ['ALVARO ANTONIO LUCERO', 'LUCERO TOLEDO ALVARO ANTONI']],
      ['MIGUEL HERNANDEZ', ['MIGUEL IGNACIO HERNAND']],
      ['EDUARDO GALVEZ', ['EDUARDO ENIQUE GALVEZ', 'EDUARDO ENRIQUE GALVEZ', 'FELIPE EDUARDO GALVEZ YUTRO']],
      ['GASTON SANDOVAL', ['GASTON NELSON SANDOVAL', 'GASTON NELSON SANDOVAL JARA']],
      ['JORGE MIGUELES', ['JORGE ALEXIS MIGUELES', 'JORGE ALEXIS MIGUELES REBOLLEDO', 'JORGE ALEXIS MIGUELES REBOL']],
      ['CLAUDIO BERNAL', ['CLAUDIO ANTONIO BERNAL', 'BERNAL MENA CLAUDIO ANTONIO', 'BERNAL MENA CLAUDIO AN']],
      ['VICENTE MEZA', ['MEZA SEPULVEDA VICENTE', 'MEZA SEPULVEDA VICENTE ALBERTO']],
      ['CHRISTIAN GROB', ['CHRISTIAN GROB HERNAND', 'CHRISTIAN GROB HERNANDEZ']],
      ['HECTOR MIRANDA', ['HECTOR IGNACIO MIRANDA', 'HECTOR IGNACIO MIRANDA ZALA', 'HECTOR IGNACIO MIRANDA ZALAQUETT']],
      ['FELIPE MILLAN', ['FELIPE ALEJANDRO MILLA', 'FELIPE ALEJANDRO MILLAN VID']],
      ['MATIAS CARRASCO', ['MATIAS NICOLAS CARRASC', 'MATIAS NICOLAS CARRASCO ORT', 'MATIAS NICOLAS CARRASCO ORTEGA']],
      ['VALENTINA GYLLEN', ['VALENTINA PAZ GYLLEN M', 'VALENTINA GYLLEN', 'VALENTINA PAZ GYLLEN MARTIN']],
      ['SAIDA POLLAK', ['POLLAK DONOSO SAIDA ES']],
      ['DANIEL MOLINA', ['DANIEL ESTEBAN MOLINA', 'DANIEL ESTEBAN MOLINA OSORIO']],
      ['OSCAR VARGAS', ['VARGAS HOGER OSCAR MAN', 'VARGAS HOGER OSCAR MANUEL']],
      ['ESTEBAN TEJO', ['ESTEBAN ALEJANDRO TEJO', 'ESTEBAN ALEJANDRO TEJO CAVALIERI']],
      ['MARIA PAZ CAMPOS', ['MARIA PAZ CAMPOS VASQU', 'MARIA PAZ CAMPOS VASQUEZ']],
      ['PATRICIO SOLIS', ['SOLIS DEL DESPOSITO PA', 'SOLIS DEL DESPOSITO PATRICI']],
      ['MARIA JESUS VERNAL', ['MARIA JESUS VERNAL BRI', 'VERNAL BRITO MARIA JES', 'VERNAL BRITO MARIA JESUS', 'MARIA JESUS VERNAL BRITO']],
      ['JOSE MIGUEL ABUDINEN', ['JOSE MIGUEL ABUDINEN B', 'JOSE MIGUEL ABUDINEN BUTTO']],
      ['CRISTIAN MIRANDA', ['CRISTIAN ERNESTO MIRAN', 'CRISTIAN ERNESTO MIRANDA GALVEZ']],
      ['HENRY ORTIZ', ['HENRY MARCIAL ORTIZ GR', 'HENRY MARCIAL ORTIZ GRANDON']],
      ['SERGIO REYES', ['REYES ARAYA SERGIO ALE', 'REYES ARAYA SERGIO ALEJANDR']],
      ['ALEXANDROS DZAZOPULOS', ['DZAZOPULOS ELGUETA ALE', 'DZAZOPULOS ELGUETA ALEXANDROS']],
      ['RAIMUNDO CONCHA', ['RAIMUNDO ANTONIO CONCHA CORTI', 'RAIMUNDO ANTONIO CONCH', 'RAIMUNDO ANTONIO CONCHA COR']],
      ['RODRIGO CASTRO', ['CASTRO GONZALEZ RODRIGO ANDRES']],
      ['VICTOR AGUILERA', ['AGUILERA GRANA VICTOR EDUARDO']],
      ['RAYMI UGAZ', ['UGAZ AYALA RAYMI ANDRES', 'RAYMI UGAZ AYALA', 'RAYMI UGAZ']],
      ['ANDRES LEIVA', ['ANDRES FELIPE LEIVA PARDO']],
      ['ESTEBAN VILCHES', ['TRONCOSO VILCHES ESTEBAN ANDRES', 'ESTEBAN IGNACIO VILCHES MAN']],
      ['MARCELO DONOSO', ['DONOSO DIAZ MARCELO OCTAVIO', 'MARCELO DONOSO']],
      ['CATALINA VALENZUELA', ['VALENZUELA MAUREIRA CATALINA VALESKA', 'VALENZUELA MAUREIRA CA']],
      ['JULIO MORALES', ['JULIO MORALES']],
      ['CRISTOBAL MORALES', ['CRISTOBAL ANDRES MORALES RAVEST', 'CRISTOBAL ANDRES MORALES RA', 'CRISTOBAL ANDRES MORAL']],
      ['IGNACIO PACHECO', ['IGNACIO PACHECO LOPEZ']],
      ['LILIANA PINTANEL', ['LILIANA DEL CARMEN PINTANEL', 'LILIANA DEL CARMEN PIN']],
      ['GERMAN SALAZAR', ['GERMAN FEDERICO EUGE SALAZA']],
      ['BRUNNO RETAMAL', ['BRUNNO ALEJANDRO RETAM']],
      ['SERGIO ESCUDERO', ['SERGIO ALEJANDRO ESCUDERO C']],
      ['FERNANDA TORO', ['FERNANDA TORO ESTAY']],
      ['ANGEL OSSES', ['ANGEL FRANCISCO OSSES']],
      ['BRUNO ALISTE', ['BRUNO ALISTE MONEY']],
    ]);
    this.columnMapping = { date: ['FECHA', 'DATE'], detail: ['DETALLE MOVIMIENTO', 'DETALLEMOVIMIENTO', 'DETALLE'], valeNumber: ['N VALE', 'N_VALE', 'N° VALE', 'Nº VALE'], deposit: ['DEPOSITO', 'DEPÓSITO', 'MONTO', 'TOTAL'], ordinary: ['ORDINARIA', 'CUOTA ORDINARIA'], extraordinary: ['EXTRAORDINARIA', 'CUOTA EXTRAORDINARIA'], others: ['OTROS'], note: ['NOTA', 'DETALLE OTROS'], observation: ['OBSERVACION', 'OBSERVACIÓN'] };
    this.images = { logo: null, signature: null };
    this.currentPdfDoc = null;
    this.currentTransactionForModal = null;
    this.editingTransactionIndex = null;
    this.init();
  }

  async init() {
    this.loadSentValesFromStorage();
    await this.loadImages();
    this.setupEventListeners();
    await this.loadInitialData();
  }

  loadSentValesFromStorage() {
    try {
      const sentValesData = localStorage.getItem('sentVales');
      if (sentValesData) {
        this.sentVales = new Set(JSON.parse(sentValesData));
      }
    } catch (error) {
      this.sentVales = new Set();
    }
  }

  updateSentValesStorage() {
    localStorage.setItem('sentVales', JSON.stringify(Array.from(this.sentVales)));
  }

  clearSentVales() {
    if (confirm("¿Está seguro de que desea borrar todos los registros de vales enviados? Esta acción no se puede deshacer.")) {
      this.sentVales.clear();
      localStorage.removeItem('sentVales');
      this.showMessage("Registros de envío limpiados.", 'warning');
      this.displayResults();
    }
  }

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
    try {
      const volResponse = await fetch('volunteers.json');
      if (!volResponse.ok) throw new Error('No se pudo encontrar `volunteers.json`.');
      const volunteersList = await volResponse.json();
      volunteersList.forEach(v => {
        if (v.nombre && v.apellido) {
          const masterName = this.normalizeText(`${v.nombre} ${v.apellido}`);
          this.volunteerData.set(masterName, {
            email: v.correo || null,
            nombre: v.nombre,
            apellido: v.apellido,
            officialName: this.formatNameToTitleCase(`${v.nombre} ${v.apellido}`)
          });
        }
      });
      this.showMessage('Lista de voluntarios cargada.', 'success');
    } catch (error) {
      this.showMessage('Error: No se pudo cargar `volunteers.json`. La aplicación no funcionará correctamente.', 'error', false);
    }
  }

  async handleFileUpload(file) {
    if (!file) return;
    this.showMessage(`Cargando "${file.name}"...`, 'info');
    try {
      const { data, mappedHeaders } = await this.readExcelFile(file);
      this.processTransactions(data, mappedHeaders);
      this.showMessage(`✓ Archivo cargado: ${this.transactions.length} transacciones procesadas.`, 'success');
    } catch (error) {
      this.showMessage(`Error: ${error.message}`, 'error', false);
    }
  }

  readExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'array', cellDates: true });
          const sheetName = workbook.SheetNames.find(name => this.normalizeText(name).includes('DETALLE') || this.normalizeText(name).includes('MOVIMIENTO')) || workbook.SheetNames[0];
          if (!sheetName) return reject(new Error("No se encontró una hoja válida en el Excel."));
          const worksheet = workbook.Sheets[sheetName];
          const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
          const mappedHeaders = {};
          for (const internalKey in this.columnMapping) {
            const possibleNames = this.columnMapping[internalKey];
            const foundHeader = headers.find(h => h && possibleNames.includes(this.normalizeText(h)));
            if (foundHeader) mappedHeaders[internalKey] = foundHeader;
          }
          if (!mappedHeaders.detail || !mappedHeaders.deposit) return reject(new Error("Columnas 'Detalle' o 'Depósito' no encontradas. Verifique el archivo."));
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
      .map((row, index) => this.normalizeTransaction(row, getValue, index));
    this.applyFilters();
  }

  normalizeTransaction(row, getValue, index) {
    const detail = String(getValue(row, 'detail') || '');
    const nameFromExcel = this.extractName(detail);
    const masterName = this.getMasterName(nameFromExcel);
    const volunteer = this.volunteerData.get(masterName);
    const date = this.parseDate(getValue(row, 'date'));
    const deposit = this.parseAmount(getValue(row, 'deposit'));
    const transactionId = `${this.formatDate(date)}-${masterName}-${deposit}-${index}`;

    return {
      id: transactionId,
      date,
      dateStr: this.formatDate(date),
      detail,
      nameFromExcel: nameFromExcel,
      officialDisplayName: volunteer ? volunteer.officialName : nameFromExcel,
      nombre: volunteer ? volunteer.nombre : '',
      apellido: volunteer ? volunteer.apellido : '',
      masterName: masterName,
      email: volunteer ? volunteer.email || 'correo@reemplazame.cl' : 'correo@reemplazame.cl',
      valeNumber: getValue(row, 'valeNumber') || '',
      deposit: deposit,
      ordinary: this.parseAmount(getValue(row, 'ordinary')),
      extraordinary: this.parseAmount(getValue(row, 'extraordinary')),
      others: this.parseAmount(getValue(row, 'others')),
      note: [getValue(row, 'note'), getValue(row, 'observation')].filter(Boolean).join(' - '),
    };
  }

  applyFilters() {
    const volunteerFilter = document.getElementById('volunteer-filter').value.trim();
    const monthFilter = document.getElementById('month-filter').value;
    let filtered = [...this.transactions];
    if (monthFilter) {
      const [year, month] = monthFilter.split('-');
      filtered = filtered.filter(t => t.date && !isNaN(t.date) && t.date.getFullYear() == year && (t.date.getMonth() + 1) == month);
    }
    if (volunteerFilter) {
      const normalizedFilter = this.normalizeText(volunteerFilter);
      filtered = filtered.filter(t => this.normalizeText(t.nameFromExcel).includes(normalizedFilter) || (t.masterName && this.normalizeText(t.masterName).includes(normalizedFilter)));
    }
    this.displayedTransactions = filtered.sort((a, b) => (b.date || 0) - (a.date || 0));
    this.updateFiltersUI();
    this.displayResults();
    this.updateStats();
  }

  displayResults() {
    const tbody = document.getElementById('table-body');
    const noDataDiv = document.getElementById('no-data');
    const tableContainer = document.getElementById('table-container');

    if (!this.displayedTransactions || this.displayedTransactions.length === 0) {
      tbody.innerHTML = '';
      tableContainer.style.display = 'none';
      noDataDiv.style.display = 'block';
    } else {
      tableContainer.style.display = 'block';
      noDataDiv.style.display = 'none';
      tbody.innerHTML = this.displayedTransactions.map((t, index) => {
        const isSent = this.sentVales.has(t.id);
        const hasNoEmail = t.email === 'correo@reemplazame.cl';
        const sentClass = isSent ? 'sent' : '';
        const noEmailClass = hasNoEmail ? 'no-email' : '';
        const buttonHtml = isSent
          ? `<div class="action-buttons">
              <button class="btn-vale" onclick="event.stopPropagation(); treasury.generateVale(${index})"><i class="fas fa-file-pdf"></i> Ver Vale</button>
              <button class="btn-vale btn-uncheck" onclick="event.stopPropagation(); treasury.unmarkAsSent(${index})"><i class="fas fa-times"></i></button>
            </div>`
          : `<div class="action-buttons">
              <button class="btn-vale" onclick="event.stopPropagation(); treasury.generateVale(${index})"><i class="fas fa-file-pdf"></i> Ver Vale</button>
              <button class="btn-vale" onclick="event.stopPropagation(); treasury.markAsSent(${index})"><i class="fas fa-check"></i></button>
            </div>`;
        return `
          <tr class="${sentClass} ${noEmailClass}" onclick="treasury.openEditTransactionModal(${index})" style="cursor: pointer;">
              <td>${t.dateStr}</td>
              <td>${t.nameFromExcel}</td>
              <td>${t.valeNumber || '-'}</td>
              <td>${this.formatCurrency(t.deposit)}</td>
              <td>${t.ordinary ? this.formatCurrency(t.ordinary) : '-'}</td>
              <td>${t.extraordinary ? this.formatCurrency(t.extraordinary) : '-'}</td>
              <td>${t.others ? this.formatCurrency(t.others) : '-'}</td>
              <td>${t.note || '-'}</td>
              <td>${buttonHtml}</td>
          </tr>`;
      }).join('');
    }
  }

  markAsSent(index) {
    const transaction = this.displayedTransactions[index];
    if (!transaction) return;
    
    if (confirm('¿Está seguro de marcar este vale como enviado?')) {
      this.sentVales.add(transaction.id);
      this.updateSentValesStorage();
      this.displayResults();
      this.showMessage('Vale marcado como enviado.', 'success');
    }
  }

  unmarkAsSent(index) {
    const transaction = this.displayedTransactions[index];
    if (!transaction) return;
    
    if (confirm('¿Está seguro de quitar el check de enviado de este vale?')) {
      this.sentVales.delete(transaction.id);
      this.updateSentValesStorage();
      this.displayResults();
      this.showMessage('Check de enviado quitado.', 'success');
    }
  }

  updateStats() {
    const total = this.displayedTransactions.reduce((sum, t) => sum + t.deposit, 0);
    document.querySelector('.stat-item:nth-child(1) .stat-value').textContent = this.displayedTransactions.length.toLocaleString('es-CL');
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
      option.value = key;
      option.textContent = name;
      monthSelect.appendChild(option);
    });
    if (currentMonth) monthSelect.value = currentMonth;
  }

  async generateVale(index) {
    const t = this.displayedTransactions[index];
    if (!t) return;
    this.currentTransactionForModal = t;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const PW = 215.9, PH = 279.4, M = 20;

    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, PW, 40, 'F');
    if (this.images.logo) {
      const logoWidth = 25;
      const aspectRatio = this.images.logo.height / this.images.logo.width;
      const logoHeight = logoWidth * aspectRatio;
      doc.addImage(this.images.logo, 'PNG', M, (40 - logoHeight) / 2, logoWidth, logoHeight);
    }
    doc.setFontSize(18); doc.setFont(undefined, 'bold'); doc.text('TESORERÍA – 2ª COMPAÑÍA', PW - M, 15, { align: 'right' });
    doc.setFontSize(12); doc.setFont(undefined, 'normal'); doc.text('La Vida por la Humanidad', PW - M, 23, { align: 'right' });

    const startY = 50;
    const labelX = M + 4, valueX = M + 50, lineH = 8;
    let y = startY + 10;

    const pdfName = (t.apellido && t.nombre) ? `${t.apellido}, ${t.nombre}`.toUpperCase() : t.officialDisplayName.toUpperCase();

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold'); doc.text('N° Vale:', labelX, y); doc.setFont(undefined, 'normal'); doc.text(t.valeNumber || 'S/N', valueX, y);
    y += lineH * 1.5; doc.setFont(undefined, 'bold'); doc.text('Nombre:', labelX, y); doc.setFont(undefined, 'normal'); doc.text(pdfName, valueX, y, { maxWidth: PW - valueX - M });
    y += lineH * 1.5; doc.setFont(undefined, 'bold'); doc.text('Fecha:', labelX, y); doc.setFont(undefined, 'normal'); doc.text(t.dateStr, valueX, y);
    y += lineH * 1.5; doc.setFont(undefined, 'bold'); doc.text('Detalle Otros:', labelX, y); doc.setFont(undefined, 'normal'); doc.text(t.note || '-', valueX, y, { maxWidth: PW - valueX - M });
    doc.setLineWidth(0.2); doc.rect(M, startY, PW - 2 * M, y - startY + 5);

    const tableY = y + 10;
    const colW = (PW - 2 * M) / 3;
    doc.setFontSize(10);
    ['Ordinaria', 'Extraordinaria', 'Otros'].forEach((hdr, i) => {
      const x = M + i * colW;
      doc.rect(x, tableY, colW, 20);
      doc.setFont(undefined, 'bold'); doc.text(hdr, x + colW / 2, tableY + 6, { align: 'center' });
      doc.setFont(undefined, 'normal'); const val = [t.ordinary, t.extraordinary, t.others][i];
      doc.text(this.formatCurrency(val), x + colW / 2, tableY + 14, { align: 'center' });
    });

    const totalY = tableY + 25;
    doc.setFillColor(230, 230, 250); doc.rect(M, totalY, PW - 2 * M, 15, 'F');
    doc.setFontSize(14); doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', M + 10, totalY + 10); doc.text(this.formatCurrency(t.deposit), PW - M - 10, totalY + 10, { align: 'right' });

    const signY = PH - 65;
    if (this.images.signature) {
      const ratio = this.images.signature.height / this.images.signature.width;
      const sigWidth = 50; const sigHeight = sigWidth * ratio;
      doc.addImage(this.images.signature, 'PNG', M + 10, signY, sigWidth, sigHeight);
    }
    doc.setLineWidth(0.3); doc.line(M + 10, signY + 30, M + 70, signY + 30);
    doc.setFontSize(11); doc.setFont(undefined, 'normal'); doc.text('Tesorero', M + 40, signY + 36, { align: 'center' });
    const now = new Date(); const footer = `Emitido: ${now.toLocaleString('es-CL')}`;
    doc.setFontSize(8); doc.text(footer, PW / 2, PH - 10, { align: 'center' });
    this.currentPdfDoc = doc;
    document.getElementById('vale-preview').src = doc.output('datauristring');
    document.getElementById('vale-modal').classList.add('show');
  }

  showMessage(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    switch(type) {
      case 'success':
        icon = 'fas fa-check-circle';
        break;
      case 'error':
        icon = 'fas fa-exclamation-circle';
        break;
      default:
        icon = 'fas fa-info-circle';
    }
    
    toast.innerHTML = `
      <i class="${icon}"></i>
      <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remover el toast después de 3 segundos
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
  }

  handleEmailVale() {
    const transaction = this.currentTransactionForModal;
    if (!transaction) return;
    
    this.downloadCurrentPdf();
    
    // Determinar el concepto de pago con mejor lógica
    let paymentConcept = this.getPaymentConcept(transaction);
    
    // Crear fecha actual formateada
    const currentDate = new Date().toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
    
    const subject = encodeURIComponent(`Comprobante de ${paymentConcept} - Segunda Compañía`);
    
    // Crear el cuerpo del correo mejorado
    const body = encodeURIComponent(this.createEmailBody(transaction, paymentConcept, currentDate));
    
    const emailAction = () => {
      const mailtoLink = `mailto:${transaction.email === 'correo@reemplazame.cl' ? '' : transaction.email}?subject=${subject}&body=${body}`;
      window.open(mailtoLink, '_blank');
      this.showMessage("Se abrirá su cliente de correo. No olvide adjuntar el PDF descargado.", "info");
      this.sentVales.add(transaction.id);
      this.updateSentValesStorage();
      closeValeModal();
      this.displayResults();
    };
    
    if (transaction.email === 'correo@reemplazame.cl') {
      this.showMessage("No se encontró un correo para este voluntario. Se abrirá el cliente de correo para que ingrese la dirección manualmente.", "info");
    }
    
    emailAction();
  }

  // Función para determinar el concepto de pago
  getPaymentConcept(transaction) {
    const hasOrdinary = transaction.ordinary > 0;
    const hasExtraordinary = transaction.extraordinary > 0;
    const hasOthers = transaction.others > 0;
    
    // Múltiples conceptos
    if ((hasOrdinary && hasExtraordinary) || (hasOrdinary && hasOthers) || (hasExtraordinary && hasOthers) || (hasOrdinary && hasExtraordinary && hasOthers)) {
      return 'Abono Múltiple';
    }
    
    // Conceptos únicos
    if (hasOrdinary && !hasExtraordinary && !hasOthers) {
      return 'Cuota Ordinaria';
    }
    
    if (hasExtraordinary && !hasOrdinary && !hasOthers) {
      return 'Cuota Extraordinaria';
    }
    
    if (hasOthers && !hasOrdinary && !hasExtraordinary) {
      return 'Otros Conceptos';
    }
    
    // Fallback
    return 'Abono/Pago';
  }

  // Función para crear el cuerpo del correo
  createEmailBody(transaction, paymentConcept, currentDate) {
    let detalles = `• Concepto: ${paymentConcept}\n• Fecha: ${transaction.dateStr}\n• Monto: ${this.formatCurrency(transaction.deposit)}`;
    
    // Agregar observaciones si existen
    if (transaction.note && transaction.note.trim() !== '') {
      detalles += `\n• Observaciones: ${transaction.note}`;
    }
    
    // Agregar desglose si hay múltiples conceptos
    if (paymentConcept === 'Abono Múltiple') {
      detalles += '\n\nDESGLOSE:';
      if (transaction.ordinary > 0) {
        detalles += `\n• Cuota Ordinaria: ${this.formatCurrency(transaction.ordinary)}`;
      }
      if (transaction.extraordinary > 0) {
        detalles += `\n• Cuota Extraordinaria: ${this.formatCurrency(transaction.extraordinary)}`;
      }
      if (transaction.others > 0) {
        detalles += `\n• Otros Conceptos: ${this.formatCurrency(transaction.others)}`;
      }
    }
    
    return `Estimado(a) ${transaction.officialDisplayName},

Hemos registrado exitosamente su pago.

DETALLES DEL PAGO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${detalles}

Se adjunta el comprobante oficial en formato PDF.

Si tiene alguna consulta, no dude en contactarnos.

Saludos cordiales,
Tesorería - Segunda Compañía de Bomberos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Este comprobante fue generado el ${currentDate}`;
  }

  downloadCurrentPdf() {
    if (!this.currentPdfDoc || !this.currentTransactionForModal) return;

    // 1. Desestructuramos para obtener las propiedades que necesitamos del objeto de la transacción.
    //    Añadimos 'valeNumber' a la lista.
    const { officialDisplayName, valeNumber } = this.currentTransactionForModal;

    // 2. Obtenemos la fecha de hoy en un formato amigable para nombres de archivo (YYYY-MM-DD).
    const date = new Date().toISOString().split('T')[0];
    
    // 3. Preparamos los componentes del nombre del archivo.
    //    - Si 'valeNumber' no existe, usamos 'SN' (Sin Número) como valor por defecto.
    //    - Reemplazamos los espacios en el nombre por guiones bajos para evitar problemas en algunos sistemas.
    const valeId = valeNumber || 'SN';
    const sanitizedName = officialDisplayName.replace(/\s/g, '_');

    // 4. Ensamblamos el nombre del archivo final con el nuevo formato.
    const filename = `Vale_${valeId}_${sanitizedName}_${date}.pdf`;

    // 5. Guardamos el PDF con el nuevo nombre.
    this.currentPdfDoc.save(filename);
  }

  exportToExcel() {
    if (this.displayedTransactions.length === 0) {
      this.showMessage('No hay datos para exportar.', 'error', false);
      return;
    }
    const dataToExport = this.displayedTransactions.map(t => ({
      'Fecha': t.dateStr,
      'Voluntario (Excel)': t.nameFromExcel,
      'Voluntario (Oficial)': t.officialDisplayName,
      'N° Vale': t.valeNumber,
      'Depósito': t.deposit,
      'Cuota Ordinaria': t.ordinary,
      'Cuota Extraordinaria': t.extraordinary,
      'Otros': t.others,
      'Detalle/Nota': t.note,
      'Email': t.email,
      'Enviado': this.sentVales.has(t.id) ? 'Sí' : 'No'
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `Reporte_Tesoreria_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  parseAmount(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseInt(value.replace(/[^0-9-]/g, '')) || 0;
    return 0;
  }

  normalizeText(text) { if (!text) return ''; return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim(); }

  extractName(detail) { if (!detail) return 'SIN NOMBRE'; let name = detail.replace(/ACU\?NTILD/gi, 'ACUÑA').replace(/\?NTILD/gi, 'Ñ').replace(/\?A/g, 'Ñ'); name = name.replace(/^(TRASPASO|TRANSFERENCIA|DEPOSITO|PAGO)\s*DE:?\s*/i, '').trim(); return this.formatNameToTitleCase(name); }

  getMasterName(name) { const normalizedName = this.normalizeText(name); for (const [master, aliases] of this.nameAliases.entries()) { if (aliases.some(alias => this.normalizeText(alias) === normalizedName)) { return master; } } if (this.volunteerData.has(normalizedName)) { return normalizedName; } for (const masterKey of this.volunteerData.keys()) { if (masterKey.startsWith(normalizedName) || normalizedName.startsWith(masterKey)) { return masterKey; } } return normalizedName; }

  parseDate(dateValue) { if (!dateValue) return null; if (dateValue instanceof Date) return dateValue; if (typeof dateValue === 'number') { return new Date(Math.round((dateValue - 25569) * 86400 * 1000)); } if (typeof dateValue === 'string') { const partsDMY = dateValue.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/); if (partsDMY) return new Date(partsDMY[3], partsDMY[2] - 1, partsDMY[1]); } return null; }

  formatDate(date) { if (!date || !(date instanceof Date) || isNaN(date)) return 'Fecha inválida'; return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }); }

  formatCurrency(amount) { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount || 0); }

  formatNameToTitleCase(name) { if (!name) return ''; return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '); }

  setupEventListeners() {
    document.getElementById('file-input').addEventListener('change', (e) => { if (e.target.files[0]) this.handleFileUpload(e.target.files[0]); e.target.value = null; });
    document.getElementById('btn-apply-filters').addEventListener('click', () => this.applyFilters());
    document.getElementById('btn-clear-filters').addEventListener('click', () => { document.getElementById('volunteer-filter').value = ''; document.getElementById('month-filter').value = ''; this.applyFilters(); });
    document.getElementById('clear-volunteer').addEventListener('click', () => { document.getElementById('volunteer-filter').value = ''; document.getElementById('volunteer-suggestions').classList.remove('show'); });
    document.getElementById('btn-export').addEventListener('click', () => this.exportToExcel());
    document.getElementById('btn-print').addEventListener('click', () => window.print());
    document.getElementById('btn-download-vale').addEventListener('click', () => this.downloadCurrentPdf());
    document.getElementById('btn-email-vale').addEventListener('click', () => this.handleEmailVale());
    document.getElementById('btn-clear-storage').addEventListener('click', () => this.clearSentVales());
    const modal = document.getElementById('vale-modal');
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.modal-close')) closeValeModal(); });
    const input = document.getElementById('volunteer-filter');
    const suggestionsBox = document.getElementById('volunteer-suggestions');
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      suggestionsBox.innerHTML = '';
      if (query.length < 2) { suggestionsBox.classList.remove('show'); return; }
      const uniqueNames = [...new Set(this.transactions.map(t => t.nameFromExcel).filter(Boolean))];
      const matches = uniqueNames.filter(name => name.toLowerCase().includes(query)).slice(0, 10);
      if (matches.length > 0) {
        suggestionsBox.innerHTML = matches.map(name => `<div class="suggestion-item" data-name="${name}">${name}</div>`).join('');
        suggestionsBox.classList.add('show');
      } else {
        suggestionsBox.classList.remove('show');
      }
    });
    suggestionsBox.addEventListener('click', (e) => { if (e.target.classList.contains('suggestion-item')) { input.value = e.target.dataset.name; suggestionsBox.classList.remove('show'); } });
    document.addEventListener('click', (e) => { if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) { suggestionsBox.classList.remove('show'); } });

    // Agregar el listener para el formulario de generar vale
    document.getElementById('generate-vale-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.generateValeFromForm();
    });

    // Agregar el listener para el formulario de editar transacción
    document.getElementById('edit-transaction-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveTransactionEdit();
    });

    // Agregar el listener para el select de voluntarios
    document.getElementById('volunteer-select').addEventListener('change', () => {
      this.handleVolunteerSelect();
    });

    // Agregar el listener para el select de voluntarios en el formulario de generar vale
    document.getElementById('volunteer-select-generate').addEventListener('change', () => {
      this.handleVolunteerSelectGenerate();
    });
  }

  openGenerateValeModal() {
    console.log('Abriendo modal de generar vale...');
    // Cargar la lista de voluntarios
    this.loadVolunteersListGenerate();
    
    // Establecer la fecha actual como valor predeterminado
    document.getElementById('payment-date').valueAsDate = new Date();
    
    // Mostrar el modal
    document.getElementById('generate-vale-modal').classList.add('show');
  }

  closeGenerateValeModal() {
    document.getElementById('generate-vale-modal').classList.remove('show');
    document.getElementById('generate-vale-form').reset();
  }

  generateValeFromForm() {
    const names = document.getElementById('volunteer-names').value;
    const lastnames = document.getElementById('volunteer-lastnames').value;
    const email = document.getElementById('volunteer-email').value;
    const date = document.getElementById('payment-date').value;
    const valeNumber = document.getElementById('vale-number').value;
    const concept = document.getElementById('payment-concept').value;
    const amount = parseFloat(document.getElementById('payment-amount').value);
    const note = document.getElementById('payment-note').value;

    // Crear objeto de transacción para el vale
    const transaction = {
      nameFromExcel: `${names} ${lastnames}`,
      dateStr: new Date(date).toLocaleDateString('es-CL'),
      deposit: amount,
      ordinary: concept === 'ordinary' ? amount : 0,
      extraordinary: concept === 'extraordinary' ? amount : 0,
      others: concept === 'others' ? amount : 0,
      note: note,
      officialDisplayName: `${names} ${lastnames}`,
      email: email,
      nombre: names,
      apellido: lastnames,
      valeNumber: valeNumber
    };

    // Generar el PDF directamente
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const PW = 215.9, PH = 279.4, M = 20;

    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, PW, 40, 'F');
    if (this.images.logo) {
      const logoWidth = 25;
      const aspectRatio = this.images.logo.height / this.images.logo.width;
      const logoHeight = logoWidth * aspectRatio;
      doc.addImage(this.images.logo, 'PNG', M, (40 - logoHeight) / 2, logoWidth, logoHeight);
    }
    doc.setFontSize(18); doc.setFont(undefined, 'bold'); doc.text('TESORERÍA – 2ª COMPAÑÍA', PW - M, 15, { align: 'right' });
    doc.setFontSize(12); doc.setFont(undefined, 'normal'); doc.text('La Vida por la Humanidad', PW - M, 23, { align: 'right' });

    const startY = 50;
    const labelX = M + 4, valueX = M + 50, lineH = 8;
    let y = startY + 10;

    const pdfName = `${lastnames}, ${names}`.toUpperCase();

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold'); doc.text('N° Vale:', labelX, y); doc.setFont(undefined, 'normal'); doc.text(valeNumber, valueX, y);
    y += lineH * 1.5; doc.setFont(undefined, 'bold'); doc.text('Nombre:', labelX, y); doc.setFont(undefined, 'normal'); doc.text(pdfName, valueX, y, { maxWidth: PW - valueX - M });
    y += lineH * 1.5; doc.setFont(undefined, 'bold'); doc.text('Fecha:', labelX, y); doc.setFont(undefined, 'normal'); doc.text(transaction.dateStr, valueX, y);
    y += lineH * 1.5; doc.setFont(undefined, 'bold'); doc.text('Detalle Otros:', labelX, y); doc.setFont(undefined, 'normal'); doc.text(note || '-', valueX, y, { maxWidth: PW - valueX - M });
    doc.setLineWidth(0.2); doc.rect(M, startY, PW - 2 * M, y - startY + 5);

    const tableY = y + 10;
    const colW = (PW - 2 * M) / 3;
    doc.setFontSize(10);
    ['Ordinaria', 'Extraordinaria', 'Otros'].forEach((hdr, i) => {
      const x = M + i * colW;
      doc.rect(x, tableY, colW, 20);
      doc.setFont(undefined, 'bold'); doc.text(hdr, x + colW / 2, tableY + 6, { align: 'center' });
      doc.setFont(undefined, 'normal'); const val = [transaction.ordinary, transaction.extraordinary, transaction.others][i];
      doc.text(this.formatCurrency(val), x + colW / 2, tableY + 14, { align: 'center' });
    });

    const totalY = tableY + 25;
    doc.setFillColor(230, 230, 250); doc.rect(M, totalY, PW - 2 * M, 15, 'F');
    doc.setFontSize(14); doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', M + 10, totalY + 10); doc.text(this.formatCurrency(transaction.deposit), PW - M - 10, totalY + 10, { align: 'right' });

    const signY = PH - 65;
    if (this.images.signature) {
      const ratio = this.images.signature.height / this.images.signature.width;
      const sigWidth = 50; const sigHeight = sigWidth * ratio;
      doc.addImage(this.images.signature, 'PNG', M + 10, signY, sigWidth, sigHeight);
    }
    doc.setLineWidth(0.3); doc.line(M + 10, signY + 30, M + 70, signY + 30);
    doc.setFontSize(11); doc.setFont(undefined, 'normal'); doc.text('Tesorero', M + 40, signY + 36, { align: 'center' });
    const now = new Date(); const footer = `Emitido: ${now.toLocaleString('es-CL')}`;
    doc.setFontSize(8); doc.text(footer, PW / 2, PH - 10, { align: 'center' });

    // Guardar el PDF generado y mostrarlo en el modal
    this.currentPdfDoc = doc;
    this.currentTransactionForModal = transaction;
    document.getElementById('vale-preview').src = doc.output('datauristring');
    document.getElementById('vale-modal').classList.add('show');

    // Generar y enviar el correo
    const paymentConcept = this.getPaymentConcept(transaction);
    const currentDate = new Date().toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
    
    const subject = encodeURIComponent(`Comprobante de ${paymentConcept} - Segunda Compañía`);
    const body = encodeURIComponent(this.createEmailBody(transaction, paymentConcept, currentDate));
    
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');

    this.closeGenerateValeModal();
    this.showMessage('Vale generado y correo preparado exitosamente', 'success');
  }

  openEditTransactionModal(index) {
    const transaction = this.displayedTransactions[index];
    if (!transaction) return;

    // Cargar la lista de voluntarios
    this.loadVolunteersList();

    // Llenar el formulario con los datos de la transacción
    document.getElementById('edit-volunteer-names').value = transaction.nombre || '';
    document.getElementById('edit-volunteer-lastnames').value = transaction.apellido || '';
    document.getElementById('edit-volunteer-email').value = transaction.email || '';
    document.getElementById('edit-payment-date').value = transaction.date ? transaction.date.toISOString().split('T')[0] : '';
    document.getElementById('edit-vale-number').value = transaction.valeNumber || '';
    
    // Determinar el concepto de pago
    let concept = 'others';
    if (transaction.ordinary) concept = 'ordinary';
    else if (transaction.extraordinary) concept = 'extraordinary';
    document.getElementById('edit-payment-concept').value = concept;
    
    document.getElementById('edit-payment-amount').value = transaction.deposit || '';
    document.getElementById('edit-payment-note').value = transaction.note || '';

    // Guardar el índice de la transacción que se está editando
    this.editingTransactionIndex = index;

    // Mostrar el modal
    document.getElementById('edit-transaction-modal').classList.add('show');
  }

  loadVolunteersList() {
    // Obtener todos los voluntarios únicos de las transacciones
    const volunteers = new Set();
    this.transactions.forEach(t => {
      if (t.nombre && t.apellido) {
        volunteers.add(`${t.nombre} ${t.apellido}`);
      }
    });

    // Convertir el Set a un array y ordenarlo alfabéticamente
    const sortedVolunteers = Array.from(volunteers).sort();

    // Obtener el elemento select
    const select = document.getElementById('volunteer-select');
    if (!select) return;

    // Limpiar opciones existentes excepto la primera
    while (select.options.length > 1) {
      select.remove(1);
    }

    // Agregar las opciones
    sortedVolunteers.forEach(volunteer => {
      const option = document.createElement('option');
      option.value = volunteer;
      option.textContent = volunteer;
      select.appendChild(option);
    });
  }

  handleVolunteerSelect() {
    const select = document.getElementById('volunteer-select');
    const selectedValue = select.value;
    
    if (selectedValue && selectedValue !== '') {
      const [nombre, ...apellidos] = selectedValue.split(' ');
      const apellido = apellidos.join(' ');
      
      document.getElementById('edit-volunteer-names').value = nombre;
      document.getElementById('edit-volunteer-lastnames').value = apellido;
      
      // Buscar el email correspondiente en las transacciones
      const transaction = this.transactions.find(t => 
        t.nombre === nombre && t.apellido === apellido
      );
      
      if (transaction) {
        document.getElementById('edit-volunteer-email').value = transaction.email || '';
      }
    }
  }

  closeEditTransactionModal() {
    document.getElementById('edit-transaction-modal').classList.remove('show');
    document.getElementById('edit-transaction-form').reset();
    this.editingTransactionIndex = null;
  }

  saveTransactionEdit() {
    if (this.editingTransactionIndex === null) return;

    const transaction = this.displayedTransactions[this.editingTransactionIndex];
    if (!transaction) return;

    // Obtener los valores del formulario
    const names = document.getElementById('edit-volunteer-names').value;
    const lastnames = document.getElementById('edit-volunteer-lastnames').value;
    const email = document.getElementById('edit-volunteer-email').value;
    const date = document.getElementById('edit-payment-date').value;
    const valeNumber = document.getElementById('edit-vale-number').value;
    const concept = document.getElementById('edit-payment-concept').value;
    const amount = parseFloat(document.getElementById('edit-payment-amount').value);
    const note = document.getElementById('edit-payment-note').value;

    // Actualizar la transacción
    transaction.nombre = names;
    transaction.apellido = lastnames;
    transaction.email = email;
    transaction.date = new Date(date);
    transaction.dateStr = new Date(date).toLocaleDateString('es-CL');
    transaction.valeNumber = valeNumber;
    transaction.note = note;
    transaction.deposit = amount;
    transaction.ordinary = concept === 'ordinary' ? amount : 0;
    transaction.extraordinary = concept === 'extraordinary' ? amount : 0;
    transaction.others = concept === 'others' ? amount : 0;
    transaction.nameFromExcel = `${names} ${lastnames}`;
    transaction.officialDisplayName = `${names} ${lastnames}`;

    // Actualizar la visualización
    this.displayResults();
    this.updateStats();

    // Cerrar el modal
    this.closeEditTransactionModal();
    this.showMessage('Transacción actualizada exitosamente', 'success');
  }

  loadVolunteersListGenerate() {
    console.log('Iniciando carga de voluntarios...');
    console.log('Transacciones disponibles:', this.transactions.length);

    // Obtener todos los voluntarios únicos de las transacciones
    const volunteers = new Set();
    this.transactions.forEach(t => {
      if (t.nombre && t.apellido) {
        const fullName = `${t.nombre} ${t.apellido}`;
        volunteers.add(fullName);
        console.log('Agregando voluntario:', fullName);
      }
    });

    // Convertir el Set a un array y ordenarlo alfabéticamente
    const sortedVolunteers = Array.from(volunteers).sort();
    console.log('Voluntarios únicos encontrados:', sortedVolunteers);

    // Obtener el elemento select
    const select = document.getElementById('volunteer-select-generate');
    if (!select) {
      console.error('No se encontró el elemento select de voluntarios');
      return;
    }

    // Limpiar opciones existentes excepto la primera
    while (select.options.length > 1) {
      select.remove(1);
    }

    // Agregar las opciones
    sortedVolunteers.forEach(volunteer => {
      const option = document.createElement('option');
      option.value = volunteer;
      option.textContent = volunteer;
      select.appendChild(option);
    });

    console.log('Voluntarios cargados en el select:', select.options.length - 1);
  }

  handleVolunteerSelectGenerate() {
    const select = document.getElementById('volunteer-select-generate');
    const selectedValue = select.value;
    
    if (selectedValue && selectedValue !== '') {
      const [nombre, ...apellidos] = selectedValue.split(' ');
      const apellido = apellidos.join(' ');
      
      document.getElementById('volunteer-names').value = nombre;
      document.getElementById('volunteer-lastnames').value = apellido;
      
      // Buscar el email correspondiente en las transacciones
      const transaction = this.transactions.find(t => 
        t.nombre === nombre && t.apellido === apellido
      );
      
      if (transaction) {
        document.getElementById('volunteer-email').value = transaction.email || '';
      }
    }
  }
}

function closeValeModal() {
  document.getElementById('vale-modal').classList.remove('show');
  if (treasury) {
    treasury.currentTransactionForModal = null;
  }
}

let treasury;
document.addEventListener('DOMContentLoaded', () => {
  treasury = new TreasurySystem();
});
