/*
 * Vista previa en vivo del PDF de un DTE (Crédito Fiscal tipo 03 o Factura tipo 01).
 * Replica el layout del PDF que se envía por correo (API/src/utils/mailUtils.js):
 * banda gris superior con título/QR/códigos, bloques EMISOR y RECEPTOR,
 * tabla SERVICIOS y resumen de totales con el total en verde azulado.
 */

const NAVY = "#1E3256";
const TEAL = "#009A9A";

// Tipografías que imitan las del PDF (Helvetica + Dancing Script)
const PDF_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SCRIPT_FONT = "'Segoe Script', 'Brush Script MT', 'Dancing Script', cursive";

const money = (v) => `$${(Number(v) || 0).toFixed(2)}`;

const titleCaseWords = (input) => {
  const text = (input ?? "").toString().trim();
  if (!text) return "";
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

const mapTipoEstablecimiento = (code) => {
  const t = (code ?? "").toString();
  if (t === "20") return "Otro";
  if (t === "01") return "Sucursal / Agencia";
  if (t === "02") return "Casa matriz";
  if (t === "04") return "Bodega";
  if (t === "07") return "Predio y/o patio";
  return t;
};

// Igual que en mailUtils: deducir la etiqueta del documento del receptor (tipo 01)
const docLabelFor = (numDoc) => {
  const doc = (numDoc ?? "").toString();
  if (doc.includes("-")) return "DUI:";
  const digits = doc.replace(/\D/g, "");
  if (digits.length > 0 && digits.length <= 7) return "NRC:";
  if (digits.length > 7) return "NIT:";
  return "DOC:";
};

/* QR simulado: matriz 21x21 con patrones de posición reales y relleno
   pseudoaleatorio determinista (no parpadea entre renders). */
const MockQR = ({ size = 82 }) => {
  const n = 21;
  const inFinder = (x, y) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const finderDark = (x, y) => {
    const lx = x < 7 ? x : x - (n - 7);
    const ly = y < 7 ? y : y - (n - 7);
    const ring = lx === 0 || ly === 0 || lx === 6 || ly === 6;
    const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
    return ring || core;
  };
  const noise = (x, y) => (((x * 73856093) ^ (y * 19349663)) >>> 0) % 100 < 44;

  const cells = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let dark;
      if (inFinder(x, y)) dark = finderDark(x, y);
      else if (x === 6 || y === 6) dark = (x + y) % 2 === 0; // patrón de sincronía
      else dark = noise(x, y);
      if (dark) {
        cells.push(
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
        );
      }
    }
  }
  return (
    <svg
      viewBox={`-1 -1 ${n + 2} ${n + 2}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-label="QR de ejemplo"
    >
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#fff" />
      <g fill="#26262b">{cells}</g>
    </svg>
  );
};

const InfoBlock = ({ title, rows }) => {
  const visibleRows = rows.filter(
    (r) => (r.value ?? "").toString().trim().length > 0
  );
  return (
    <div
      className="flex-1 rounded-xl px-3 py-2.5 min-w-0 border border-solid border-gray-300/80 shadow-sm"
      style={{ backgroundColor: "#F4F4F6", color: NAVY }}
    >
      <div
        className="font-bold text-[10px] tracking-[0.12em] mb-1.5 pb-1 border-b border-solid border-gray-300"
        style={{ color: TEAL }}
      >
        {title}
      </div>
      {visibleRows.length === 0 && (
        <div className="text-[9px] italic text-gray-400">
          Complete los datos…
        </div>
      )}
      {visibleRows.map((row) => (
        <div key={row.label} className="flex flex-row gap-1.5 mb-[3px]">
          <div className="w-[95px] shrink-0 font-semibold text-[9px] leading-snug text-gray-600">
            {row.label}
          </div>
          <div className="flex-1 text-[9px] leading-snug break-words min-w-0">
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
};

const CreditoFiscalPdfPreview = ({
  tipoDte = "03",
  userinfo = {},
  client = {},
  departamentoName = "",
  municipioName = "",
  listItems = [],
  subtotal = 0,
  iva = 0,
  total = 0,
  rentvalue = 0,
  ivaRetenido = 0,
  observaciones = "",
  time = { date: "", time: "" },
  numeroControl = "",
  cantidadEnLetras = "",
}) => {
  const emisorNombre = titleCaseWords(
    (userinfo.name ?? "").toString().split(/\s+/).slice(0, 4).join(" ")
  );

  const emisorRows = [
    { label: "Nombre o razón social:", value: emisorNombre },
    { label: "NIT:", value: userinfo.nit },
    { label: "NRC:", value: userinfo.nrc },
    { label: "Actividad económica:", value: userinfo.descactividad },
    { label: "Dirección:", value: userinfo.direccion },
    { label: "Correo electrónico:", value: userinfo.correo_electronico },
    { label: "Nombre comercial:", value: userinfo.nombre_comercial },
    {
      label: "Tipo de establecimiento:",
      value: mapTipoEstablecimiento(userinfo.tipoestablecimiento),
    },
  ];

  const receptorRows =
    tipoDte === "01"
      ? [
          { label: "Nombre o razón social:", value: client.name },
          { label: docLabelFor(client.document), value: client.document },
          { label: "NRC:", value: client.pdfNrc },
          { label: "Actividad económica:", value: client.pdfDescActividad },
          { label: "Departamento:", value: departamentoName },
          { label: "Municipio:", value: municipioName },
          { label: "Dirección:", value: client.address },
          { label: "Teléfono:", value: client.phone },
          { label: "Correo electrónico:", value: client.email },
        ]
      : [
          { label: "Nombre o razón social:", value: client.name },
          { label: "Nombre comercial:", value: client.nombreComercial },
          { label: "NIT:", value: client.nit },
          { label: "NRC:", value: client.nrc },
          { label: "Actividad económica:", value: client.descActividad },
          { label: "Departamento:", value: departamentoName },
          { label: "Municipio:", value: municipioName },
          { label: "Dirección:", value: client.address },
          { label: "Teléfono:", value: client.phone },
          { label: "Correo electrónico:", value: client.email },
        ];

  const ivaReten1 = Number(ivaRetenido) || 0;
  const montoTotalOperacion = (Number(subtotal) || 0) + (Number(iva) || 0);

  const totalsRows = [
    { label: "Subtotal", value: subtotal },
    { label: "Monto de descuento", value: 0 },
    { label: "Total gravado", value: subtotal },
    { label: "Sumatoria de ventas", value: subtotal },
    { label: "Impuesto valor agregado 13%", value: iva },
    { label: "IVA recibido", value: 0 },
    { label: "IVA retenido 1%", value: ivaReten1 },
    { label: "Retención de renta 10%", value: rentvalue },
    { label: "Otros montos no afectados", value: 0 },
    { label: "Monto total de operación", value: montoTotalOperacion },
  ];

  return (
    <div
      className="w-full bg-white rounded-xl shadow-[0px_8px_24px_rgba(30,_50,_86,_0.18)] border border-solid border-gray-200 overflow-hidden text-left"
      style={{ fontFamily: PDF_FONT }}
    >
      {/* ---- Banda superior gris (encabezado del PDF) ---- */}
      <div
        className="px-5 pt-4 pb-3 border-b border-solid border-gray-300/70"
        style={{ background: "linear-gradient(180deg, #F2F2F4 0%, #E9E9EC 100%)" }}
      >
        <div
          className="text-center font-semibold text-[12px] tracking-[0.18em]"
          style={{ color: NAVY }}
        >
          DOCUMENTO TRIBUTARIO ELECTRONICO
        </div>
        <div
          className="text-center font-bold text-[16px] tracking-[0.08em] mb-3"
          style={{ color: NAVY }}
        >
          {tipoDte === "01" ? "FACTURA" : "CRÉDITO FISCAL"}
        </div>

        <div className="flex flex-row gap-4 items-start">
          {/* Nombre del emisor (zona de marca del PDF) */}
          <div className="flex-1 min-w-0 pt-1">
            <div
              className="text-[19px] leading-snug break-words"
              style={{ color: NAVY, fontFamily: SCRIPT_FONT }}
            >
              {emisorNombre || "Nombre del emisor"}
            </div>
            <div
              className="text-[10px] mt-1.5 tracking-[0.08em] uppercase"
              style={{ color: NAVY }}
            >
              {userinfo.descactividad || ""}
            </div>
          </div>

          {/* QR simulado (el real se genera al emitir) */}
          <div className="shrink-0 flex flex-col items-center gap-0.5">
            <div className="rounded-md bg-white p-1 border border-solid border-gray-300 shadow-sm">
              <MockQR />
            </div>
            <span className="text-[7px] text-gray-400 tracking-wide">
              QR real al emitir
            </span>
          </div>

          {/* Códigos */}
          <div className="w-[42%] shrink-0 text-[9px] leading-snug text-gray-800 min-w-0 space-y-1">
            <div>
              <div className="font-bold" style={{ color: NAVY }}>
                Código de generación
              </div>
              <div className="text-gray-400 italic">Se genera al emitir</div>
            </div>
            <div>
              <div className="font-bold" style={{ color: NAVY }}>
                Número de control
              </div>
              <div className="break-all tabular-nums">{numeroControl || "—"}</div>
            </div>
            <div>
              <div className="font-bold" style={{ color: NAVY }}>
                Sello de recepción
              </div>
              <div className="text-gray-400 italic">Pendiente de Hacienda</div>
            </div>
          </div>
        </div>

        <div className="border-t border-solid border-gray-400/60 mt-3 pt-2 flex flex-row justify-between gap-2 text-[9px] text-gray-800">
          <div>
            <div className="font-bold" style={{ color: NAVY }}>
              Modelo de facturación
            </div>
            <div>Previo</div>
          </div>
          <div className="text-center">
            <div className="font-bold" style={{ color: NAVY }}>
              Fecha y hora de generación
            </div>
            <div className="tabular-nums">
              {time.date} · {time.time}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold" style={{ color: NAVY }}>
              Tipo de transmisión
            </div>
            <div>Normal</div>
          </div>
        </div>
      </div>

      {/* ---- Cuerpo ---- */}
      <div className="px-5 py-4">
        {/* Bloques emisor / receptor */}
        <div className="flex flex-row gap-3">
          <InfoBlock title="EMISOR" rows={emisorRows} />
          <InfoBlock title="RECEPTOR" rows={receptorRows} />
        </div>

        {/* Tabla de servicios */}
        <div className="flex flex-row items-center gap-2 mt-5 mb-2">
          <div className="flex-1 border-t border-solid border-gray-200" />
          <div
            className="font-bold text-[11px] tracking-[0.2em]"
            style={{ color: TEAL }}
          >
            SERVICIOS
          </div>
          <div className="flex-1 border-t border-solid border-gray-200" />
        </div>
        <table
          className="w-full border-collapse text-[9px]"
          style={{ color: NAVY }}
        >
          <thead>
            <tr
              className="border-b-2 border-solid"
              style={{ borderColor: NAVY }}
            >
              <th className="py-1.5 pr-1 text-left font-bold">N°</th>
              <th className="py-1.5 pr-1 text-left font-bold">Cant.</th>
              <th className="py-1.5 pr-1 text-left font-bold">Descripción</th>
              <th className="py-1.5 pr-1 text-right font-bold">Unitario</th>
              <th className="py-1.5 pr-1 text-right font-bold">Descuento</th>
              <th className="py-1.5 pr-1 text-right font-bold">No Sujetas</th>
              <th className="py-1.5 pr-1 text-right font-bold">Gravadas</th>
              <th className="py-1.5 text-right font-bold">Exentas</th>
            </tr>
          </thead>
          <tbody>
            {listItems.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-4 text-center italic text-gray-400"
                >
                  Agregue items para verlos aquí…
                </td>
              </tr>
            )}
            {listItems.map((item, index) => (
              <tr
                key={index}
                className="border-b border-solid border-gray-100"
                style={{
                  backgroundColor: index % 2 === 1 ? "#FAFAFB" : "transparent",
                }}
              >
                <td className="py-1 pr-1 align-top tabular-nums">
                  {index + 1}
                </td>
                <td className="py-1 pr-1 align-top tabular-nums">
                  {item.cantidad}
                </td>
                <td className="py-1 pr-1 align-top break-words">
                  {item.descripcion}
                </td>
                <td className="py-1 pr-1 text-right align-top tabular-nums">
                  {money(item.precioUni)}
                </td>
                <td className="py-1 pr-1 text-right align-top tabular-nums">
                  {money(item.montoDescu)}
                </td>
                <td className="py-1 pr-1 text-right align-top tabular-nums">
                  {money(item.ventaNoSuj)}
                </td>
                <td className="py-1 pr-1 text-right align-top tabular-nums">
                  {money(
                    (Number(item.precioUni) || 0) * (Number(item.cantidad) || 0)
                  )}
                </td>
                <td className="py-1 text-right align-top tabular-nums">
                  {money(item.ventaExenta)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Observaciones + resumen */}
        <div className="flex flex-row gap-4 mt-4 items-start">
          <div className="w-[45%] shrink-0">
            <div
              className="rounded-xl px-3 py-2.5 min-h-[90px] border border-solid border-gray-300/80 shadow-sm"
              style={{ backgroundColor: "#F4F4F6" }}
            >
              <div
                className="font-bold text-[10px] tracking-[0.12em] mb-1 pb-1 border-b border-solid border-gray-300"
                style={{ color: TEAL }}
              >
                OBSERVACIONES
              </div>
              <div className="text-[9px] text-gray-800 break-words whitespace-pre-wrap leading-snug">
                {observaciones}
              </div>
            </div>
          </div>

          <div className="flex-1 text-[10px] min-w-0" style={{ color: NAVY }}>
            {totalsRows.map((row, i) => (
              <div
                key={row.label}
                className={`flex flex-row justify-between gap-2 py-[2.5px] ${
                  i === totalsRows.length - 1
                    ? "border-t border-solid border-gray-300 mt-1 pt-1.5 font-bold"
                    : ""
                }`}
              >
                <span className="text-gray-600">{row.label}:</span>
                <span className="tabular-nums text-right">
                  {money(row.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cantidad en letras + total grande */}
        <div className="flex flex-row justify-between items-end mt-5 gap-4">
          <div
            className="text-[9px] max-w-[55%] italic leading-snug"
            style={{ color: NAVY }}
          >
            {cantidadEnLetras}
          </div>
          <div className="text-right">
            <div className="text-[8px] uppercase tracking-[0.15em] text-gray-400 mb-0.5">
              Total a pagar
            </div>
            <div
              className="text-[22px] font-bold tabular-nums leading-none"
              style={{ color: TEAL }}
            >
              {money(total)}
            </div>
            <div className="border-t-2 border-solid mt-1.5 w-[120px] ml-auto" style={{ borderColor: TEAL }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditoFiscalPdfPreview;
