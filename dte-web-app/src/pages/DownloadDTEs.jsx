import React, { useState } from 'react';
import { toast } from 'react-toastify';
import HamburguerComponent from '../components/HamburguerComponent';
import SidebarComponent from '../components/SideBarComponent';
import PlantillaAPI from '../services/PlantillaService';
import BillsxItemsAPI from '../services/BIllxitemsService';
import UserService from '../services/UserServices';
import JSZip from 'jszip';

const DownloadDTEs = () => {
  const [tipoDte, setTipoDte] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const token = localStorage.getItem("token");
  const id_emisor = localStorage.getItem("user_id");

  const tiposDte = [
    { value: '01', label: 'Factura' },
    { value: '03', label: 'Crédito Fiscal' },
    { value: '05', label: 'Nota de Crédito' },
    { value: '06', label: 'Nota de Débito' },
    { value: '08', label: 'Comprobante de Liquidación' },
    { value: '14', label: 'Factura de Sujeto Excluido' },
  ];

  const handleDownload = async () => {
    // Validaciones
    if (!tipoDte) {
      toast.error('Por favor seleccione un tipo de DTE');
      return;
    }

    if (!fechaInicio) {
      toast.error('Por favor seleccione la fecha de inicio');
      return;
    }

    if (!fechaFin) {
      toast.error('Por favor seleccione la fecha de fin');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast.error('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    setIsDownloading(true);
    setIsLoading(true);

    try {
      // Obtener información del usuario
      const user = await UserService.getUserInfo(id_emisor, token);
      
      // Obtener DTEs por tipo y rango de fechas
      const dtes = await PlantillaAPI.getByUserIdAndRange(id_emisor, token, fechaInicio, fechaFin);
      
      if (!dtes || dtes.length === 0) {
        toast.info('No se encontraron DTEs para el período seleccionado');
        setIsDownloading(false);
        setIsLoading(false);
        return;
      }

      // Filtrar por tipo de DTE y solo los que tienen sello de recepción
      const filteredDtes = dtes.filter(dte => 
        dte.tipo === tipoDte && 
        dte.sellado === true && 
        dte.sellorecibido !== null && 
        dte.sellorecibido !== undefined
      );
      
      if (filteredDtes.length === 0) {
        toast.info(`No se encontraron DTEs sellados de tipo ${tipoDte} para el período seleccionado`);
        setIsDownloading(false);
        setIsLoading(false);
        return;
      }

      toast.info(`Descargando ${filteredDtes.length} DTEs...`);

      // Crear archivo ZIP para PDFs y JSONs
      const zipPDF = new JSZip();
      const zipJSON = new JSZip();

      // Procesar cada DTE
      for (const dte of filteredDtes) {
        try {
          // Obtener items del DTE
          const items = await BillsxItemsAPI.getlist(token, dte.codigo_de_generacion);
          
          // Construir el objeto JSON en formato para firmar
          const dteJson = await buildDTEJson(dte, user, items);
          
          // Agregar JSON al ZIP
          const jsonFileName = `${dte.codigo_de_generacion}.json`;
          zipJSON.file(jsonFileName, JSON.stringify(dteJson, null, 2));

          // Descargar PDF
          const pdfBlob = await downloadPDFAsBlob(dte.codigo_de_generacion, user, dte);
          if (pdfBlob) {
            const pdfFileName = `${dte.re_name}_${dte.codigo_de_generacion}.pdf`;
            zipPDF.file(pdfFileName, pdfBlob);
          }
        } catch (error) {
          console.error(`Error procesando DTE ${dte.codigo_de_generacion}:`, error);
        }
      }

      // Generar y descargar ZIP de PDFs
      const pdfZipBlob = await zipPDF.generateAsync({ type: 'blob' });
      downloadZipFile(pdfZipBlob, `DTEs_PDFs_${tipoDte}_${fechaInicio}_${fechaFin}.zip`);

      // Generar y descargar ZIP de JSONs
      const jsonZipBlob = await zipJSON.generateAsync({ type: 'blob' });
      downloadZipFile(jsonZipBlob, `DTEs_JSONs_${tipoDte}_${fechaInicio}_${fechaFin}.zip`);

      toast.success(`Se descargaron ${filteredDtes.length} DTEs exitosamente`);
      
      // Resetear formulario
      setTipoDte('');
      setFechaInicio('');
      setFechaFin('');
    } catch (error) {
      console.error('Error al descargar DTEs:', error);
      toast.error('Error al descargar los DTEs');
    } finally {
      setIsDownloading(false);
      setIsLoading(false);
    }
  };

  // Función para descargar PDF como Blob
  const downloadPDFAsBlob = async (codigoGeneracion, user, dte) => {
    const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
    try {
      const response = await fetch(`${BASE_URL}/mail/bill/${id_emisor}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ codigo_de_generacion: codigoGeneracion })
      });

      if (!response.ok) {
        throw new Error('Error al descargar PDF');
      }

      return await response.blob();
    } catch (error) {
      console.error(`Error descargando PDF para ${codigoGeneracion}:`, error);
      return null;
    }
  };

  // Función para descargar archivo ZIP
  const downloadZipFile = (blob, filename) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Función para construir el JSON del DTE en formato para firmar
  const buildDTEJson = async (content, user, items) => {
    // Procesar items según el tipo de DTE
    let processedItems = [];
    
    if (content.tipo === "03") {
      // Crédito Fiscal
      processedItems = items.map(item => {
        const tributos = item.tributos ? item.tributos.split('|') : [];
        return {
          numItem: parseInt(item.numitem),
          tipoItem: parseInt(item.tipoitem),
          numeroDocumento: item.numerodocumento,
          cantidad: parseFloat(item.cantidad),
          codigo: item.codigo,
          codTributo: item.codtributo,
          uniMedida: parseInt(item.unimedida),
          descripcion: item.descripcion,
          precioUni: parseFloat(item.preciouni),
          montoDescu: parseFloat(item.montodescu),
          ventaNoSuj: parseFloat(item.ventanosuj),
          ventaExenta: parseFloat(item.ventaexenta),
          ventaGravada: parseFloat(item.ventagravada),
          tributos: tributos.length > 0 ? tributos : null,
          psv: parseFloat(item.psv),
          noGravado: parseFloat(item.nogravado),
          ivaItem: parseFloat(item.ivaitem)
        };
      });
    } else {
      // Otros tipos de DTE
      processedItems = items.map(item => ({
        numItem: parseInt(item.numitem),
        tipoItem: parseInt(item.tipoitem),
        numeroDocumento: item.numerodocumento,
        cantidad: parseFloat(item.cantidad),
        codigo: item.codigo,
        codTributo: item.codtributo,
        uniMedida: parseInt(item.unimedida),
        descripcion: item.descripcion,
        precioUni: parseFloat(item.preciouni),
        montoDescu: parseFloat(item.montodescu),
        ventaNoSuj: parseFloat(item.ventanosuj),
        ventaExenta: parseFloat(item.ventaexenta),
        ventaGravada: parseFloat(item.ventagravada),
        tributos: item.tributos,
        psv: parseFloat(item.psv),
        noGravado: parseFloat(item.nogravado)
      }));
    }

    const dteData = {
      identificacion: {
        version: parseInt(content.version),
        ambiente: content.ambiente,
        tipoDte: content.tipo,
        numeroControl: content.numero_de_control,
        codigoGeneracion: content.codigo_de_generacion,
        tipoModelo: parseInt(content.modelo_de_factura),
        tipoOperacion: parseInt(content.tipo_de_transmision),
        fecEmi: content.fecha_y_hora_de_generacion,
        horEmi: content.horemi,
        tipoMoneda: content.tipomoneda,
        tipoContingencia: content.tipocontingencia,
        motivoContin: content.motivocontin,
      },
      documentoRelacionado: content.documentorelacionado,
      emisor: {
        direccion: {
          municipio: user.municipio,
          departamento: user.departamento,
          complemento: user.direccion
        },
        nit: user.nit,
        nrc: user.nrc,
        nombre: user.name,
        codActividad: user.codactividad,
        descActividad: user.descactividad,
        telefono: user.numero_de_telefono,
        correo: user.correo_electronico,
        nombreComercial: user.nombre_comercial,
        tipoEstablecimiento: user.tipoestablecimiento,
        codEstableMH: content.codestablemh,
        codEstable: content.codestable,
        codPuntoVentaMH: content.codpuntoventamh,
        codPuntoVenta: content.codpuntoventa
      },
      receptor: {
        codActividad: content.re_codactividad,
        direccion: content.re_direccion,
        nrc: content.re_nrc,
        descActividad: content.re_actividad_economica,
        correo: content.re_correo_electronico,
        tipoDocumento: content.re_tipodocumento,
        nombre: content.re_name,
        telefono: content.re_numero_telefono,
        numDocumento: content.re_numdocumento
      },
      otrosDocumentos: content.otrosdocumentos,
      ventaTercero: content.ventatercero,
      cuerpoDocumento: processedItems,
      resumen: {
        condicionOperacion: content.condicionoperacion,
        totalIva: parseFloat(content.iva_percibido),
        saldoFavor: content.saldofavor,
        numPagoElectronico: content.numpagoelectronico,
        pagos: [
          {
            periodo: content.periodo,
            plazo: content.plazo,
            montoPago: content.montopago,
            codigo: content.codigo,
            referencia: content.referencia
          }
        ],
        totalNoSuj: content.totalnosuj,
        tributos: content.tributos,
        totalLetras: content.cantidad_en_letras,
        totalExenta: content.totalexenta,
        subTotalVentas: content.subtotalventas,
        totalGravada: parseFloat(content.total_agravada),
        montoTotalOperacion: content.montototaloperacion,
        descuNoSuj: content.descunosuj,
        descuExenta: content.descuexenta,
        descuGravada: content.descugravada,
        porcentajeDescuento: content.porcentajedescuento,
        totalDescu: parseFloat(content.monto_global_de_descuento),
        subTotal: parseFloat(content.subtotal),
        ivaRete1: parseFloat(content.iva_retenido),
        reteRenta: parseFloat(content.retencion_de_renta),
        totalNoGravado: content.totalnogravado,
        totalPagar: parseFloat(content.total_a_pagar)
      },
      extension: {
        docuEntrega: content.documento_e,
        nombRecibe: content.documento_r,
        observaciones: content.observaciones,
        placaVehiculo: content.placavehiculo,
        nombEntrega: content.responsable_emisor,
        docuRecibe: content.documento_receptor,
      },
      apendice: content.apendice,
    };

    return dteData;
  };

  const sidebar = () => {
    setVisible(!visible);
  };

  return (
    <div className="w-full min-h-screen bg-steelblue-300 flex flex-col items-center justify-start relative animate-fadeIn">
      {/* Hamburguer y Sidebar */}
      <div className="absolute top-0 left-0 z-20 animate-slideInLeft">
        <HamburguerComponent sidebar={sidebar} open={visible} />
      </div>
      <div className="absolute top-0 left-0 z-10 animate-slideInLeft">
        <SidebarComponent visible={visible} setVisible={setVisible} />
      </div>

      {/* Contenido principal */}
      <main className="w-full flex flex-col items-center justify-start pt-16 pb-8 px-4 animate-fadeInUp">
        <div className="w-full max-w-2xl">
          {/* Título de la página */}
          <div className="w-full mb-6 text-center animate-slideInDown">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              Descargar DTEs
            </h1>
            <p className="text-sm text-white/90 mt-2">
              Descarga de Documentos Tributarios Electrónicos
            </p>
          </div>

          {/* Card de descarga */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 md:p-8 hover:shadow-2xl transition-all duration-300 animate-fadeInUp animate-delay-200">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-6 pb-3 border-b border-gray-200">
              Selecciona los parámetros de descarga
            </h2>

            {/* Formulario */}
            <div className="flex flex-col gap-5">
              {/* Tipo de DTE */}
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <label 
                  htmlFor="tipoDte" 
                  className="relative text-sm leading-[21px] font-semibold text-black inline-block min-w-[90px]"
                >
                  Tipo de DTE *
                </label>
                <select
                  id="tipoDte"
                  value={tipoDte}
                  onChange={(e) => setTipoDte(e.target.value)}
                  className="self-stretch rounded-3xs bg-white box-border flex flex-row items-start justify-start py-2.5 px-[15px] max-w-full text-dimgray border-[1px] border-solid border-gray-400 hover:bg-gainsboro-200 hover:border-darkslategray-200 focus:outline-none focus:ring-2 focus:ring-steelblue-200 transition-all"
                >
                  <option value="">Seleccione un tipo de DTE</option>
                  {tiposDte.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Período de tiempo */}
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <label className="relative text-sm leading-[21px] font-semibold text-black inline-block">
                  Período de tiempo *
                </label>

                <div className="self-stretch grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                  {/* Fecha inicio */}
                  <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] min-w-[200px] max-w-full">
                    <label 
                      htmlFor="fechaInicio" 
                      className="relative text-xs leading-[18px] text-dimgray inline-block"
                    >
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      id="fechaInicio"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="self-stretch rounded-3xs bg-white box-border flex flex-row items-start justify-start py-2.5 px-[15px] text-dimgray border-[1px] border-solid border-gray-400 hover:bg-gainsboro-200 hover:border-darkslategray-200 focus:outline-none focus:ring-2 focus:ring-steelblue-200 transition-all"
                    />
                  </div>

                  {/* Fecha fin */}
                  <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] min-w-[200px] max-w-full">
                    <label 
                      htmlFor="fechaFin" 
                      className="relative text-xs leading-[18px] text-dimgray inline-block"
                    >
                      Fecha de fin
                    </label>
                    <input
                      type="date"
                      id="fechaFin"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="self-stretch rounded-3xs bg-white box-border flex flex-row items-start justify-start py-2.5 px-[15px] text-dimgray border-[1px] border-solid border-gray-400 hover:bg-gainsboro-200 hover:border-darkslategray-200 focus:outline-none focus:ring-2 focus:ring-steelblue-200 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de descarga */}
              <div className="self-stretch flex flex-row items-center justify-end gap-3 mt-2">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`
                    cursor-pointer flex items-center justify-center gap-2 
                    py-2.5 px-6 rounded-3xs font-semibold
                    transition-all duration-200 shadow-md hover:shadow-lg
                    ${isDownloading 
                      ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                      : 'bg-steelblue-200 hover:bg-steelblue-100 active:scale-95'
                    }
                    text-white border-none
                  `}
                >
                  <img 
                    src="/descargar@2x.png" 
                    alt="Download" 
                    className="h-5 w-5 relative overflow-hidden shrink-0 brightness-0 invert"
                  />
                  <span className="relative text-sm leading-[21px] font-semibold">
                    {isDownloading ? 'Descargando...' : 'Descargar DTEs'}
                  </span>
                </button>
              </div>

              {/* Información adicional */}
              <div className="self-stretch rounded-3xs bg-aliceblue box-border flex flex-col items-start justify-start p-4 gap-2 border-[1px] border-solid border-steelblue-100 mt-4">
                <div className="flex flex-row items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-steelblue-200"></div>
                  <p className="text-xs leading-[18px] font-medium text-darkslategray-100 m-0">
                    <span className="font-bold">Nota:</span> Solo se descargarán DTEs sellados (con sello de recepción del Ministerio de Hacienda).
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-steelblue-200"></div>
                  <p className="text-xs leading-[18px] font-medium text-darkslategray-100 m-0">
                    Se generarán dos archivos ZIP: uno con los PDFs y otro con los archivos JSON.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de carga */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="h-16 w-16 border-4 border-steelblue-300 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-black">Descargando DTEs...</p>
            <p className="text-sm text-gray-600">Por favor espere</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadDTEs;
