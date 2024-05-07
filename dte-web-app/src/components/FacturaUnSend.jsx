import React, { useEffect, useState } from "react";
import checkimg from "../assets/imgs/marca-de-verificacion.png";
import Firmservice from "../services/Firm";
import PlantillaAPI from "../services/PlantillaService";
import SendAPI from "../services/SendService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BillsxItemsAPI from "../services/BIllxitemsService";

const FrameComponent1 = ({key, content , user}) => {
  const [tipo, setTipo] = useState("");
  const token = localStorage.getItem("token");
  const id_emisor = localStorage.getItem("user_id");
  const tokenminis = localStorage.getItem("tokenminis");
  const [Listitems , setItems] = useState([]);
  useEffect(() => {
    if (content.tipo === "01") {
      setTipo("Factura");
    } else if (content.tipo === "03") {
      setTipo("Credito Fiscal");
    }

    /* Find service per factura */
    const itemsdata = async () => {
      const data = await BillsxItemsAPI.getlist(token,content.codigo_de_generacion);
      console.log("data");
      data.map((item) => {
        delete item.id;
        delete item.id_items;
        delete item.id_facturas;
      });

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

};
itemsdata();
    console.log("user");
    console.log(user);

    console.log("content");
    console.log(content);

    
  }, []);

  const ViewBillHandler = () => {
    console.log("ViewBillHandler");
  };

  const EditBillHandler = () => {
    console.log("EditBillHandler");
  };

  const DownloadBillHandler = () => {
    console.log("DownloadBillHandler");
  };

  const ValidateBillHandler = async () => { /* Firm DTE */
/* -----------------CONST DATA--------------------------- */

var data = {
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
    nrc: user.nrc ,
    nombre: user.name ,
    codActividad: user.codactividad,
    descActividad: user.descactividad, 
    telefono: user.numero_de_telefono, 
    correo: user.correo_electronico, 
    nombreComercial: user.nombre_comercial,
    tipoEstablecimiento: user.tipoestablecimiento,

    /* TODO: Just in case establecimiento  */
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
  cuerpoDocumento: Listitems ,
  resumen: {
    condicionOperacion: content.condicionoperacion, 
    totalIva: parseFloat(content.iva_percibido),/* pending */   
    saldoFavor: content.saldofavor,   
    numPagoElectronico: content.numpagoelectronico,  
    pagos: [
      {/* TODO: ADD MORE PAYMENTS */
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

    console.log("---------------resultado--------------");
    console.log(data);
    console.log("---------------resultado--------------");

/* -------------------------------------------- */
    const Firm = {
      nit: user.nit ,
      activo: true,
      passwordPri: user.passwordpri ,
      dteJson: data,
    };
    const responseFirm = await Firmservice.create(Firm);
    console.log(responseFirm);

    data.firma = responseFirm.body;
    data.sellado = content.sellado;
    data.sello = content.sello;

    console.log("---------------resultado of firm server--------------");
    console.log(responseFirm);
    const response = await PlantillaAPI.update(
      id_emisor,
      data,
      token,
      data.identificacion.codigoGeneracion
    );
    console.log("edited");
    console.log(response); 
    /*  window.location.reload();  */
  };

  const SendBillHandler = async () => {
    console.log("SendBillHandler");
    console.log(content);
    console.log("---------------resultado--------------");
    console.log(content.ambiente);
    console.log(content.tipo);
    const count = await PlantillaAPI.count(id_emisor, content.tipo, token);

    const parseintversion = parseInt(content.version);
 
    const dataSend = { /* TODO: SEND */
      tipoDte: content.tipo,
      ambiente: content.ambiente,
      idEnvio: parseInt(count[0].count + 1),
      version: parseintversion,
      codigoGeneracion: content.codigo_de_generacion,
      documento: content.firm,
    };


    try {
      console.log(dataSend);
      const senddata = await SendAPI.sendBill(dataSend, tokenminis);
      console.log(senddata);

      
    if (senddata.estado === "PROCESADO") {
      const response = await PlantillaAPI.updatesend(id_emisor,true,senddata.selloRecibido,token,content.codigo_de_generacion);
      console.log("edited");
      console.log(response);
     /*  window.location.reload(); */
    if (senddata.estado === "RECHAZADO")
      alert("Error al enviar la factura", senddata.descripcionMsg);
    }


    } catch (error) {
      console.log(error)
    }


  };

  // Determine the button color and additional content based on `content.firm`
  const buttonStyle = content.firm ? "bg-lightgreen" : "bg-whitesmoke";
  const firmbutton = content.firm ? (
    <div className=" flex flex-row">
      <button
        onClick={ValidateBillHandler}
        className={`cursor-pointer h-12 [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
      >
        <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
          Firmar
        </div>
        <img src={checkimg} alt="Tick" className="w-[30px] h-[30px]" />
      </button>
    </div>
  ) : (
    <div className=" flex flex-row">
      <button
        onClick={ValidateBillHandler}
        className={`cursor-pointer h-12 [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
      >
        <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
          Firmar
        </div>
      </button>
    </div>
  );

  const sendedebutton = content.sellado ? (
    <div className=" flex flex-row">
      <button
        onClick={SendBillHandler}
        className={`cursor-pointer h-12 [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
      >
        <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
          Enviar
        </div>
        <img src={checkimg} alt="Tick" className="w-[30px] h-[30px]" />
      </button>
    </div>
  ) : (
    <div className=" flex flex-row">
      <button
        onClick={SendBillHandler}
        className={`cursor-pointer h-12 [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
      >
        <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
          Enviar
        </div>
      </button>
    </div>
  );

  return (
    <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-2 box-border text-left text-3xs text-black font-inria-sans">
      <header className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-0.5 pb-0 pr-[52px] pl-[15px] box-border text-xl text-black font-inria-sans">
        <div className="flex flex-col items-start justify-start pt-1 px-0 pb-0">
          <h1 className="m-0 relative text-inherit font-bold z-[3]">{tipo}</h1>
        </div>
        <div className="flex flex-row items-start justify-start gap-[0px_8px]">
          <img
            className="w-[33px] h-[33px] relative object-cover z-[3]"
            loading="lazy"
            onClick={ViewBillHandler}
            alt=""
            src="/ver@2x.png"
          />
          <img
            className="w-[26px]  h-[26px] relative object-cover z-[3]"
            loading="lazy"
            onClick={EditBillHandler}
            alt=""
            src="/editar@2x.png"
          />
          <img
            className="h-[33px]  w-[30px] relative object-cover z-[3]"
            onClick={DownloadBillHandler}
            loading="lazy"
            alt=""
            src="/descargar@2x.png"
          />
        </div>
      </header>
      <div className="self-stretch flex flex-row items-start justify-start py-0 pr-[3px] pl-0">
        <div className="flex flex-row items-start justify-start gap-[0px_11px]"></div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-start py-0 px-[7px] box-border">
        <div className="flex-1 flex flex-row items-start justify-start gap-[0px_21px]">
          <div className="flex-1 flex flex-col items-start justify-start pt-[7px] px-0 pb-0">
            <div className="self-stretch flex flex-col items-start justify-start gap-[7px_0px]">
              <div className="relative whitespace-nowrap z-[1]">
                {content.re_name}
              </div>
              <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
              <div className="relative whitespace-nowrap z-[1]">
                NIT: {content.re_nit}
              </div>
              <div className="relative whitespace-nowrap z-[1]">
                Correo: {content.re_correo_electronico}
              </div>
              <div className="relative whitespace-nowrap z-[1]">
                Teléfono: {content.re_numero_telefono}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end justify-start gap-[8px_0px]">
            <button className="cursor-pointer [border:none] pt-[7px] px-2 pb-1 bg-white rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-gainsboro-100">
              <b className="relative text-11xl font-inria-sans text-black text-left whitespace-nowrap z-[2]">
                TOTAL: ${content.total_a_pagar}
              </b>
            </button>
            <div className="self-stretch flex  gap-[0px_8px]">
              {firmbutton}
              {sendedebutton} {/* Additional content if `firm` is not null */}
            </div>
          </div>
        </div>
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
export default FrameComponent1;
