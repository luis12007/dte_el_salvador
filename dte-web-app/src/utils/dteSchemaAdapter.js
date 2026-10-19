/*
 * Adaptador de DTE a los esquemas JSON vigentes del Ministerio de Hacienda
 * (svfe-json-schemas, carpeta context/ del repositorio).
 *
 *   01 Factura .......................... fe-f-v2      (version 2)
 *   03 Comprobante de crédito fiscal .... fe-ccf-v4    (version 4)
 *   05 Nota de crédito .................. fe-nc-v4     (version 4)
 *   06 Nota de débito ................... fe-nd-v4     (version 4)
 *   08 Comprobante de liquidación ....... fe-cl-v2     (version 2)
 *   14 Factura de sujeto excluido ....... fe-fse-v2    (version 2)
 *   Evento de invalidación .............. invalidacion-schema-v3 (version 3)
 *
 * RETROCOMPATIBLE: detecta si el JSON viene con el formato anterior de la app
 * (versiones viejas, sujetoExcluido, ivaRete1, extension, receptor.nit en NC/ND,
 * numeroControl sin M###P###, etc.) y lo convierte. Si ya viene en el formato
 * nuevo lo deja igual (la función es idempotente).
 *
 * IMPORTANTE: este archivo existe en DOS lugares y debe mantenerse idéntico:
 *   - dte-web-app/src/utils/dteSchemaAdapter.js
 *   - API/src/utils/dteSchemaAdapter.js
 * Está escrito en CommonJS para que lo usen tanto React como Node.
 */

/* ------------------------------------------------------------------ */
/* Valores fijos acordados                                              */
/* ------------------------------------------------------------------ */

// Dirección del emisor cuando no ha llenado el distrito en su perfil:
// San Salvador (06) / San Salvador Centro (23) / distrito San Salvador (14).
const EMISOR_DIRECCION_DEFAULT = { departamento: "06", municipio: "23", distrito: "14" };

// Códigos de establecimiento y punto de venta: siempre fijos.
const COD_ESTABLE = "M001";
const COD_PUNTO_VENTA = "P001";

/*
 * Distritos (CAT-008) que pertenecen a cada municipio (CAT-013), según la
 * reorganización municipal de 2024. Clave "departamento-municipio".
 * El primer distrito de cada lista es el que se usa por defecto cuando el
 * receptor o el emisor no tienen distrito (o tienen uno que no corresponde).
 * Hacienda rechaza un distrito que no pertenece al municipio
 * ("[receptor.direccion.distrito] VALOR NO ES PERMITIDO").
 */
const DISTRITOS_POR_MUNICIPIO = {
  // 01 Ahuachapán
  "01-13": ["03", "05", "09", "12"],
  "01-14": ["01", "02", "04", "11"],
  "01-15": ["07", "06", "08", "10"],
  // 02 Santa Ana
  "02-14": ["07", "06", "11", "13"],
  "02-15": ["10"],
  "02-16": ["02", "04"],
  "02-17": ["03", "01", "05", "08", "09", "12"],
  // 03 Sonsonate
  "03-17": ["07", "08", "10", "13"],
  "03-18": ["15", "16", "09", "11", "14"],
  "03-19": ["06", "02", "03", "12", "04", "05"],
  "03-20": ["01"],
  // 04 Chalatenango
  "04-34": ["12", "04", "25"],
  "04-35": ["16", "33", "13", "01", "08", "10", "24", "31", "32", "22"],
  "04-36": ["07", "02", "03", "05", "06", "09", "11", "14", "15", "17", "18", "19", "20", "21", "23", "26", "27", "28", "29", "30"],
  // 05 La Libertad
  "05-23": ["12", "16", "17"],
  "05-24": ["15", "02"],
  "05-25": ["03", "07", "13", "21", "19"],
  "05-26": ["01", "06", "10", "14", "22"],
  "05-27": ["09", "05", "08", "18", "20"],
  "05-28": ["11", "04"],
  // 06 San Salvador
  "06-20": ["01", "05", "06"],
  "06-21": ["02", "09"],
  "06-22": ["17", "07", "13", "18"],
  "06-23": ["14", "03", "04", "08", "19"],
  "06-24": ["10", "11", "12", "15", "16"],
  // 07 Cuscatlán
  "07-17": ["15", "09", "06", "07", "10"],
  "07-18": ["02", "01", "03", "04", "05", "08", "11", "12", "13", "14", "16"],
  // 08 La Paz
  "08-23": ["05", "01", "09", "11", "13", "15", "20"],
  "08-24": ["19", "02", "03", "04", "06", "07", "08", "12", "14", "16", "18"],
  "08-25": ["21", "10", "17", "22"],
  // 09 Cabañas
  "09-10": ["06", "02", "05", "08", "09"],
  "09-11": ["03", "01", "04", "07"],
  // 10 San Vicente
  "10-14": ["01", "04", "05", "06", "07", "08", "09"],
  "10-15": ["10", "02", "03", "11", "12", "13"],
  // 11 Usulután
  "11-24": ["21", "01", "02", "05", "07", "09", "11", "12", "16"],
  "11-25": ["23", "03", "04", "06", "10", "13", "17", "18", "20", "22"],
  "11-26": ["08", "14", "15", "19"],
  // 12 San Miguel
  "12-21": ["02", "01", "04", "11", "13", "14", "16", "19"],
  "12-22": ["17", "03", "06", "09", "12", "20"],
  "12-23": ["05", "07", "08", "10", "15", "18"],
  // 13 Morazán
  "13-27": ["16", "01", "02", "03", "07", "10", "11", "14", "18", "20", "24"],
  "13-28": ["19", "04", "05", "06", "08", "09", "12", "13", "15", "17", "21", "22", "23", "25", "26"],
  // 14 La Unión
  "14-19": ["16", "01", "02", "03", "06", "09", "11", "12", "13", "15"],
  "14-20": ["08", "04", "05", "07", "10", "14", "17", "18"],
};

