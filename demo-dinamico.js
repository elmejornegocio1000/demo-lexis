/* =====================================================
   LEXIS INTELLIGENT — Demo dinámico por parámetros URL
   Uso: agregar antes de </body> en el HTML de la landing

   Parámetros disponibles:
     abogado = nombre completo del abogado/a
     estudio  = nombre del estudio
     ciudad   = ciudad y provincia

   Ejemplo de URL demo:
   https://gleeful-bonbon-e682c1.netlify.app/
   ?abogado=Dr.+Gustavo+Rojas+Martinez
   &estudio=Estudio+Rovi
   &ciudad=San+Rafael%2C+Mendoza
===================================================== */
(function () {
  var p       = new URLSearchParams(window.location.search);
  var abogado = (p.get('abogado') || '').trim();
  var estudio = (p.get('estudio') || '').trim();
  var ciudad  = (p.get('ciudad')  || '').trim();

  if (!abogado && !estudio && !ciudad) return; // sin params → muestra original

  /* ---- divide nombre para respetar el cursivo del h1 ---- */
  var partes    = abogado ? abogado.split(' ') : [];
  var apellido  = partes.length > 1 ? partes[partes.length - 1] : abogado;
  var preApell  = partes.length > 1 ? partes.slice(0, -1).join(' ') : abogado;

  /* ---- recorre nodos de texto y reemplaza ---- */
  function reemplazar(nodo, busca, pone) {
    if (!busca || !pone) return;
    if (nodo.nodeType === 3) {
      if (nodo.textContent.indexOf(busca) !== -1)
        nodo.textContent = nodo.textContent.split(busca).join(pone);
    } else if (nodo.nodeType === 1 &&
               nodo.tagName !== 'SCRIPT' && nodo.tagName !== 'STYLE') {
      Array.from(nodo.childNodes).forEach(function(c){ reemplazar(c, busca, pone); });
    }
  }

  var b = document.body;

  /* ---- nombre del abogado/a ---- */
  if (abogado) {
    reemplazar(b, 'Dra. Jorgelina Farías', abogado);
    reemplazar(b, 'Jorgelina Farías',      abogado);
    reemplazar(b, 'Dra. Jorgelina ',       preApell + ' ');
    reemplazar(b, 'Jorgelina ',            preApell + ' ');
    reemplazar(b, 'Farías',               apellido);
  }

  /* ---- nombre del estudio ---- */
  if (estudio) {
    reemplazar(b, 'Estudio Jurídico', estudio);
  }

  /* ---- ciudad / provincia ---- */
  if (ciudad) {
    reemplazar(b, 'Termas de Río Hondo, Sgo. del Estero', ciudad);
    reemplazar(b, 'Termas de Río Hondo',                  ciudad);
    reemplazar(b, 'Sgo. del Estero',                      '');
    reemplazar(b, 'Santiago del Estero',                  '');
  }

  /* ---- título del browser ---- */
  if (abogado)
    document.title = abogado + ' — Abogado/a · ' + (ciudad || 'Argentina');
})();