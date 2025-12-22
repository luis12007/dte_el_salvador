import React, { useState } from "react";
import Modal from "react-modal";
import HamburguerComponent from "./HamburguerComponent";
import SidebarComponent from "../components/SideBarComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlantillaAPI from "../services/PlantillaService";
import { useEffect } from "react";
import UserService from "../services/UserServices";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

import ModalEditJson from "./ModalEditJson";

const BooksComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visible, setVisible] = useState(false);
  const [book, setBook] = useState("");
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [jsonData, setJsonData] = useState(null);
  const [user, setUser] = useState({});

  // Estado para el modal de edición de JSON
  const [isEditJsonModalOpen, setIsEditJsonModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const resultusers = await UserService.getUserInfo(user_id, token);
      setUser(resultusers);
    };
    fetchUser();
  }, []);

  const openModal = (booktype) => {
    setIsModalOpen(true);
    setBook(booktype);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sidebar = () => {
    setVisible(!visible);
  };

  const handleDownload = () => {
    console.log("Download clicked with dates:", startDate, endDate);

    if (startDate === "" || endDate === "") {
      toast.error("Por favor seleccione un rango de fechas");
      return;
    }

    if (book === "LC") {
      console.log("Libros de Contribuyentes");
      LibroContribuyentes();
    }
    if (book === "LCF") {
      console.log("Libros de Consumidor Final");
      LibroConsumidorFinal();
    }
    if (book === "LCOM") {
      console.log("Libros de Compras");
      LibroCompras();
    }
    if (book === "ANEX") {
      console.log("Anexos");
      Anexos();
    }

    // Nuevos tipos: exportaciones de datos brutos por documento
    if (book === "RAW_FACT") {
      console.log("Exportación bruta: Facturas (01)");
      exportRawFactura();
    }
    if (book === "RAW_CF") {
      console.log("Exportación bruta: Crédito Fiscal (03)");
      exportRawCreditoFiscal();
    }
    if (book === "RAW_SUEX") {
      console.log("Exportación bruta: Sujeto Excluido (14)");
      exportRawSujetoExcluido();
    }
    if (book === "RAW_NOTAS") {
      console.log("Exportación bruta: Notas (05,06)");
      exportRawNotas();
    }

    if (book === "RAW_COMP") {
      console.log("Exportación bruta: Compras");
      exportRawCompras();
    }

    closeModal();
  };

  const Anexos = async () => {
    console.log("Anexos");
    anexoBill();
    anexoCF();
    anexoSuex();
    anexoCompras();
  };

  // Utilidades para exportación bruta a Excel (sin transformar)
  const flattenObject = (obj, prefix = "") => {
    const res = {};
    if (!obj || typeof obj !== "object") return res;
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(res, flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        // Serializamos arrays como JSON para no perder datos
        res[newKey] = JSON.stringify(value);
      } else {
        res[newKey] = value;
      }
    }
    return res;
  };

  const buildColumnsFromData = (data) => {
    const colSet = new Set();
    data.forEach((item) => {
      const flat = flattenObject(item);
      Object.keys(flat).forEach((k) => colSet.add(k));
    });
    return Array.from(colSet);
  };

  const generateRawExcel = async (data, title, filenameBase) => {
    if (!data || !data.length) {
      toast.info("No hay datos para exportar");
      return;
    }

    const flatRows = data.map((item) => flattenObject(item));
    const columns = buildColumnsFromData(data);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");

    const addMergedHeader = (text, opts = {}) => {
      const r = worksheet.addRow([text]);
      const rowIndex = r.number;
      worksheet.mergeCells(rowIndex, 1, rowIndex, Math.max(1, columns.length));
      const cell = worksheet.getCell(rowIndex, 1);
      cell.style = {
        font: { bold: opts.bold ?? true, size: opts.size ?? 16, name: "Arial" },
        alignment: {
          horizontal: opts.align ?? "center",
          vertical: "middle",
          wrapText: true,
        },
      };
      r.height = opts.height ?? 25;
    };

    // Encabezados estilo "libros"
    addMergedHeader(title, { size: 18 });
    addMergedHeader(`${user?.name ?? ""}`, {
      bold: true,
      size: 14,
      align: "left",
    });
    addMergedHeader(`Fecha: ${startDate} al ${endDate}`, {
      bold: false,
      size: 12,
      align: "left",
    });
    addMergedHeader(`NRC: ${user?.nrc ?? ""}`, {
      bold: false,
      size: 12,
      align: "left",
    });
    worksheet.addRow([""]);

    // Encabezado de columnas (todas las llaves crudas)
    const headerRow = worksheet.addRow(columns);
    headerRow.eachCell((cell) => {
      cell.style = {
        font: { bold: true, color: { argb: "FFFFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" },
        },
        alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        border: {
          top: { style: "medium", color: { argb: "FF000000" } },
          left: { style: "medium", color: { argb: "FF000000" } },
          bottom: { style: "medium", color: { argb: "FF000000" } },
          right: { style: "medium", color: { argb: "FF000000" } },
        },
      };
    });

    // Filas de datos

    // Formatear fecha_y_hora_de_generacion y recolectar totales
    const numericColumns = columns.filter(
      (col) => flatRows.some((row) => !isNaN(Number(row[col])))
    );
    const totals = {};
    numericColumns.forEach((col) => (totals[col] = 0));

    flatRows.forEach((rowObj) => {
      // Formato fecha dd/mm/yyyy si existe la columna
      if (rowObj["fecha_y_hora_de_generacion"]) {
        const d = new Date(rowObj["fecha_y_hora_de_generacion"]);
        if (!isNaN(d.getTime())) {
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          rowObj["fecha_y_hora_de_generacion"] = `${day}/${month}/${year}`;
        }
      }
      // Sumar totales
      numericColumns.forEach((col) => {
        const val = Number(rowObj[col]);
        if (!isNaN(val)) totals[col] += val;
      });
      const row = worksheet.addRow(columns.map((c) => rowObj[c] ?? ""));
      row.eachCell((cell) => {
        cell.style = {
          alignment: { horizontal: "left", vertical: "middle", wrapText: true },
          border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          },
        };
      });
    });

    // Fila de totales
    if (flatRows.length > 0 && numericColumns.length > 0) {
      const totalRow = columns.map((col) => {
        if (numericColumns.includes(col)) return totals[col];
        if (col === columns[0]) return "TOTALES";
        return "";
      });
      const row = worksheet.addRow(totalRow);
      row.eachCell((cell) => {
        cell.style = {
          font: { bold: true },
          alignment: { horizontal: "left", vertical: "middle", wrapText: true },
          border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          },
        };
      });
    }

    // Ancho de columnas
    const defaultWidth = 20;
    worksheet.columns = columns.map(() => ({ width: defaultWidth }));

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filenameBase} ${startDate} - ${endDate}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Archivo creado con éxito");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Error al crear el archivo");
    }
  };

  // Exportación con columnas fijas y altura máxima por fila
  const FIXED_HEADERS = [
    "tipo",
    "codigo de generacion",
    "numero de control",
    "sello de recepcion",
    "fecha",
    "hora emi",
    "re correo electronico",
    "re name",
    "re numero de telefono",
    "ambiente",
    "subtotal",
    "total garvado",
    "iva percibido",
    "iva retenido",
    "retencion de renta",
    "total",
    "total a pagar",
    "observaciones",
  ];

  // Construye un Date combinando fecha (fecha_y_hora_de_generacion solo fecha) y hora (horemi)
  const buildDateTime = (obj) => {
    const dateRaw = (obj?.fecha_y_hora_de_generacion || obj?.fecha || "")
      .toString()
      .split("T")[0];
    const timeRaw = (obj?.horemi || obj?.hora || "").toString();
    let iso = "";
    if (dateRaw && timeRaw) iso = `${dateRaw}T${timeRaw}`;
    else if (dateRaw) iso = dateRaw;
    else if (timeRaw) iso = `1970-01-01T${timeRaw}`; // fallback solo hora
    const d = new Date(iso);
    return isFinite(d.getTime()) ? d : new Date(0);
  };

  const mapItemToFixedRow = (item, allItems = null) => {
    // Si es una petición de totales
    if (item === "TOTALES" && Array.isArray(allItems)) {
      const numericFields = [
        "subtotal",
        "total garvado",
        "iva percibido",
        "iva retenido",
        "retencion de renta",
        "total",
        "total a pagar"
      ];
      const totals = {};
      numericFields.forEach(f => totals[f] = 0);
      allItems.forEach(row => {
        const mapped = mapItemToFixedRow(row);
        numericFields.forEach(f => {
          const val = Number(mapped[f]);
          if (!isNaN(val)) totals[f] += val;
        });
      });
      return {
        tipo: "TOTALES",
        "codigo de generacion": "",
        "numero de control": "",
        "sello de recepcion": "",
        fecha: "",
        "hora emi": "",
        "re correo electronico": "",
        "re name": "",
        "re numero de telefono": "",
        ambiente: "",
        subtotal: totals["subtotal"],
        "total garvado": totals["total garvado"],
        "iva percibido": totals["iva percibido"],
        "iva retenido": totals["iva retenido"],
        "retencion de renta": totals["retencion de renta"],
        total: totals["total"],
        "total a pagar": totals["total a pagar"],
        observaciones: ""
      };
    }
    let fechaSolo = (item?.fecha_y_hora_de_generacion || item?.fecha || "")
      .toString()
      .split("T")[0];
    // Formatear fecha como dd/mm/yyyy si es válida
    if (fechaSolo && fechaSolo.includes("-")) {
      const [y, m, d] = fechaSolo.split("-");
      if (y && m && d) fechaSolo = `${d}/${m}/${y}`;
    }
    const horaSolo = (item?.horemi || item?.hora || "").toString();
    const ambienteLocal = localStorage.getItem("ambiente") || "";
    // Subtotal heurístico
    const subtotal =
      item?.subtotal ??
      item?.monto_total ??
      item?.montototal ??
      item?.montototaloperacion ??
      item?.total_agravada ??
      0;
    // Total heurístico
    const total =
      item?.total ?? item?.montototaloperacion ?? item?.monto_total ?? 0;
    const totalPagar = item?.total_a_pagar ?? total;
    return {
      tipo: item?.tipo ?? item?.type ?? "",
      "codigo de generacion":
        item?.codigo_de_generacion ??
        item?.codigo_generacion ??
        item?.codigo ??
        "",
      "numero de control":
        item?.numero_de_control ?? item?.numero_control ?? "",
      "sello de recepcion": item?.sello_de_recepcion ?? "",
      fecha: fechaSolo ?? "",
      "hora emi": horaSolo ?? "",
      "re correo electronico":
        item?.re_email ?? item?.re_correo ?? item?.re_correo_electronico ?? "",
      "re name": item?.re_name ?? "",
      "re numero de telefono":
        item?.re_telefono ?? item?.re_numero_telefono ?? item?.re_phone ?? "",
      ambiente: item?.ambiente ?? ambienteLocal,
      subtotal: subtotal,
      "total garvado": item?.total_agravada ?? 0,
      "iva percibido": item?.iva_percibido ?? 0,
      "iva retenido": item?.iva_retenido ?? 0,
      "retencion de renta": item?.retencion_de_renta ?? 0,
      total: total,
      "total a pagar": totalPagar,
      observaciones: item?.observaciones ?? "",
    };
  };

  const generateFixedColumnsExcel = async (data, title, filenameBase) => {
    if (!data || !data.length) {
      toast.info("No hay datos para exportar");
      return;
    }

    // Ordenar por fecha y hora ascendente
    const sorted = [...data].sort(
      (a, b) => buildDateTime(a) - buildDateTime(b)
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");

    // Encabezados tipo libros
    const addMergedHeader = (text, opts = {}) => {
      const r = worksheet.addRow([text]);
      const rowIndex = r.number;
      worksheet.mergeCells(
        rowIndex,
        1,
        rowIndex,
        Math.max(1, FIXED_HEADERS.length)
      );
      const cell = worksheet.getCell(rowIndex, 1);
      cell.style = {
        font: { bold: opts.bold ?? true, size: opts.size ?? 16, name: "Arial" },
        alignment: {
          horizontal: opts.align ?? "center",
          vertical: "middle",
          wrapText: true,
        },
      };
      r.height = opts.height ?? 25;
    };

    addMergedHeader(title, { size: 18 });
    addMergedHeader(`${user?.name ?? ""}`, {
      bold: true,
      size: 14,
      align: "left",
    });
    addMergedHeader(`Fecha: ${startDate} al ${endDate}`, {
      bold: false,
      size: 12,
      align: "left",
    });
    addMergedHeader(`NRC: ${user?.nrc ?? ""}`, {
      bold: false,
      size: 12,
      align: "left",
    });
    worksheet.addRow([""]);

    // Header fijo
    const headerRow = worksheet.addRow(FIXED_HEADERS);
    headerRow.eachCell((cell) => {
      cell.style = {
        font: { bold: true, color: { argb: "FFFFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" },
        },
        alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        border: {
          top: { style: "medium", color: { argb: "FF000000" } },
          left: { style: "medium", color: { argb: "FF000000" } },
          bottom: { style: "medium", color: { argb: "FF000000" } },
          right: { style: "medium", color: { argb: "FF000000" } },
        },
      };
    });
    headerRow.height = 36;

    // Filas de datos con altura máxima 36
    sorted.forEach((item) => {
      const mapped = mapItemToFixedRow(item);
      const rowValues = FIXED_HEADERS.map((h) => mapped[h] ?? "");
      const row = worksheet.addRow(rowValues);
      row.eachCell((cell) => {
        cell.style = {
          alignment: { horizontal: "left", vertical: "middle", wrapText: true },
          border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          },
        };
      });
      row.height = 36;
    });

    // Fila de totales
    if (sorted.length > 0) {
      const totalsObj = mapItemToFixedRow("TOTALES", sorted);
      const totalRow = FIXED_HEADERS.map((h) => totalsObj[h] ?? "");
      const row = worksheet.addRow(totalRow);
      row.eachCell((cell) => {
        cell.style = {
          font: { bold: true },
          alignment: { horizontal: "left", vertical: "middle", wrapText: true },
          border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          },
        };
      });
    }

    worksheet.columns = FIXED_HEADERS.map(() => ({ width: 22 }));

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filenameBase} ${startDate} - ${endDate}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Archivo creado con éxito");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Error al crear el archivo");
    }
  };

  // Exportadores por tipo de documento (sin transformar)
  const exportRawFactura = async () => {
    const data = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["01"],
      startDate,
      endDate
    );
    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Facturas (01)"
      );
      return;
    }
    await generateFixedColumnsExcel(
      data,
      "FACTURAS (Datos brutos)",
      "Facturas (Raw)"
    );
  };

  const exportRawCreditoFiscal = async () => {
    const data = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["03"],
      startDate,
      endDate
    );
    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Crédito Fiscal (03)"
      );
      return;
    }
    await generateFixedColumnsExcel(
      data,
      "CRÉDITO FISCAL (Datos brutos)",
      "Credito Fiscal (Raw)"
    );
  };

  const exportRawSujetoExcluido = async () => {
    const data = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["14"],
      startDate,
      endDate
    );
    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Sujeto Excluido (14)"
      );
      return;
    }
    await generateFixedColumnsExcel(
      data,
      "SUJETO EXCLUIDO (Datos brutos)",
      "Sujeto Excluido (Raw)"
    );
  };

  const exportRawNotas = async () => {
    const data = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["05", "06"],
      startDate,
      endDate
    );
    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Notas (05,06)"
      );
      return;
    }
    await generateFixedColumnsExcel(
      data,
      "NOTAS DÉBITO/CRÉDITO (Datos brutos)",
      "Notas (Raw)"
    );
  };

  // Exportación bruta de Compras (esquema específico)
  const COMPRAS_RAW_HEADERS = [
    "tipo",
    "codigo_de_generacion",
    "sellado",
    "numero_de_control",
    "sello_de_recepcion",
    "modelo_de_factura",
    "tipo_de_transmision",
    "fecha_y_hora_de_generacion",
    "id_emisor",
    "id_receptor",
    "qr",
    "total_agravada",
    "subtotal",
    "monto_global_de_descuento",
    "iva_percibido",
    "iva_retenido",
    "retencion_de_renta",
    "total_a_pagar",
    "cantidad_en_letras",
    "observaciones",
    "responsable_emisor",
    "documento_e",
    "documento_r",
    "documento_receptor",
    "firm",
    "re_nit",
    "re_nrc",
    "re_actividad_economica",
    "re_direccion",
    "re_correo_electronico",
    "re_nombre_comercial",
    "re_name",
    "re_numero_telefono",
    "re_tipo_establecimiento",
    "version",
    "ambiente",
    "tipomoneda",
    "tipocontingencia",
    "motivocontin",
    "documentorelacionado",
    "codestablemh",
    "codestable",
    "codpuntoventamh",
    "codpuntoventa",
    "re_codactividad",
    "re_tipodocumento",
    "re_numdocumento",
    "otrosdocumentos",
    "ventatercero",
    "condicionoperacion",
    "saldofavor",
    "numpagoelectronico",
    "periodo",
    "montopago",
    "codigo",
    "referencia",
    "totalnosuj",
    "tributos",
    "totalexenta",
    "subtotalventas",
    "montototaloperacion",
    "descunosuj",
    "descuexenta",
    "descugravada",
    "porcentajedescuento",
    "totalnogravado",
    "placavehiculo",
    "horemi",
    "plazo",
    "tributocf",
    "id_envio",
    "em_codactividad",
    "em_direccion",
    "em_nit",
    "em_nrc",
    "em_actividad_economica",
    "em_correo_electronico",
    "em_tipodocumento",
    "em_name",
    "em_numero_telefono",
    "em_numdocumento",
  ];

  const exportRawCompras = async () => {
    const data = await PlantillaAPI.getcompras(
      user_id,
      token,
      startDate,
      endDate
    );

    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Compras"
      );
      return;
    }

    const rows = data.map((p) => {
      const pago0 =
        Array.isArray(p?.resumen?.pagos) && p.resumen.pagos.length > 0
          ? p.resumen.pagos[0]
          : null;
      const trib0 =
        Array.isArray(p?.resumen?.tributos) && p.resumen.tributos.length > 0
          ? p.resumen.tributos[0]
          : null;
      return {
        tipo: p?.tipo ?? p?.tipoDte ?? p?.identificacion?.tipoDte ?? null,
        codigo_de_generacion:
          p?.codigo_de_generacion ??
          p?.codigoGeneracion ??
          p?.identificacion?.codigoGeneracion ??
          null,
        sellado: p?.sellado ?? null,
        numero_de_control:
          p?.numero_de_control ??
          p?.numeroControl ??
          p?.identificacion?.numeroControl ??
          null,
        sello_de_recepcion:
          p?.sello_de_recepcion ??
          p?.respuestaMh?.selloRecibido ??
          p?.selloRecepcion ??
          null,
        modelo_de_factura:
          p?.modelo_de_factura ??
          p?.tipoModelo ??
          p?.identificacion?.tipoModelo ??
          null,
        tipo_de_transmision:
          p?.tipo_de_transmision ??
          p?.tipoOperacion ??
          p?.identificacion?.tipoOperacion ??
          null,
        fecha_y_hora_de_generacion:
          p?.fecha_y_hora_de_generacion ??
          p?.fecEmi ??
          p?.identificacion?.fecEmi ??
          null,
        id_emisor: p?.id_emisor ?? null,
        id_receptor: p?.id_receptor ?? null,
        qr: p?.qr ?? null,
        total_agravada: p?.total_agravada ?? p?.resumen?.totalGravada ?? null,
        subtotal: p?.subtotal ?? p?.subTotal ?? p?.resumen?.subTotal ?? null,
        monto_global_de_descuento:
          p?.monto_global_de_descuento ?? p?.resumen?.totalDescu ?? null,
        iva_percibido: p?.iva_percibido ?? p?.resumen?.ivaPerci1 ?? null,
        iva_retenido: p?.iva_retenido ?? p?.resumen?.ivaRete1 ?? null,
        retencion_de_renta:
          p?.retencion_de_renta ?? p?.resumen?.reteRenta ?? null,
        total_a_pagar:
          p?.total_a_pagar ??
          p?.resumen?.totalPagar ??
          p?.montototaloperacion ??
          p?.resumen?.montoTotalOperacion ??
          null,
        cantidad_en_letras:
          p?.cantidad_en_letras ?? p?.resumen?.totalLetras ?? null,
        observaciones: p?.observaciones ?? p?.extension?.observaciones ?? null,
        responsable_emisor:
          p?.responsable_emisor ?? p?.extension?.docuEntrega ?? null,
        documento_e: p?.documento_e ?? p?.extension?.nombEntrega ?? null,
        documento_r: p?.documento_r ?? p?.extension?.nombRecibe ?? null,
        documento_receptor:
          p?.documento_receptor ?? p?.extension?.docuRecibe ?? null,
        firm: p?.firm ?? p?.documento ?? null,
        re_nit: p?.re_nit ?? p?.receptor?.nit ?? null,
        re_nrc: p?.re_nrc ?? p?.receptor?.nrc ?? null,
        re_actividad_economica:
          p?.re_actividad_economica ?? p?.receptor?.descActividad ?? null,
        re_direccion:
          p?.re_direccion ??
          ([
            p?.receptor?.direccion?.departamento,
            p?.receptor?.direccion?.municipio,
            p?.receptor?.direccion?.complemento,
          ]
            .filter(Boolean)
            .join("|") ||
            null),
        re_correo_electronico:
          p?.re_correo_electronico ?? p?.receptor?.correo ?? null,
        re_nombre_comercial:
          p?.re_nombre_comercial ?? p?.receptor?.nombreComercial ?? null,
        re_name: p?.re_name ?? p?.receptor?.nombre ?? null,
        re_numero_telefono:
          p?.re_numero_telefono ?? p?.receptor?.telefono ?? null,
        re_tipo_establecimiento:
          p?.re_tipo_establecimiento ??
          p?.receptor?.tipoEstablecimiento ??
          null,
        version: p?.version ?? p?.identificacion?.version ?? null,
        ambiente: p?.ambiente ?? p?.identificacion?.ambiente ?? null,
        tipomoneda: p?.tipomoneda ?? p?.identificacion?.tipoMoneda ?? null,
        tipocontingencia:
          p?.tipocontingencia ?? p?.identificacion?.tipoContingencia ?? null,
        motivocontin:
          p?.motivocontin ?? p?.identificacion?.motivoContin ?? null,
        documentorelacionado:
          p?.documentorelacionado ??
          (p?.documentoRelacionado
            ? JSON.stringify(p.documentoRelacionado)
            : null),
        codestablemh: p?.codestablemh ?? p?.emisor?.codEstableMH ?? null,
        codestable: p?.codestable ?? p?.emisor?.codEstable ?? null,
        codpuntoventamh:
          p?.codpuntoventamh ?? p?.emisor?.codPuntoVentaMH ?? null,
        codpuntoventa: p?.codpuntoventa ?? p?.emisor?.codPuntoVenta ?? null,
        re_codactividad:
          p?.re_codactividad ?? p?.receptor?.codActividad ?? null,
        re_tipodocumento:
          p?.re_tipodocumento ?? p?.receptor?.tipoDocumento ?? null,
        re_numdocumento:
          p?.re_numdocumento ?? p?.receptor?.numeroDocumento ?? null,
        otrosdocumentos:
          p?.otrosdocumentos ??
          (p?.otrosDocumentos ? JSON.stringify(p.otrosDocumentos) : null),
        ventatercero:
          p?.ventatercero ??
          (p?.ventaTercero ? JSON.stringify(p.ventaTercero) : null),
        condicionoperacion:
          p?.condicionoperacion ?? p?.resumen?.condicionOperacion ?? null,
        saldofavor: p?.saldofavor ?? p?.resumen?.saldoFavor ?? null,
        numpagoelectronico:
          p?.numpagoelectronico ?? p?.resumen?.numPagoElectronico ?? null,
        periodo: p?.periodo ?? pago0?.periodo ?? null,
        montopago: p?.montopago ?? pago0?.montoPago ?? null,
        codigo: p?.codigo ?? pago0?.codigo ?? null,
        referencia: p?.referencia ?? pago0?.referencia ?? null,
        totalnosuj: p?.totalnosuj ?? p?.resumen?.totalNoSuj ?? null,
        tributos:
          p?.tributos ??
          (p?.resumen?.tributos ? JSON.stringify(p.resumen.tributos) : null),
        totalexenta: p?.totalexenta ?? p?.resumen?.totalExenta ?? null,
        subtotalventas: p?.subtotalventas ?? p?.resumen?.subTotalVentas ?? null,
        montototaloperacion:
          p?.montototaloperacion ?? p?.resumen?.montoTotalOperacion ?? null,
        descunosuj: p?.descunosuj ?? p?.resumen?.descuNoSuj ?? null,
        descuexenta: p?.descuexenta ?? p?.resumen?.descuExenta ?? null,
        descugravada: p?.descugravada ?? p?.resumen?.descuGravada ?? null,
        porcentajedescuento:
          p?.porcentajedescuento ?? p?.resumen?.porcentajeDescuento ?? null,
        totalnogravado: p?.totalnogravado ?? p?.resumen?.totalNoGravado ?? null,
        placavehiculo: p?.placavehiculo ?? p?.extension?.placaVehiculo ?? null,
        horemi: p?.horemi ?? p?.horEmi ?? p?.identificacion?.horEmi ?? null,
        plazo: p?.plazo ?? pago0?.plazo ?? null,
        tributocf:
          p?.tributocf ??
          (trib0
            ? `${trib0.codigo}|${trib0.descripcion}|${trib0.valor}`
            : null),
        id_envio: p?.id_envio ?? null,
        em_codactividad: p?.em_codactividad ?? p?.emisor?.codActividad ?? null,
        em_direccion:
          p?.em_direccion ??
          ([
            p?.emisor?.direccion?.departamento,
            p?.emisor?.direccion?.municipio,
            p?.emisor?.direccion?.complemento,
          ]
            .filter(Boolean)
            .join("|") ||
            null),
        em_nit: p?.em_nit ?? p?.emisor?.nit ?? null,
        em_nrc: p?.em_nrc ?? p?.emisor?.nrc ?? null,
        em_actividad_economica:
          p?.em_actividad_economica ?? p?.emisor?.descActividad ?? null,
        em_correo_electronico:
          p?.em_correo_electronico ?? p?.emisor?.correo ?? null,
        em_tipodocumento:
          p?.em_tipodocumento ?? p?.emisor?.tipoDocumento ?? null,
        em_name: p?.em_name ?? p?.emisor?.nombre ?? null,
        em_numero_telefono:
          p?.em_numero_telefono ?? p?.emisor?.telefono ?? null,
        em_numdocumento:
          p?.em_numdocumento ?? p?.emisor?.nombreComercial ?? null,
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Compras (Raw)");

    const addMergedHeader = (text, opts = {}) => {
      const r = worksheet.addRow([text]);
      const rowIndex = r.number;
      worksheet.mergeCells(
        rowIndex,
        1,
        rowIndex,
        Math.max(1, COMPRAS_RAW_HEADERS.length)
      );
      const cell = worksheet.getCell(rowIndex, 1);
      cell.style = {
        font: { bold: opts.bold ?? true, size: opts.size ?? 16, name: "Arial" },
        alignment: {
          horizontal: opts.align ?? "center",
          vertical: "middle",
          wrapText: true,
        },
      };
      r.height = opts.height ?? 25;
    };

    // Encabezados estilo "libros"
    addMergedHeader("COMPRAS (Datos brutos - esquema especial)", { size: 18 });
    addMergedHeader(`${user?.name ?? ""}`, {
      bold: true,
      size: 14,
      align: "left",
    });
    addMergedHeader(`Fecha: ${startDate} al ${endDate}`, {
      bold: false,
      size: 12,
      align: "left",
    });
    addMergedHeader(`NRC: ${user?.nrc ?? ""}`, {
      bold: false,
      size: 12,
      align: "left",
    });
    worksheet.addRow([""]);

    // Header de columnas en el orden definido
    const headerRow = worksheet.addRow(COMPRAS_RAW_HEADERS);
    headerRow.eachCell((cell) => {
      cell.style = {
        font: { bold: true, color: { argb: "FFFFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" },
        },
        alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        border: {
          top: { style: "medium", color: { argb: "FF000000" } },
          left: { style: "medium", color: { argb: "FF000000" } },
          bottom: { style: "medium", color: { argb: "FF000000" } },
          right: { style: "medium", color: { argb: "FF000000" } },
        },
      };
    });

    // Filas de datos
    rows.forEach((r) => {
      const row = worksheet.addRow(
        COMPRAS_RAW_HEADERS.map((key) => r[key] ?? "")
      );
      row.eachCell((cell) => {
        cell.style = {
          alignment: { horizontal: "left", vertical: "middle", wrapText: true },
          border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          },
        };
      });
    });

    // Ancho de columnas
    worksheet.columns = COMPRAS_RAW_HEADERS.map(() => ({ width: 24 }));

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Compras (Raw) ${startDate} - ${endDate}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Archivo creado con éxito");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Error al crear el archivo");
    }
  };

  const anexoSuex = async () => {
    const data = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["14"],
      startDate,
      endDate
    );
    console.log(data);

    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Sujeto excluido"
      );
      return;
    }

    const transformedData = data.map((item) => {
      if (item.re_tipodocumento === "13") {
        item.tipo = "2";
      } else if (item.re_tipodocumento === "36") {
        item.tipo = "1";
      } else {
        item.tipo = "3";
      }
      const datatranform = {
        "TIPO DE DOCUMENTO": item.tipo,
        "NÚMERO DE NIT, DUI U OTRO DOCUMENTO": item.re_numdocumento,
        "NOMBRE, RAZÓN SOCIAL O DENOMINACIÓN": item.re_name,
        "FECHA DE EMISIÓN DEL DOCUMENTO": item.fecha_y_hora_de_generacion,
        "NÚMERO DE SERIE DEL DOCUMENTO": item.sello_de_recepcion,
        "NÚMERO DE DOCUMENTO": item.codigo_de_generacion,
        "MONTO DE LA OPERACIÓN": item.montototaloperacion,
        "MONTO DE LA RETENCIÓN DEL IVA 13%": 0,
        "TIPO DE OPERACIÓN (Renta)": "1",
        "CLASIFICACIÓN (Renta)": "1",
        "SECTOR (Renta)": "4",
        "TIPO DE COSTO/GASTO (Renta)": "3",
        "NÚMERO DEL ANEXO": "5",
      };
      return datatranform;
    });

    transformedData.sort(
      (a, b) =>
        new Date(a["FECHA DE EMISIÓN DEL DOCUMENTO"]) -
        new Date(b["FECHA DE EMISIÓN DEL DOCUMENTO"])
    );

    // Calcular totales
    /* const totales = transformedData.reduce((acc, item) => ({
      'TIPO DE DOCUMENTO': '',
      'NÚMERO DE NIT, DUI U OTRO DOCUMENTO': '',
      'NOMBRE, RAZÓN SOCIAL O DENOMINACIÓN': 'TOTAL',
      'FECHA DE EMISIÓN DEL DOCUMENTO': '',
      'NÚMERO DE SERIE DEL DOCUMENTO': '',
      'NÚMERO DE DOCUMENTO': '',
      'MONTO DE LA OPERACIÓN': acc['MONTO DE LA OPERACIÓN'] + Number(item['MONTO DE LA OPERACIÓN'] || 0),
      'MONTO DE LA RETENCIÓN DEL IVA 13%': acc['MONTO DE LA RETENCIÓN DEL IVA 13%'] + Number(item['MONTO DE LA RETENCIÓN DEL IVA 13%'] || 0),
      'TIPO DE OPERACIÓN (Renta)': '',
      'CLASIFICACIÓN (Renta)': '',
      'SECTOR (Renta)': '',
      'TIPO DE COSTO/GASTO (Renta)': '',
      'NÚMERO DEL ANEXO': ''
    }), {
      'MONTO DE LA OPERACIÓN': 0,
      'MONTO DE LA RETENCIÓN DEL IVA 13%': 0
    });

    // Agregar fila de totales
    transformedData.push(totales); */

    const wb = XLSX.utils.book_new();

    // Convert data to worksheet without headers
    const ws = XLSX.utils.json_to_sheet(transformedData, { skipHeader: true });

    // Set column widths for better readability
    const colWidths = Array(21).fill({ wch: 20 }); // Set width of 20 for all 21 columns
    ws["!cols"] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    // Generate CSV file with current date
    const date = new Date().toISOString().split("T")[0];
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });

    // Create a Blob from the CSV and save it
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Anexo ventas Sujeto excluido ${startDate} - ${endDate}.csv`;
    link.click();

    toast.success("Anexo de Sujeto excluido creado con éxito");
  };

  /* ------------------------Buys-------------------------- */

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.identificacion) {
          toast.error("Archivo JSON no reconocido");
          return;
        }
        setJsonData(json);
        toast.info("Archivo JSON Reconocido");
      } catch (error) {
        toast.error("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
  };

  const createcompras = async (payload = jsonData) => {
    if (!payload) {
      toast.error("No JSON data available");
      return;
    }
    const data = await PlantillaAPI.createcompras(payload, token, user_id);
    console.log(data);
    if (data.message === "compra creada") {
      toast.success("Compra agregada con éxito");
    } else {
      toast.error("Error al agregar la compra contacte al soporte");
    }
    /* wait 5 seconds and reload */
    setTimeout(() => {
      window.location.reload();
    }, 7000);
  };

  const calculateTotalsCompras = (data) => {
    return data.reduce(
      (acc, row) => {
        return {
          totalCompras:
            acc.totalCompras + Number(row["COMPRAS EXENTAS INTERNAS"] || 0),
          importacionesEx:
            acc.importacionesEx +
            Number(row["IMPORTACIONES E INTERNACIONES EXENTAS"] || 0),
          totalAgravado:
            acc.totalAgravado + Number(row["COMPRAS INTERNAS GRAVADAS"] || 0),
          importacionesAg:
            acc.importacionesAg +
            Number(row["IMPORTACIONES E INTERNACIONES GRAVADAS"] || 0),
          iva: acc.iva + Number(row["CRÉDITO FISCAL"] || 0),
          anticipo:
            acc.anticipo + Number(row["ANTICIPO A CUENTA IVA PERCIBIDO"] || 0),
          grantotal: acc.grantotal + Number(row["TOTAL DE COMPRAS"] || 0),
          sujetosExcluidos:
            acc.sujetosExcluidos +
            Number(row["COMPRAS AS SUJETOS EXCLUIDOS"] || 0),
        };
      },
      {
        totalCompras: 0,
        importacionesEx: 0,
        totalAgravado: 0,
        importacionesAg: 0,
        iva: 0,
        anticipo: 0,
        grantotal: 0,
        sujetosExcluidos: 0,
      }
    );
  };

  const LibroCompras = async () => {
    const data = await PlantillaAPI.getcompras(
      user_id,
      token,
      startDate,
      endDate
    );
    console.log(data);

    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Libro Compras"
      );
      return;
    }

    const num = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    const transformedData = data.map((item, index) => {
      const fechaDoc =
        item?.fecha ?? item?.fecha_y_hora_de_generacion ?? item?.identificacion?.fecEmi ?? "";

      // Libro (según tu lista) agrupa importaciones + internaciones
      const comprasInternasExentas =
        item?.compras_internas_exentas ??
        item?.comprasInternasExentas ??
        item?.totalexenta ??
        item?.resumen?.totalExenta ??
        0;

      const importacionesExentasNoSujetas =
        item?.importaciones_exentas_no_sujetas ?? item?.importacionesExentasNoSujetas ?? 0;
      const internacionesExentasNoSujetas =
        item?.internaciones_exentas_no_sujetas ?? item?.internacionesExentasNoSujetas ?? 0;
      const importInternExentas =
        num(importacionesExentasNoSujetas) + num(internacionesExentasNoSujetas);

      const comprasInternasGravadas =
        item?.compras_internas_gravadas ??
        item?.comprasInternasGravadas ??
        item?.ventas_internas_gravadas ??
        item?.ventasInternasGravadas ??
        item?.total_agravada ??
        item?.resumen?.totalGravada ??
        0;

      const internacionesGravadasBienes =
        item?.internaciones_gravadas_bienes ?? item?.internacionesGravadasBienes ?? 0;
      const importacionesGravadasBienes =
        item?.importaciones_gravadas_bienes ?? item?.importacionesGravadasBienes ?? 0;
      const importacionesGravadasServicio =
        item?.importaciones_gravadas_servicio ??
        item?.importacionesGravadasServicio ??
        item?.importacionesGravadasServicios ??
        0;
      const importInternGravadas =
        num(internacionesGravadasBienes) +
        num(importacionesGravadasBienes) +
        num(importacionesGravadasServicio);

      const creditoFiscal =
        item?.credito_fiscal ??
        item?.creditoFiscal ??
        item?.iva_percibido ??
        item?.resumen?.ivaPerci1 ??
        item?.resumen?.totalIva ??
        0;

      const totalCompras =
        item?.total_compras ??
        item?.totalCompras ??
        item?.total_a_pagar ??
        item?.montototaloperacion ??
        item?.resumen?.totalPagar ??
        item?.resumen?.montoTotalOperacion ??
        0;

      return {
      "N°": index + 1,
        "FECHA DE EMISIÓN DEL DOCUMENTO": fechaDoc,
      "NÚMERO DE DOCUMENTO": item.codigo_de_generacion,
        "NÚMERO DE REGISTRO DEL CONTRIBUYENTE":
          item?.nrc_proveedor ?? item?.nrcProveedor ?? item?.em_nrc ?? "",
      "NOMBRE DEL PROVEEDOR": item.em_name,
      "COMPRAS EXENTAS INTERNAS": num(comprasInternasExentas),
      "IMPORTACIONES E INTERNACIONES EXENTAS": num(importInternExentas),
      "COMPRAS INTERNAS GRAVADAS": num(comprasInternasGravadas),
      "IMPORTACIONES E INTERNACIONES GRAVADAS": num(importInternGravadas),
      "CRÉDITO FISCAL": num(creditoFiscal),
      "ANTICIPO A CUENTA IVA PERCIBIDO": "",
      "TOTAL DE COMPRAS": num(totalCompras),
      "COMPRAS AS SUJETOS EXCLUIDOS": "",
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Libro de compras");

    // Add header rows
    const headerRows = [
      ["LIBRO DE IVA COMPRAS"],
      [`${user.name}`],
      [`Fecha: ${startDate} al ${endDate}`],
      [`NRC: ${user.nrc}`],
      [""], // Empty row for spacing
    ];

    // Add and style each header row
    headerRows.forEach((row, index) => {
      const excelRow = worksheet.addRow(row);
      worksheet.mergeCells(`A${index + 1}:M${index + 1}`);

      // Style the merged cell
      const cell = worksheet.getCell(`A${index + 1}`);
      if (index == 0 || index == 1) {
        cell.style = {
          font: {
            bold: true,
            size: 16,
            name: "Arial",
          },
          alignment: {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          },
        };
      } else {
        cell.style = {
          font: {
            bold: false,
            size: 13,
            name: "Arial",
          },
          alignment: {
            horizontal: "left",
            vertical: "middle",
            wrapText: true,
          },
        };
      }

      excelRow.height = index === 0 ? 30 : 25;
    });

    const tableHeaders = [
      "N°",
      "FECHA DE EMISIÓN DEL DOCUMENTO",
      "NÚMERO DE DOCUMENTO",
      "NÚMERO DE REGISTRO DEL CONTRIBUYENTE",
      "NOMBRE DEL PROVEEDOR",
      "COMPRAS EXENTAS INTERNAS",
      "IMPORTACIONES E INTERNACIONES EXENTAS",
      "COMPRAS INTERNAS GRAVADAS",
      "IMPORTACIONES E INTERNACIONES GRAVADAS",
      "CRÉDITO FISCAL",
      "ANTICIPO A CUENTA IVA PERCIBIDO",
      "TOTAL DE COMPRAS",
      "COMPRAS AS SUJETOS EXCLUIDOS",
    ];

    const headerRow = worksheet.addRow(tableHeaders);

    // Style table headers
    headerRow.eachCell((cell) => {
      cell.style = {
        font: {
          bold: true,
          color: { argb: "FFFFFFFF" },
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" },
        },
        alignment: {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        },
        border: {
          top: { style: "medium", color: { argb: "FF000000" } },
          left: { style: "medium", color: { argb: "FF000000" } },
          bottom: { style: "medium", color: { argb: "FF000000" } },
          right: { style: "medium", color: { argb: "FF000000" } },
        },
      };
    });

    // Add data rows
    transformedData.forEach((rowData) => {
      const row = worksheet.addRow(Object.values(rowData));
      row.eachCell((cell) => {
        cell.style = {
          alignment: {
            horizontal: "center",
            vertical: "middle",
          },
          border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          },
        };
      });
    });

    // Add empty row before summary
    // Calculate totals
    const totals = calculateTotalsCompras(transformedData);

    // Add summary section
    const summaryRows = [
      /* Total agravado */
      [
        "",
        "",
        "",
        "",
        "TOTAL",
        totals.totalCompras,
        totals.importacionesEx,
        totals.totalAgravado,
        totals.importacionesAg,
        totals.iva,
        totals.anticipo,
        totals.grantotal,
        totals.sujetosExcluidos,
      ],
    ];

    const summaryStartRow = worksheet.rowCount + 1;

    // Add and style summary rows
    summaryRows.forEach((row, index) => {
      const summaryRow = worksheet.addRow(row);
      // Apply styles to cells
      summaryRow.eachCell((cell, colNumber) => {
        let borderStyle = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };

        // Add thick border for periphery
        if (index === 0) {
          borderStyle.top.style = "medium";
        }
        if (index === summaryRows.length - 1) {
          borderStyle.bottom.style = "medium";
        }
        if (colNumber === 2) {
          borderStyle.left.style = "medium";
        }
        if (colNumber === 9) {
          borderStyle.right.style = "medium";
        }
        cell.style = {
          font: {
            bold: index === 0 || colNumber === 2,
            size: index === 0 ? 12 : 11,
          },
          alignment: {
            horizontal:
              index === 0
                ? "center"
                : colNumber === 2
                ? "left"
                : colNumber === 3
                ? "right"
                : "center",
            vertical: "middle",
          },
          border: borderStyle,
        };
      });

      // Set row height
      summaryRow.height = 25;
    });

    worksheet.columns = [
      { width: 5 },
      { width: 16 },
      { width: 40 },
      { width: 40 },
      { width: 40 },
      { width: 10 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 14 },
    ];

    // Generate and save the file
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Libro de Compras ${startDate} - ${endDate}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Libro de Compras creado con éxito");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Error al crear el Libro de Compras");
    }
  };

  const anexoCompras = async () => {
    const data = await PlantillaAPI.getcompras(
      user_id,
      token,
      startDate,
      endDate
    );
    console.log(data);

    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Compras"
      );
      return;
    }

    const formatToDMY = (input) => {
      if (!input) return input;
      const str = String(input).trim();
      // YYYY-MM-DD
      const iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (iso) {
        const y = iso[1],
          m = parseInt(iso[2], 10),
          d = parseInt(iso[3], 10);
        return `${d}/${m}/${y}`;
      }
      // DD/MM/YY or DD/MM/YYYY
      const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (dmy) {
        const d = parseInt(dmy[1], 10);
        const m = parseInt(dmy[2], 10);
        let y = dmy[3];
        if (y.length === 2) y = '20' + y;
        return `${d}/${m}/${y}`;
      }
      // DD-MM-YY or DD-MM-YYYY
      const dmyDash = str.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
      if (dmyDash) {
        const d = parseInt(dmyDash[1], 10);
        const m = parseInt(dmyDash[2], 10);
        let y = dmyDash[3];
        if (y.length === 2) y = '20' + y;
        return `${d}/${m}/${y}`;
      }
      // Fallback: Date
      const dt = new Date(str);
      if (!isNaN(dt)) {
        const m = dt.getMonth() + 1;
        const d = dt.getDate();
        const y = dt.getFullYear();
        return `${d}/${m}/${y}`;
      }
      return str;
    };

    const num = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    const transformedData = data.map((item) => {
      const nitProveedor = item?.nit_proveedor ?? item?.nitProveedor ?? item?.em_nit ?? "";
      const nrcProveedor = item?.nrc_proveedor ?? item?.nrcProveedor ?? item?.em_nrc ?? "";
      const nitOrNrc = String(nitProveedor || "").trim() ? nitProveedor : nrcProveedor;

      const comprasInternasExentas =
        item?.compras_internas_exentas ??
        item?.comprasInternasExentas ??
        item?.totalexenta ??
        item?.resumen?.totalExenta ??
        0;
      const internacionesExentasNoSujetas =
        item?.internaciones_exentas_no_sujetas ?? item?.internacionesExentasNoSujetas ?? 0;
      const importacionesExentasNoSujetas =
        item?.importaciones_exentas_no_sujetas ?? item?.importacionesExentasNoSujetas ?? 0;
      const comprasInternasGravadas =
        item?.compras_internas_gravadas ??
        item?.comprasInternasGravadas ??
        item?.ventas_internas_gravadas ??
        item?.ventasInternasGravadas ??
        item?.total_agravada ??
        item?.resumen?.totalGravada ??
        0;
      const internacionesGravadasBienes =
        item?.internaciones_gravadas_bienes ?? item?.internacionesGravadasBienes ?? 0;
      const importacionesGravadasBienes =
        item?.importaciones_gravadas_bienes ?? item?.importacionesGravadasBienes ?? 0;
      const importacionesGravadasServicio =
        item?.importaciones_gravadas_servicio ??
        item?.importacionesGravadasServicio ??
        item?.importacionesGravadasServicios ??
        0;
      const creditoFiscal =
        item?.credito_fiscal ??
        item?.creditoFiscal ??
        item?.iva_percibido ??
        item?.resumen?.ivaPerci1 ??
        item?.resumen?.totalIva ??
        0;
      const totalCompras =
        item?.total_compras ??
        item?.totalCompras ??
        item?.total_a_pagar ??
        item?.montototaloperacion ??
        item?.resumen?.totalPagar ??
        item?.resumen?.montoTotalOperacion ??
        0;

      return {
      "FECHA DE EMISIÓN DEL DOCUMENTO": formatToDMY(
        item?.fecha ?? item?.fecha_y_hora_de_generacion
      ),
        "CLASE DE DOCUMENTO": item?.clase_documento ?? item?.claseDocumento ?? "4",
      "TIPO DE DOCUMENTO": item.tipo,
      "NÚMERO DE DOCUMENTO": item.codigo_de_generacion,
      "NIT O NRC DEL PROVEEDOR": nitOrNrc,
      "NOMBRE DEL PROVEEDOR": item.em_name,
      "COMPRAS INTERNAS EXENTAS": num(comprasInternasExentas),
      "INTERNACIONES EXENTAS Y/O NO SUJETAS": num(internacionesExentasNoSujetas),
      "IMPORTACIONES EXENTAS Y/O NO SUJETAS": num(importacionesExentasNoSujetas),
      "COMPRAS INTERNAS GRAVADAS": num(comprasInternasGravadas),
      "INTERNACIONES GRAVADAS DE BIENES": num(internacionesGravadasBienes),
      "IMPORTACIONES GRAVADAS DE BIENES": num(importacionesGravadasBienes),
        "IMPORTACIONES GRAVADAS DE SERVICIOS": num(importacionesGravadasServicio),
      "CRÉDITO FISCAL": num(creditoFiscal),
      "TOTAL DE COMPRAS": num(totalCompras),
        "DUI DEL PROVEEDOR":
          item?.dui_proveedor ?? "",
        "TIPO DE OPERACIÓN (Renta)":
          item?.tipo_operacion_renta ?? item?.tipoOperacionRenta ?? item?.rentaTipoOperacion ?? "1",
        "CLASIFICACIÓN (Renta)":
          item?.clasificacion_renta ?? item?.clasificacionRenta ?? item?.rentaClasificacion ?? "2",
        "SECTOR (Renta)": item?.sector_renta ?? item?.sectorRenta ?? item?.rentaSector ?? "2",
        "TIPO DE COSTO/GASTO (Renta)":
          item?.tipo_costo_gasto_renta ?? item?.tipoCostoGastoRenta ?? item?.rentaTipoCostoGasto ?? "3",
        "NÚMERO DEL ANEXO": item?.numero_anexo ?? item?.numeroAnexo ?? item?.rentaNumeroAnexo ?? "3",
      };
    });

    // Parser para D/M/YY o D/M/YYYY
    const parseDMY = (s) => {
      if (!s) return new Date("Invalid");
      const str = String(s).trim();
      const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (dmy) {
        const d = parseInt(dmy[1], 10);
        const m = parseInt(dmy[2], 10);
        const y =
          dmy[3].length === 2
            ? 2000 + parseInt(dmy[3], 10)
            : parseInt(dmy[3], 10);
        return new Date(y, m - 1, d);
      }
      return new Date(str);
    };
    // Ordenar por fecha con formato D/M/Y
    transformedData.sort(
      (a, b) =>
        parseDMY(a["FECHA DE EMISIÓN DEL DOCUMENTO"]) -
        parseDMY(b["FECHA DE EMISIÓN DEL DOCUMENTO"])
    );

    // Calcular totales
    /* const totales = transformedData.reduce((acc, item) => ({
      'FECHA DE EMISIÓN DEL DOCUMENTO': '',
      'CLASE DE DOCUMENTO': '',
      'TIPO DE DOCUMENTO': '',
      'NÚMERO DE DOCUMENTO': '',
      'NIT O NRC DEL PROVEEDOR': '',
      'NOMBRE DEL PROVEEDOR': 'TOTAL',
      'COMPRAS INTERNAS EXENTAS': acc['COMPRAS INTERNAS EXENTAS'] + Number(item['COMPRAS INTERNAS EXENTAS'] || 0),
      'INTERNACIONES EXENTAS Y/O NO SUJETAS': acc['INTERNACIONES EXENTAS Y/O NO SUJETAS'] + Number(item['INTERNACIONES EXENTAS Y/O NO SUJETAS'] || 0),
      'IMPORTACIONES EXENTAS Y/O NO SUJETAS': acc['IMPORTACIONES EXENTAS Y/O NO SUJETAS'] + Number(item['IMPORTACIONES EXENTAS Y/O NO SUJETAS'] || 0),
      'COMPRAS INTERNAS GRAVADAS': acc['COMPRAS INTERNAS GRAVADAS'] + Number(item['COMPRAS INTERNAS GRAVADAS'] || 0),
      'INTERNACIONES GRAVADAS DE BIENES': acc['INTERNACIONES GRAVADAS DE BIENES'] + Number(item['INTERNACIONES GRAVADAS DE BIENES'] || 0),
      'IMPORTACIONES GRAVADAS DE BIENES': acc['IMPORTACIONES GRAVADAS DE BIENES'] + Number(item['IMPORTACIONES GRAVADAS DE BIENES'] || 0),
      'IMPORTACIONES GRAVADAS DE SERVICIOS': acc['IMPORTACIONES GRAVADAS DE SERVICIOS'] + Number(item['IMPORTACIONES GRAVADAS DE SERVICIOS'] || 0),
      'CRÉDITO FISCAL': acc['CRÉDITO FISCAL'] + Number(item['CRÉDITO FISCAL'] || 0),
      'TOTAL DE COMPRAS': acc['TOTAL DE COMPRAS'] + Number(item['TOTAL DE COMPRAS'] || 0),
      'DUI DEL PROVEEDOR': '',
      'TIPO DE OPERACIÓN (Renta)': '',
      'CLASIFICACIÓN (Renta)': '',
      'SECTOR (Renta)': '',
      'TIPO DE COSTO/GASTO (Renta)': '',
      'NÚMERO DEL ANEXO': ''
    }), {
      'COMPRAS INTERNAS EXENTAS': 0,
      'INTERNACIONES EXENTAS Y/O NO SUJETAS': 0,
      'IMPORTACIONES EXENTAS Y/O NO SUJETAS': 0,
      'COMPRAS INTERNAS GRAVADAS': 0,
      'INTERNACIONES GRAVADAS DE BIENES': 0,
      'IMPORTACIONES GRAVADAS DE BIENES': 0,
      'IMPORTACIONES GRAVADAS DE SERVICIOS': 0,
      'CRÉDITO FISCAL': 0,
      'TOTAL DE COMPRAS': 0
    });

    // Agregar fila de totales
    transformedData.push(totales); */

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet without headers
    const ws = XLSX.utils.json_to_sheet(transformedData, { skipHeader: true });

    // Set column widths for better readability
    const colWidths = Array(21).fill({ wch: 20 }); // Set width of 20 for all 21 columns
    ws["!cols"] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    // Generate CSV file with current date
    const date = new Date().toISOString().split("T")[0];
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });

    // Create a Blob from the CSV and save it
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Anexo Compras ${startDate} - ${endDate}.csv`;
    link.click();

    toast.success("Anexo de Compras creado con éxito");
  };
  /* ------------------------Buys-------------------------- */

  /* ------------------------CF-------------------------- */

  const calculateTotalsContribuyentes = (data) => {
    return data.reduce(
      (acc, row) => {
        return {
          sujetas: acc.sujetas + Number(row["DÉBITO FISCAL"] || 0),
          exentas: acc.exentas + Number(row["VENTAS EXENTAS"] || 0),
          locales: acc.locales + Number(row["VENTAS INTERNAS GRAVADAS"] || 0),
          exportaciones:
            acc.exportaciones +
            Number(row["VENTAS EXENTAS A CUENTA DE TERCERO"] || 0),
          iva: acc.iva + Number(row["IVA PERCIBIDO"] || 0),
          retencion: acc.retencion + Number(row["RETENCION"] || 0),
          grantotal: acc.grantotal + Number(row["TOTAL"] || 0),
        };
      },
      {
        sujetas: 0,
        exentas: 0,
        locales: 0,
        exportaciones: 0,
        iva: 0,
        retencion: 0,
        grantotal: 0,
      }
    );
  };

  const LibroContribuyentes = async () => {
    const data = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["03", "05", "06"],
      startDate,
      endDate
    );
    console.log(data);

    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Libro Contribuyentes"
      );
      return;
    }

    const transformedData = data.map((item, index) => ({
      "N°": index + 1,
      "FECHA DE EMISIÓN DEL DOCUMENTO": item.fecha_y_hora_de_generacion,
      "NÚMERO DE CORRELATIVO PREEIMPRESO": item.codigo_de_generacion,
      "NÚMERO DE CONTROL INTERNO SISTEMA FORMULARIO ÚNICO":
        item.codigo_de_generacion,
      "NOMBRE DEL CLIENTE MANDANTE O MANDATARIO": item.re_name,
      "NRC DEL CLIENTE": item.re_nrc,
      "VENTAS EXENTAS": item.totalexenta || 0,
      "VENTAS INTERNAS GRAVADAS": item.total_agravada || 0,
      "DÉBITO FISCAL": item.tributocf.split("|")[2] || 0,
      "VENTAS EXENTAS A CUENTA DE TERCEROS": 0,
      "VENTAS INTERNAS GRAVADAS A CUENTA DE TERCEROS": 0,
      "DEBITO FISCAL POR CUENTA DE TERCEROS": 0,
      "IVA PERCIBIDO": 0,
      RETENCION: item.retencion_de_renta || 0,
      TOTAL: item.total_a_pagar,
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Libro de Contribuyentes");

    // Add header rows
    const headerRows = [
      ["LIBRO DE IVA VENTAS CONTRIBUYENTES"],
      [`${user.name}`],
      [`Fecha: ${startDate} al ${endDate}`],
      [`NRC: ${user.nrc}`],
      [""], // Empty row for spacing
    ];

    // Add and style each header row
    headerRows.forEach((row, index) => {
      const excelRow = worksheet.addRow(row);
      worksheet.mergeCells(`A${index + 1}:O${index + 1}`);

      // Style the merged cell
      const cell = worksheet.getCell(`A${index + 1}`);
      if (index == 0 || index == 1) {
        cell.style = {
          font: {
            bold: true,
            size: 16,
            name: "Arial",
          },
          alignment: {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          },
        };
      } else {
        cell.style = {
          font: {
            bold: false,
            size: 13,
            name: "Arial",
          },
          alignment: {
            horizontal: "left",
            vertical: "middle",
            wrapText: true,
          },
        };
      }

      excelRow.height = index === 0 ? 30 : 25;
    });

    const tableHeaders = [
      "N°",
      "FECHA DE EMISIÓN DEL DOCUMENTO",
      "NÚMERO DE CORRELATIVO PREEIMPRESO",
      "NÚMERO DE CONTROL INTERNO SISTEMA FORMULARIO ÚNICO",
      "NOMBRE DEL CLIENTE MANDANTE O MANDATARIO",
      "NRC DEL CLIENTE",
      "VENTAS EXENTAS",
      "VENTAS INTERNAS GRAVADAS",
      "DÉBITO FISCAL",
      "VENTAS EXENTAS A CUENTA DE TERCEROS",
      "VENTAS INTERNAS GRAVADAS A CUENTA DE TERCEROS",
      "DEBITO FISCAL POR CUENTA DE TERCEROS",
      "IVA PERCIBIDO",
      "RETENCION",
      "TOTAL",
    ];

    const headerRow = worksheet.addRow(tableHeaders);

    // Style table headers
    headerRow.eachCell((cell) => {
      cell.style = {
        font: {
          bold: true,
          color: { argb: "FFFFFFFF" },
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" },
        },
        alignment: {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        },
        border: {
          top: { style: "medium", color: { argb: "FF000000" } },
          left: { style: "medium", color: { argb: "FF000000" } },
          bottom: { style: "medium", color: { argb: "FF000000" } },
          right: { style: "medium", color: { argb: "FF000000" } },
        },
      };
    });

    transformedData.forEach((rowData) => {
      const row = worksheet.addRow(Object.values(rowData));
      row.eachCell((cell) => {
        cell.style = {
          alignment: {
            horizontal: "center",
            vertical: "middle",
          },
          border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          },
        };
      });
    });

    // Add empty row before summary
    // Calculate totals
    const totals = calculateTotalsContribuyentes(transformedData);

    // Add summary section
    const summaryRows = [
      /* Total agravado */
      [
        "",
        "",
        "",
        "",
        "",
        "TOTAL",
        "0",
        totals.locales,
        totals.sujetas,
        totals.exportaciones,
        "0",
        "0",
        totals.iva,
        totals.retencion,
        totals.grantotal,
      ],
    ];

    // Add and style summary rows
    summaryRows.forEach((row, index) => {
      const summaryRow = worksheet.addRow(row);
      // Apply styles to cells
      summaryRow.eachCell((cell, colNumber) => {
        if (colNumber > 5) {
          let borderStyle = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };

          // Add thick border for periphery
          if (index === 0) {
            borderStyle.top.style = "medium";
          }
          if (index === summaryRows.length - 1) {
            borderStyle.bottom.style = "medium";
          }
          if (colNumber === 2) {
            borderStyle.left.style = "medium";
          }
          if (colNumber === 9) {
            borderStyle.right.style = "medium";
          }
          cell.style = {
            font: {
              bold: index === 0 || colNumber === 2,
              size: index === 0 ? 12 : 11,
            },
            alignment: {
              horizontal:
                index === 0
                  ? "center"
                  : colNumber === 2
                  ? "left"
                  : colNumber === 3
                  ? "right"
                  : "center",
              vertical: "middle",
            },
            border: borderStyle,
          };
        }
      });

      // Set row height
      summaryRow.height = 25;
    });

    /* Adding the new table */

    const dataCFinal = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["01"],
      startDate,
      endDate
    );
    console.log("dataCFinal");
    console.log(dataCFinal);

    const datapresentation = dataCFinal.reduce(
      (acc, item) => {
        return {
          totalexenta: acc.totalexenta + Number(item.totalexenta || 0),
          total_agravada: acc.total_agravada + Number(item.total_agravada || 0),
          iva_percibido: acc.iva_percibido + Number(item.iva_percibido || 0),
          retencion_de_renta:
            acc.retencion_de_renta + Number(item.retencion_de_renta || 0),
          montototaloperacion:
            acc.montototaloperacion + Number(item.montototaloperacion || 0),
        };
      },
      {
        totalexenta: 0,
        total_agravada: 0,
        iva_percibido: 0,
        retencion_de_renta: 0,
        montototaloperacion: 0,
      }
    );

    const summarybooks = [
      /* Total agravado */
      [
        "",
        "",
        "",
        "",
        "No Sujetas",
        "Exentas",
        "Agravadas",
        "Exportaciones",
        "IVA",
        "Retencion",
        "Total",
      ],
      [
        "",
        "",
        "",
        "Libro de Credito Fiscal",
        "",
        "0",
        totals.locales,
        totals.exportaciones,
        totals.sujetas,
        totals.retencion,
        totals.grantotal,
      ],
      [
        "",
        "",
        "",
        "Libro de Consumidor Final",
        "0",
        datapresentation.totalexenta,
        datapresentation.total_agravada,
        "0",
        datapresentation.iva_percibido,
        datapresentation.retencion_de_renta,
        datapresentation.montototaloperacion,
      ],
      [
        "",
        "",
        "",
        "Facturas de Exportación",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
      ],
      [
        "",
        "",
        "",
        "Total",
        "0",
        Number(datapresentation.totalexenta),
        totals.locales + datapresentation.total_agravada,
        "0",
        totals.iva + datapresentation.iva_percibido,
        totals.retencion + datapresentation.retencion_de_renta,
        datapresentation.montototaloperacion + totals.grantotal,
      ],
    ];

    const summaryStartRow = worksheet.rowCount + 1;

    // Add empty row before summary
    worksheet.addRow([]);
    // Add empty row before summary
    worksheet.addRow([]);
    // Add and style summary rows
    summarybooks.forEach((row, index) => {
      const summaryRow = worksheet.addRow(row);

      // Apply styles to cells
      summaryRow.eachCell((cell, colNumber) => {
        if (colNumber > 3) {
          // Only style columns B and onwards
          let borderStyle = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };

          // Add thick border for periphery
          if (index === 0) {
            borderStyle.top.style = "medium";
          }
          if (index === summarybooks.length - 1) {
            borderStyle.bottom.style = "medium";
          }
          if (colNumber === 2) {
            borderStyle.left.style = "medium";
          }
          if (colNumber === 9) {
            borderStyle.right.style = "medium";
          }

          cell.style = {
            font: {
              bold: index === 0 || colNumber === 2,
              size: index === 0 ? 12 : 11,
            },
            alignment: {
              horizontal:
                index === 0
                  ? "center"
                  : colNumber === 2
                  ? "left"
                  : colNumber === 3
                  ? "right"
                  : "center",
              vertical: "middle",
            },
            border: borderStyle,
          };
        }
      });

      // Set row height
      summaryRow.height = 25;
    });

    // Set column widths for better readability
    worksheet.columns = [
      { width: 5 }, // N°
      { width: 17 }, // FECHA
      { width: 37 }, // CORRELATIVO
      { width: 30 }, // CONTROL INTERNO
      { width: 40 }, // NOMBRE
      { width: 10 }, // NRC
      { width: 10 }, // VENTAS EXENTAS
      { width: 20 }, // VENTAS GRAVADAS
      { width: 10 }, // DEBITO
      { width: 12 }, // VENTAS EXENTAS TERCEROS
      { width: 22 }, // VENTAS GRAVADAS TERCEROS
      { width: 20 }, // DEBITO TERCEROS
      { width: 15 }, // IVA
      { width: 15 }, // Retencion
      { width: 15 }, // TOTAL
    ];

    // Generate and save the file
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Libro de Contribuyentes ${startDate} - ${endDate} -${user.name}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Libro de Contribuyentes creado con éxito");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Error al crear el Libro de Contribuyentes");
    }
  };

  const anexoCF = async () => {
    const data = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["03", "05", "06"],
      startDate,
      endDate
    );
    console.log(data);

    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Contribuyentes"
      );
      return;
    }

    const formatToDMY = (input) => {
      if (!input) return input;
      const str = String(input).trim();
      // YYYY-MM-DD
      const iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (iso) {
        const y = iso[1],
          m = parseInt(iso[2], 10),
          d = parseInt(iso[3], 10);
        return `${d}/${m}/${y}`;
      }
      // DD/MM/YY or DD/MM/YYYY
      const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (dmy) {
        const d = parseInt(dmy[1], 10);
        const m = parseInt(dmy[2], 10);
        let y = dmy[3];
        if (y.length === 2) y = '20' + y;
        return `${d}/${m}/${y}`;
      }
      // DD-MM-YY or DD-MM-YYYY
      const dmyDash = str.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
      if (dmyDash) {
        const d = parseInt(dmyDash[1], 10);
        const m = parseInt(dmyDash[2], 10);
        let y = dmyDash[3];
        if (y.length === 2) y = '20' + y;
        return `${d}/${m}/${y}`;
      }
      // Fallback: Date
      const dt = new Date(str);
      if (!isNaN(dt)) {
        const m = dt.getMonth() + 1;
        const d = dt.getDate();
        const y = dt.getFullYear();
        return `${d}/${m}/${y}`;
      }
      return str;
    };

    const transformedData = data.map((item) => ({
      "FECHA DE EMISIÓN DEL DOCUMENTO": formatToDMY(
        item.fecha_y_hora_de_generacion
      ),
      "CLASE DE DOCUMENTO": 4,
      "TIPO DE DOCUMENTO": item.tipo,
      "NUMERO DE RESOLUCIÓN": item.numero_de_control, // Add if available in your data
      "SERIE DEL DOCUMENTO": item.sello_de_recepcion,
      "NÚMERO DE DOCUMENTO": item.codigo_de_generacion,
      "NÚMERO DE CONTROL INTERNO": 0,
      "NIT O NRC DEL CLIENTE": item.re_nit,
      "NOMBRE RAZÓN SOCIAL O DENOMINACIÓN": item.re_name,
      "VENTAS EXENTAS": item.totalexenta || 0,
      "VENTAS NO SUJETAS": item.totalnosuj || 0,
      "VENTAS GRAVADAS LOCALES": item.total_agravada || 0,
      "DEBITO FISCAL": item.tributocf ? item.tributocf.split("|")[2] : 0,
      "VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS": item.ventatercero || 0,
      "DEBITO FISCAL POR VENTAS A CUENTA DE TERCEROS": 0, // Add if available in your data
      "TOTAL DE VENTAS": item.total_a_pagar,
      "NUMERO DE DUI DEL CLIENTE": "", // Add if available in your data
      "NÚMERO DEL ANEXO1": "1", // Add if available in your data
      "NÚMERO DEL ANEXO2": "1", // Add if available in your data
      "NÚMERO DEL ANEXO3": "1", // Add if available in your data
    }));
    // Parser para D/M/YY o D/M/YYYY
    const parseDMY = (s) => {
      if (!s) return new Date("Invalid");
      const str = String(s).trim();
      const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (dmy) {
        const d = parseInt(dmy[1], 10);
        const m = parseInt(dmy[2], 10);
        const y =
          dmy[3].length === 2
            ? 2000 + parseInt(dmy[3], 10)
            : parseInt(dmy[3], 10);
        return new Date(y, m - 1, d);
      }
      return new Date(str);
    };
    transformedData.sort(
      (a, b) =>
        parseDMY(a["FECHA DE EMISIÓN DEL DOCUMENTO"]) -
        parseDMY(b["FECHA DE EMISIÓN DEL DOCUMENTO"])
    );

    // Calcular totales
    /* const totales = transformedData.reduce((acc, item) => ({
      'FECHA DE EMISIÓN DEL DOCUMENTO': '',
      'CLASE DE DOCUMENTO': '',
      'TIPO DE DOCUMENTO': '',
      'NUMERO DE RESOLUCIÓN': '',
      'SERIE DEL DOCUMENTO': '',
      'NÚMERO DE DOCUMENTO': '',
      'NÚMERO DE CONTROL INTERNO': '',
      'NIT O NRC DEL CLIENTE': '',
      'NOMBRE RAZÓN SOCIAL O DENOMINACIÓN': 'TOTAL',
      'VENTAS EXENTAS': acc['VENTAS EXENTAS'] + Number(item['VENTAS EXENTAS'] || 0),
      'VENTAS NO SUJETAS': acc['VENTAS NO SUJETAS'] + Number(item['VENTAS NO SUJETAS'] || 0),
      'VENTAS GRAVADAS LOCALES': acc['VENTAS GRAVADAS LOCALES'] + Number(item['VENTAS GRAVADAS LOCALES'] || 0),
      'DEBITO FISCAL': acc['DEBITO FISCAL'] + Number(item['DEBITO FISCAL'] || 0),
      'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS': acc['VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS'] + Number(item['VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS'] || 0),
      'DEBITO FISCAL POR VENTAS A CUENTA DE TERCEROS': acc['DEBITO FISCAL POR VENTAS A CUENTA DE TERCEROS'] + Number(item['DEBITO FISCAL POR VENTAS A CUENTA DE TERCEROS'] || 0),
      'TOTAL DE VENTAS': acc['TOTAL DE VENTAS'] + Number(item['TOTAL DE VENTAS'] || 0),
      'NUMERO DE DUI DEL CLIENTE': '',
      'NÚMERO DEL ANEXO': ''
    }), {
      'VENTAS EXENTAS': 0,
      'VENTAS NO SUJETAS': 0,
      'VENTAS GRAVADAS LOCALES': 0,
      'DEBITO FISCAL': 0,
      'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS': 0,
      'DEBITO FISCAL POR VENTAS A CUENTA DE TERCEROS': 0,
      'TOTAL DE VENTAS': 0
    });

    // Agregar fila de totales
    transformedData.push(totales); */

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet without headers
    const ws = XLSX.utils.json_to_sheet(transformedData, { skipHeader: true });

    // Set column widths for better readability
    const colWidths = Array(21).fill({ wch: 20 }); // Set width of 20 for all 21 columns
    ws["!cols"] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    // Generate CSV file with current date
    const date = new Date().toISOString().split("T")[0];
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });

    // Create a Blob from the CSV and save it
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Anexo ventas contribuyente ${startDate} - ${endDate}.csv`;
    link.click();

    toast.success("Anexo de contribuyentes creado con éxito");
  };
  /* ------------------------CF-------------------------- */

  /* ------------------------Bill-------------------------- */

  const LibroConsumidorFinal = async () => {
    // Get and transform data
    const data = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["01"],
      startDate,
      endDate
    );
    console.log(data);
    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Libro Consumidor final"
      );
      return;
    }
    const transformedData = transformData(data);
    console.log(transformedData);

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Libro de Ventas");

    // Add header rows
    const headerRows = [
      ["LIBRO DE IVA VENTAS CONSUMIDOR FINAL"],
      [`${user.name}`],
      [`Fecha: ${startDate} al ${endDate}`],
      [`NRC: ${user.nrc}`],
      [""], // Empty row for spacing
    ];

    // Add and style each header row
    headerRows.forEach((row, index) => {
      const excelRow = worksheet.addRow(row);
      worksheet.mergeCells(`A${index + 1}:I${index + 1}`);

      // Style the merged cell
      const cell = worksheet.getCell(`A${index + 1}`);
      if (index == 0 || index == 1) {
        cell.style = {
          font: {
            bold: true,
            size: 16,
            name: "Arial",
          },
          alignment: {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          },
        };
      } else {
        cell.style = {
          font: {
            bold: false,
            size: 13,
            name: "Arial",
          },
          alignment: {
            horizontal: "left",
            vertical: "middle",
            wrapText: true,
          },
        };
      }

      // Set row height
      excelRow.height = index === 0 ? 30 : 25;
    });

    // Add table headers
    const tableHeaders = [
      "DÍA",
      "DOCUMENTO EMITIDO (DEL)",
      "DOCUMENTO EMITIDO (AL)",
      "N° DE CAJA O SISTEMA COMPUTARIZADO",
      "VENTAS EXENTAS",
      "VENTAS INTERNAS GRAVADAS",
      "EXPORTACIONES",
      "TOTAL DE VENTAS DIARIAS PROPIAS",
      "VENTAS A CUENTAS DE TERCEROS",
    ];

    const headerRow = worksheet.addRow(tableHeaders);

    // Style table headers
    headerRow.eachCell((cell) => {
      cell.style = {
        font: {
          bold: true,
          color: { argb: "FFFFFFFF" },
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" },
        },
        alignment: {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        },
        border: {
          top: { style: "medium", color: { argb: "FF000000" } },
          left: { style: "medium", color: { argb: "FF000000" } },
          bottom: { style: "medium", color: { argb: "FF000000" } },
          right: { style: "medium", color: { argb: "FF000000" } },
        },
      };
    });
    /* order transformeddata by days using day number and day column*/
    transformedData.sort((a, b) => a["DÍA"] - b["DÍA"]);

    // Add data rows
    transformedData.forEach((rowData) => {
      const row = worksheet.addRow(Object.values(rowData));
      row.eachCell((cell) => {
        cell.style = {
          alignment: {
            horizontal: "center",
            vertical: "middle",
          },
          border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          },
        };
      });
    });

    // Calculate totals
    const totals = calculateTotals(transformedData);

    // Add total row
    const totalRow = worksheet.addRow([
      "TOTAL",
      "",
      "",
      "",
      totals.ventasExentas,
      totals.totalVentas,
      totals.ventasExterior,
      totals.granTotal - totals.ventasExterior,
      0,
    ]);

    // Style total row
    totalRow.eachCell((cell, colNumber) => {
      cell.style = {
        font: {
          bold: true,
          size: 11,
        },
        alignment: {
          horizontal: "center",
          vertical: "middle",
        },
        border: {
          top: { style: "medium", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "medium", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE7E6E6" },
        },
      };
    });

    // Add empty row before summary
    worksheet.addRow([]);

    // Add summary section
    const summaryRows = [
      /* Total agravado */ ["", "Resumen de Operaciones", ""],
      ["", "Iva Retenido", totals.ivaRetenido],
      ["", "Total Ventas gravado", totals.totalVentas],
      ["", "Ventas Exentas", totals.ventasExentas],
      ["", "Ventas al Exterior", totals.ventasExterior],
      ["", "Total Ventas", totals.granTotal],
    ];

    // Get the starting row number for the summary section
    const summaryStartRow = worksheet.rowCount + 1;

    // Add and style summary rows
    summaryRows.forEach((row, index) => {
      const summaryRow = worksheet.addRow(row);

      // Merge cells for the header row (first row)
      if (index === 0) {
        worksheet.mergeCells(`B${summaryStartRow}:C${summaryStartRow}`);
      }

      // Apply styles to cells
      summaryRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2) {
          // Only style columns B and onwards
          let borderStyle = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };

          // Add thick border for periphery
          if (index === 0) {
            borderStyle.top.style = "medium";
          }
          if (index === summaryRows.length - 1) {
            borderStyle.bottom.style = "medium";
          }
          if (colNumber === 2) {
            borderStyle.left.style = "medium";
          }
          if (colNumber === 9) {
            borderStyle.right.style = "medium";
          }

          cell.style = {
            font: {
              bold: index === 0 || colNumber === 2,
              size: index === 0 ? 12 : 11,
            },
            alignment: {
              horizontal:
                index === 0
                  ? "center"
                  : colNumber === 2
                  ? "left"
                  : colNumber === 3
                  ? "right"
                  : "center",
              vertical: "middle",
            },
            border: borderStyle,
          };
        }
      });

      // Set row height
      summaryRow.height = 25;
    });

    // Set column widths
    worksheet.columns = [
      { width: 12 }, // DÍA
      { width: 32 }, // DOCUMENTO DEL
      { width: 32 }, // DOCUMENTO AL
      { width: 34 }, // N° DE CAJA
      { width: 15 }, // VENTAS EXENTAS
      { width: 15 }, // VENTAS GRAVADAS
      { width: 15 }, // EXPORTACIONES
      { width: 30 }, // TOTAL VENTAS
      { width: 30 }, // VENTAS TERCEROS
    ];

    // Generate and save the file
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Libro de ventas consumidor final ${startDate} - ${endDate}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Libro de ventas consumidor final creado con éxito");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Error al crear el libro de ventas");
    }
  };

  const calculateTotals = (data) => {
    return data.reduce(
      (acc, row) => {
        return {
          ventasNetas: acc.ventasNetas + (row["VENTAS INTERNAS GRAVADAS"] || 0),
          ivaDebito: acc.ivaDebito + (row["VENTAS INTERNAS GRAVADAS"] || 0),
          ivaRetenido: acc.ivaRetenido + (row["IVA RETENIDO"] || 0),
          totalVentas: acc.totalVentas + (row["VENTAS INTERNAS GRAVADAS"] || 0),
          ventasExentas: acc.ventasExentas + (row["VENTAS EXENTAS"] || 0),
          ventasExterior: acc.ventasExterior + (row["EXPORTACIONES"] || 0),
          granTotal:
            acc.granTotal +
            (row["TOTAL DE VENTAS DIARIAS PROPIAS"] || 0) +
            (row["VENTAS A CUENTAS DE TERCEROS"] || 0),
        };
      },
      {
        ventasNetas: 0,
        ivaDebito: 0,
        ivaRetenido: 0,
        totalVentas: 0,
        ventasExentas: 0,
        ventasExterior: 0,
        granTotal: 0,
      }
    );
  };

  // Keep your existing transformData function
  const transformData = (data) => {
    // Comparador robusto para números de control: intenta comparar por número al final; fallback a comparación natural
    const compareControl = (a, b) => {
      const sa = String(a ?? "");
      const sb = String(b ?? "");
      if (sa === sb) return 0;
      const ma = sa.match(/(\d+)/g);
      const mb = sb.match(/(\d+)/g);
      if (ma && mb) {
        const na = parseInt(ma[ma.length - 1], 10);
        const nb = parseInt(mb[mb.length - 1], 10);
        if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
      }
      return sa.localeCompare(sb, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    };

    const groupedData = data.reduce((acc, item) => {
      // data = "2025-01-31" -> tomar el día
      const day = item.fecha_y_hora_de_generacion.split("-")[2].split("T")[0];
      if (!acc[day]) {
        const base = {
          DÍA: day,
          "DOCUMENTO EMITIDO (DEL)": item.numero_de_control,
          "DOCUMENTO EMITIDO (AL)": item.numero_de_control,
          "N° DE CAJA O SISTEMA COMPUTARIZADO": "1",
          "VENTAS EXENTAS": 0,
          "VENTAS INTERNAS GRAVADAS": 0,
          EXPORTACIONES: 0,
          "TOTAL DE VENTAS DIARIAS PROPIAS": 0,
          "VENTAS A CUENTAS DE TERCEROS": 0,
        };
        // Guardar min/max como propiedades NO enumerables para no afectar el orden de columnas
        Object.defineProperty(base, "_minDoc", {
          value: item.numero_de_control,
          writable: true,
          enumerable: false,
        });
        Object.defineProperty(base, "_maxDoc", {
          value: item.numero_de_control,
          writable: true,
          enumerable: false,
        });
        acc[day] = base;
      } else {
        const curr = item.numero_de_control;
        if (curr != null) {
          if (compareControl(curr, acc[day]._minDoc) < 0)
            acc[day]._minDoc = curr;
          if (compareControl(curr, acc[day]._maxDoc) > 0)
            acc[day]._maxDoc = curr;
          acc[day]["DOCUMENTO EMITIDO (DEL)"] = acc[day]._minDoc;
          acc[day]["DOCUMENTO EMITIDO (AL)"] = acc[day]._maxDoc;
        }
      }
      acc[day]["VENTAS EXENTAS"] += Number(item.totalexenta) || 0;
      acc[day]["VENTAS INTERNAS GRAVADAS"] += Number(item.total_agravada) || 0;
      acc[day]["TOTAL DE VENTAS DIARIAS PROPIAS"] +=
        Number(item.total_a_pagar) || 0;
      acc[day]["VENTAS A CUENTAS DE TERCEROS"] +=
        Number(item.ventatercero) || 0;

      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const anexoBill = async () => {
    const data = await PlantillaAPI.getbytypeandid(
      user_id,
      token,
      ["01"],
      startDate,
      endDate
    );
    console.log(data);

    if (!data.length) {
      toast.info(
        "No se encontraron datos para el rango de fechas seleccionado - Consumidor final"
      );
      return;
    }
    // Transform the data to match the required structure
    console.log("data");
    console.log(data);

    // Helper para formatear a D/M/YY desde DD/MM/YY, DD/MM/YYYY, DD-MM-YY, YYYY-MM-DD, etc.
    const formatToDMY = (input) => {
      if (!input) return input;
      const str = String(input).trim();
      // YYYY-MM-DD
      const iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (iso) {
        const y = iso[1],
          m = parseInt(iso[2], 10),
          d = parseInt(iso[3], 10);
        return `${d}/${m}/${y}`;
      }
      // DD/MM/YY or DD/MM/YYYY
      const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (dmy) {
        const d = parseInt(dmy[1], 10);
        const m = parseInt(dmy[2], 10);
        let y = dmy[3];
        if (y.length === 2) y = '20' + y;
        return `${d}/${m}/${y}`;
      }
      // DD-MM-YY or DD-MM-YYYY
      const dmyDash = str.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
      if (dmyDash) {
        const d = parseInt(dmyDash[1], 10);
        const m = parseInt(dmyDash[2], 10);
        let y = dmyDash[3];
        if (y.length === 2) y = '20' + y;
        return `${d}/${m}/${y}`;
      }
      // Fallback: Date
      const dt = new Date(str);
      if (!isNaN(dt)) {
        const m = dt.getMonth() + 1;
        const d = dt.getDate();
        const y = dt.getFullYear();
        return `${d}/${m}/${y}`;
      }
      return str;
    };

    const transformedData = data.map((item) => {
      let operation = "1"; /* Gravadas */
      if (item.totalexenta != 0) {
        operation = "2"; /* Exentas */
      }
      const datatranform = {
        "FECHA DE EMISIÓN": formatToDMY(item.fecha_y_hora_de_generacion),
        "CLASE DE DOCUMENTO": 4,
        "TIPO DE DOCUMENTO": 1,
        "NÚMERO DE RESOLUCIÓN": item.numero_de_control,
        "SERIE DEL DOCUMENTO": item.sello_de_recepcion /* DSAF */,
        "VENTAS EXENTAS2": item.totalexenta || 0,
        "VENTAS EXENTAS": item.totalexenta || 0,
        "NÚMERO DE DOCUMENTO (DEL)": item.codigo_de_generacion,
        "NÚMERO DE DOCUMENTO (AL)": item.codigo_de_generacion,
        "NÚMERO DE MAQUINA REGISTRADORA": "",
        "VENTAS INTERNAS EXENTAS NO SUJETAS A PROPORCIONALIDAD": 0,
        "VENTAS INTERNAS EXENTAS NO SUJETAS A PROPORCIONALIDAD2": 0,
        "VENTAS NO SUJETAS": item.totalnosuj || 0,
        "VENTAS GRAVADAS LOCALES": item.total_agravada || 0,
        "EXPORTACIONES DENTRO DEL ÁREA DE CENTROAMÉRICA": 0,
        "EXPORTACIONES FUERA DEL ÁREA DE CENTROAMÉRICA": 0,
        "EXPORTACIONES DE SERVICIO": 0,
        "VENTAS A ZONAS FRANCAS  Y DPA (TASA CERO)": 0,
        "VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS": 0,
        "TOTAL DE VENTAS": item.total_a_pagar,
        "TIPO DE OPERACIÓN (RENTA)": operation,
        "TIPO DE INGRESO (RENTA)": "1",
        "NÚMERO DEL ANEXO": "2",
      };
      return datatranform;
    });

    /* filtering and ordering data by date */
    // Parser para ordenar por fecha en D/M/YY o D/M/YYYY
    const parseDMY = (s) => {
      if (!s) return new Date("Invalid");
      const str = String(s).trim();
      const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (dmy) {
        const d = parseInt(dmy[1], 10);
        const m = parseInt(dmy[2], 10);
        const y =
          dmy[3].length === 2
            ? 2000 + parseInt(dmy[3], 10)
            : parseInt(dmy[3], 10);
        return new Date(y, m - 1, d);
      }
      return new Date(str);
    };
    transformedData.sort(
      (a, b) =>
        parseDMY(a["FECHA DE EMISIÓN"]) - parseDMY(b["FECHA DE EMISIÓN"])
    );

    // Calcular totales
    /* const totales = transformedData.reduce((acc, item) => ({
      'FECHA DE EMISIÓN': '',
      'CLASE DE DOCUMENTO': '',
      'TIPO DE DOCUMENTO': '',
      'NÚMERO DE RESOLUCIÓN': '',
      'SERIE DEL DOCUMENTO': '',
      'NUMERO DE CONTROL INTERNO DEL': '',
      'NUMERO DE CONTROL INTERNO AL': '',
      'NÚMERO DE DOCUMENTO (DEL)': '',
      'NÚMERO DE DOCUMENTO (AL)': '',
      'NÚMERO DE MAQUINA REGISTRADORA': 'TOTAL',
      'VENTAS EXENTAS': acc['VENTAS EXENTAS'] + Number(item['VENTAS EXENTAS'] || 0),
      'VENTAS INTERNAS EXENTAS NO SUJETAS A PROPORCIONALIDAD': acc['VENTAS INTERNAS EXENTAS NO SUJETAS A PROPORCIONALIDAD'] + Number(item['VENTAS INTERNAS EXENTAS NO SUJETAS A PROPORCIONALIDAD'] || 0),
      'VENTAS NO SUJETAS': acc['VENTAS NO SUJETAS'] + Number(item['VENTAS NO SUJETAS'] || 0),
      'VENTAS GRAVADAS LOCALES': acc['VENTAS GRAVADAS LOCALES'] + Number(item['VENTAS GRAVADAS LOCALES'] || 0),
      'EXPORTACIONES DENTRO DEL ÁREA DE CENTROAMÉRICA': acc['EXPORTACIONES DENTRO DEL ÁREA DE CENTROAMÉRICA'] + Number(item['EXPORTACIONES DENTRO DEL ÁREA DE CENTROAMÉRICA'] || 0),
      'EXPORTACIONES FUERA DEL ÁREA DE CENTROAMÉRICA': acc['EXPORTACIONES FUERA DEL ÁREA DE CENTROAMÉRICA'] + Number(item['EXPORTACIONES FUERA DEL ÁREA DE CENTROAMÉRICA'] || 0),
      'EXPORTACIONES DE SERVICIO': acc['EXPORTACIONES DE SERVICIO'] + Number(item['EXPORTACIONES DE SERVICIO'] || 0),
      'VENTAS A ZONAS FRANCAS  Y DPA (TASA CERO)': acc['VENTAS A ZONAS FRANCAS  Y DPA (TASA CERO)'] + Number(item['VENTAS A ZONAS FRANCAS  Y DPA (TASA CERO)'] || 0),
      'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS': acc['VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS'] + Number(item['VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS'] || 0),
      'TOTAL DE VENTAS': acc['TOTAL DE VENTAS'] + Number(item['TOTAL DE VENTAS'] || 0),
      'TIPO DE OPERACIÓN (RENTA)': '',
      'TIPO DE INGRESO (RENTA)': '',
      'NÚMERO DEL ANEXO': ''
    }), {
      'VENTAS EXENTAS': 0,
      'VENTAS INTERNAS EXENTAS NO SUJETAS A PROPORCIONALIDAD': 0,
      'VENTAS NO SUJETAS': 0,
      'VENTAS GRAVADAS LOCALES': 0,
      'EXPORTACIONES DENTRO DEL ÁREA DE CENTROAMÉRICA': 0,
      'EXPORTACIONES FUERA DEL ÁREA DE CENTROAMÉRICA': 0,
      'EXPORTACIONES DE SERVICIO': 0,
      'VENTAS A ZONAS FRANCAS  Y DPA (TASA CERO)': 0,
      'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS': 0,
      'TOTAL DE VENTAS': 0
    });

    // Agregar fila de totales
    transformedData.push(totales); */

    /* // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet without headers
    const ws = XLSX.utils.json_to_sheet(transformedData, { 
      skipHeader: true 
    });

    // Set column widths for better readability
    const colWidths = Array(21).fill({ wch: 20 }); // Set width of 20 for all 21 columns
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Generate Excel file with current date
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Anexo ventas consumidor final ${startDate} - ${endDate}.xlsx`); */

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet without headers
    const ws = XLSX.utils.json_to_sheet(transformedData, { skipHeader: true });

    // Set column widths for better readability
    const colWidths = Array(21).fill({ wch: 20 }); // Set width of 20 for all 21 columns
    ws["!cols"] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    // Generate CSV file with current date
    const date = new Date().toISOString().split("T")[0];
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });

    // Create a Blob from the CSV and save it
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Anexo ventas consumidor final ${startDate} - ${endDate}.csv`;
    link.click();

    toast.success("Anexo de Consumidor final creado con éxito");
  };
  /* ------------------------Bill-------------------------- */

  return (
    <div className="min-h-screen bg-steelblue-300 flex flex-col">
      {/* Header Section */}
      <div className="fixed top-0 left-0 z-40">
        <HamburguerComponent sidebar={sidebar} open={visible} />
        <SidebarComponent visible={visible} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Page Title */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Reportes y Libros Contables
          </h1>
          <p className="text-white/80 text-lg">
            Genera reportes fiscales y gestiona tus libros contables
          </p>
        </div>

        {/* Reports Grid */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {/* Anexos Card */}
            <div className="animate-fadeInUp animate-delay-100 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📋</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Anexos Fiscales
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  CF, FCF, CSE y Compras
                </p>
                <button
                  onClick={() => openModal("ANEX")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  Generar Anexos
                </button>
              </div>
            </div>

            {/* Exportación Bruta (Todos los Documentos) */}
            <div className="animate-fadeInUp animate-delay-150 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧾</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Exportación de Documentos (Raw)
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Facturas, Crédito Fiscal, Sujeto Excluido y Notas
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => openModal("RAW_FACT")}
                    className="w-full bg-blue-500/90 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Facturas (01)
                  </button>
                  <button
                    onClick={() => openModal("RAW_CF")}
                    className="w-full bg-indigo-500/90 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Crédito Fiscal (03)
                  </button>
                  <button
                    onClick={() => openModal("RAW_SUEX")}
                    className="w-full bg-emerald-500/90 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Sujeto Excluido (14)
                  </button>
                  <button
                    onClick={() => openModal("RAW_NOTAS")}
                    className="w-full bg-orange-500/90 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Notas Débito/Crédito (05,06)
                  </button>
                </div>
              </div>
            </div>

            {/* Exportación Bruta de Compras */}
            { <div className="animate-fadeInUp animate-delay-175 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Exportación de Compras (Raw)
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  JSON de compras convertidas a Excel de columnas fijas
                </p>
                <button
                  onClick={() => openModal("RAW_COMP")}
                  className="w-full bg-amber-500/90 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  Compras (Raw)
                </button>
              </div>
            </div> }

            {/* Libro Contribuyentes Card */}
            <div className="animate-fadeInUp animate-delay-200 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Libro de Contribuyentes
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Registro de ventas a contribuyentes
                </p>
                <button
                  onClick={() => openModal("LC")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  Generar Libro
                </button>
              </div>
            </div>

            {/* Libro Consumidor Final Card */}
            <div className="animate-fadeInUp animate-delay-300 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Libro Consumidor Final
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Registro de ventas a consumidor final
                </p>
                <button
                  onClick={() => openModal("LCF")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  Generar Libro
                </button>
              </div>
            </div>

            {/* Libro Compras Card */}
            { <div className="animate-fadeInUp animate-delay-400 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Libro de Compras
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Registro de compras y crédito fiscal
                </p>
                <button
                  onClick={() => openModal("LCOM")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  Generar Libro
                </button>
              </div>
            </div> }
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-slideInUp animate-delay-500 bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📁</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Subir Factura de Compras
                </h3>
                <p className="text-gray-600 text-sm">
                  Importa facturas desde archivo JSON
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-gray-400 mb-2">
                      <span className="text-2xl">📄</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Haz clic para seleccionar un archivo JSON
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {jsonData && (
              <div className="animate-zoomIn bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Información del JSON
                  </h3>
                  {/* El llenado/edición ahora se hace desde el botón principal */}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Emisor:</span>
                      <span className="text-gray-800">{jsonData?.emisor?.nombre || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Nombre comercial:</span>
                      <span className="text-gray-800">{jsonData?.emisor?.nombreComercial || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Receptor:</span>
                      <span className="text-gray-800">{jsonData?.receptor?.nombre || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Fecha:</span>
                      <span className="text-gray-800">{jsonData?.identificacion?.fecEmi || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Total:</span>
                      <span className="text-gray-800 font-bold">${jsonData?.resumen?.montoTotalOperacion || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Resumen</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-gray-600">Total gravado:</span>
                      <span className="text-gray-800">
                        {jsonData?.resumen?.totalGravada != null ? `$${Number(jsonData.resumen.totalGravada).toFixed(2)}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-gray-600">IVA (tributos o totalIva):</span>
                      <span className="text-gray-800">
                        {Array.isArray(jsonData?.resumen?.tributos) && jsonData.resumen.tributos.length > 0
                          ? `$${jsonData.resumen.tributos.reduce((sum, t) => sum + (Number(t?.valor) || 0), 0).toFixed(2)}`
                          : (jsonData?.resumen?.totalIva != null
                              ? `$${Number(jsonData.resumen.totalIva).toFixed(2)}`
                              : 'N/A')}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-gray-600">Total a pagar:</span>
                      <span className="text-gray-800">
                        {jsonData?.resumen?.totalPagar != null ? `$${Number(jsonData.resumen.totalPagar).toFixed(2)}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Identificadores</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-gray-600">Código de generación:</span>
                      <span className="text-gray-800 break-all">{jsonData?.identificacion?.codigoGeneracion || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-gray-600">Correlativo (N°):</span>
                      <span className="text-gray-800">
                        {jsonData?.identificacion?.numeroControl?.split('-')?.pop() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-gray-600">Número de control:</span>
                      <span className="text-gray-800 break-all">{jsonData?.identificacion?.numeroControl || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-gray-600">Sello de recepción:</span>
                      <span className="text-gray-800 break-all">{jsonData?.respuestaMh?.selloRecibido || jsonData?.selloRecepcion || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-gray-600">Fecha/Hora emisión:</span>
                      <span className="text-gray-800">
                        {(jsonData?.identificacion?.fecEmi || 'N/A') + ' ' + (jsonData?.identificacion?.horEmi || '')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Desglose de ítems</h4>
                    <span className="text-xs text-gray-500">{jsonData?.cuerpoDocumento?.length || 0} ítem(s)</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto text-xs">
                    <div className="grid grid-cols-12 gap-2 py-2 border-b font-medium text-gray-600 sticky top-0 bg-gray-50">
                      <div className="col-span-1">#</div>
                      <div className="col-span-3">Código</div>
                      <div className="col-span-5">Descripción</div>
                      <div className="col-span-1 text-right">Cant.</div>
                      <div className="col-span-2 text-right">Subtotal</div>
                    </div>
                    {Array.isArray(jsonData?.cuerpoDocumento) && jsonData.cuerpoDocumento.map((item, idx) => {
                      const qty = Number(item?.cantidad) || 0;
                      const pu = Number(item?.precioUni) || 0;
                      const subtotal = (qty * pu).toFixed(2);
                      return (
                        <div key={idx} className="grid grid-cols-12 gap-2 py-2 border-b last:border-b-0 items-center">
                          <div className="col-span-1 text-gray-700">{item?.numItem || idx + 1}</div>
                          <div className="col-span-3 text-gray-700 truncate" title={item?.codigo || ''}>{item?.codigo || '-'}</div>
                          <div className="col-span-5 text-gray-700 truncate" title={item?.descripcion || ''}>{item?.descripcion || '-'}</div>
                          <div className="col-span-1 text-right text-gray-700">{qty}</div>
                          <div className="col-span-2 text-right text-gray-700">${subtotal}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditJsonModalOpen(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  ✍️ Llenar campos restante
                </button>
                {/* Modal para editar el JSON */}
                <ModalEditJson
                  isOpen={isEditJsonModalOpen}
                  onRequestClose={() => setIsEditJsonModalOpen(false)}
                  jsonData={jsonData}
                  onSave={(newData) => setJsonData(newData)}
                  primaryLabel="💾 Guardar Factura"
                  onSaveBill={async (finalJson) => {
                    await createcompras(finalJson);
                    setIsEditJsonModalOpen(false);
                  }}
                />
              </div>
            )} 
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Select Dates"
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 sm:mx-6 animate-zoomIn">
          {/* Modal Header */}
          <div className="bg-blue-500 text-white p-4 sm:p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold">
                📅 Seleccionar Fechas
              </h2>
              <button
                onClick={closeModal}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1 rounded-full transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm mt-2">
              Selecciona el rango de fechas para generar el reporte
            </p>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                📅 Fecha inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                📅 Fecha final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded-b-xl flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={closeModal}
              className="px-4 sm:px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={handleDownload}
              className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm sm:text-base"
            >
              📥 Descargar
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default BooksComponent;
