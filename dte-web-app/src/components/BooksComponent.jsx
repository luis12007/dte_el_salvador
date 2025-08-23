import React, { useState } from 'react';
import Modal from 'react-modal';
import HamburguerComponent from './HamburguerComponent';
import SidebarComponent from '../components/SideBarComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlantillaAPI from '../services/PlantillaService';
import { useEffect } from 'react';
import UserService from '../services/UserServices';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

const BooksComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visible, setVisible] = useState(true);
  const [book, setBook] = useState("");
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [jsonData, setJsonData] = useState(null);
  const [user, setUser] = useState({});

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
  }

  const handleDownload = () => {
    console.log('Download clicked with dates:', startDate, endDate);

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

    closeModal();
  };

  const Anexos = async () => {
    console.log("Anexos");
    anexoBill();
    anexoCF();
    anexoSuex();
    anexoCompras();
  }

  // Utilidades para exportación bruta a Excel (sin transformar)
  const flattenObject = (obj, prefix = '') => {
    const res = {};
    if (!obj || typeof obj !== 'object') return res;
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
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
    data.forEach(item => {
      const flat = flattenObject(item);
      Object.keys(flat).forEach(k => colSet.add(k));
    });
    return Array.from(colSet);
  };

  const generateRawExcel = async (data, title, filenameBase) => {
    if (!data || !data.length) {
      toast.info("No hay datos para exportar");
      return;
    }

    const flatRows = data.map(item => flattenObject(item));
    const columns = buildColumnsFromData(data);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    const addMergedHeader = (text, opts = {}) => {
      const r = worksheet.addRow([text]);
      const rowIndex = r.number;
      worksheet.mergeCells(rowIndex, 1, rowIndex, Math.max(1, columns.length));
      const cell = worksheet.getCell(rowIndex, 1);
      cell.style = {
        font: { bold: opts.bold ?? true, size: opts.size ?? 16, name: 'Arial' },
        alignment: { horizontal: opts.align ?? 'center', vertical: 'middle', wrapText: true },
      };
      r.height = opts.height ?? 25;
    };

    // Encabezados estilo "libros"
    addMergedHeader(title, { size: 18 });
    addMergedHeader(`${user?.name ?? ''}`, { bold: true, size: 14, align: 'left' });
    addMergedHeader(`Fecha: ${startDate} al ${endDate}`, { bold: false, size: 12, align: 'left' });
    addMergedHeader(`NRC: ${user?.nrc ?? ''}`, { bold: false, size: 12, align: 'left' });
    worksheet.addRow(['']);

    // Encabezado de columnas (todas las llaves crudas)
    const headerRow = worksheet.addRow(columns);
    headerRow.eachCell((cell) => {
      cell.style = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: { style: 'medium', color: { argb: 'FF000000' } },
          left: { style: 'medium', color: { argb: 'FF000000' } },
          bottom: { style: 'medium', color: { argb: 'FF000000' } },
          right: { style: 'medium', color: { argb: 'FF000000' } },
        },
      };
    });

    // Filas de datos
    flatRows.forEach(rowObj => {
      const row = worksheet.addRow(columns.map(c => rowObj[c] ?? ''));
      row.eachCell((cell) => {
        cell.style = {
          alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
        };
      });
    });

    // Ancho de columnas
    const defaultWidth = 20;
    worksheet.columns = columns.map(() => ({ width: defaultWidth }));

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filenameBase} ${startDate} - ${endDate}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Archivo creado con éxito");
    } catch (error) {
      console.error('Error generating Excel file:', error);
      toast.error('Error al crear el archivo');
    }
  };

  // Exportación con columnas fijas y altura máxima por fila
  const FIXED_HEADERS = [
    'tipo',
    'codigo de generacion',
    'numero de control',
    'sello de recepcion',
    'fecha',
    'hora emi',
    're correo electronico',
    're name',
    're numero de telefono',
    'ambiente',
    'subtotal',
    'total garvado',
    'iva percibido',
    'iva retenido',
    'retencion de renta',
    'total',
    'total a pagar',
    'observaciones'
  ];

  // Construye un Date combinando fecha (fecha_y_hora_de_generacion solo fecha) y hora (horemi)
  const buildDateTime = (obj) => {
    const dateRaw = (obj?.fecha_y_hora_de_generacion || obj?.fecha || '').toString().split('T')[0];
    const timeRaw = (obj?.horemi || obj?.hora || '').toString();
    let iso = '';
    if (dateRaw && timeRaw) iso = `${dateRaw}T${timeRaw}`;
    else if (dateRaw) iso = dateRaw;
    else if (timeRaw) iso = `1970-01-01T${timeRaw}`; // fallback solo hora
    const d = new Date(iso);
    return isFinite(d.getTime()) ? d : new Date(0);
  };

  const mapItemToFixedRow = (item) => {
    const fechaSolo = (item?.fecha_y_hora_de_generacion || item?.fecha || '').toString().split('T')[0];
    const horaSolo = (item?.horemi || item?.hora || '').toString();
    const ambienteLocal = localStorage.getItem('ambiente') || '';
    // Subtotal heurístico
    const subtotal = item?.subtotal ?? item?.monto_total ?? item?.montototal ?? item?.montototaloperacion ?? item?.total_agravada ?? 0;
    // Total heurístico
    const total = item?.total ?? item?.montototaloperacion ?? item?.monto_total ?? 0;
    const totalPagar = item?.total_a_pagar ?? total;
    return {
      'tipo': item?.tipo ?? item?.type ?? '',
      'codigo de generacion': item?.codigo_de_generacion ?? item?.codigo_generacion ?? item?.codigo ?? '',
      'numero de control': item?.numero_de_control ?? item?.numero_control ?? '',
      'sello de recepcion': item?.sello_de_recepcion ?? '',
  'fecha': fechaSolo ?? '',
  'hora emi': horaSolo ?? '',
      're correo electronico': item?.re_email ?? item?.re_correo ?? item?.re_correo_electronico ?? '',
      're name': item?.re_name ?? '',
      're numero de telefono': item?.re_telefono ?? item?.re_numero_telefono ?? item?.re_phone ?? '',
      'ambiente': item?.ambiente ?? ambienteLocal,
      'subtotal': subtotal,
      'total garvado': item?.total_agravada ?? 0,
      'iva percibido': item?.iva_percibido ?? 0,
      'iva retenido': item?.iva_retenido ?? 0,
      'retencion de renta': item?.retencion_de_renta ?? 0,
      'total': total,
      'total a pagar': totalPagar,
      'observaciones': item?.observaciones ?? ''
    };
  };

  const generateFixedColumnsExcel = async (data, title, filenameBase) => {
    if (!data || !data.length) {
      toast.info('No hay datos para exportar');
      return;
    }

    // Ordenar por fecha y hora ascendente
  const sorted = [...data].sort((a, b) => buildDateTime(a) - buildDateTime(b));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    // Encabezados tipo libros
    const addMergedHeader = (text, opts = {}) => {
      const r = worksheet.addRow([text]);
      const rowIndex = r.number;
      worksheet.mergeCells(rowIndex, 1, rowIndex, Math.max(1, FIXED_HEADERS.length));
      const cell = worksheet.getCell(rowIndex, 1);
      cell.style = {
        font: { bold: opts.bold ?? true, size: opts.size ?? 16, name: 'Arial' },
        alignment: { horizontal: opts.align ?? 'center', vertical: 'middle', wrapText: true },
      };
      r.height = opts.height ?? 25;
    };

    addMergedHeader(title, { size: 18 });
    addMergedHeader(`${user?.name ?? ''}`, { bold: true, size: 14, align: 'left' });
    addMergedHeader(`Fecha: ${startDate} al ${endDate}`, { bold: false, size: 12, align: 'left' });
    addMergedHeader(`NRC: ${user?.nrc ?? ''}`, { bold: false, size: 12, align: 'left' });
    worksheet.addRow(['']);

    // Header fijo
    const headerRow = worksheet.addRow(FIXED_HEADERS);
    headerRow.eachCell((cell) => {
      cell.style = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: { style: 'medium', color: { argb: 'FF000000' } },
          left: { style: 'medium', color: { argb: 'FF000000' } },
          bottom: { style: 'medium', color: { argb: 'FF000000' } },
          right: { style: 'medium', color: { argb: 'FF000000' } },
        },
      };
    });
    headerRow.height = 36;

    // Filas de datos con altura máxima 36
  sorted.forEach((item) => {
      const mapped = mapItemToFixedRow(item);
      const rowValues = FIXED_HEADERS.map((h) => mapped[h] ?? '');
      const row = worksheet.addRow(rowValues);
      row.eachCell((cell) => {
        cell.style = {
          alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
        };
      });
      row.height = 36;
    });

    worksheet.columns = FIXED_HEADERS.map(() => ({ width: 22 }));

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filenameBase} ${startDate} - ${endDate}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Archivo creado con éxito');
    } catch (error) {
      console.error('Error generating Excel file:', error);
      toast.error('Error al crear el archivo');
    }
  };

  // Exportadores por tipo de documento (sin transformar)
  const exportRawFactura = async () => {
    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["01"], startDate, endDate);
    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Facturas (01)");
      return;
    }
  await generateFixedColumnsExcel(data, 'FACTURAS (Datos brutos)', 'Facturas (Raw)');
  };

  const exportRawCreditoFiscal = async () => {
    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["03"], startDate, endDate);
    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Crédito Fiscal (03)");
      return;
    }
  await generateFixedColumnsExcel(data, 'CRÉDITO FISCAL (Datos brutos)', 'Credito Fiscal (Raw)');
  };

  const exportRawSujetoExcluido = async () => {
    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["14"], startDate, endDate);
    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Sujeto Excluido (14)");
      return;
    }
  await generateFixedColumnsExcel(data, 'SUJETO EXCLUIDO (Datos brutos)', 'Sujeto Excluido (Raw)');
  };

  const exportRawNotas = async () => {
    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["05", "06"], startDate, endDate);
    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Notas (05,06)");
      return;
    }
  await generateFixedColumnsExcel(data, 'NOTAS DÉBITO/CRÉDITO (Datos brutos)', 'Notas (Raw)');
  };


  const anexoSuex = async () => {

    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["14"], startDate, endDate);
    console.log(data);

    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Sujeto excluido");
      return;
    }

    const transformedData = data.map(item => {
      if (item.re_tipodocumento === "13") {
        item.tipo = "2";
      } else if (item.re_tipodocumento === "36") {
        item.tipo = "1";
      } else {
        item.tipo = "3";
      }
      const datatranform = {
        'TIPO DE DOCUMENTO': item.tipo,
        'NÚMERO DE NIT, DUI U OTRO DOCUMENTO': item.re_numdocumento,
        'NOMBRE, RAZÓN SOCIAL O DENOMINACIÓN': item.re_name,
        'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
        'NÚMERO DE SERIE DEL DOCUMENTO': item.sello_de_recepcion,
        'NÚMERO DE DOCUMENTO': item.codigo_de_generacion,
        'MONTO DE LA OPERACIÓN': item.total_a_pagar,
        'MONTO DE LA RETENCIÓN DEL IVA 13%': item.retencion_de_renta,
        'TIPO DE OPERACIÓN (Renta)': '1',
        'CLASIFICACIÓN (Renta)': '1',
        'SECTOR (Renta)': '4',
        'TIPO DE COSTO/GASTO (Renta)': '3',
        'NÚMERO DEL ANEXO': '5'
      };
      return datatranform;
    });

    transformedData.sort((a, b) => new Date(a['FECHA DE EMISIÓN DEL DOCUMENTO']) - new Date(b['FECHA DE EMISIÓN DEL DOCUMENTO']));

    const wb = XLSX.utils.book_new();

    // Convert data to worksheet without headers
    const ws = XLSX.utils.json_to_sheet(transformedData, { skipHeader: true });

    // Set column widths for better readability
    const colWidths = Array(21).fill({ wch: 20 }); // Set width of 20 for all 21 columns
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Generate CSV file with current date
    const date = new Date().toISOString().split('T')[0];
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ';' });

    // Create a Blob from the CSV and save it
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Anexo ventas Sujeto excluido ${startDate} - ${endDate}.csv`;
    link.click();

    toast.success("Anexo de Sujeto excluido creado con éxito");
  }

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

  const createcompras = async () => {
    if (!jsonData) {
      toast.error("No JSON data available");
      return;
    }
    const data = await PlantillaAPI.createcompras(jsonData, token, user_id);
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
    return data.reduce((acc, row) => {
      return {
        totalCompras: acc.totalCompras + Number(row['COMPRAS EXENTAS INTERNAS'] || 0),
        importacionesEx: acc.importacionesEx + Number((row['IMPORTACIONES E INTERNACIONES EXENTAS'] || 0)),
        totalAgravado: acc.totalAgravado + Number(row['COMPRAS INTERNAS GRAVADAS'] || 0),
        importacionesAg: acc.importacionesAg + Number(row['IMPORTACIONES E INTERNACIONES GRAVADAS'] || 0),
        iva: acc.iva + Number(row['CRÉDITO FISCAL'] || 0),
        anticipo: acc.anticipo + Number(row['ANTICIPO A CUENTA IVA PERCIBIDO'] || 0),
        grantotal: acc.grantotal + Number(row['TOTAL DE COMPRAS'] || 0),
        sujetosExcluidos: acc.sujetosExcluidos + Number(row['COMPRAS AS SUJETOS EXCLUIDOS'] || 0)
      };
    }, {
      totalCompras: 0,
      importacionesEx: 0,
      totalAgravado: 0,
      importacionesAg: 0,
      iva: 0,
      anticipo: 0,
      grantotal: 0,
      sujetosExcluidos: 0
    });
  };


  const LibroCompras = async () => {
    const data = await PlantillaAPI.getcompras(user_id, token, startDate, endDate);
    console.log(data);

    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Libro Compras");
      return;
    }


    const transformedData = data.map((item, index) => ({
      'N°': index + 1,
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'NÚMERO DE DOCUMENTO': item.codigo_de_generacion,
      'NÚMERO DE REGISTRO DEL CONTRIBUYENTE': item.em_nrc,
      'NOMBRE DEL PROVEEDOR': item.em_name,
      'COMPRAS EXENTAS INTERNAS': 0,
      'IMPORTACIONES E INTERNACIONES EXENTAS': 0,
      'COMPRAS INTERNAS GRAVADAS': item.total_agravada || 0,
      'IMPORTACIONES E INTERNACIONES GRAVADAS': 0,
      'CRÉDITO FISCAL': item.iva_percibido,
      'ANTICIPO A CUENTA IVA PERCIBIDO': "",
      'TOTAL DE COMPRAS': item.montototaloperacion,
      'COMPRAS AS SUJETOS EXCLUIDOS': ""
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Libro de compras');

    // Add header rows
    const headerRows = [
      ['LIBRO DE IVA COMPRAS'],
      [`${user.name}`],
      [`Fecha: ${startDate} al ${endDate}`],
      [`NRC: ${user.nrc}`],
      [''], // Empty row for spacing
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
            name: 'Arial',
          },
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
          },
        };
      } else {
        cell.style = {
          font: {
            bold: false,
            size: 13,
            name: 'Arial',
          },
          alignment: {
            horizontal: 'left',
            vertical: 'middle',
            wrapText: true,
          },
        };
      }


      excelRow.height = index === 0 ? 30 : 25;
    });

    const tableHeaders = [
      'N°',
      'FECHA DE EMISIÓN DEL DOCUMENTO',
      'NÚMERO DE DOCUMENTO',
      'NÚMERO DE REGISTRO DEL CONTRIBUYENTE',
      'NOMBRE DEL PROVEEDOR',
      'COMPRAS EXENTAS INTERNAS',
      'IMPORTACIONES E INTERNACIONES EXENTAS',
      'COMPRAS INTERNAS GRAVADAS',
      'IMPORTACIONES E INTERNACIONES GRAVADAS',
      'CRÉDITO FISCAL',
      'ANTICIPO A CUENTA IVA PERCIBIDO',
      'TOTAL DE COMPRAS',
      'COMPRAS AS SUJETOS EXCLUIDOS'
    ];

    const headerRow = worksheet.addRow(tableHeaders);


    // Style table headers
    headerRow.eachCell((cell) => {
      cell.style = {
        font: {
          bold: true,
          color: { argb: 'FFFFFFFF' },
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        },
        border: {
          top: { style: 'medium', color: { argb: 'FF000000' } },
          left: { style: 'medium', color: { argb: 'FF000000' } },
          bottom: { style: 'medium', color: { argb: 'FF000000' } },
          right: { style: 'medium', color: { argb: 'FF000000' } },
        },
      };
    });

    // Add data rows
    transformedData.forEach((rowData) => {
      const row = worksheet.addRow(Object.values(rowData));
      row.eachCell((cell) => {
        cell.style = {
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
          },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
        };
      });
    });

    // Add empty row before summary
    // Calculate totals
    const totals = calculateTotalsCompras(transformedData);

    // Add summary section
    const summaryRows = [ /* Total agravado */
      ['', '', '', '', 'TOTAL', totals.totalCompras, totals.importacionesEx, totals.totalAgravado, totals.importacionesAg, totals.iva, totals.anticipo, totals.grantotal, totals.sujetosExcluidos]
    ];

    const summaryStartRow = worksheet.rowCount + 1;

    // Add and style summary rows
    summaryRows.forEach((row, index) => {
      const summaryRow = worksheet.addRow(row);
      // Apply styles to cells
      summaryRow.eachCell((cell, colNumber) => {
        let borderStyle = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };

        // Add thick border for periphery
        if (index === 0) {
          borderStyle.top.style = 'medium';
        }
        if (index === summaryRows.length - 1) {
          borderStyle.bottom.style = 'medium';
        }
        if (colNumber === 2) {
          borderStyle.left.style = 'medium';
        }
        if (colNumber === 9) {
          borderStyle.right.style = 'medium';
        }
        cell.style = {
          font: {
            bold: index === 0 || colNumber === 2,
            size: index === 0 ? 12 : 11,
          },
          alignment: {
            horizontal: index === 0 ? 'center' : (colNumber === 2 ? 'left' : (colNumber === 3 ? 'right' : 'center')),
            vertical: 'middle',
          },
          border: borderStyle
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
      { width: 14 }
    ];



    // Generate and save the file
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Libro de Compras ${startDate} - ${endDate}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Libro de Compras creado con éxito");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Error al crear el Libro de Compras");
    }
  }



  const anexoCompras = async () => {
    const data = await PlantillaAPI.getcompras(user_id, token, startDate, endDate);
    console.log(data);

    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Compras");
      return;
    }


    const transformedData = data.map(item => ({
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'CLASE DE DOCUMENTO': "4",
      'TIPO DE DOCUMENTO': item.tipo,
      'NÚMERO DE DOCUMENTO': item.codigo_de_generacion,
      'NIT O NRC DEL PROVEEDOR': item.em_nit || item.em_nit,
      'NOMBRE DEL PROVEEDOR': item.em_name,
      'COMPRAS INTERNAS EXENTAS': 0,
      'INTERNACIONES EXENTAS Y/O NO SUJETAS': 0,
      'IMPORTACIONES EXENTAS Y/O NO SUJETAS': 0,
      'COMPRAS INTERNAS GRAVADAS': item.total_agravada || 0,
      'INTERNACIONES GRAVADAS DE BIENES': 0,
      'IMPORTACIONES GRAVADAS DE BIENES': 0,
      'IMPORTACIONES GRAVADAS DE SERVICIOS': 0,
      'CRÉDITO FISCAL': item.iva_percibido,
      'TOTAL DE COMPRAS': item.total_a_pagar,
      'DUI DEL PROVEEDOR': '',
      'TIPO DE OPERACIÓN (Renta)': '1',
      'CLASIFICACIÓN (Renta)': '2',
      'SECTOR (Renta)': '2',
      'TIPO DE COSTO/GASTO (Renta)': '3',
      'NÚMERO DEL ANEXO': '3'
    }));

    // Filter and order data by date
    transformedData.sort((a, b) => new Date(a['FECHA DE EMISIÓN DEL DOCUMENTO']) - new Date(b['FECHA DE EMISIÓN DEL DOCUMENTO']));

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet without headers
    const ws = XLSX.utils.json_to_sheet(transformedData, { skipHeader: true });

    // Set column widths for better readability
    const colWidths = Array(21).fill({ wch: 20 }); // Set width of 20 for all 21 columns
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Generate CSV file with current date
    const date = new Date().toISOString().split('T')[0];
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ';' });

    // Create a Blob from the CSV and save it
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Anexo Compras ${startDate} - ${endDate}.csv`;
    link.click();

    toast.success("Anexo de Compras creado con éxito");
  }
  /* ------------------------Buys-------------------------- */


  /* ------------------------CF-------------------------- */

  const calculateTotalsContribuyentes = (data) => {
    return data.reduce((acc, row) => {
      return {
        sujetas: acc.sujetas + Number(row['DÉBITO FISCAL'] || 0),
        exentas: acc.exentas + Number((row['VENTAS EXENTAS'] || 0)),
        locales: acc.locales + Number(row['VENTAS INTERNAS GRAVADAS'] || 0),
        exportaciones: acc.exportaciones + Number(row['VENTAS EXENTAS A CUENTA DE TERCERO'] || 0),
        iva: acc.iva + Number(row['IVA PERCIBIDO'] || 0),
        retencion: acc.retencion + Number(row['RETENCION'] || 0),
        grantotal: acc.grantotal + Number(row['TOTAL'] || 0),
      };
    }, {
      sujetas: 0,
      exentas: 0,
      locales: 0,
      exportaciones: 0,
      iva: 0,
      retencion: 0,
      grantotal: 0,
    });
  };


  const LibroContribuyentes = async () => {
    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["03", "05", "06"], startDate, endDate);
    console.log(data);

    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Libro Contribuyentes");
      return;
    }

    const transformedData = data.map((item, index) => ({
      'N°': index + 1,
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'NÚMERO DE CORRELATIVO PREEIMPRESO': item.codigo_de_generacion,
      'NÚMERO DE CONTROL INTERNO SISTEMA FORMULARIO ÚNICO': item.codigo_de_generacion,
      'NOMBRE DEL CLIENTE MANDANTE O MANDATARIO': item.re_name,
      'NRC DEL CLIENTE': item.re_nrc,
      'VENTAS EXENTAS': item.totalexenta || 0,
      'VENTAS INTERNAS GRAVADAS': item.total_agravada || 0,
      'DÉBITO FISCAL': 0,
      'VENTAS EXENTAS A CUENTA DE TERCEROS': 0,
      'VENTAS INTERNAS GRAVADAS A CUENTA DE TERCEROS': 0,
      'DEBITO FISCAL POR CUENTA DE TERCEROS': 0,
      'IVA PERCIBIDO': item.tributocf.split('|')[2] || 0,
      'RETENCION': item.retencion_de_renta || 0,
      'TOTAL': item.total_a_pagar
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Libro de Contribuyentes');

    // Add header rows
    const headerRows = [
      ['LIBRO DE IVA VENTAS CONTRIBUYENTES'],
      [`${user.name}`],
      [`Fecha: ${startDate} al ${endDate}`],
      [`NRC: ${user.nrc}`],
      [''], // Empty row for spacing
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
            name: 'Arial',
          },
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
          },
        };
      } else {
        cell.style = {
          font: {
            bold: false,
            size: 13,
            name: 'Arial',
          },
          alignment: {
            horizontal: 'left',
            vertical: 'middle',
            wrapText: true,
          },
        };
      }


      excelRow.height = index === 0 ? 30 : 25;
    });

    const tableHeaders = [
      'N°',
      'FECHA DE EMISIÓN DEL DOCUMENTO',
      'NÚMERO DE CORRELATIVO PREEIMPRESO',
      'NÚMERO DE CONTROL INTERNO SISTEMA FORMULARIO ÚNICO',
      'NOMBRE DEL CLIENTE MANDANTE O MANDATARIO',
      'NRC DEL CLIENTE',
      'VENTAS EXENTAS',
      'VENTAS INTERNAS GRAVADAS',
      'DÉBITO FISCAL',
      'VENTAS EXENTAS A CUENTA DE TERCEROS',
      'VENTAS INTERNAS GRAVADAS A CUENTA DE TERCEROS',
      'DEBITO FISCAL POR CUENTA DE TERCEROS',
      'IVA PERCIBIDO',
      'RETENCION',
      'TOTAL'
    ];

    const headerRow = worksheet.addRow(tableHeaders);

    // Style table headers
    headerRow.eachCell((cell) => {
      cell.style = {
        font: {
          bold: true,
          color: { argb: 'FFFFFFFF' },
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        },
        border: {
          top: { style: 'medium', color: { argb: 'FF000000' } },
          left: { style: 'medium', color: { argb: 'FF000000' } },
          bottom: { style: 'medium', color: { argb: 'FF000000' } },
          right: { style: 'medium', color: { argb: 'FF000000' } },
        },
      };
    });

    transformedData.forEach((rowData) => {
      const row = worksheet.addRow(Object.values(rowData));
      row.eachCell((cell) => {
        cell.style = {
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
          },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
        };
      });
    });


    // Add empty row before summary
    // Calculate totals
    const totals = calculateTotalsContribuyentes(transformedData);

    // Add summary section
    const summaryRows = [ /* Total agravado */
      ['', '', '', '', '', 'TOTAL', totals.sujetas, totals.locales, totals.exportaciones,'0','0','0', totals.iva, totals.retencion, totals.grantotal]
    ];

    // Add and style summary rows
    summaryRows.forEach((row, index) => {
      const summaryRow = worksheet.addRow(row);
      // Apply styles to cells
      summaryRow.eachCell((cell, colNumber) => {
        if (colNumber > 5) {
        let borderStyle = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };

        // Add thick border for periphery
        if (index === 0) {
          borderStyle.top.style = 'medium';
        }
        if (index === summaryRows.length - 1) {
          borderStyle.bottom.style = 'medium';
        }
        if (colNumber === 2) {
          borderStyle.left.style = 'medium';
        }
        if (colNumber === 9) {
          borderStyle.right.style = 'medium';
        }
        cell.style = {
          font: {
            bold: index === 0 || colNumber === 2,
            size: index === 0 ? 12 : 11,
          },
          alignment: {
            horizontal: index === 0 ? 'center' : (colNumber === 2 ? 'left' : (colNumber === 3 ? 'right' : 'center')),
            vertical: 'middle',
          },
          border: borderStyle
        };
      }
      });

      // Set row height
      summaryRow.height = 25;
    });

    /* Adding the new table */

    const dataCFinal = await PlantillaAPI.getbytypeandid(user_id, token, ["01"], startDate, endDate);
    console.log("dataCFinal");
    console.log(dataCFinal);

    const datapresentation = dataCFinal.reduce((acc, item) => {
      return {
        totalexenta: acc.totalexenta + Number(item.totalexenta || 0),
        total_agravada: acc.total_agravada + Number(item.total_agravada || 0),
        iva_percibido: acc.iva_percibido + Number(item.iva_percibido || 0),
        retencion_de_renta: acc.retencion_de_renta + Number(item.retencion_de_renta || 0),
        montototaloperacion: acc.montototaloperacion + Number(item.montototaloperacion || 0)
      };
    }, {
      totalexenta: 0,
      total_agravada: 0,
      iva_percibido: 0,
      retencion_de_renta: 0,
      montototaloperacion: 0
    });

    const summarybooks = [ /* Total agravado */
      ['', '', '', '', 'No Sujetas', 'Exentas', 'Agravadas','Exportaciones','IVA','Retencion', 'Total'],
      ['', '', '', 'Libro de Credito Fiscal', totals.sujetas, '0', totals.locales, totals.exportaciones, totals.iva, totals.retencion, totals.grantotal],
      ['', '', '', 'Libro de Consumidor Final', '0', datapresentation.totalexenta, datapresentation.total_agravada,'0',datapresentation.iva_percibido,datapresentation.retencion_de_renta, datapresentation.montototaloperacion],
      ['', '', '', 'Facturas de Exportación', '0', '0', '0','0','0','0', '0'],
      ['', '', '', 'Total','0' , Number(datapresentation.totalexenta), totals.locales + datapresentation.total_agravada,'0',(totals.iva + datapresentation.iva_percibido),(totals.retencion + datapresentation.retencion_de_renta), (datapresentation.montototaloperacion + totals.grantotal)],
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
        if (colNumber > 3) { // Only style columns B and onwards
          let borderStyle = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };

          // Add thick border for periphery
          if (index === 0) {
            borderStyle.top.style = 'medium';
          }
          if (index === summarybooks.length - 1) {
            borderStyle.bottom.style = 'medium';
          }
          if (colNumber === 2) {
            borderStyle.left.style = 'medium';
          }
          if (colNumber === 9) {
            borderStyle.right.style = 'medium';
          }

          cell.style = {
            font: {
              bold: index === 0 || colNumber === 2,
              size: index === 0 ? 12 : 11,
            },
            alignment: {
              horizontal: index === 0 ? 'center' : (colNumber === 2 ? 'left' : (colNumber === 3 ? 'right' : 'center')),
              vertical: 'middle',
            },
            border: borderStyle
          };
        }
      });

      // Set row height
      summaryRow.height = 25;
    });



    // Set column widths for better readability
    worksheet.columns = [
      { width: 5 },  // N°
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
      { width: 15 },  // Retencion
      { width: 15 }  // TOTAL
    ];

    // Generate and save the file
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Libro de Contribuyentes ${startDate} - ${endDate} -${user.name}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Libro de Contribuyentes creado con éxito");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Error al crear el Libro de Contribuyentes");
    }

  }

  const anexoCF = async () => {

    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["03", "05", "06"], startDate, endDate);
    console.log(data);

    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Contribuyentes");
      return;
    }


    const transformedData = data.map(item => ({
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'CLASE DE DOCUMENTO': 4,
      'TIPO DE DOCUMENTO': item.tipo,
      'NUMERO DE RESOLUCIÓN': item.numero_de_control, // Add if available in your data
      'SERIE DEL DOCUMENTO': item.sello_de_recepcion,
      'NÚMERO DE DOCUMENTO': item.codigo_de_generacion,
      'NÚMERO DE CONTROL INTERNO': 0,
      'NIT O NRC DEL CLIENTE': item.re_nit,
      'NOMBRE RAZÓN SOCIAL O DENOMINACIÓN': item.re_name,
      'VENTAS EXENTAS': item.totalexenta || 0,
      'VENTAS NO SUJETAS': item.totalnosuj || 0,
      'VENTAS GRAVADAS LOCALES': item.total_agravada || 0,
      'DEBITO FISCAL': item.tributocf ? item.tributocf.split('|')[2] : 0,
      'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS': item.ventatercero || 0,
      'DEBITO FISCAL POR VENTAS A CUENTA DE TERCEROS': 0, // Add if available in your data
      'TOTAL DE VENTAS': item.total_a_pagar,
      'NUMERO DE DUI DEL CLIENTE': '', // Add if available in your data
      'NÚMERO DEL ANEXO': "1" // Add if available in your data
    }));
    transformedData.sort((a, b) => new Date(a['FECHA DE EMISIÓN DEL DOCUMENTO']) - new Date(b['FECHA DE EMISIÓN DEL DOCUMENTO']));

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet without headers
    const ws = XLSX.utils.json_to_sheet(transformedData, { skipHeader: true });

    // Set column widths for better readability
    const colWidths = Array(21).fill({ wch: 20 }); // Set width of 20 for all 21 columns
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Generate CSV file with current date
    const date = new Date().toISOString().split('T')[0];
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ';' });

    // Create a Blob from the CSV and save it
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Anexo ventas contribuyente ${startDate} - ${endDate}.csv`;
    link.click();

    toast.success("Anexo de contribuyentes creado con éxito");
  }
  /* ------------------------CF-------------------------- */


  /* ------------------------Bill-------------------------- */

  const LibroConsumidorFinal = async () => {
    // Get and transform data
    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["01"], startDate, endDate);
    console.log(data);
    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Libro Consumidor final");
      return;
    }
    const transformedData = transformData(data);
    console.log(transformedData);

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Libro de Ventas');

    // Add header rows
    const headerRows = [
      ['LIBRO DE IVA VENTAS CONSUMIDOR FINAL'],
      [`${user.name}`],
      [`Fecha: ${startDate} al ${endDate}`],
      [`NRC: ${user.nrc}`],
      [''], // Empty row for spacing
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
            name: 'Arial',
          },
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
          },
        };
      } else {
        cell.style = {
          font: {
            bold: false,
            size: 13,
            name: 'Arial',
          },
          alignment: {
            horizontal: 'left',
            vertical: 'middle',
            wrapText: true,
          },
        };
      }

      // Set row height
      excelRow.height = index === 0 ? 30 : 25;
    });

    // Add table headers
    const tableHeaders = [
      'DÍA',
      'DOCUMENTO EMITIDO (DEL)',
      'DOCUMENTO EMITIDO (AL)',
      'N° DE CAJA O SISTEMA COMPUTARIZADO',
      'VENTAS EXENTAS',
      'VENTAS INTERNAS GRAVADAS',
      'EXPORTACIONES',
      'TOTAL DE VENTAS DIARIAS PROPIAS',
      'VENTAS A CUENTAS DE TERCEROS'
    ];

    const headerRow = worksheet.addRow(tableHeaders);

    // Style table headers
    headerRow.eachCell((cell) => {
      cell.style = {
        font: {
          bold: true,
          color: { argb: 'FFFFFFFF' },
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        },
        border: {
          top: { style: 'medium', color: { argb: 'FF000000' } },
          left: { style: 'medium', color: { argb: 'FF000000' } },
          bottom: { style: 'medium', color: { argb: 'FF000000' } },
          right: { style: 'medium', color: { argb: 'FF000000' } },
        },
      };
    });
    /* order transformeddata by days using day number and day column*/
    transformedData.sort((a, b) => a['DÍA'] - b['DÍA']);

    // Add data rows
    transformedData.forEach((rowData) => {
      const row = worksheet.addRow(Object.values(rowData));
      row.eachCell((cell) => {
        cell.style = {
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
          },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
        };
      });
    });

    // Add empty row before summary
    worksheet.addRow([]);

    // Calculate totals
    const totals = calculateTotals(transformedData);

    // Add summary section
    const summaryRows = [ /* Total agravado */
      ['', 'Resumen de Operaciones', ''],
      ['', 'Iva Retenido', totals.ivaRetenido],
      ['', 'Total Ventas agravado', totals.totalVentas],
      ['', 'Ventas Exentas', totals.ventasExentas],
      ['', 'Ventas al Exterior', totals.ventasExterior],
      ['', 'Total Ventas', totals.granTotal]
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
        if (colNumber >= 2) { // Only style columns B and onwards
          let borderStyle = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };

          // Add thick border for periphery
          if (index === 0) {
            borderStyle.top.style = 'medium';
          }
          if (index === summaryRows.length - 1) {
            borderStyle.bottom.style = 'medium';
          }
          if (colNumber === 2) {
            borderStyle.left.style = 'medium';
          }
          if (colNumber === 9) {
            borderStyle.right.style = 'medium';
          }

          cell.style = {
            font: {
              bold: index === 0 || colNumber === 2,
              size: index === 0 ? 12 : 11,
            },
            alignment: {
              horizontal: index === 0 ? 'center' : (colNumber === 2 ? 'left' : (colNumber === 3 ? 'right' : 'center')),
              vertical: 'middle',
            },
            border: borderStyle
          };
        }
      });

      // Set row height
      summaryRow.height = 25;
    });



    // Set column widths
    worksheet.columns = [
      { width: 12 },  // DÍA
      { width: 32 },  // DOCUMENTO DEL
      { width: 32 },  // DOCUMENTO AL
      { width: 34 },  // N° DE CAJA
      { width: 15 },  // VENTAS EXENTAS
      { width: 15 },  // VENTAS GRAVADAS
      { width: 15 },  // EXPORTACIONES
      { width: 30 },  // TOTAL VENTAS
      { width: 30 }   // VENTAS TERCEROS
    ];

    // Generate and save the file
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
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
    return data.reduce((acc, row) => {
      return {
        ventasNetas: acc.ventasNetas + (row['VENTAS INTERNAS GRAVADAS'] || 0),
        ivaDebito: acc.ivaDebito + ((row['VENTAS INTERNAS GRAVADAS'] || 0)),
        ivaRetenido: acc.ivaRetenido + (row['IVA RETENIDO'] || 0),
        totalVentas: acc.totalVentas + (row['VENTAS INTERNAS GRAVADAS'] || 0),
        ventasExentas: acc.ventasExentas + (row['VENTAS EXENTAS'] || 0),
        ventasExterior: acc.ventasExterior + (row['EXPORTACIONES'] || 0),
        granTotal: acc.granTotal + (row['TOTAL DE VENTAS DIARIAS PROPIAS'] || 0) +
          (row['VENTAS A CUENTAS DE TERCEROS'] || 0)
      };
    }, {
      ventasNetas: 0,
      ivaDebito: 0,
      ivaRetenido: 0,
      totalVentas: 0,
      ventasExentas: 0,
      ventasExterior: 0,
      granTotal: 0
    });
  };



  // Keep your existing transformData function
  const transformData = (data) => {
    // Comparador robusto para números de control: intenta comparar por número al final; fallback a comparación natural
    const compareControl = (a, b) => {
      const sa = String(a ?? '');
      const sb = String(b ?? '');
      if (sa === sb) return 0;
      const ma = sa.match(/(\d+)/g);
      const mb = sb.match(/(\d+)/g);
      if (ma && mb) {
        const na = parseInt(ma[ma.length - 1], 10);
        const nb = parseInt(mb[mb.length - 1], 10);
        if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
      }
      return sa.localeCompare(sb, undefined, { numeric: true, sensitivity: 'base' });
    };

    const groupedData = data.reduce((acc, item) => {
      // data = "2025-01-31" -> tomar el día
      const day = item.fecha_y_hora_de_generacion.split('-')[2].split('T')[0];
      if (!acc[day]) {
        const base = {
          'DÍA': day,
          'DOCUMENTO EMITIDO (DEL)': item.numero_de_control,
          'DOCUMENTO EMITIDO (AL)': item.numero_de_control,
          'N° DE CAJA O SISTEMA COMPUTARIZADO': "1",
          'VENTAS EXENTAS': 0,
          'VENTAS INTERNAS GRAVADAS': 0,
          'EXPORTACIONES': 0,
          'TOTAL DE VENTAS DIARIAS PROPIAS': 0,
          'VENTAS A CUENTAS DE TERCEROS': 0
        };
        // Guardar min/max como propiedades NO enumerables para no afectar el orden de columnas
        Object.defineProperty(base, '_minDoc', { value: item.numero_de_control, writable: true, enumerable: false });
        Object.defineProperty(base, '_maxDoc', { value: item.numero_de_control, writable: true, enumerable: false });
        acc[day] = base;
      } else {
        const curr = item.numero_de_control;
        if (curr != null) {
          if (compareControl(curr, acc[day]._minDoc) < 0) acc[day]._minDoc = curr;
          if (compareControl(curr, acc[day]._maxDoc) > 0) acc[day]._maxDoc = curr;
          acc[day]['DOCUMENTO EMITIDO (DEL)'] = acc[day]._minDoc;
          acc[day]['DOCUMENTO EMITIDO (AL)'] = acc[day]._maxDoc;
        }
      }
      acc[day]['VENTAS EXENTAS'] += Number(item.totalexenta) || 0;
      acc[day]['VENTAS INTERNAS GRAVADAS'] += Number(item.total_agravada) || 0;
      acc[day]['TOTAL DE VENTAS DIARIAS PROPIAS'] += Number(item.total_a_pagar) || 0;
      acc[day]['VENTAS A CUENTAS DE TERCEROS'] += Number(item.ventatercero) || 0;

      return acc;
    }, {});

    return Object.values(groupedData);
  };


  const anexoBill = async () => {
    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["01"], startDate, endDate);
    console.log(data);

    if (!data.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Consumidor final");
      return;
    }
    // Transform the data to match the required structure
    console.log("data");
    console.log(data);

    
    const transformedData = data.map(item => {

      
      let operation = "1"; /* Gravadas */
      if (item.totalexenta != 0){
        operation = "2"; /* Exentas */
      }
      const datatranform = {
        'FECHA DE EMISIÓN': item.fecha_y_hora_de_generacion,
        'CLASE DE DOCUMENTO': 4,
        'TIPO DE DOCUMENTO': 1,
        'NÚMERO DE RESOLUCIÓN': item.numero_de_control,
        'SERIE DEL DOCUMENTO': item.sello_de_recepcion,/* DSAF */
        'NUMERO DE CONTROL INTERNO DEL': item.codigo_de_generacion,
        'NUMERO DE CONTROL INTERNO AL': item.codigo_de_generacion,
        'NÚMERO DE DOCUMENTO (DEL)': item.codigo_de_generacion,
        'NÚMERO DE DOCUMENTO (AL)': item.codigo_de_generacion,
        'NÚMERO DE MAQUINA REGISTRADORA': '',
        'VENTAS EXENTAS': item.totalexenta || 0,
        'VENTAS INTERNAS EXENTAS NO SUJETAS A PROPORCIONALIDAD': 0,
        'VENTAS NO SUJETAS': item.totalnosuj || 0,
        'VENTAS GRAVADAS LOCALES': item.total_agravada || 0,
        'EXPORTACIONES DENTRO DEL ÁREA DE CENTROAMÉRICA': 0,
        'EXPORTACIONES FUERA DEL ÁREA DE CENTROAMÉRICA': 0,
        'EXPORTACIONES DE SERVICIO': 0,
        'VENTAS A ZONAS FRANCAS  Y DPA (TASA CERO)': 0,
        'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS': 0,
        'TOTAL DE VENTAS': item.total_a_pagar,
        'TIPO DE OPERACIÓN (RENTA)': operation,
        'TIPO DE INGRESO (RENTA)': "1", 
        'NÚMERO DEL ANEXO': '2'
      }
      return datatranform;
    });

    /* filtering and ordering data by date */
    transformedData.sort((a, b) => new Date(a['FECHA DE EMISIÓN']) - new Date(b['FECHA DE EMISIÓN']));


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
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Generate CSV file with current date
    const date = new Date().toISOString().split('T')[0];
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ';' });

    // Create a Blob from the CSV and save it
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Anexo ventas consumidor final ${startDate} - ${endDate}.csv`;
    link.click();

    toast.success("Anexo de Consumidor final creado con éxito");
  }
  /* ------------------------Bill-------------------------- */


  return (
    <div className="min-h-screen bg-steelblue-300 flex flex-col">
      {/* Header Section */}
      <div className="fixed top-0 left-0 z-40">
        <HamburguerComponent sidebar={sidebar} visible={visible} />
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
                  onClick={() => openModal('ANEX')} 
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
                    onClick={() => openModal('RAW_FACT')}
                    className="w-full bg-blue-500/90 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Facturas (01)
                  </button>
                  <button 
                    onClick={() => openModal('RAW_CF')}
                    className="w-full bg-indigo-500/90 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Crédito Fiscal (03)
                  </button>
                  <button 
                    onClick={() => openModal('RAW_SUEX')}
                    className="w-full bg-emerald-500/90 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Sujeto Excluido (14)
                  </button>
                  <button 
                    onClick={() => openModal('RAW_NOTAS')}
                    className="w-full bg-orange-500/90 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Notas Débito/Crédito (05,06)
                  </button>
                </div>
              </div>
            </div>

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
                  onClick={() => openModal('LC')} 
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
                  onClick={() => openModal('LCF')} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  Generar Libro
                </button>
              </div>
            </div>

            {/* Libro Compras Card */}
            <div className="animate-fadeInUp animate-delay-400 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
                  onClick={() => openModal('LCOM')} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  Generar Libro
                </button>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload Card */}
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

            {/* JSON Preview Card */}
            {jsonData && (
              <div className="animate-zoomIn bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Información del JSON
                  </h3>
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
                
                <button
                  onClick={createcompras}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  💾 Guardar Factura
                </button>
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
              <h2 className="text-lg sm:text-xl font-bold">📅 Seleccionar Fechas</h2>
              <button 
                onClick={closeModal}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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