const pad2 = (v) => {
  const s = reqStrSafe(v);
  return /^\d$/.test(s) ? `0${s}` : s;
};
function reqStrSafe(v) {
  return v === null || v === undefined ? "" : String(v).trim();
}

/*
 * Devuelve { departamento, municipio, distrito } coherentes con CAT-012/013/008.
 * - Si el distrito pertenece al municipio, se respeta.
 * - Si el municipio es un código viejo (antes de 2024) que en realidad es un
 *   distrito del departamento, se convierte al municipio nuevo que lo contiene.
 * - Si falta el distrito o no corresponde, se usa el distrito por defecto del municipio.
 * Devuelve null si el departamento/municipio no se pueden resolver.
 */
const resolverUbicacion = (departamento, municipio, distrito) => {
  const dep = pad2(departamento);
  const mun = pad2(municipio);
  const dis = pad2(distrito);
  const lista = DISTRITOS_POR_MUNICIPIO[`${dep}-${mun}`];
  if (lista) {
    return { departamento: dep, municipio: mun, distrito: lista.includes(dis) ? dis : lista[0] };
  }
  // Código de municipio viejo: corresponde a un distrito del departamento.
  const candidatoDistrito = dis || mun;
  for (const [clave, distritos] of Object.entries(DISTRITOS_POR_MUNICIPIO)) {
    const [d, m] = clave.split("-");
    if (d === dep && distritos.includes(candidatoDistrito)) {
      return { departamento: dep, municipio: m, distrito: candidatoDistrito };
    }
  }
  return null;
};

// NC/ND/CL: el esquema exige tipoDocumento del receptor; 36 = NIT (CAT-022).
const TIPO_DOC_NIT = "36";

// NC/ND: CAT-006 Retención IVA MH, se usa solo si hay IVA retenido. 22 = 1%.
const CODIGO_RETENCION_MH_DEFAULT = "22";

// CL: CAT-032 Domicilio fiscal del receptor. 1 = Domiciliado.
const COD_DOMICILIADO_DEFAULT = 1;

// Formato del número de documento del receptor (Normativa de Cumplimiento v2).
// MH rechazó "########-#" en Factura v2 ("numDocumento no cumple el formato
// requerido", código 096), así que DUI (13) y NIT (36) se envían solo con dígitos.
// Si Hacienda vuelve a exigir el guion en el DUI, poner DUI_CON_GUION en true.
const DUI_CON_GUION = false;

const SCHEMA_VERSIONS = {
  "01": 2,
  "03": 4,
  "05": 4,
  "06": 4,
  "08": 2,
  "14": 2,
  invalidacion: 3,
};

const NUMERO_CONTROL_REGEX = /^DTE-\d{2}-(M|B|S|P)\d{3}P\d{3}-\d{15}$/;

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const isBlank = (v) =>
  v === null || v === undefined || (typeof v === "string" && v.trim() === "");

const optStr = (v) => (isBlank(v) ? null : String(v).trim());
const reqStr = (v) => (v === null || v === undefined ? "" : String(v).trim());

