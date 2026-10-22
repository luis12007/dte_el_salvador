/*
 * Recuadro de "Observaciones" para los PDF de DTE (descarga y correo).
 *
 * Antes el texto se cortaba cada 45 caracteres y cada pedazo se pintaba en
 * una altura fija: si el texto traía saltos de línea, PDFKit los bajaba y el
 * siguiente pedazo se dibujaba encima. Ahora se dibuja en un solo bloque con
 * ancho fijo (respeta saltos de línea y ajusta palabras) y, si no cabe, se
 * reduce el tamaño de letra hasta que entre en el recuadro.
 */

// Recuadro: x=20, ancho 200 (igual que antes). Alto aumentado de 100 a 130.
const OBS = {
  x: 20,
  width: 200,
  height: 130,
  radius: 8,
  padding: 8,
  titleOffset: 6, // título a y + 8 + 6
  textOffset: 18, // texto a y + 8 + 18
  maxFontSize: 7,
  minFontSize: 4,
};

// Espacio extra respecto al diseño anterior (para bajar lo que va debajo).
const OBS_EXTRA_ALTO = OBS.height - 100;

const normalizarTexto = (texto) =>
  (texto === null || texto === undefined ? "" : String(texto))
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/*
 * Dibuja el recuadro, el título y el texto de observaciones.
 * y: misma referencia que usaban los PDF (el recuadro empieza en y + 8).
 */
const drawObservaciones = (pdfDoc, texto, y) => {
  const boxTop = y + 8;
  pdfDoc.roundedRect(OBS.x, boxTop, OBS.width, OBS.height, OBS.radius).fill("#EAEAEA").stroke("#000");
  pdfDoc.fillColor("#1E3256").fontSize(9).text("Observaciones", OBS.x + OBS.padding, boxTop + OBS.titleOffset);

  const contenido = normalizarTexto(texto);
  if (!contenido) return;

  const textX = OBS.x + OBS.padding;
  const textY = boxTop + OBS.textOffset;
  const width = OBS.width - OBS.padding * 2;
  const height = OBS.height - OBS.textOffset - OBS.padding / 2;

  // Tamaño más grande que permita que todo el texto quepa en el recuadro.
  let size = OBS.maxFontSize;
  pdfDoc.font("Helvetica");
  while (size > OBS.minFontSize) {
    pdfDoc.fontSize(size);
    if (pdfDoc.heightOfString(contenido, { width, lineGap: 0 }) <= height) break;
    size = Math.round((size - 0.25) * 100) / 100;
  }

  // Con el tamaño mínimo, lo que no quepa se corta con "..." dentro del recuadro.
  pdfDoc
    .fillColor("#000000")
    .fontSize(size)
    .text(contenido, textX, textY, { width, height, lineGap: 0, ellipsis: true });
};

module.exports = { drawObservaciones, OBS_EXTRA_ALTO, OBS };
