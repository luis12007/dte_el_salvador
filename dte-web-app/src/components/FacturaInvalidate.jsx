import React, { useEffect, useState } from "react";
import checkimg from "../assets/imgs/marca-de-verificacion.png";
import Firmservice from "../services/Firm";
import PlantillaAPI from "../services/PlantillaService";
import SendAPI from "../services/SendService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BillsxItemsAPI from "../services/BIllxitemsService";
import SendEmail from "../services/SendMailService";
import downloadPDF from "../services/DownloadPDF";
import { useNavigate } from "react-router-dom";
import imgx from "../assets/imgs/x.png";
import LoginAPI from "../services/Loginservices";
import mailimg from "../assets/imgs/correo.png";
import cross from "../assets/imgs/cross.png";
import direct from "../assets/imgs/direct.png";
import signature from "../assets/imgs/signature.png";
import UserService from "../services/UserServices";
import { v4 as uuidv4 } from "uuid";


const FacturaInvalidate = ({ key, content, user }) => {
  const [tipo, setTipo] = useState("");
  const token = localStorage.getItem("token");
  const id_emisor = localStorage.getItem("user_id");
  const tokenminis = localStorage.getItem("tokenminis");
  const [Listitems, setItems] = useState([]);
  const navigate = useNavigate();
  const [usuario, setUser] = useState([]);
  const [mailchecker, setMailChecker] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formattedTotal, setFormattedTotal] = useState("");
  const fecAnula = new Date().toISOString().split('T')[0]; // Gets current date in "YYYY-MM-DD" format
  const horAnula = new Date().toLocaleTimeString('en-US', {
    hour12: false, // 24-hour format
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }); // Gets current time in "HH:mm:ss" format
  useEffect(() => {
    if (content.tipo === "01") {
      setTipo("Factura");
    } else if (content.tipo === "03") {
      setTipo("Crédito Fiscal");
    } else if (content.tipo === "14") {
      setTipo("Sujeto Excluido");
    }else if (content.tipo === "05") {
      setTipo("Nota de Credito");
    } else if (content.tipo === "06") {
      setTipo("Nota de Debito");
    }

    if (content.re_correo_electronico === ""
      || content.re_correo_electronico === null) {
      console.log("no email");
      setMailChecker(false);
    }

    /* Find service per factura */
    const itemsdata = async () => {
      const data = await BillsxItemsAPI.getlist(token, content.codigo_de_generacion);
      console.log("data");
      data.map((item) => {
        delete item.id;
        delete item.id_items;
        delete item.id_facturas;
      });

      if (content.tipo === "03") {
        const newItems = data.map((item) => {
          const newItem = {
            codTributo: item.codtributo,
            descripcion: item.descripcion,
            uniMedida: item.unimedida,
            codigo: item.codigo,
            cantidad: item.cantidad,
            numItem: item.numitem,
            tributos: [item.tributos.toString()],
            noGravado: item.nogravado,
            psv: item.psv,
            montoDescu: item.montodescu,
            numeroDocumento: item.numerodocumento,
            precioUni: item.preciouni,
            ventaGravada: item.ventagravada,
            ventaExenta: item.ventaexenta,
            ventaNoSuj: item.ventanosuj,
            tipoItem: item.tipoitem,
          };
          return newItem;
        });
        console.log(newItems);
        setItems(newItems);

      } else if (content.tipo === "01") {


        const newItems = data.map((item) => {
          const newItem = {
            codTributo: item.codtributo,
            descripcion: item.descripcion,
            uniMedida: item.unimedida,
            codigo: item.codigo,
            cantidad: item.cantidad,
            numItem: item.numitem,
            tributos: item.tributos,
            ivaItem: item.ivaitem,
            noGravado: item.nogravado,
            psv: item.psv,
            montoDescu: item.montodescu,
            numeroDocumento: item.numerodocumento,
            precioUni: item.preciouni,
            ventaGravada: item.ventagravada,
            ventaExenta: item.ventaexenta,
            ventaNoSuj: item.ventanosuj,
            tipoItem: item.tipoitem,
          };
          return newItem;
        });


        console.log(newItems);
        setItems(newItems);
      }

    };
    itemsdata();
    console.log("user");
    console.log(user);
    setUser(user)

    console.log("content");
    console.log(content);

    setFormattedTotal(content.total_a_pagar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 1,000

  }, []);




  const SendBillHandlerNoSend = async () => {
  toast.error("No se puede invalidar una factura no enviada");
  };

  const SendBillHandler = async () => {
    setIsLoading(true);







    const myUuid = uuidv4().toUpperCase().toString();
    /* setting data */

   /*  var invalidation_obj = {
      identificacion: {
        version: 2, 
        ambiente: content.ambiente,
        codigoGeneracion: myUuid,
        fecAnula: fecAnula,
        horAnula: horAnula
      },
      emisor: {
        nit: user.nit,
        nombre: user.name,
        tipoEstablecimiento: user.nombre_comercial,
        nomEstablecimiento: user.nombre_comercial,
        telefono: user.numero_de_telefono,
        correo: user.correo_electronico,
        numFacturador: null,
        codEstablecimiento: user.codigo_establecimiento,
        puntoVenta: null,
        codEstablecimiento: user.tipoestablecimiento,
      },
      receptor: {
        tipoDocumento: content.re_tipodocumento,
        numDocumento: content.re_numdocumento,
        numFacturador: null,
        nombre: content.re_name,
        telefono: content.re_numero_telefono,
        correo: content.re_correo_electronico,
      },
      documento: {
        tipoDte: content.tipo,
        codigoGeneracion: content.codigo_de_generacion,
        selloRecibido: content.sello_de_recepcion,
        numeroControl: content.numero_de_control, 
        fecEmi: content.fecha_y_hora_de_generacion,
        montoIva: parseFloat(content.iva_percibido),
      },
      motivo: {
        tipoAnulacion: 2,
        motivoAnulacion: "Error en los datos del documento",
        nombreResponsable: user.name,
        tipDocResponsable: 13, 
        numDocResponsable: Number("063842754"),
        nombreSolicita: user.name,
        tipDocSolicita: 13, 
        numDocSolicita: Number("063842754")
      }
    };
 */
    var invalidation_obj = {};
  if (content.tipo === "01"){
      invalidation_obj = {
      identificacion: {
        version: 2,
        ambiente: content.ambiente,
        codigoGeneracion: myUuid,
        fecAnula: fecAnula,
        horAnula: horAnula
      },
      emisor: {
        nit: user.nit,
        nombre: user.name,
        tipoEstablecimiento: user.tipoestablecimiento,
        nomEstablecimiento: user.nombre_comercial,
        telefono: user.numero_de_telefono,
        correo: user.correo_electronico,
                  codEstableMH: "M001",
          codEstable: "M001",
          codPuntoVentaMH: "P001",
          codPuntoVenta: "P001",
      },
      documento: {
        tipoDte: content.tipo,
        codigoGeneracion: content.codigo_de_generacion,
        selloRecibido: content.sello_de_recepcion,
        numeroControl: content.numero_de_control,
        fecEmi: content.fecha_y_hora_de_generacion,
        montoIva: parseFloat(content.iva_percibido),
        codigoGeneracionR: null,
        tipoDocumento: content.re_tipodocumento,
        numDocumento: content.re_numdocumento,
        nombre: content.re_name,
        telefono: content.re_numero_telefono, 
        correo: content.re_correo_electronico
      },
      motivo: {
        tipoAnulacion: 2,
        motivoAnulacion: "Error en los datos del documento",
        nombreResponsable: user.name,
        tipDocResponsable: "36",
        numDocResponsable: user.nit,
        nombreSolicita: user.name,
        tipDocSolicita: "36",
        numDocSolicita: user.nit
      }
    };
  }
  else if (content.tipo === "03"){
      invalidation_obj = {
      identificacion: {
        version: 2,
        ambiente: content.ambiente,
        codigoGeneracion: myUuid,
        fecAnula: fecAnula,
        horAnula: horAnula
      },
      emisor: {
        nit: user.nit,
        nombre: user.name,
        tipoEstablecimiento: user.tipoestablecimiento,
        nomEstablecimiento: user.nombre_comercial,
        telefono: user.numero_de_telefono,
        correo: user.correo_electronico,
        codEstableMH: null,
        codEstable: null,
        codPuntoVentaMH: null,
        codPuntoVenta: null
      },
      documento: {
        tipoDte: content.tipo,
        codigoGeneracion: content.codigo_de_generacion,
        selloRecibido: content.sello_de_recepcion,
        numeroControl: content.numero_de_control,
        fecEmi: content.fecha_y_hora_de_generacion,
        montoIva: parseFloat(content.iva_percibido),
        codigoGeneracionR: null,
        tipoDocumento: "36",
        numDocumento: content.re_nit,
        nombre: content.re_name,
        telefono: content.re_numero_telefono,
        correo: content.re_correo_electronico
      },
      motivo: {
        tipoAnulacion: 2,
        motivoAnulacion: "Error en los datos del documento",
        nombreResponsable: user.name,
        tipDocResponsable: "36",
        numDocResponsable: user.nit,
        nombreSolicita: user.name,
        tipDocSolicita: "36",
        numDocSolicita: user.nit
      }
    };
  }

    
    console.log("invalidation_obj");
    console.log(invalidation_obj);

    /* firming data */
    const Firm = {
      nit: user.nit,
      activo: true,
      passwordPri: user.passwordpri,
      dteJson: invalidation_obj,
    };

    let firmtoken = {};

    if (id_emisor == 1 || id_emisor == 2) {
      const responseFirm = await Firmservice.create(Firm);
      console.log("firm response")
      console.log(responseFirm);

      if (responseFirm === undefined) {
        toast.error("No se encontró firmador activo");
        return
      }
      firmtoken = responseFirm.body;



      console.log("---------------resultado of firm server--------------");
      console.log(responseFirm);
    }
    
    if (id_emisor == 3) {
      const responseFirm = await Firmservice.create_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);

      if (responseFirm === undefined) {
        toast.error("No se encontró firmador activo");
        return
      }
      firmtoken = responseFirm.body;



      console.log("---------------resultado of firm server--------------");
      console.log(responseFirm);
    }
    if (id_emisor == 4) {
      const responseFirm = await Firmservice.HM_Clinic(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;


      console.log("---------------resultado of firm server--------------");
      console.log(responseFirm);
    }

    if (id_emisor == 14) {
      const responseFirm = await Firmservice.ICP(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;


      console.log("---------------resultado of firm server--------------");
      console.log(responseFirm);
    }

    if (id_emisor == 13) {
      const responseFirm = await Firmservice.ICP_PROD(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;


      console.log("---------------resultado of firm server--------------");
      console.log(responseFirm);
    }
    if (id_emisor == 9) {
      const responseFirm = await Firmservice.HM_Clinic_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;


      console.log("---------------resultado of firm server--------------");
      console.log(responseFirm);
    }
    if (id_emisor == 5) {
      const responseFirm = await Firmservice.DR_julio_HM(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;


      console.log("---------------resultado of firm server--------------");
      console.log(responseFirm);
    }

    if (id_emisor == 8) {
      const responseFirm = await Firmservice.DR_julio_HM_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;


      console.log("---------------resultado of firm server--------------");
      console.log(responseFirm);
    }

    if (id_emisor == 6) {
      const responseFirm = await Firmservice.DR_VIDES(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 10) {
      const responseFirm = await Firmservice.DR_VIDES_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 14) {
      const responseFirm = await Firmservice.ICP(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 13) {
      const responseFirm = await Firmservice.ICP_PROD(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 7) {
      const responseFirm = await Firmservice.OSEGUEDA(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 12) {
      const responseFirm = await Firmservice.OSEGUEDA_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }


    if (id_emisor == 15) {
      const responseFirm = await Firmservice.RINO_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

      if (id_emisor == 18) {
        const responseFirm = await Firmservice.RINO_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        firmtoken = responseFirm.body;
      }

      if (id_emisor == 16) {
      const responseFirm = await Firmservice.GINE_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 17) {
      const responseFirm = await Firmservice.GINE_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 19) {
      const responseFirm = await Firmservice.Jorge_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 20) {
      const responseFirm = await Firmservice.Jorge_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 21) {
      const responseFirm = await Firmservice.default_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 22) {
      const responseFirm = await Firmservice.default_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 23) {
      const responseFirm = await Firmservice.default_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 24) {
      const responseFirm = await Firmservice.default_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 25) {
      const responseFirm = await Firmservice.default_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 26) {
      const responseFirm = await Firmservice.default_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 27) {
      const responseFirm = await Firmservice.default_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 28) {
      const responseFirm = await Firmservice.default_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 29) {
      const responseFirm = await Firmservice.default_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 30) {
      const responseFirm = await Firmservice.default_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

       if (id_emisor == 31) {
      const responseFirm = await Firmservice.default_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 32) {
      const responseFirm = await Firmservice.default_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

       if (id_emisor == 33) {
      const responseFirm = await Firmservice.default_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 34) {
      const responseFirm = await Firmservice.default_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

       if (id_emisor == 35) {
      const responseFirm = await Firmservice.default_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 36) {
      const responseFirm = await Firmservice.default_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

       if (id_emisor == 37) {
      const responseFirm = await Firmservice.default_test(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor == 38) {
      const responseFirm = await Firmservice.default_prod(Firm);
      console.log("firm response")
      console.log(responseFirm);
      firmtoken = responseFirm.body;
    }

    if (id_emisor > 38) {
      const responseFirm = null;
      toast.error("No se encontró firmador registrado");
      return
    }

    console.log("firm response");
    console.log(firmtoken);



    /* sending to the MH */


    

    /* login to MH */
    var resultAuthminis = {};
    if (usuario.ambiente == "00") {
    resultAuthminis = await LoginAPI.loginMinis(
      user.nit,
      user.codigo_hacienda,
      "MysoftwareSv"
    );
    } else {
    resultAuthminis = await LoginAPI.loginMinis_prod(
      user.nit,
      user.codigo_hacienda,
      "MysoftwareSv"
    );
    }
    console.log(resultAuthminis);
    if (resultAuthminis.status != "OK") {
      toast.error("Error en el login vuelve a intentar");
      return
    }

    ;

    const dataSend = { /* TODO: SEND */
      ambiente: content.ambiente,
      idEnvio: content.id_envio,/* let see if it neccesary to increment */
      version: invalidation_obj.identificacion.version,
      documento: firmtoken,
    };
    var callMH = {};
    if(usuario.ambiente == "00"){

    callMH = await SendAPI.invalidatebill(dataSend, resultAuthminis.body.token.slice(7));
    console.log("callMH");
    console.log(callMH);
    } else {
    callMH = await SendAPI.invalidatebillprod(dataSend, resultAuthminis.body.token.slice(7));
      console.log("callMH");
    console.log(callMH);
    }

    if (callMH.estado === "PROCESADO") {
    setIsLoading(false);

      toast.success("Factura invalidada con éxito");
    const response = await PlantillaAPI.deletePlantillabyCodeGeneration(content.codigo_de_generacion, token);
    console.log("deleted");
    console.log(response);
    if (response.message === "plantilla eliminado") {
      toast.success("Factura eliminada con éxito");
      /* wait 5 seconds */
      setTimeout(() => {
        window.location.reload();

      }, 3000);
    } else {
      toast.error("Error al eliminar la plantilla recarga pagina");
    }
      /* deleting form db */

    }


    if (callMH.estado === "RECHAZADO") {
          if ( callMH.descripcionMsg === "[documento.codigoGeneracion] DOCUMENTO SE ENCUENTRA INVALIDADO" ) {
       toast.success("Factura invalidada con éxito");

    const response = await PlantillaAPI.deletePlantillabyCodeGeneration(content.codigo_de_generacion, token);
    console.log("deleted");
    console.log(response);
    if (response.message === "plantilla eliminado") {
      toast.success("Factura eliminada con éxito");
      /* wait 5 seconds */
      setTimeout(() => {
        window.location.reload();

      }, 3000);
      return;
    }
  }
    setIsLoading(false);

      toast.error(`RECHAZADO ${callMH.descripcionMsg}`);
      console.log(callMH.observaciones);
      for (let i = 0; i < callMH.observaciones.length; i++) {
        toast.error(`Observación ${i + 1} ${callMH.observaciones[i]}`);
      }
    }

  };

  // Determine the button color and additional content based on `content.firm`
  const buttonStyle = content.firm ? "bg-lightcoral" : " bg-lightgreen";



  const sendedebutton = content.sellado ? (
    <div className="self-center flex w-full  flex-row">
      <button
        onClick={SendBillHandler}
        className={`cursor-pointer  h-12 [border:none] w-full pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-lg flex flex-row items-center justify-center z-[2] hover:bg-lightgray-100`}
      >
        <h1>invalidar</h1>
      </button>
    </div>
  ) : (
    <div className="self-center flex   w-full flex-row">
      <button
        onClick={SendBillHandlerNoSend}
        className={`cursor-pointer  h-12 w-full [border:none] justify-center items-center ${buttonStyle} rounded-lg flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100`}
      >
        <h1>No enviada</h1>

      </button>
    </div>
  );



  /* Delete bill handler using the services */


  return (
    <div className="w-full max-w-full mx-0 bg-white rounded-xl shadow-sm ring-1 ring-black/5 px-3 sm:px-5 py-4 sm:py-5 my-6 text-black font-inria-sans overflow-hidden break-words box-border">
      <header className="flex items-center justify-between min-w-0 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-gainsboro-200 text-black border border-gray-300">
            {tipo || 'Documento'}
          </span>
        </div>
      </header>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="space-y-1 min-w-0">
          <div className="text-lg font-bold break-words whitespace-normal">{content.re_name}</div>
          <div className="text-base text-black break-all whitespace-normal">Documento: {content.re_nit ? content.re_nit : content.re_numdocumento || '—'}</div>
          <div className="text-base text-black break-words whitespace-normal">Correo: {content.re_correo_electronico || '—'}</div>
          <div className="text-base text-black break-words whitespace-normal">Teléfono: {content.re_numero_telefono || '—'}</div>
          <div className="text-sm text-black space-y-0.5">
            <div>Código de generación: {content.codigo_de_generacion}</div>
            <div>Número de control: {content.numero_de_control}</div>
          </div>
        </div>
        <div className="flex md:items-end md:justify-end min-w-0">
          <div className="inline-flex items-center gap-2 bg-gainsboro-200 px-3 py-2 rounded-lg border border-gray-300">
            <span className="text-sm font-medium text-black">TOTAL</span>
            <span className="text-lg font-bold tracking-wide">${formattedTotal}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        {sendedebutton}
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};
export default FacturaInvalidate;