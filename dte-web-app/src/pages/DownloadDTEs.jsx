import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import HamburguerComponent from '../components/HamburguerComponent';
import SidebarComponent from '../components/SideBarComponent';
import PlantillaAPI from '../services/PlantillaService';
import BillsxItemsAPI from '../services/BIllxitemsService';
import UserService from '../services/UserServices';
import JSZip from 'jszip';
import "react-toastify/dist/ReactToastify.css";
const BASE_URL = "https://intuitive-bravery-production.up.railway.app";

const sanitizeFilenamePart = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return 'SIN_NOMBRE';
  // Evita caracteres inválidos en Windows y separadores de ruta.
  const sanitized = raw
    .replace(/[\\/]/g, '-')
    .replace(/[<>:"|?*\u0000-\u001F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return sanitized || 'SIN_NOMBRE';
};

const normalizeTributos = (tributosRaw, contextForLogs) => {
  if (tributosRaw === null || tributosRaw === undefined) return null;

  // Caso string: puede venir "" o "A|B|C"
  if (typeof tributosRaw === 'string') {
    const trimmed = tributosRaw.trim();
    if (!trimmed) return null;
    const parts = trimmed
      .split('|')
      .map((p) => String(p).trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : null;
  }

  // Caso array: ya viene parseado
  if (Array.isArray(tributosRaw)) {
    const parts = tributosRaw
      .map((p) => String(p ?? '').trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : null;
  }

  // Otros tipos: log para diagnóstico y no romper
  console.warn('[DownloadDTEs] tributos en formato inesperado; se omite', {
    ...contextForLogs,
    typeof: typeof tributosRaw,
    value: tributosRaw,
  });
  return null;
};

const DownloadDTEs = () => {
  const [tipoDte, setTipoDte] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalKind, setModalKind] = useState(''); // '', 'progress', 'not-found', 'error'
  const [keepModalOpen, setKeepModalOpen] = useState(false);
  const [isModalFadingOut, setIsModalFadingOut] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState({
    title: '',
    detail: '',
    current: 0,
    total: 0,
  });
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
    setKeepModalOpen(false);
    setIsModalFadingOut(false);
    setModalKind('progress');
    setLoadingStatus({
      title: 'Buscando DTEs...',
      detail: `Consultando del ${fechaInicio} al ${fechaFin}`,
      current: 0,
      total: 0,
    });

    try {
      console.log('[DownloadDTEs] Inicio descarga', {
        id_emisor,
        tipoDte,
        fechaInicio,
        fechaFin,
      });

      // Obtener información del usuario
      setLoadingStatus({
        title: 'Buscando DTEs...',
        detail: 'Cargando información del emisor...',
        current: 0,
        total: 0,
      });
      const user = await UserService.getUserInfo(id_emisor, token);
      console.log('[DownloadDTEs] Usuario cargado', {
        id_emisor,
        nit: user?.nit,
        nrc: user?.nrc,
        name: user?.name,
      });
      
      // Obtener DTEs por tipo y rango de fechas
      setLoadingStatus({
        title: 'Buscando DTEs...',
        detail: 'Consultando documentos en el período seleccionado...',
        current: 0,
        total: 0,
      });
      const dtes = await PlantillaAPI.getByUserIdAndRange(id_emisor, token, fechaInicio, fechaFin);
      console.log('[DownloadDTEs] DTEs obtenidos', {
        total: Array.isArray(dtes) ? dtes.length : null,
      });
      
      if (!dtes || dtes.length === 0) {
        toast.warn('No se encontró ningún DTE para el período seleccionado');
        setModalKind('not-found');
        setKeepModalOpen(true);
        setLoadingStatus({
          title: 'Sin resultados',
          detail: 'No se encontraron DTEs para el período seleccionado.',
          current: 0,
          total: 0,
        });
        setIsDownloading(false);
        return;
      }

      // Filtrar SOLO por tipo de DTE (sin importar si están sellados o no)
      setLoadingStatus({
        title: 'Buscando DTEs...',
        detail: 'Filtrando por tipo de documento...',
        current: 0,
        total: 0,
      });
      const filteredDtes = dtes.filter(dte => dte?.tipo === tipoDte);

      console.log('[DownloadDTEs] DTEs filtrados (sellados + tipo)', {
        tipoDte,
        totalFiltrados: filteredDtes.length,
      });
      
      if (filteredDtes.length === 0) {
        toast.warn(`No se encontró ningún DTE de tipo ${tipoDte} para el período seleccionado`);
        setModalKind('not-found');
        setKeepModalOpen(true);
        setLoadingStatus({
          title: 'Sin resultados',
          detail: `No se encontraron DTEs de tipo ${tipoDte} en el período seleccionado.`,
          current: 0,
          total: 0,
        });
        setIsDownloading(false);
        return;
      }

      toast.info(`Descargando ${filteredDtes.length} DTEs...`);
      setLoadingStatus({
        title: `Encontrados ${filteredDtes.length} DTE(s)`,
        detail: 'Iniciando descarga de PDFs y generación de JSONs...',
        current: 0,
        total: filteredDtes.length,
      });

      // Crear archivo ZIP para PDFs y JSONs
      const zipPDF = new JSZip();
      const zipJSON = new JSZip();

      // Procesar cada DTE
      let processedCount = 0;
      let pdfOkCount = 0;
      let pdfFailCount = 0;
      let jsonOkCount = 0;
      let jsonFailCount = 0;
      for (const dte of filteredDtes) {
        try {
          processedCount += 1;
          setLoadingStatus({
            title: 'Descargando...',
            detail: `Procesando ${processedCount} de ${filteredDtes.length}`,
            current: processedCount,
            total: filteredDtes.length,
          });
          console.log('[DownloadDTEs] Procesando DTE', {
            idx: processedCount,
            total: filteredDtes.length,
            codigoGeneracion: dte?.codigo_de_generacion,
            tipo: dte?.tipo,
            receptor: dte?.re_name,
          });

          // Obtener items del DTE
          const items = await BillsxItemsAPI.getlist(token, dte.codigo_de_generacion);
          console.log('[DownloadDTEs] Items obtenidos', {
            codigoGeneracion: dte?.codigo_de_generacion,
            items: Array.isArray(items) ? items.length : null,
          });
          
          // Construir el objeto JSON en formato para firmar
          const dteJson = await buildDTEJson(dte, user, items);
          jsonOkCount += 1;
          
          // Agregar JSON al ZIP
          const jsonFileName = `${dte.codigo_de_generacion}.json`;
          zipJSON.file(jsonFileName, JSON.stringify(dteJson, null, 2));

          // Descargar PDF
          const pdfBlob = await downloadPDFAsBlob(dte.codigo_de_generacion);
          if (pdfBlob) {
            pdfOkCount += 1;
            const receptorSafe = sanitizeFilenamePart(dte.re_name);
            const pdfFileName = `${receptorSafe}_${dte.codigo_de_generacion}.pdf`;
            zipPDF.file(pdfFileName, pdfBlob);
            console.log('[DownloadDTEs] PDF agregado al ZIP', {
              codigoGeneracion: dte?.codigo_de_generacion,
              filename: pdfFileName,
              sizeBytes: pdfBlob.size,
            });
          } else {
            pdfFailCount += 1;
            console.warn('[DownloadDTEs] PDF no disponible (null)', {
              codigoGeneracion: dte?.codigo_de_generacion,
            });
          }
        } catch (error) {
          jsonFailCount += 1;
          console.error(`Error procesando DTE ${dte.codigo_de_generacion}:`, error);
        }
      }

      console.log('[DownloadDTEs] Resumen procesamiento', {
        totalFiltrados: filteredDtes.length,
        processedCount,
        pdfOkCount,
        pdfFailCount,
        jsonOkCount,
        jsonFailCount,
      });

      setLoadingStatus({
        title: 'Generando archivos...',
        detail: 'Empaquetando PDFs y JSONs en ZIP...',
        current: filteredDtes.length,
        total: filteredDtes.length,
      });

      // Generar y descargar ZIP de PDFs (si hay al menos 1 PDF)
      const pdfFilesCount = Object.keys(zipPDF.files || {}).length;
      if (pdfFilesCount > 0) {
        const pdfZipBlob = await zipPDF.generateAsync({ type: 'blob' });
        downloadZipFile(pdfZipBlob, `DTEs_PDFs_${tipoDte}_${fechaInicio}_${fechaFin}.zip`);
      } else {
        console.warn('[DownloadDTEs] ZIP de PDFs vacío; se omite descarga');
        toast.info('No se pudo generar el ZIP de PDFs (no hubo PDFs disponibles)');
      }

      // Generar y descargar ZIP de JSONs
      const jsonFilesCount = Object.keys(zipJSON.files || {}).length;
      if (jsonFilesCount > 0) {
        const jsonZipBlob = await zipJSON.generateAsync({ type: 'blob' });
        downloadZipFile(jsonZipBlob, `DTEs_JSONs_${tipoDte}_${fechaInicio}_${fechaFin}.zip`);
      } else {
        console.warn('[DownloadDTEs] ZIP de JSONs vacío; se omite descarga');
        toast.info('No se pudo generar el ZIP de JSONs (no hubo JSONs disponibles)');
      }

      toast.success(`Se descargaron ${filteredDtes.length} DTEs exitosamente`);
      setModalKind('progress');
      setLoadingStatus({
        title: 'Listo',
        detail: 'Descarga iniciada. Puedes revisar tus descargas.',
        current: filteredDtes.length,
        total: filteredDtes.length,
      });
      
      // Resetear formulario
      setTipoDte('');
      setFechaInicio('');
      setFechaFin('');
    } catch (error) {
      console.error('Error al descargar DTEs:', error);
      toast.error('Error al descargar los DTEs');
      setModalKind('error');
      setLoadingStatus({
        title: 'Error',
        detail: 'Ocurrió un error descargando los DTEs. Revisa la consola para más detalle.',
        current: 0,
        total: 0,
      });
    } finally {
      setIsDownloading(false);
      if (!keepModalOpen) {
        setIsLoading(false);
      }
    }
  };

  // Mantener el modal de "Sin resultados" 5s, con shake y luego fade-out.
  useEffect(() => {
    if (!isLoading || modalKind !== 'not-found') return;

    setIsModalFadingOut(false);
    const fadeTimer = setTimeout(() => {
      setIsModalFadingOut(true);
    }, 4300);

    const closeTimer = setTimeout(() => {
      setIsLoading(false);
      setKeepModalOpen(false);
      setIsModalFadingOut(false);
      setModalKind('');
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [isLoading, modalKind]);

  // Función para descargar PDF como Blob
  const downloadPDFAsBlob = async (codigoGeneracion) => {
    try {
      const url = `${BASE_URL}/mail/bill/${id_emisor}`;
      console.log('[DownloadDTEs] Solicitando PDF', {
        url,
        codigoGeneracion,
      });

      const response = await fetch(`${BASE_URL}/mail/bill/${id_emisor}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ codigo_de_generacion: codigoGeneracion })
      });

      if (!response.ok) {
        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch (e) {
          // ignorar
        }
        console.error('[DownloadDTEs] Respuesta no OK al descargar PDF', {
          codigoGeneracion,
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          bodyPreview: errorBody?.slice?.(0, 500),
        });
        throw new Error(`Error al descargar PDF (HTTP ${response.status})`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType && !contentType.toLowerCase().includes('pdf') && !contentType.toLowerCase().includes('octet-stream')) {
        // Muchas APIs devuelven JSON en error aunque sea 200; registramos para diagnóstico.
        let bodyPreview = '';
        try {
          bodyPreview = (await response.clone().text())?.slice?.(0, 500) || '';
        } catch (e) {
          // ignorar
        }
        console.warn('[DownloadDTEs] Content-Type inesperado para PDF', {
          codigoGeneracion,
          contentType,
          bodyPreview,
        });
      }

      const blob = await response.blob();
      console.log('[DownloadDTEs] PDF recibido', {
        codigoGeneracion,
        contentType,
        sizeBytes: blob.size,
      });

      if (!blob || blob.size === 0) {
        console.warn('[DownloadDTEs] PDF vacío (0 bytes)', { codigoGeneracion });
      }

      return blob;
    } catch (error) {
      console.error(`Error descargando PDF para ${codigoGeneracion}:`, error);
      return null;
    }
  };

  // Función para descargar archivo ZIP
  const downloadZipFile = (blob, filename) => {
    try {
      console.log('[DownloadDTEs] Generando descarga ZIP', {
        filename,
        sizeBytes: blob?.size,
      });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[DownloadDTEs] Error iniciando descarga ZIP', { filename, error });
      toast.error('No se pudo iniciar la descarga del ZIP');
    }
  };

  // Función para construir el JSON del DTE en formato para firmar
  const buildDTEJson = async (content, user, items) => {
    // Procesar items según el tipo de DTE
    let processedItems = [];
    
    if (content.tipo === "03") {
      // Crédito Fiscal
      processedItems = items.map(item => {
        const tributos = normalizeTributos(item.tributos, {
          tipoDte: content?.tipo,
          codigoGeneracion: content?.codigo_de_generacion,
          numItem: item?.numitem,
        });
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
          tributos,
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
        tributos: normalizeTributos(item.tributos, {
          tipoDte: content?.tipo,
          codigoGeneracion: content?.codigo_de_generacion,
          numItem: item?.numitem,
        }),
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
      <ToastContainer />
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
          <div
            className={
              `bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4 ` +
              `transition-opacity duration-700 ${isModalFadingOut ? 'opacity-0' : 'opacity-100'} ` +
              `${modalKind === 'not-found' ? 'border-2 border-yellow-400 animate-shake' : ''}`
            }
          >
            {modalKind !== 'not-found' && (
              <div className="h-16 w-16 border-4 border-steelblue-300 border-t-transparent rounded-full animate-spin"></div>
            )}
            <p className="text-lg font-semibold text-black">{loadingStatus.title || 'Procesando...'}</p>
            <p className="text-sm text-gray-600">{loadingStatus.detail || 'Por favor espere'}</p>
            {loadingStatus.total > 0 && (
              <p className="text-sm text-gray-600">
                {loadingStatus.current} / {loadingStatus.total}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadDTEs;