const toNum = (v, fallback = 0) => {
  if (isBlank(v)) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const money = (v, fallback = 0) => Math.round(toNum(v, fallback) * 100) / 100;
const amount8 = (v, fallback = 0) => Math.round(toNum(v, fallback) * 1e8) / 1e8;
const optNum = (v) => (isBlank(v) ? null : toNum(v, null));

const optInt = (v) => {
  if (isBlank(v)) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

/* Número de documento según su tipo (CAT-022):
   13 DUI -> 9 dígitos (o ########-# si DUI_CON_GUION), 36 NIT -> solo dígitos.
   Otros tipos (pasaporte, carnet, otro) se dejan como vienen. */
const normalizeNumDocumento = (tipoDocumento, numDocumento) => {
  if (isBlank(numDocumento)) return numDocumento;
  const raw = String(numDocumento).trim();
  const tipo = isBlank(tipoDocumento) ? "" : String(tipoDocumento).trim();
  const digits = raw.replace(/\D/g, "");
  if (tipo === "13" && digits.length === 9) {
    return DUI_CON_GUION ? `${digits.slice(0, 8)}-${digits.slice(8)}` : digits;
  }
  if (tipo === "36" && (digits.length === 9 || digits.length === 14)) {
    return digits;
  }
  return raw;
};

/* Monto en letras con el mismo formato que usan las pantallas de creación. */
const numeroALetras = (numero) => {
  const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
  const especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE"];
  const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
  const centenas = ["", "CIEN", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];
  if (numero === 0) return "CERO";
  if (numero < 10) return unidades[numero];
  if (numero < 16) return especiales[numero - 10];
  if (numero < 20) return "DIECI" + unidades[numero - 10];
  if (numero < 30) return numero === 20 ? "VEINTE" : "VEINTI" + unidades[numero - 20];
  if (numero < 100) {
    const u = numero % 10;
    return decenas[Math.floor(numero / 10)] + (u > 0 ? " Y " + unidades[u] : "");
  }
  if (numero < 1000) {
    const c = Math.floor(numero / 100);
    const r = numero % 100;
    return (c === 1 && r > 0 ? "CIENTO" : centenas[c]) + (r > 0 ? " " + numeroALetras(r) : "");
  }
  if (numero < 1000000) {
    const m = Math.floor(numero / 1000);
    const r = numero % 1000;
    return (m === 1 ? "MIL" : numeroALetras(m) + " MIL") + (r > 0 ? " " + numeroALetras(r) : "");
  }
  const mi = Math.floor(numero / 1000000);
  const r = numero % 1000000;
  return (mi === 1 ? "UN MILLÓN" : numeroALetras(mi) + " MILLONES") + (r > 0 ? " " + numeroALetras(r) : "");
};

const dineroALetras = (cantidad) => {
  const n = Math.round(toNum(cantidad) * 100) / 100;
  if (n === 0) return "CERO DÓLARES";
  const [d, c] = n.toFixed(2).split(".");
  const dolares = parseInt(d, 10);
  const centavos = parseInt(c, 10);
  let res = `${numeroALetras(dolares)} ${dolares === 1 ? "DÓLAR" : "DÓLARES"}`;
  if (centavos > 0) res += ` CON ${numeroALetras(centavos)} ${centavos === 1 ? "CENTAVO" : "CENTAVOS"}`;
  return res;
};

/* numeroControl: si no cumple el formato nuevo se conserva el correlativo
   y se reemplaza el segmento de establecimiento por M001P001. */
const normalizeNumeroControl = (numeroControl, tipoDte) => {
  const raw = reqStr(numeroControl);
  if (NUMERO_CONTROL_REGEX.test(raw)) return raw;
  const digits = (raw.split("-").pop() || "").replace(/\D/g, "");
  const correlativo = digits.slice(-15).padStart(15, "0");
  return `DTE-${tipoDte}-${COD_ESTABLE}${COD_PUNTO_VENTA}-${correlativo}`;
};

/* Receptor: el distrito se valida contra su municipio. Si no se puede resolver
   la ubicación, se usa la dirección por defecto de San Salvador. */
const buildDireccionReceptor = (dir) => {
  if (!dir || typeof dir !== "object") return null;
  const ubicacion =
    resolverUbicacion(dir.departamento, dir.municipio, dir.distrito) || EMISOR_DIRECCION_DEFAULT;
  return { ...ubicacion, complemento: reqStr(dir.complemento) };
};

/* Emisor: si tiene distrito (perfil) se usa su departamento/municipio/distrito
   validados entre sí; si no tiene distrito o no se puede resolver, la
   dirección fija de San Salvador. */
const buildDireccionEmisor = (dir, distritoPerfil) => {
  const d = dir && typeof dir === "object" ? dir : {};
  const distrito = !isBlank(d.distrito) ? d.distrito : distritoPerfil;
  const ubicacion = isBlank(distrito)
    ? EMISOR_DIRECCION_DEFAULT
    : resolverUbicacion(d.departamento, d.municipio, distrito) || EMISOR_DIRECCION_DEFAULT;
  return { ...ubicacion, complemento: reqStr(d.complemento) };
};

const buildIdentificacion = (ident, tipoDte, { withFusion = false, withContingencia = true } = {}) => {
  const out = {
    version: SCHEMA_VERSIONS[tipoDte],
    ambiente: reqStr(ident.ambiente),
    tipoDte,
    numeroControl: normalizeNumeroControl(ident.numeroControl, tipoDte),
    codigoGeneracion: reqStr(ident.codigoGeneracion).toUpperCase(),
    tipoModelo: toNum(ident.tipoModelo, 1),
    tipoOperacion: optInt(ident.tipoOperacion) ?? 1,
  };
  // Liquidación (08) no lleva datos de contingencia en su identificación.
  if (withContingencia) {
    out.tipoContingencia = optInt(ident.tipoContingencia);
    out.motivoContin = optStr(ident.motivoContin);
  }
  out.fecEmi = reqStr(ident.fecEmi);
  out.horEmi = reqStr(ident.horEmi);
  out.tipoMoneda = "USD";
  if (withFusion) out.fusion = optStr(ident.fusion);
  return out;
};

const buildDocumentoRelacionado = (docs) => {
  if (!Array.isArray(docs) || docs.length === 0) return null;
  return docs.map((d) => ({
    tipoDocumento: reqStr(d.tipoDocumento),
    tipoGeneracion: optInt(d.tipoGeneracion) ?? 2,
    numeroDocumento: reqStr(d.numeroDocumento),
    fechaEmision: reqStr(d.fechaEmision),
  }));
};

const buildPagos = (pagos) => {
  if (!Array.isArray(pagos) || pagos.length === 0) return null;
  return pagos.map((p) => ({
    codigo: optStr(p.codigo),
    montoPago: money(p.montoPago),
    referencia: optStr(p.referencia),
    plazo: optStr(p.plazo),
    periodo: optNum(p.periodo),
  }));
};

const buildTributosResumen = (tributos) => {
  if (!Array.isArray(tributos) || tributos.length === 0) return null;
  const valid = tributos.filter((t) => t && !isBlank(t.codigo) && String(t.codigo) !== "undefined");
  if (valid.length === 0) return null;
  return valid.map((t) => ({
    codigo: reqStr(t.codigo),
    descripcion: reqStr(t.descripcion),
    valor: money(t.valor),
  }));
};

const buildTributosItem = (tributos) => {
  if (!Array.isArray(tributos) || tributos.length === 0) return null;
  const valid = tributos.filter((t) => !isBlank(t) && String(t) !== "null");
  return valid.length === 0 ? null : valid.map((t) => String(t));
};

const buildApendice = (apendice) =>
  Array.isArray(apendice) && apendice.length > 0 ? apendice : null;

const optArray = (a) => (Array.isArray(a) && a.length > 0 ? a : null);

const observacionesFrom = (data) =>
  optStr(data?.resumen?.observaciones ?? data?.extension?.observaciones);

// Reparte un total entre ítems en proporción a ventaGravada; el último ajusta la suma.
const distribute = (total, bases) => {
  const sum = bases.reduce((a, b) => a + b, 0);
  if (!total || sum <= 0) return bases.map(() => 0);
  let assigned = 0;
  return bases.map((b, i) => {
    if (i === bases.length - 1) return money(total - assigned);
    const part = money((total * b) / sum);
    assigned += part;
    return part;
  });
};

/* Retención de renta: F, CCF, NC, ND y CL ya no la llevan en el esquema.
   Si un documento viejo la restaba del total, se devuelve al total a pagar
   y se regenera el monto en letras. */
const totalSinRenta = (res, totalBase) => {
  const renta = money(res?.reteRenta);
  const total = money(totalBase);
  if (renta > 0) {
    const nuevo = money(total + renta);
    return { totalPagar: nuevo, totalLetras: dineroALetras(nuevo) };
  }
  return { totalPagar: total, totalLetras: optStr(res?.totalLetras) };
};

const buildEmisor = (e, opts = {}) => {
  const { nombreComercial = true, establecimiento = true, telefonoOpcional = false, distritoPerfil = null } = opts;
  const out = {
    nit: reqStr(e.nit),
    nrc: optStr(e.nrc),
    nombre: reqStr(e.nombre),
    codActividad: reqStr(e.codActividad),
    descActividad: reqStr(e.descActividad),
  };
  if (nombreComercial) out.nombreComercial = optStr(e.nombreComercial);
  out.direccion = buildDireccionEmisor(e.direccion, distritoPerfil);
  out.telefono = telefonoOpcional ? optStr(e.telefono) : reqStr(e.telefono);
  out.correo = reqStr(e.correo);
  if (establecimiento) {
    out.codEstable = COD_ESTABLE;
    out.codPuntoVenta = COD_PUNTO_VENTA;
  }
  return out;
};

/* ------------------------------------------------------------------ */
/* Detección de formato                                                 */
/* ------------------------------------------------------------------ */

/* Devuelve "actual" si el JSON ya cumple la estructura del esquema vigente
   (versión y campos clave) o "anterior" si viene con el formato viejo. */
const detectFormat = (data) => {
  if (!data || typeof data !== "object") return "desconocido";
  if (data.documento && data.motivo) {
    const v = data.identificacion?.version;
    return v === SCHEMA_VERSIONS.invalidacion && data.identificacion?.fecEmi ? "actual" : "anterior";
  }
  const tipo = data.identificacion?.tipoDte;
  if (!SCHEMA_VERSIONS[tipo]) return "desconocido";
  const legacyKeys =
    data.extension !== undefined ||
    data.sujetoExcluido !== undefined ||
    data.emisor?.codEstableMH !== undefined ||
    data.emisor?.tipoEstablecimiento !== undefined ||
    data.resumen?.ivaRete1 !== undefined ||
    data.resumen?.ivaPerci1 !== undefined ||
    data.resumen?.totalExportacion !== undefined ||
    (data.emisor?.direccion && data.emisor.direccion.distrito === undefined) ||
    !NUMERO_CONTROL_REGEX.test(reqStr(data.identificacion?.numeroControl));
  return data.identificacion?.version === SCHEMA_VERSIONS[tipo] && !legacyKeys ? "actual" : "anterior";
};

/* ------------------------------------------------------------------ */
/* 01 Factura v2                                                        */
/* ------------------------------------------------------------------ */

const adaptFactura = (data, extra) => {
  const r = data.receptor;
  const hasReceptor = r && !(isBlank(r.numDocumento) && isBlank(r.nombre) && isBlank(r.tipoDocumento));
  const receptor = hasReceptor
    ? {
        tipoDocumento: optStr(r.tipoDocumento),
        numDocumento: optStr(normalizeNumDocumento(r.tipoDocumento, r.numDocumento)),
        nrc: optStr(r.nrc),
        nombre: optStr(r.nombre),
        codActividad: optStr(r.codActividad),
        descActividad: optStr(r.descActividad),
        direccion: r.direccion && typeof r.direccion === "object" ? buildDireccionReceptor(r.direccion) : null,
        telefono: optStr(r.telefono),
        correo: optStr(r.correo),
      }
    : null;

  const res = data.resumen || {};
  const { totalPagar, totalLetras } = totalSinRenta(res, res.totalPagar);
  return {
    identificacion: buildIdentificacion(data.identificacion, "01"),
    documentoRelacionado: buildDocumentoRelacionado(data.documentoRelacionado),
    emisor: buildEmisor(data.emisor, { distritoPerfil: extra.distritoEmisor }),
    receptor,
    otrosDocumentos: optArray(data.otrosDocumentos),
    ventaTercero: data.ventaTercero || null,
    cuerpoDocumento: (data.cuerpoDocumento || []).map((it, i) => ({
      numItem: i + 1,
      tipoItem: optInt(it.tipoItem) ?? 1,
      numeroDocumento: optStr(it.numeroDocumento),
      cantidad: amount8(it.cantidad),
      codigo: optStr(it.codigo),
      codTributo: optStr(it.codTributo),
      uniMedida: optInt(it.uniMedida) ?? 99,
      descripcion: reqStr(it.descripcion),
      precioUni: amount8(it.precioUni),
      montoDescu: amount8(it.montoDescu),
      ventaNoSuj: amount8(it.ventaNoSuj),
      ventaExenta: amount8(it.ventaExenta),
      ventaGravada: amount8(it.ventaGravada),
      tributos: buildTributosItem(it.tributos),
      psv: amount8(it.psv),
      noGravado: amount8(it.noGravado),
      ivaItem: amount8(it.ivaItem),
    })),
    resumen: {
      totalNoSuj: money(res.totalNoSuj),
      totalExenta: money(res.totalExenta),
      totalGravada: money(res.totalGravada),
      subTotalVentas: money(res.subTotalVentas),
      descuNoSuj: money(res.descuNoSuj),
      descuExenta: money(res.descuExenta),
      descuGravada: money(res.descuGravada),
      porcentajeDescuento: money(res.porcentajeDescuento),
      totalDescu: money(res.totalDescu),
      tributos: buildTributosResumen(res.tributos),
      subTotal: money(res.subTotal),
      ivaRete: money(res.ivaRete ?? res.ivaRete1),
      montoTotalOperacion: money(res.montoTotalOperacion),
      totalNoGravado: money(res.totalNoGravado),
      totalPagar,
      totalLetras,
      totalIva: money(res.totalIva),
      saldoFavor: money(res.saldoFavor),
      condicionOperacion: toNum(res.condicionOperacion, 1),
      pagos: buildPagos(res.pagos),
      numPagoElectronico: optStr(res.numPagoElectronico),
      observaciones: observacionesFrom(data),
    },
    apendice: buildApendice(data.apendice),
  };
};

/* ------------------------------------------------------------------ */
/* 03 Comprobante de crédito fiscal v4                                  */
/* ------------------------------------------------------------------ */

const adaptCreditoFiscal = (data, extra) => {
  const r = data.receptor || {};
  const res = data.resumen || {};
  const { totalPagar, totalLetras } = totalSinRenta(res, res.totalPagar);
  return {
    identificacion: buildIdentificacion(data.identificacion, "03"),
    documentoRelacionado: buildDocumentoRelacionado(data.documentoRelacionado),
    emisor: buildEmisor(data.emisor, { distritoPerfil: extra.distritoEmisor }),
    receptor: {
      nit: reqStr(normalizeNumDocumento("36", r.nit ?? r.numDocumento)),
      nrc: optStr(r.nrc),
      nombre: reqStr(r.nombre),
      codActividad: reqStr(r.codActividad),
      descActividad: reqStr(r.descActividad),
      nombreComercial: optStr(r.nombreComercial),
      direccion: buildDireccionReceptor(r.direccion),
      telefono: optStr(r.telefono),
      correo: optStr(r.correo),
    },
    otrosDocumentos: optArray(data.otrosDocumentos),
    ventaTercero: data.ventaTercero || null,
    cuerpoDocumento: (data.cuerpoDocumento || []).map((it, i) => ({
      numItem: i + 1,
      tipoItem: optInt(it.tipoItem) ?? 1,
      numeroDocumento: optStr(it.numeroDocumento),
      codigo: optStr(it.codigo),
      codTributo: optStr(it.codTributo),
      descripcion: reqStr(it.descripcion),
      cantidad: amount8(it.cantidad),
      uniMedida: optInt(it.uniMedida) ?? 99,
      precioUni: amount8(it.precioUni),
      montoDescu: amount8(it.montoDescu),
      ventaNoSuj: amount8(it.ventaNoSuj),
      ventaExenta: amount8(it.ventaExenta),
      ventaGravada: amount8(it.ventaGravada),
      tributos: buildTributosItem(it.tributos),
      psv: amount8(it.psv),
      noGravado: amount8(it.noGravado),
    })),
    resumen: {
      totalNoSuj: money(res.totalNoSuj),
      totalExenta: money(res.totalExenta),
      totalGravada: money(res.totalGravada),
      subTotalVentas: money(res.subTotalVentas),
      descuNoSuj: money(res.descuNoSuj),
      descuExenta: money(res.descuExenta),
      descuGravada: money(res.descuGravada),
      porcentajeDescuento: money(res.porcentajeDescuento),
      totalDescu: money(res.totalDescu),
      tributos: buildTributosResumen(res.tributos),
      subTotal: money(res.subTotal),
      ivaPerci: money(res.ivaPerci ?? res.ivaPerci1),
      ivaRete: money(res.ivaRete ?? res.ivaRete1),
      montoTotalOperacion: money(res.montoTotalOperacion),
      totalNoGravado: money(res.totalNoGravado),
      totalPagar,
      totalLetras,
      saldoFavor: money(res.saldoFavor),
      condicionOperacion: toNum(res.condicionOperacion, 1),
      pagos: buildPagos(res.pagos),
      numPagoElectronico: optStr(res.numPagoElectronico),
      observaciones: observacionesFrom(data),
    },
    apendice: buildApendice(data.apendice),
  };
};

/* ------------------------------------------------------------------ */
/* 05 Nota de crédito v4 / 06 Nota de débito v4                         */
/* ------------------------------------------------------------------ */

const adaptNota = (data, tipoDte, extra) => {
  const r = data.receptor || {};
  const res = data.resumen || {};
  const items = data.cuerpoDocumento || [];

  const docRelacionados = buildDocumentoRelacionado(data.documentoRelacionado) || [];
  const numeroDocumentoDefault = docRelacionados[0]?.numeroDocumento || "";

  const tributos = buildTributosResumen(res.tributos);
  const iva20 = (tributos || []).find((t) => t.codigo === "20");
  const bases = items.map((it) => toNum(it.ventaGravada));
  const totalIva = iva20 ? iva20.valor : money(res.totalIva);
  const ivaPerci = money(res.ivaPerci ?? res.ivaPerci1);
  const ivaRete = money(res.ivaRete ?? res.ivaRete1);

  // Si ya viene en formato nuevo, se respetan los montos por ítem.
  const itemsYaAdaptados = items.length > 0 && items.every((it) => it.totalIva !== undefined);
  const ivaItems = itemsYaAdaptados ? items.map((it) => amount8(it.totalIva)) : distribute(totalIva, bases);
  const perciItems = itemsYaAdaptados ? items.map((it) => amount8(it.ivaPerci)) : distribute(ivaPerci, bases);
  const reteItems = itemsYaAdaptados ? items.map((it) => amount8(it.ivaRete)) : distribute(ivaRete, bases);

  const { totalPagar, totalLetras } = totalSinRenta(res, res.totalPagar ?? extra.totalPagar ?? res.montoTotalOperacion);

  const resumen = {
    totalNoSuj: money(res.totalNoSuj),
    totalExenta: money(res.totalExenta),
    totalGravada: money(res.totalGravada),
    subTotalVentas: money(res.subTotalVentas),
    totalDescu: money(res.totalDescu),
    tributos,
    montoTotalOperacion: money(res.montoTotalOperacion),
    ivaPerci,
    totalIva,
    ivaRete,
    totalNoGravado: money(res.totalNoGravado),
    totalPagar,
    totalLetras,
    condicionOperacion: toNum(res.condicionOperacion, 1),
  };
  if (tipoDte === "06") resumen.numPagoElectronico = optStr(res.numPagoElectronico);
  resumen.observaciones = observacionesFrom(data);
  resumen.codigoRetencionMH = !isBlank(res.codigoRetencionMH)
    ? String(res.codigoRetencionMH)
    : ivaRete > 0
      ? CODIGO_RETENCION_MH_DEFAULT
      : null;

  return {
    identificacion: buildIdentificacion(data.identificacion, tipoDte, { withFusion: true }),
    documentoRelacionado: docRelacionados,
    emisor: buildEmisor(data.emisor, { establecimiento: false, distritoPerfil: extra.distritoEmisor }),
    receptor: {
      tipoDocumento: isBlank(r.tipoDocumento) ? TIPO_DOC_NIT : String(r.tipoDocumento),
      numDocumento: reqStr(normalizeNumDocumento(isBlank(r.tipoDocumento) ? TIPO_DOC_NIT : r.tipoDocumento, r.numDocumento ?? r.nit)),
      nrc: optStr(r.nrc),
      nombre: reqStr(r.nombre),
      codActividad: reqStr(r.codActividad),
      descActividad: reqStr(r.descActividad),
      nombreComercial: optStr(r.nombreComercial),
      direccion: buildDireccionReceptor(r.direccion),
      telefono: optStr(r.telefono),
      correo: optStr(r.correo),
    },
    ventaTercero: data.ventaTercero || null,
    cuerpoDocumento: items.map((it, i) => ({
      numItem: i + 1,
      tipoItem: optInt(it.tipoItem) ?? 1,
      numeroDocumento: isBlank(it.numeroDocumento) ? numeroDocumentoDefault : String(it.numeroDocumento),
      cantidad: amount8(it.cantidad),
      codigo: optStr(it.codigo),
      codTributo: optStr(it.codTributo),
      uniMedida: optInt(it.uniMedida) ?? 99,
      descripcion: reqStr(it.descripcion),
      precioUni: amount8(it.precioUni),
      montoDescu: amount8(it.montoDescu),
      ventaNoSuj: amount8(it.ventaNoSuj),
      ventaExenta: amount8(it.ventaExenta),
      ventaGravada: amount8(it.ventaGravada),
      tributos: buildTributosItem(it.tributos),
      noGravado: amount8(it.noGravado),
      ivaPerci: perciItems[i],
      totalIva: ivaItems[i],
      ivaRete: reteItems[i],
    })),
    resumen,
    apendice: buildApendice(data.apendice),
  };
};

/* ------------------------------------------------------------------ */
/* 08 Comprobante de liquidación v2                                     */
/* ------------------------------------------------------------------ */

const adaptLiquidacion = (data, extra) => {
  const r = data.receptor || {};
  const res = data.resumen || {};
  const total = money(res.total ?? res.totalPagar ?? extra.totalPagar);
  return {
    identificacion: buildIdentificacion(data.identificacion, "08", { withFusion: true, withContingencia: false }),
    emisor: buildEmisor(data.emisor, { telefonoOpcional: true, distritoPerfil: extra.distritoEmisor }),
    receptor: {
      tipoDocumento: isBlank(r.tipoDocumento) ? TIPO_DOC_NIT : String(r.tipoDocumento),
      numDocumento: reqStr(normalizeNumDocumento(isBlank(r.tipoDocumento) ? TIPO_DOC_NIT : r.tipoDocumento, r.numDocumento ?? r.nit)),
      codDomiciliado: optInt(r.codDomiciliado) ?? COD_DOMICILIADO_DEFAULT,
      nrc: optStr(r.nrc),
      nombre: reqStr(r.nombre),
      codActividad: reqStr(r.codActividad),
      descActividad: reqStr(r.descActividad),
      nombreComercial: optStr(r.nombreComercial),
      direccion: buildDireccionReceptor(r.direccion),
      telefono: optStr(r.telefono),
      correo: optStr(r.correo),
    },
    cuerpoDocumento: (data.cuerpoDocumento || []).map((it, i) => ({
      numItem: i + 1,
      tipoDte: reqStr(it.tipoDte),
      tipoGeneracion: optInt(it.tipoGeneracion) ?? 2,
      numeroDocumento: reqStr(it.numeroDocumento),
      fechaEmision: reqStr(it.fechaEmision ?? it.fechaGeneracion),
      ventaNoSuj: amount8(it.ventaNoSuj),
      ventaExenta: amount8(it.ventaExenta),
      ventaGravada: amount8(it.ventaGravada),
      exportaciones: amount8(it.exportaciones),
      tributos: buildTributosItem(it.tributos),
      ivaItem: amount8(it.ivaItem),
      observaciones: optStr(it.observaciones ?? it.obsItem),
    })),
    resumen: {
      totalNoSuj: money(res.totalNoSuj),
      totalExenta: money(res.totalExenta),
      totalGravada: money(res.totalGravada),
      exportacion: money(res.exportacion ?? res.totalExportacion),
      subTotalVentas: money(res.subTotalVentas),
      tributos: buildTributosResumen(res.tributos),
      montoTotalOperacion: money(res.montoTotalOperacion),
      ivaPerci: money(res.ivaPerci ?? res.ivaPerci1),
      total,
      totalLetras: optStr(res.totalLetras) || dineroALetras(total),
      condicionOperacion: toNum(res.condicionOperacion, 1),
      observaciones: observacionesFrom(data),
    },
    apendice: buildApendice(data.apendice),
  };
};

/* ------------------------------------------------------------------ */
/* 14 Factura de sujeto excluido v2                                     */
/* ------------------------------------------------------------------ */

const adaptSujetoExcluido = (data, extra) => {
  const r = data.receptor || data.sujetoExcluido || {};
  const res = data.resumen || {};
  return {
    identificacion: buildIdentificacion(data.identificacion, "14"),
    emisor: buildEmisor(data.emisor, { nombreComercial: false, distritoPerfil: extra.distritoEmisor }),
    receptor: {
      tipoDocumento: reqStr(r.tipoDocumento),
      numDocumento: reqStr(normalizeNumDocumento(r.tipoDocumento, r.numDocumento)),
      nombre: reqStr(r.nombre),
      codActividad: optStr(r.codActividad),
      descActividad: optStr(r.descActividad),
      direccion: buildDireccionReceptor(r.direccion),
      telefono: optStr(r.telefono),
      correo: optStr(r.correo),
    },
    cuerpoDocumento: (data.cuerpoDocumento || []).map((it, i) => ({
      numItem: i + 1,
      tipoItem: optInt(it.tipoItem) ?? 1,
      cantidad: amount8(it.cantidad),
      codigo: optStr(it.codigo),
      uniMedida: optInt(it.uniMedida) ?? 99,
      descripcion: reqStr(it.descripcion),
      precioUni: amount8(it.precioUni),
      montoDescu: amount8(it.montoDescu),
      compra: amount8(it.compra),
    })),
    resumen: {
      totalCompra: money(res.totalCompra),
      descu: money(res.descu),
      totalDescu: money(res.totalDescu),
      subTotal: money(res.subTotal),
      reteRenta: money(res.reteRenta),
      totalPagar: money(res.totalPagar),
      totalLetras: optStr(res.totalLetras),
      condicionOperacion: toNum(res.condicionOperacion, 1),
      pagos: buildPagos(res.pagos),
      observaciones: observacionesFrom(data),
    },
    apendice: buildApendice(data.apendice),
  };
};

/* ------------------------------------------------------------------ */
/* Evento de invalidación v3                                            */
/* ------------------------------------------------------------------ */

const adaptInvalidationForSigning = (evento) => {
  const ident = evento.identificacion || {};
  const e = evento.emisor || {};
  const d = evento.documento || {};
  const m = evento.motivo || {};
  return {
    identificacion: {
      version: SCHEMA_VERSIONS.invalidacion,
      ambiente: reqStr(ident.ambiente),
      codigoGeneracion: reqStr(ident.codigoGeneracion).toUpperCase(),
      fecEmi: reqStr(ident.fecEmi ?? ident.fecAnula),
      horEmi: reqStr(ident.horEmi ?? ident.horAnula),
      fusion: optStr(ident.fusion),
    },
    emisor: {
      nit: reqStr(e.nit),
      nombre: reqStr(e.nombre),
      codEstableMH: COD_ESTABLE,
      codEstable: COD_ESTABLE,
      codPuntoVentaMH: COD_PUNTO_VENTA,
      codPuntoVenta: COD_PUNTO_VENTA,
      telefono: reqStr(e.telefono),
      correo: reqStr(e.correo),
    },
    documento: {
      tipoDte: reqStr(d.tipoDte),
      codigoGeneracion: reqStr(d.codigoGeneracion),
      selloRecibido: reqStr(d.selloRecibido),
      numeroControl: optStr(d.numeroControl),
      fecEmi: reqStr(d.fecEmi),
      codigoGeneracionR: optStr(d.codigoGeneracionR),
      tipoDocumento: optStr(d.tipoDocumento),
      numDocumento: optStr(normalizeNumDocumento(d.tipoDocumento, d.numDocumento)),
      nombre: optStr(d.nombre),
      telefono: optStr(d.telefono),
      correo: optStr(d.correo),
    },
    motivo: {
      tipoAnulacion: optInt(m.tipoAnulacion) ?? 2,
      motivoAnulacion: optStr(m.motivoAnulacion),
      nombreResponsable: reqStr(m.nombreResponsable),
      tipDocResponsable: reqStr(m.tipDocResponsable),
      numDocResponsable: reqStr(normalizeNumDocumento(m.tipDocResponsable, m.numDocResponsable)),
      nombreSolicita: reqStr(m.nombreSolicita),
      tipDocSolicita: reqStr(m.tipDocSolicita),
      numDocSolicita: reqStr(normalizeNumDocumento(m.tipDocSolicita, m.numDocSolicita)),
    },
  };
};

/* ------------------------------------------------------------------ */
/* API pública                                                          */
/* ------------------------------------------------------------------ */

/*
 * Devuelve el DTE con el esquema vigente.
 * extra (opcional):
 *   distritoEmisor: distrito del perfil del emisor (si el JSON no lo trae)
 *   totalPagar:     total guardado en la plantilla (NC/ND/CL viejas no lo traen en el resumen)
 * Tipos sin esquema nuevo cubierto se devuelven sin cambios.
 */
const adaptDteForSigning = (data, extra = {}) => {
  if (!data || typeof data !== "object") return data;
  if (data.documento && data.motivo) return adaptInvalidationForSigning(data);
  const tipo = data.identificacion?.tipoDte;
  switch (tipo) {
    case "01":
      return adaptFactura(data, extra);
    case "03":
      return adaptCreditoFiscal(data, extra);
    case "05":
    case "06":
      return adaptNota(data, tipo, extra);
    case "08":
      return adaptLiquidacion(data, extra);
    case "14":
      return adaptSujetoExcluido(data, extra);
    default:
      return data;
  }
};

const schemaVersionFor = (tipoDte) => SCHEMA_VERSIONS[tipoDte] ?? null;

/* Copia al objeto con formato anterior los datos que deben quedar guardados
   igual que en el documento firmado (versión y número de control). */
const syncLegacyWithSigned = (legacy, signed) => {
  if (!legacy?.identificacion || !signed?.identificacion) return legacy;
  legacy.identificacion.version = signed.identificacion.version;
  if (signed.identificacion.numeroControl) {
    legacy.identificacion.numeroControl = signed.identificacion.numeroControl;
  }
  return legacy;
};

/* Decodifica el payload de una firma JWS (el JSON exacto que se firmó). */
const decodeJwsPayload = (jws) => {
  try {
    if (typeof jws !== "string") return null;
    const parts = jws.split(".");
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    let text;
    if (typeof Buffer !== "undefined") {
      text = Buffer.from(padded, "base64").toString("utf8");
    } else {
      const bin = atob(padded);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      text = new TextDecoder("utf-8").decode(bytes);
    }
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

/*
 * JSON que se entrega al receptor (Manual de Integración 6.5):
 * estructura del DTE + firmaElectronica + selloRecibido.
 * Si la firma guardada ya contiene un DTE con el esquema vigente se usa ese
 * JSON tal cual se firmó; si no, se adapta el JSON reconstruido desde la BD.
 */
const buildClientDteJson = (legacyJson, { firma = null, sello = null, distritoEmisor = null, totalPagar } = {}) => {
  const firmado = decodeJwsPayload(firma);
  let dte;
  if (firmado && detectFormat(firmado) === "actual") {
    dte = firmado;
  } else {
    dte = adaptDteForSigning(legacyJson, { distritoEmisor, totalPagar });
  }
  return {
    ...dte,
    firmaElectronica: firma || null,
    selloRecibido: sello || null,
  };
};

module.exports = {
  SCHEMA_VERSIONS,
  EMISOR_DIRECCION_DEFAULT,
  DISTRITOS_POR_MUNICIPIO,
  resolverUbicacion,
  COD_ESTABLE,
  COD_PUNTO_VENTA,
  adaptDteForSigning,
  adaptInvalidationForSigning,
  schemaVersionFor,
  detectFormat,
  syncLegacyWithSigned,
  buildClientDteJson,
  decodeJwsPayload,
  dineroALetras,
};
