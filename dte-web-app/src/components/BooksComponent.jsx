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
    // Implement download logic here
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

    closeModal();
  };

  const Anexos = async () => {
    console.log("Anexos");
    anexoBill();
    anexoCF();
    anexoSuex();
    anexoCompras();
  }


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

    const summarybooks = [ /* Total agravado */
      ['', '', '', '', 'No Sujetas', 'Exentas', 'Agravadas','Exportaciones','IVA','Retencion', 'Total'],
      ['', '', '', 'Libro de Credito Fiscal', '', '', '','','','', ''],
      ['', '', '', 'Libro de Consumidor Final', '', '', '','','','', ''],
      ['', '', '', 'Facturas de Exportación', '', '', '','','','', ''],
      ['', '', '', 'Total', '', '', '','','','', ''],
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
    const groupedData = data.reduce((acc, item) => {
      /* data = "2025-01-31" chopping to have just the 31 */
      const day = item.fecha_y_hora_de_generacion.split('-')[2].split('T')[0];
      console.log("day");
      console.log(day);
      if (!acc[day]) {
        acc[day] = {
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
      } else {
        acc[day]['DOCUMENTO EMITIDO (DEL)'] = item.numero_de_control;
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
    const transformedData = data.map(item => {

      /* transforming the data from yyyy-mm-dd to dd/mm/yyyy */
      const date = new Date(item.fecha_y_hora_de_generacion);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      item.fecha_y_hora_de_generacion = `${day}/${month}/${year}`;
      console.log("data item");
      console.log(item.fecha_y_hora_de_generacion);
      const datatranform = {
        'FECHA DE EMISIÓN': item.fecha_y_hora_de_generacion,
        'CLASE DE DOCUMENTO': 4,
        'TIPO DE DOCUMENTO': 1,
        'NÚMERO DE RESOLUCIÓN': item.numero_de_control,
        'SERIE DEL DOCUMENTO': item.sello_de_recepcion,/* DSAF */
        'NUMERO DE CONTROL INTERNO DEL': "0",
        'NUMERO DE CONTROL INTERNO AL': "0",
        'NÚMERO DE DOCUMENTO (DEL)': item.codigo_de_generacion,
        'NÚMERO DE DOCUMENTO (AL)': item.codigo_de_generacion,
        'NÚMERO DE MAQUINA REGISTRADORA': '15555',
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
        'NÚMERO DEL ANEXO': '2'
      }
      return datatranform;
    });


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
    <div className="flex flex-col items-center  justify-center min-h-screen bg-steelblue-300">
      <div className='absolute top-0 left-0 pt-8 ch:items-center'>
        <HamburguerComponent sidebar={sidebar} visible={visible} />
        <SidebarComponent visible={visible} />
      </div>
      <div className="grid grid-cols-1 w-3/5 md:grid-cols-2 gap-4 pt-6">

        <div className="bg-white  p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Anexos CF, FCF, CSE, Compras</h2>
          <button onClick={() => openModal('ANEX')} className="bg-blue-500  text-white px-4 py-2 rounded">Seleccionar</button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Libros de Contribuyentes</h2>
          <button onClick={() => openModal('LC')} className="bg-blue-500  text-white px-4 py-2 rounded">Seleccionar</button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Libros de Consumidor Final</h2>
          <button onClick={() => openModal('LCF')} className="bg-blue-500 text-white px-4 py-2 rounded">Seleccionar</button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Libros de Compras</h2>
          <button onClick={() => openModal('LCOM')} className="bg-blue-500 text-white px-4 py-2 rounded">Seleccionar</button>
        </div>
        <div className="mt-3 p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center h-16">
            <h2 className="text-lg font-bold">Subir factura de compras</h2>
          </div>
          <input
            type="file"
            lang="es"
            accept=".json"
            onChange={handleFileUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />

        </div>

        {jsonData && (
          <div className="mt-3 max-w-md p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">JSON Información</h2>
            <pre className="text-lg bg-slate-300 shadow-2xl p-2 rounded-md overflow-auto max-h-64 ">
              <p><strong>Emisor: </strong> {jsonData?.emisor?.nombre ?? null}</p>
              <p><strong>Nombre comercial: </strong> {jsonData?.emisor?.nombreComercial ?? null}</p>
              <p><strong>Receptor: </strong> {jsonData?.receptor?.nombre ?? null}</p>
              <p><strong>Fecha: </strong> {jsonData?.identificacion?.fecEmi ?? null}</p>
              <p><strong>Total: </strong> {jsonData?.resumen?.montoTotalOperacion ?? null}</p>

            </pre>
            <button
              onClick={createcompras}
              className="w-full mt-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition duration-200"
            >
              Guardar Factura
            </button>
          </div>

        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Select Dates"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-4 rounded-lg shadow-lg w-3/5 ch:w-2/5">
          <h2 className="text-lg font-bold mb-4">Selecciona las fechas</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">Cerrar</button>
            <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">Descargar</button>
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