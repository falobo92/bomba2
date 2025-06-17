const { useState, useEffect, useRef } = React;

const columnMapping = {
  date: ['FECHA', 'DATE'],
  detail: ['DETALLE MOVIMIENTO', 'DETALLEMOVIMIENTO', 'DETALLE'],
  valeNumber: ['N VALE', 'N_VALE', 'N° VALE', 'Nº VALE'],
  deposit: ['DEPOSITO', 'DEPÓSITO', 'MONTO', 'TOTAL'],
  ordinary: ['ORDINARIA', 'CUOTA ORDINARIA'],
  extraordinary: ['EXTRAORDINARIA', 'CUOTA EXTRAORDINARIA'],
  others: ['OTROS'],
  note: ['NOTA', 'DETALLE OTROS'],
  observation: ['OBSERVACION', 'OBSERVACIÓN']
};

function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findEmail(name, contacts) {
  const normalized = normalizeText(name);
  if (contacts.has(normalized)) return contacts.get(normalized).email;
  for (const [key, data] of contacts.entries()) {
    if (key.includes(normalized) || normalized.includes(key)) return data.email;
  }
  return 'MODIFICAR@correo.cl';
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [contacts, setContacts] = useState(new Map());
  const [allNames, setAllNames] = useState([]);
  const [monthFilter, setMonthFilter] = useState('');
  const [volFilter, setVolFilter] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fileInfo, setFileInfo] = useState({ text: '', type: '' });
  const [stats, setStats] = useState({ count: 0, total: 0 });
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentTx, setCurrentTx] = useState(null);
  const fileInput = useRef(null);
  const [images, setImages] = useState({ logo: null, signature: null });

  useEffect(() => {
    fetch('volunteers.json')
      .then(r => r.json())
      .then(list => {
        const map = new Map();
        const names = [];
        list.forEach(v => {
          if (v.nombre && v.apellido && v.correo) {
            const name = `${v.nombre} ${v.apellido}`;
            map.set(normalizeText(name), { email: v.correo, name });
            names.push(name);
          }
        });
        setContacts(map);
        setAllNames(names);
      })
      .catch(() => alert('No se pudo cargar volunteers.json'));
  }, []);

  useEffect(() => {
    const load = async src => {
      const img = new Image();
      img.src = src;
      await new Promise(res => { img.onload = res; img.onerror = res; });
      return img.complete && img.naturalHeight !== 0 ? img : null;
    };
    Promise.all([load('escudo-original.png'), load('firma_tesorero.png')])
      .then(([logo, signature]) => setImages({ logo, signature }));
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, monthFilter, volFilter]);

  useEffect(() => {
    const total = displayed.reduce((sum, t) => sum + (t.deposit || 0), 0);
    setStats({ count: displayed.length, total });
  }, [displayed]);

  useEffect(() => {
    const norm = normalizeText(volFilter);
    if (!volFilter.trim()) { setSuggestions([]); return; }
    const matches = allNames.filter(n => normalizeText(n).includes(norm)).slice(0,5);
    setSuggestions(matches);
  }, [volFilter, allNames]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileInfo({ text: `Cargando "${file.name}"...`, type: 'info' });
    readExcel(file)
      .then(data => {
        setTransactions(data);
        setFileInfo({ text: `✓ ${data.length} transacciones cargadas`, type: 'success' });
      })
      .catch(err => {
        console.error(err);
        setFileInfo({ text: `Error: ${err.message}`, type: 'error' });
      });
  }

  function readExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const wb = XLSX.read(e.target.result, { type: 'array', cellDates: true });
          let sheetName = wb.SheetNames.find(n => {
            const s = normalizeText(n);
            return s.includes('DETALLE') || s.includes('MOVIMIENTO');
          }) || wb.SheetNames[0];
          const ws = wb.Sheets[sheetName];
          const headers = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
          const mappedHeaders = {};
          for (const key in columnMapping) {
            const possible = columnMapping[key];
            const found = headers.find(h => h && possible.includes(normalizeText(h)));
            if (found) mappedHeaders[key] = found;
          }
          if (!mappedHeaders.detail || !mappedHeaders.deposit) {
            throw new Error('No se encontraron columnas de Detalle o Depósito');
          }
          const rows = XLSX.utils.sheet_to_json(ws, { raw: false, defval: null });
          const data = rows.map(row => normalizeTransaction(row, field => {
            const hdr = mappedHeaders[field];
            if (!hdr) return null;
            const rowKey = Object.keys(row).find(k => normalizeText(k) === normalizeText(hdr));
            return row[rowKey];
          }));
          resolve(data);
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  function normalizeTransaction(row, getValue) {
    const detail = getValue ? getValue('detail') : row['DETALLE MOVIMIENTO'] || row['DETALLE'] || '';
    const name = extractName(detail);
    const email = findEmail(name, contacts);
    const parseAmount = val => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') return parseInt(val.replace(/[^0-9-]/g, '')) || 0;
      return 0;
    };
    const dateVal = getValue ? getValue('date') : row['FECHA'];
    const date = dateVal instanceof Date ? dateVal : new Date(dateVal);
    return {
      date,
      dateStr: isNaN(date) ? 'Fecha inválida' : date.toLocaleDateString('es-CL'),
      name,
      email,
      valeNumber: (getValue ? getValue('valeNumber') : row['N VALE'] || row['N° VALE']) || '',
      deposit: parseAmount(getValue ? getValue('deposit') : (row['DEPOSITO'] || row['TOTAL'])),
      ordinary: parseAmount(getValue ? getValue('ordinary') : row['ORDINARIA']),
      extraordinary: parseAmount(getValue ? getValue('extraordinary') : row['EXTRAORDINARIA']),
      others: parseAmount(getValue ? getValue('others') : row['OTROS']),
      note: (getValue ? getValue('note') : row['NOTA']) || '',
      observation: (getValue ? getValue('observation') : row['OBSERVACION']) || ''
    };
  }

  function extractName(detail) {
    let name = detail.replace(/^(TRASPASO|TRANSFERENCIA|DEPOSITO|PAGO)\sDE:/i, '').trim();
    return name.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  function applyFilters() {
    let data = [...transactions];
    if (monthFilter) {
      const [y, m] = monthFilter.split('-');
      data = data.filter(t => t.date && t.date.getFullYear() == y && (t.date.getMonth()+1)==m);
    }
    if (volFilter) {
      const f = normalizeText(volFilter);
      data = data.filter(t => normalizeText(t.name).includes(f));
    }
    setDisplayed(data);
  }

  function formatCurrency(v) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(v || 0);
  }

  function openVale(index) {
    const t = displayed[index];
    if (!t) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const PW = 215.9, PH = 279.4, M = 20;
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, PW, 40, 'F');
    if (images.logo) doc.addImage(images.logo, 'PNG', M, 5, 30, 30);
    doc.setFontSize(18); doc.setFont(undefined, 'bold');
    doc.text('TESORERÍA – 2ª COMPAÑÍA', PW - M, 15, { align: 'right' });
    doc.setFontSize(12); doc.setFont(undefined, 'normal');
    doc.text('La Vida por la Humanidad', PW - M, 23, { align: 'right' });
    const startY = 50; const labelX=M+4,valueX=M+50,lineH=8; let y=startY+10;
    doc.setFontSize(11); doc.setFont(undefined,'bold'); doc.text('N° Vale:',labelX,y);
    doc.setFont(undefined,'normal'); doc.text(t.valeNumber||'S/N',valueX,y); y+=lineH*1.5;
    doc.setFont(undefined,'bold'); doc.text('Nombre:',labelX,y);
    doc.setFont(undefined,'normal'); doc.text(t.name,valueX,y,{maxWidth:PW-valueX-M}); y+=lineH*1.5;
    doc.setFont(undefined,'bold'); doc.text('Fecha:',labelX,y);
    doc.setFont(undefined,'normal'); doc.text(t.dateStr,valueX,y); y+=lineH*1.5;
    doc.setFont(undefined,'bold'); doc.text('Detalle Otros:',labelX,y);
    doc.setFont(undefined,'normal'); doc.text([t.note,t.observation].filter(Boolean).join(' – ')||'-',valueX,y,{maxWidth:PW-valueX-M});
    doc.setLineWidth(0.2); doc.rect(M,startY,PW-2*M,y-startY+5);
    const tableY=y+10; const colW=(PW-2*M)/3; doc.setFontSize(10);
    ['Ordinaria','Extraordinaria','Otros'].forEach((hdr,i)=>{ const x=M+i*colW; doc.rect(x,tableY,colW,20); doc.setFont(undefined,'bold'); doc.text(hdr,x+colW/2,tableY+6,{align:'center'}); doc.setFont(undefined,'normal'); const val=[t.ordinary,t.extraordinary,t.others][i]; doc.text(formatCurrency(val),x+colW/2,tableY+14,{align:'center'}); });
    const totalY=tableY+25; doc.setFillColor(230,230,250); doc.rect(M,totalY,PW-2*M,15,'F'); doc.setFontSize(14); doc.setFont(undefined,'bold'); doc.text('TOTAL:',M+10,totalY+10); doc.text(formatCurrency(t.deposit),PW-M-10,totalY+10,{align:'right'});
    const signY=PH-65; if(images.signature){const ratio=images.signature.height/images.signature.width; const sw=50,sh=sw*ratio; doc.addImage(images.signature,'PNG',M+10,signY,sw,sh);} doc.setLineWidth(0.3); doc.line(M+10,signY+30,M+70,signY+30); doc.setFontSize(11); doc.setFont(undefined,'normal'); doc.text('Tesorero',M+40,signY+36,{align:'center'});
    const now=new Date(); const footer=`Emitido: ${now.toLocaleString('es-CL')}`; doc.setFontSize(8); doc.text(footer,PW/2,PH-10,{align:'center'});
    setPdfDoc(doc); setCurrentTx(t);
    document.getElementById('vale-frame').src = doc.output('datauristring');
    document.getElementById('vale-modal').classList.add('show');
  }

  function downloadPdf(){ if(pdfDoc && currentTx){ const date=new Date().toISOString().split('T')[0]; pdfDoc.save(`Vale_${currentTx.name.replace(/\s/g,'_')}_${date}.pdf`); } }

  function sendEmail(){ if(!currentTx) return; const mail=currentTx.email||'MODIFICAR@correo.cl'; downloadPdf(); const subject=encodeURIComponent(`Comprobante de Pago ${currentTx.dateStr}`); const body=encodeURIComponent(`Estimado(a) ${currentTx.name},\n\nAdjunto encontrará su comprobante correspondiente al ${currentTx.dateStr}.\nMonto: ${formatCurrency(currentTx.deposit)}\nDetalle: ${currentTx.note || currentTx.observation || 'Sin detalle'}\n\nSaludos cordiales,\nTesorería - Segunda Compañía`); window.location.href=`mailto:${mail}?subject=${subject}&body=${body}`; alert('Se abrirá su cliente de correo. Adjunte el PDF descargado.'); }

  function months() {
    const set = new Set();
    transactions.forEach(t => { if(t.date && !isNaN(t.date)){ const key=`${t.date.getFullYear()}-${String(t.date.getMonth()+1).padStart(2,'0')}`; set.add(key); } });
    return Array.from(set).sort((a,b)=>b.localeCompare(a));
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-wrapper">
          <img src="escudo-original.png" alt="Segunda Compañía" className="header-logo" />
          <div className="header-info">
            <h1>Sistema de Tesorería</h1>
            <h2>Segunda Compañía de Bomberos de Ñuñoa</h2>
          </div>
        </div>
      </header>
      <main className="main-content">
        <section className="control-panel">
          <div className="card">
            <div className="card-header"><h3><i className="fas fa-file-upload"></i> Cargar Datos</h3></div>
            <div className="card-body">
              <div className="file-upload-area">
                <input ref={fileInput} type="file" accept=".xlsx,.xls,.xlsm,.xlsb" hidden onChange={handleFile} />
                <label className="upload-button" onClick={()=>fileInput.current.click()}>
                  <i className="fas fa-cloud-upload-alt"></i><span>Seleccionar archivo Excel</span>
                </label>
                <div className={`file-info ${fileInfo.type}`} style={{display:fileInfo.text? 'block':'none'}}>{fileInfo.text}</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3><i className="fas fa-filter"></i> Filtros</h3></div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="volunteer-filter"><i className="fas fa-user"></i> Voluntario</label>
                <div className="input-with-clear">
                  <input id="volunteer-filter" className="form-control" value={volFilter} onChange={e=>setVolFilter(e.target.value)} placeholder="Buscar por nombre..." autoComplete="off" />
                  {volFilter && <button className="btn-clear" onClick={()=>setVolFilter('')}><i className="fas fa-times"></i></button>}
                  {suggestions.length>0 && (
                    <div className="suggestions-box show">
                      {suggestions.map((s,i)=>(
                        <div key={i} className="suggestion-item" onClick={()=>{setVolFilter(s);setSuggestions([]);}}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="month-filter"><i className="fas fa-calendar"></i> Período</label>
                <select id="month-filter" className="form-control" value={monthFilter} onChange={e=>setMonthFilter(e.target.value)}>
                  <option value="">Todos los meses</option>
                  {months().map(m=> <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>
        <section className="results-panel">
          <div className="card">
            <div className="card-header">
              <h3 id="results-title"><i className="fas fa-table"></i> Movimientos</h3>
            </div>
            <div className="card-body">
              <div className="stats-grid" style={{marginBottom:'15px'}}>
                <div className="stat-item">
                  <div className="stat-value">{stats.count.toLocaleString('es-CL')}</div>
                  <div className="stat-label">Registros</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{formatCurrency(stats.total)}</div>
                  <div className="stat-label">Total Depósito</div>
                </div>
              </div>
              {displayed.length===0 ? (
                <div id="no-data" className="no-data-message" style={{display:'block'}}>
                  <i className="fas fa-inbox fa-3x"></i>
                  <p>No hay datos para mostrar</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Fecha</th><th>Voluntario</th><th>N° Vale</th><th>Depósito</th><th>Detalle</th><th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.map((t,i)=>(
                        <tr key={i}>
                          <td>{t.dateStr}</td>
                          <td>{t.name}</td>
                          <td>{t.valeNumber||'-'}</td>
                          <td>{formatCurrency(t.deposit)}</td>
                          <td>{[t.note,t.observation].filter(Boolean).join(' - ')||'-'}</td>
                          <td><button className="btn-vale" onClick={()=>openVale(i)}><i className="fas fa-file-pdf"></i> Ver Vale</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <div id="vale-modal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Vista Previa del Vale</h3>
            <button className="modal-close" onClick={()=>document.getElementById('vale-modal').classList.remove('show')}><i className="fas fa-times"></i></button>
          </div>
          <div className="modal-body"><iframe id="vale-frame" className="vale-preview"></iframe></div>
          <div className="modal-footer">
            <button className="btn btn-info" onClick={sendEmail}><i className="fas fa-envelope"></i> Enviar por Email</button>
            <button className="btn btn-primary" onClick={downloadPdf}><i className="fas fa-download"></i> Descargar PDF</button>
            <button className="btn btn-secondary" onClick={()=>document.getElementById('vale-modal').classList.remove('show')}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
