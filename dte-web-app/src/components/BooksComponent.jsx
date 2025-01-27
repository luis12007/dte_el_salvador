import React, { useState } from 'react';
import Modal from 'react-modal';
import HamburguerComponent from './HamburguerComponent';
import SidebarComponent from '../components/SideBarComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlantillaAPI from '../services/PlantillaService';
import * as XLSX from 'xlsx';


const BooksComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visible, setVisible] = useState(true);
  const [book, setBook] = useState("");
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [jsonData, setJsonData] = useState(null);

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
    if(book === "LC") {
      console.log("Libros de Contribuyentes");
      LibroContribuyentes();
    }
    if(book === "LCF") {
      console.log("Libros de Consumidor Final");
      LibroConsumidorFinal(); 
    }
    if(book === "LCOM") {
      console.log("Libros de Compras");
      LibroCompras();
    }

    closeModal();
  };



  const anexoSuex = () => {
    toast.success("Anexo de factura creado con éxito");
  }

  /* ------------------------Buys-------------------------- */

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        setJsonData(json);
        toast.success("JSON file uploaded successfully");
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
    toast.success("Compras created successfully");
  };


  const LibroCompras = async () => {
    const data = await PlantillaAPI.getcompras(user_id, token, startDate, endDate);
    console.log(data);
    anexoCompras(data);

    const transformedData = data.map((item, index) => ({
      'N°': index + 1,
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'NÚMERO DE DOCUMENTO': item.numero_de_control,
      'NÚMERO DE REGISTRO DEL CONTRIBUYENTE': item.re_nrc,
      'NOMBRE DEL PROVEEDOR': item.re_name,
      'COMPRAS EXENTAS INTERNAS': 0,
      'IMPORTACIONES E INTERNACIONES EXENTAS': 0,
      'COMPRAS INTERNAS GRAVADAS': item.total_agravada || 0,
      'IMPORTACIONES E INTERNACIONES GRAVADAS': 0,
      'CRÉDITO FISCAL': item.tributocf ? item.tributocf.split('|')[2] : 0,
      'ANTICIPO A CUENTA IVA PERCIBIDO': item.iva_percibido || 0,
      'TOTAL DE COMPRAS': item.total_a_pagar,
      'COMPRAS AS SUJETOS EXCLUIDOS': 0
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet with headers
    const ws = XLSX.utils.json_to_sheet(transformedData, {
      header: [
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
      ]
    });

    // Set column widths for better readability
    const colWidths = [
      { wch: 5 },  // N°
      { wch: 20 }, // FECHA
      { wch: 20 }, // NÚMERO DOCUMENTO
      { wch: 25 }, // NÚMERO REGISTRO
      { wch: 30 }, // NOMBRE
      { wch: 20 }, // COMPRAS EXENTAS
      { wch: 25 }, // IMPORTACIONES EXENTAS
      { wch: 20 }, // COMPRAS GRAVADAS
      { wch: 25 }, // IMPORTACIONES GRAVADAS
      { wch: 15 }, // CRÉDITO FISCAL
      { wch: 25 }, // IVA PERCIBIDO
      { wch: 15 }, // TOTAL
      { wch: 25 }  // SUJETOS EXCLUIDOS
    ];
    ws['!cols'] = colWidths;

    // Format numbers to display with 2 decimal places
    for (let cell in ws) {
      if (cell[0] === '!') continue;
      if (typeof ws[cell].v === 'number' && cell !== 'A1') { // Skip the N° column
        ws[cell].z = '#,##0.00';
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Compras');

    // Generate Excel file with current date
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Libro de compras ${startDate} = ${endDate}.xlsx`);
    toast.success("Anexo de factura creado con éxito");
  }

  const anexoCompras = (data) => {

    const transformedData = data.map(item => ({
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'CLASE DE DOCUMENTO': item.tipo,
      'TIPO DE DOCUMENTO': item.modelo_de_factura,
      'NÚMERO DE DOCUMENTO': item.numero_de_control,
      'NIT O NRC DEL PROVEEDOR': item.re_nit || item.re_nrc,
      'NOMBRE DEL PROVEEDOR': item.re_name,
      'COMPRAS INTERNAS EXENTAS': 0,
      'INTERNACIONES EXENTAS Y/O NO SUJETAS': 0,
      'IMPORTACIONES EXENTAS Y/O NO SUJETAS': 0,
      'COMPRAS INTERNAS GRAVADAS': item.total_agravada || 0,
      'INTERNACIONES GRAVADAS DE BIENES': 0,
      'IMPORTACIONES GRAVADAS DE BIENES': 0,
      'IMPORTACIONES GRAVADAS DE SERVICIOS': 0,
      'CRÉDITO FISCAL': item.tributocf ? item.tributocf.split('|')[2] : 0,
      'TOTAL DE COMPRAS': item.total_a_pagar,
      'DUI DEL PROVEEDOR': '',
      'TIPO DE OPERACIÓN (Renta)': '',
      'CLASIFICACIÓN (Renta)': '',
      'SECTOR (Renta)': '',
      'TIPO DE COSTO/GASTO (Renta)': '',
      'NÚMERO DEL ANEXO': ''
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet without headers
    const ws = XLSX.utils.json_to_sheet(transformedData, { 
      skipHeader: true 
    });

    // Set column widths for better readability
    const colWidths = [
      { wch: 20 }, // FECHA
      { wch: 15 }, // CLASE
      { wch: 15 }, // TIPO
      { wch: 20 }, // NÚMERO
      { wch: 20 }, // NIT/NRC
      { wch: 30 }, // NOMBRE
      { wch: 20 }, // COMPRAS EXENTAS
      { wch: 25 }, // INTERNACIONES EXENTAS
      { wch: 25 }, // IMPORTACIONES EXENTAS
      { wch: 20 }, // COMPRAS GRAVADAS
      { wch: 25 }, // INTERNACIONES GRAVADAS
      { wch: 25 }, // IMPORTACIONES GRAVADAS BIENES
      { wch: 25 }, // IMPORTACIONES GRAVADAS SERVICIOS
      { wch: 15 }, // CRÉDITO FISCAL
      { wch: 15 }, // TOTAL
      { wch: 20 }, // DUI
      { wch: 20 }, // TIPO OPERACIÓN
      { wch: 20 }, // CLASIFICACIÓN
      { wch: 20 }, // SECTOR
      { wch: 20 }, // TIPO COSTO/GASTO
      { wch: 15 }  // NÚMERO ANEXO
    ];
    ws['!cols'] = colWidths;

    // Format numbers to display with 2 decimal places
    for (let cell in ws) {
      if (cell[0] === '!') continue;
      if (typeof ws[cell].v === 'number') {
        ws[cell].z = '#,##0.00';
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Compras');

    // Generate Excel file with current date
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Anexo compras ${startDate} = ${endDate}.xlsx`);
    toast.success("Anexo de factura creado con éxito");
  }
  /* ------------------------Buys-------------------------- */


  /* ------------------------CF-------------------------- */
  const LibroContribuyentes = async ()  => {
    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["03", "05", "06"] , startDate, endDate);
    console.log(data);
    anexoCF(data);

    const transformedData = data.map((item, index) => ({
      'N°': index + 1,
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'NÚMERO DE CORRELATIVO PREEIMPRESO': item.numero_de_control,
      'NÚMERO DE CONTROL INTERNO SISTEMA FORMULARIO ÚNICO': item.codigo_de_generacion,
      'NOMBRE DEL CLIENTE MANDANTE O MANDATARIO': item.re_name,
      'NRC DEL CLIENTE': item.re_nrc,
      'VENTAS EXENTAS': item.totalexenta || 0,
      'VENTAS INTERNAS GRAVADAS': item.total_agravada || 0,
      'DEÉBITO FISCAL': item.tributocf ? item.tributocf.split('|')[2] : 0,
      'VENTAS EXENTAS A CUENTA DE TERCEROS': 0, // Add if available in your data
      'VENTAS INTERNAS GRAVADAS A CUENTA DE TERCEROS': item.ventatercero || 0,
      'DEBITO FISCAL POR CUENTA DE TERCEROS': 0, // Add if available in your data
      'IVA PERCIBIDO': item.iva_percibido || 0,
      'TOTAL': item.total_a_pagar
    }));

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(transformedData, {
      header: [
        'N°',
        'FECHA DE EMISIÓN DEL DOCUMENTO',
        'NÚMERO DE CORRELATIVO PREEIMPRESO',
        'NÚMERO DE CONTROL INTERNO SISTEMA FORMULARIO ÚNICO',
        'NOMBRE DEL CLIENTE MANDANTE O MANDATARIO',
        'NRC DEL CLIENTE',
        'VENTAS EXENTAS',
        'VENTAS INTERNAS GRAVADAS',
        'DEÉBITO FISCAL',
        'VENTAS EXENTAS A CUENTA DE TERCEROS',
        'VENTAS INTERNAS GRAVADAS A CUENTA DE TERCEROS',
        'DEBITO FISCAL POR CUENTA DE TERCEROS',
        'IVA PERCIBIDO',
        'TOTAL'
      ]
    });

    // Set column widths for better readability
    const colWidths = [
      { wch: 5 },  // N°
      { wch: 20 }, // FECHA
      { wch: 25 }, // CORRELATIVO
      { wch: 30 }, // CONTROL INTERNO
      { wch: 40 }, // NOMBRE
      { wch: 15 }, // NRC
      { wch: 15 }, // VENTAS EXENTAS
      { wch: 20 }, // VENTAS GRAVADAS
      { wch: 15 }, // DEBITO
      { wch: 25 }, // VENTAS EXENTAS TERCEROS
      { wch: 30 }, // VENTAS GRAVADAS TERCEROS
      { wch: 25 }, // DEBITO TERCEROS
      { wch: 15 }, // IVA
      { wch: 15 }  // TOTAL
    ];
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Ventas');

    // Generate Excel file with the current date in the filename
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Libro de ventas ${startDate} - ${endDate}.xlsx`);
    toast.success("Libro de contribuyentes creado con éxito");

  }
  const anexoCF = (data) => {
    const transformedData = data.map(item => ({
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'CLASE DE DOCUMENTO': item.tipo,
      'TIPO DE DOCUMENTO': item.modelo_de_factura,
      'NUMERO DE RESOLUCIÓN': '', // Add if available in your data
      'SERIE DEL DOCUMENTO': item.codigo_de_generacion,
      'NÚMERO DE DOCUMENTO': item.numero_de_control,
      'NÚMERO DE CONTROL INTERNO': item.numero_de_control,
      'NIT O NRC DEL CLIENTE': item.re_nrc,
      'NOMBRE RAZÓN SOCIAL O DENOMINACIÓN': item.re_name,
      'VENTAS EXENTAS': item.totalexenta || 0,
      'VENTAS NO SUJETAS': item.totalnosuj || 0,
      'VENTAS GRAVADAS LOCALES': item.total_agravada || 0,
      'DEBITO FISCAL': item.tributocf ? item.tributocf.split('|')[2] : 0,
      'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS': item.ventatercero || 0,
      'DEBITO FISCAL POR VENTAS A CUENTA DE TERCEROS': 0, // Add if available in your data
      'TOTAL DE VENTAS': item.total_a_pagar,
      'NUMERO DE DUI DEL CLIENTE': '', // Add if available in your data
      'NÚMERO DEL ANEXO': '' // Add if available in your data
    }));

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(transformedData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Generate Excel file
    XLSX.writeFile(wb, 'Anexo de ventas a contribuyentes.xlsx');

    toast.success("Anexo de factura creado con éxito");
  }
  /* ------------------------CF-------------------------- */



  /* ------------------------Bill-------------------------- */

  const LibroConsumidorFinal = async () => {
    const data = await PlantillaAPI.getbytypeandid(user_id, token, ["01"] , startDate, endDate);
    console.log(data);
    anexoBill(data);

    const transformedData = data.map(item => {
      // Extract day from the date
      const day = new Date(item.fecha_y_hora_de_generacion).getDate();
      
      return {
        'DÍA': day,
        'DOCMENTO EMITIDO (DEL)': item.numero_de_control,
        'DOCUMENTO EMITIDO (AL)': item.numero_de_control,
        'N° DE CAJA O SISTEMA COMPUTARIZADO': '1', // Adjust as needed
        'VENTAS EXENTAS': item.totalexenta || 0,
        'VENTAS INTERNAS GRAVADAS': item.total_agravada || 0,
        'EXPORTACIONES': 0, // Add if available in your data
        'TOTAL DE VENTAS DIARIAS PROPIAS': item.total_a_pagar,
        'VENTAS A CUENTAS DE TERCEROS': item.ventatercero || 0
      };
    });

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(transformedData, {
      header: [
        'DÍA',
        'DOCMENTO EMITIDO (DEL)',
        'DOCUMENTO EMITIDO (AL)',
        'N° DE CAJA O SISTEMA COMPUTARIZADO',
        'VENTAS EXENTAS',
        'VENTAS INTERNAS GRAVADAS',
        'EXPORTACIONES',
        'TOTAL DE VENTAS DIARIAS PROPIAS',
        'VENTAS A CUENTAS DE TERCEROS'
      ]
    });

    // Set column widths for better readability
    const colWidths = [
      { wch: 8 },  // DÍA
      { wch: 25 }, // DOCUMENTO DEL
      { wch: 25 }, // DOCUMENTO AL
      { wch: 25 }, // N° DE CAJA
      { wch: 15 }, // VENTAS EXENTAS
      { wch: 20 }, // VENTAS GRAVADAS
      { wch: 15 }, // EXPORTACIONES
      { wch: 25 }, // TOTAL VENTAS
      { wch: 25 }  // VENTAS TERCEROS
    ];
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Diario');

    // Generate Excel file with current date
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Libro de ventas consumidor final ${startDate} - ${endDate}.xlsx`);
    toast.success("Anexo de factura creado con éxito");

  }

  const anexoBill = (data) => {

    // Transform the data to match the required structure
    const transformedData = data.map(item => ({
      'FECHA DE EMISIÓN': item.fecha_y_hora_de_generacion,
      'CLASE DE DOCUMENTO': item.tipo,
      'TIPO DE DOCUMENTO': item.modelo_de_factura,
      'NÚMERO DE RESOLUCIÓN': '', // Add if available
      'SERIE DEL DOCUMENTO': item.codigo_de_generacion,
      'NUMERO DE CONTROL INTERNO DEL': item.numero_de_control,
      'NUMERO DE CONTROL INTERNO AL': item.numero_de_control,
      'NÚMERO DE DOCUMENTO (DEL)': item.id,
      'NÚMERO DE DOCUMENTO (AL)': item.id,
      'NÚMERO DE MAQUINA REGISTRADORA': '',
      'VENTAS EXENTAS': item.totalexenta || 0,
      'VENTAS INTERNAS EXENTAS NO SUJETAS A PROPORCIONALIDAD': 0,
      'VENTAS NO SUJETAS': item.totalnosuj || 0,
      'VENTAS GRAVADAS LOCALES': item.total_agravada || 0,
      'EXPORTACIONES DENTRO DEL ÁREA DE CENTROAMÉRICA': 0,
      'EXPORTACIONES FUERA DEL ÁREA DE CENTROAMÉRICA': 0,
      'EXPORTACIONES DE SERVICIO': 0,
      'VENTAS A ZONAS FRANCAS  Y DPA (TASA CERO)': 0,
      'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS': item.ventatercero || 0,
      'TOTAL DE VENTAS': item.total_a_pagar,
      'NÚMERO DEL ANEXO': ''
    }));

    // Create a new workbook
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
    XLSX.writeFile(wb, `Anexo ventas consumidor final ${startDate} - ${endDate}.xlsx`);
  toast.success("Anexo de factura creado con éxito");
}
  /* ------------------------Bill-------------------------- */


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-steelblue-300">
      <div className='absolute top-0 left-0 pt-10 ch:items-center'>
      <HamburguerComponent sidebar={sidebar} visible={visible} />
      <SidebarComponent visible={visible}  />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Libros de Contribuyentes</h2>
          <button onClick={() => openModal('LC')} className="bg-blue-500  text-white px-4 py-2 rounded">Open</button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Libros de Consumidor Final</h2>
          <button onClick={() => openModal('LCF')} className="bg-blue-500 text-white px-4 py-2 rounded">Open</button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Libros de Compras</h2>
          <button onClick={() => openModal('LCOM')} className="bg-blue-500 text-white px-4 py-2 rounded">Open</button>
        </div>
        
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Select Dates"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-lg font-bold mb-4">Select Dates</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
            <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">Download</button>
          </div>
        </div>
      </Modal>
      <div className="mt-8">
        <input type="file" accept=".json" onChange={handleFileUpload} className="mb-4" />
        <button onClick={createcompras} className="bg-green-500 text-white px-4 py-2 rounded">Create Compras</button>
      </div>
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