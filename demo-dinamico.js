(function () {
  var p       = new URLSearchParams(window.location.search);
  var abogado = (p.get('abogado') || '').trim();
  var estudio = (p.get('estudio') || '').trim();
  var ciudad  = (p.get('ciudad')  || '').trim();

  if (!abogado && !estudio && !ciudad) return;

  // Divide el nombre: "Dr. Oscar Ruiz" → nombre="Dr. Oscar", apellido="Ruiz"
  var partes   = abogado ? abogado.split(' ') : [];
  var apellido = partes.length > 1 ? partes[partes.length - 1] : abogado;
  var preApell = partes.length > 1 ? partes.slice(0, -1).join(' ') : abogado;

  function reemplazar(nodo, busca, pone) {
    if (!busca) return;
    if (nodo.nodeType === 3) {
      if (nodo.textContent.indexOf(busca) !== -1)
        nodo.textContent = nodo.textContent.split(busca).join(pone);
    } else if (nodo.nodeType === 1 &&
               nodo.tagName !== 'SCRIPT' && nodo.tagName !== 'STYLE') {
      Array.from(nodo.childNodes).forEach(function(c){ reemplazar(c, busca, pone); });
    }
  }

  var b = document.body;

  if (abogado) {
    // Primero los textos completos (para no romper los que ya tienen todo junto)
    reemplazar(b, 'Dra. Jorgelina Farías', abogado);
    reemplazar(b, 'Dra. Jorgelina', preApell);
    reemplazar(b, 'Jorgelina Farías', abogado);
    reemplazar(b, 'Jorgelina', preApell);
    // Apellido solo (está en <em> separado)
    reemplazar(b, 'Farías', apellido);
    document.title = abogado + ' — Abogado/a · ' + (ciudad || 'Argentina');
  }

  if (estudio) {
    reemplazar(b, 'Estudio Jurídico', estudio);
  }

  if (ciudad) {
    reemplazar(b, 'Termas de Río Hondo, Sgo. del Estero', ciudad);
    reemplazar(b, 'Termas de Río Hondo, Santiago del Estero', ciudad);
    reemplazar(b, 'Termas de Río Hondo', ciudad);
    reemplazar(b, 'Sgo. del Estero', '');
    reemplazar(b, 'Santiago del Estero', '');
  }
})();
