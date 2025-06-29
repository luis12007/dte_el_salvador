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
    var invalidation_obj = {
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

    if (id_emisor == 1 || id_emisor == 2 || id_emisor == 3) {
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

    if (id_emisor > 14) {
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
    <div className="flex w-full self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex-col items-center ml-2 pb-3 box-border my-6  text-black font-inria-sans ">
      <header className="self-stretch  rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-1 pb-0 pr-[10px] pl-[15px] box-border text-xl text-black font-inria-sans ">
        <div className="flex flex-col  items-start justify-start pt-1 px-0 pb-0">

          <h1 className="m-0 relative text-inherit font-bold z-[3] mb-2">{tipo}</h1>
        </div>


      </header>

      <div className="">
        <div className=""></div>
      </div>
      <div className="self-stretch flex flex-row items-center justify-center  py-0 px-[10px] box-border">
        <div className="flex flex-col justify-center self-center w-full">
          <div className="flex-1 flex px-4 flex-col items-center justify-center  pt-[7px]  pb-0">
            <div className="self-stretch  flex flex-col items-start justify-start gap-[7px_0px]">
              <div className="relative  whitespace-nowrap z-[1]">
                {content.re_name}
              </div>
              <div className="self-stretch  h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
              <div className="relative whitespace-nowrap z-[1]">
                {/* re_nit if it is null re_numdocumento */}
                Documento: {content.re_nit ? content.re_nit : content.re_numdocumento}
              </div>
              <div className="relative whitespace-nowrap z-[1]">
                Correo: {content.re_correo_electronico}
              </div>
              <div className="relative whitespace-nowrap z-[1]">
                Teléfono: {content.re_numero_telefono}
              </div>
            </div>
          </div>
          <div className="flex-1 flex w-full  pt-4 flex-col items-center justify-center gap-[8px_0px]">
            <button
              className="cursor-pointer [border:none] px-3 py-1 bg-gay-100 rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-gainsboro-100">
              <b className="relative text-11xl font-inria-sans text-black text-left whitespace-nowrap z-[2]">
                TOTAL: ${content.total_a_pagar}
              </b>
            </button>
            <div className="w-full  flex pt-4 gap-[0px_12px]">
              <div className="flex-grow flex justify-center">
                {sendedebutton}
              </div>
            </div>
          </div>
        </div>
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
