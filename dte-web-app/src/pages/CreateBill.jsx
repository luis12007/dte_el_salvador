import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import BillnoCF from "../components/ClientBill";
import BillCF from "../components/ClientBillCF";
import TreeNode from "../components/TreeNode";
import TableOfContents from "../components/TableOfContentsWithDelete";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdvanceItemsComponentOnComponent from "../components/AdvanceItemsOnComponentl";
import AdvanceItemsComponent from "../components/AdvanceNoItemsComponent";
import TableOfContentsNew from "../components/TableOfContentsNew";
import Firmservice from "../services/Firm";
import PlantillaService from "../services/PlantillaService";
import PlantillaAPI from '../services/PlantillaService';
import UserService from '../services/UserServices';
const Clientes = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [CF, setCF] = useState(false);
  const [Items, setItems] = useState(false);
  const token = localStorage.getItem("token");
  const id_emisor = localStorage.getItem("user_id");
  const [userinfo, setUserinfo] = useState({});
  
  
  /* useefect */
useEffect(() => {
  const fetchData = async () => {
    const response = await UserService.getUserInfo(id_emisor, token);
    console.log("User Data");
    console.log(response);
    setUserinfo(response);
  }
  fetchData();
}, []);
  /* Data of the DTE ------------------------------------ */

const [observaciones, setObservaciones] = useState("");


  /* Call to the info of user */
// Get the current date
const now = new Date();

// Get hours, minutes, and seconds
const hours = String(now.getHours()).padStart(2, '0'); // Ensure 2 digits with leading zero
const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensure 2 digits
const seconds = String(now.getSeconds()).padStart(2, '0'); // Ensure 2 digits

// Format the time in HH:MM:SS
const time24Hour = `${hours}:${minutes}:${seconds}`;
  

  const [time, setTime] = useState({
    date: "",
    time: time24Hour.toString(),
  })
  /* Cliente array */
  var [client, setClient] = useState({
    documentType: "nit",
    name: "",
    document: "",
    address: "",
    email: null,
    phone: "",
    codActividad: "10005",
    codActividad: "10005",
    nrc: null,
    descActividad: "Otro",
  }
  );

  const [total , setTotal] = useState(0);
  const [subtotal , setSubtotal] = useState(0);


  /* Const Condiciones Operaciones array op op */

  const [contents, setContents] = useState([

  ]);

  const handleRemove = (index) => {
    setContents((prevContents) =>
      prevContents.filter((_, i) => i !== index)
    );
  };

  const handleAdd = (newContents) => {
    setContents((prevContents) => [
      ...prevContents,
      { type: newContents.type, pay: newContents.pay, mount: newContents.mount, Doc: newContents.Doc },
    ]);
  };


  /* Services Add */
  const [items, setitems] = useState([

  ]);

  const [itemsAdvance, setitemsAdvance] = useState([

  ]);

  /* Set Data ----------------------------------------------- */

  const handleChangeTime = (field, value) => {
    // Update the client state with the new value
    setTime((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  }


  const itemshandleRemove = (index) => {
    setitems((prevContents) =>
      prevContents.filter((_, i) => i !== index)
    );
  };

  const itemshandleAdd = (newContents) => {
    console.log("itemshandleAdd");
    console.log(newContents);
    setitems((prevContents) => [
      ...prevContents,
      { type: newContents.type, cuantity: newContents.cuantity, description: newContents.description, price: newContents.price },
    ]);
    console.log(items);
  };
  

  const itemsAdvancehandleRemove = (index) => {
    setitemsAdvance((prevContents) =>
      prevContents.filter((_, i) => i !== index)
    );
  };

  const itemsAdvancehandleAdd = (newContents) => {
    setitemsAdvance((prevContents) => [
      ...prevContents,
      { type: newContents.type, quantity: newContents.quantity, code: newContents.code, units: newContents.units, description: newContents.description, saleType: newContents.saleType, price: newContents.price, taxes: newContents.taxes },
    ]);
  };


  /* navigate and fu */

  const navigate = useNavigate();

  const addBillHandler = async () => {
    console.log(client);
    console.log(time);
    console.log(Items);
    console.log(observaciones);
  }
  /* ---------------------------------------------------------- */
  const addBillHandler2 = async () => {


    /* Counting the sentences*/  
    const count = await PlantillaAPI.count(id_emisor,"01",token)


    const myUuid = uuidv4().toUpperCase().toString();


    var data = {
      identificacion: { 
        version: 1, /* TODO:D DONE change when update*/
        ambiente: userinfo.ambiente, /* DONE Change when production */
        tipoDte: "01", /* DONE 01 factura  and  03 CF*/
        numeroControl: getNextFormattedNumber(count[0].count), /* DONE */
        codigoGeneracion: myUuid, /* DONE */
        tipoModelo: 1, /* DONE 1 Modelo Facturación previo and 2 modelo diferido ???        */
        tipoOperacion: 1, /* DONE 1 Transmisión normal  2 to contingencia       */
        fecEmi: time.date.toString(), /* DONE  */
        horEmi: time.time, /* DONE */
        tipoMoneda: "USD", /* DONE STOCK */
        tipoContingencia: null, /* DONE review the types (Stock) */
        motivoContin: null /* DONE STOCK */
      },
      documentoRelacionado: null, /* DONE STOCK */
      emisor: { 
        direccion: {
          municipio: userinfo.municipio, /* DONE */
          departamento: userinfo.departamento, /* DONE */
          complemento: userinfo.direccion /* DONE */
        },
        nit: userinfo.nit /* DONE*/,
        nrc: userinfo.nrc /* DONE */,
        nombre:
          userinfo.name /* DONE DINAMIC LOCAL */,
        codActividad:
          userinfo.codActividad /* DONE CAT-019 Código de Actividad Económica 86203 Servicios médicos */,
        descActividad: userinfo.descActividad, /* DONE DINAMIC LOCAL */
        telefono: userinfo.numero_de_telefono, /* DONE DINAMIC LOCAL */
        correo: userinfo.correo_electronico, /* DONE DINAMIC LOCAL */
        nombreComercial: userinfo.nombre_comercial, /* DONE DINAMIC LOCAL */
        tipoEstablecimiento: userinfo.tipoEstablecimiento , /*DONE 01 Sucursal / Agencia   02 Casa matriz   04 Bodega   07 Predio y/o patio   20 Otro  */

        /* TODO: Just in case establecimiento  */
        codEstableMH: "0000",  /* Pending dinamic LOCAL */
        codEstable: "0000",  /* Pending dinamic LOCAL */
        codPuntoVentaMH: "0000",  /* Pending dinamic LOCAL */
        codPuntoVenta: "0000"  /* Pending dinamic LOCAL */
      },
      receptor: { 
        codActividad: client.codActividad, /* DONE */
        direccion: client.address, /* DONE DINAMIC LOCAL */
        nrc: client.nrc, /* DONE DINAMIC LOCAL */
        descActividad: client.descActividad, /* DONE  DINAMIC LOCAL */
        correo: client.email, /* DONE  DINAMIC LOCAL */
        tipoDocumento: client.documentType, /* DONE  36 NIT   13 DUI   37 Otro   03 Pasaporte   02 Carnet de Residente  */
        nombre: client.name, /* DONE  DINAMIC LOCAL */
        telefono: client.phone, /* DONE  DINAMIC LOCAL */
        numDocumento: client.document /* DINAMIC LOCAL */
      },
      otrosDocumentos: null, /* DONE  STOCK */
      ventaTercero: null, /* DONE  STOCK */
      cuerpoDocumento: [ 
        {
          codTributo: null, /* DONE  STOCK */
          descripcion: "TALONARIO PARQUEO: 50 TICKETS", /* DINAMIC LOCAL */
          uniMedida: 99, /* CAT-014 Unidad de Medida 99 otra PENDING */
          codigo: "EST003", /* DINAMIC LOCAL */
          cantidad: 1, /* DINAMIC LOCAL */
          numItem: 1, /* DINAMIC LOCAL */
          tributos: null, /* STOCK */
          ivaItem: 3.4513, /* STOCK */
          noGravado: 0, /* DINAMIC LOCAL */
          psv: 0, /* DINAMIC LOCAL */
          montoDescu: 0, /* DINAMIC LOCAL */
          numeroDocumento: null, /* STOCK */
          precioUni: 29.9999, /* DINAMIC LOCAL */
          ventaGravada: 29.9999, /* DINAMIC LOCAL */
          ventaExenta: 0, /* STOCK */
          ventaNoSuj: 0, /* STOCK */
          tipoItem: 2 /* 1 bienes 2 servicio 3 ambos 4 otros */
        }
      ],
      resumen: {
        condicionOperacion: 1, /* 1 Contado 2 A crédito  3 Otro    */
        totalIva: 3.45,   /* DINAMIC LOCAL */
        saldoFavor: 0,  /* STOCK */
        numPagoElectronico: null, /* STOCK */
        pagos: [
          {
            periodo: null, /* STOCK */
            plazo: null, /* STOCK */
            montoPago: 30,  /* DINAMIC LOCAL */
            codigo: "01", /* 01 Billetes y monedas
            02 Tarjeta Débito
            03 Tarjeta Crédito
            04 Cheque
            05 Transferencia_ Depósito Bancario
            06 Vales o Cupones
            08 Dinero electrónico
            09 Monedero electrónico
            10 Certificado o tarjeta de regalo
            11 Bitcoin
            12 Otras Criptomonedas
            13 Cuentas por pagar del receptor
            14 Giro bancario
            99 Otros (se debe indicar el medio de pago) 
             */
            referencia: "20240306090346" /* DINAMIC LOCAL */
          }
        ],
        totalNoSuj: 0, /* STOCK */
        tributos: null, /* STOCK */
        totalLetras: "TREINTA CON 0\/100 D\u00d3LARES", /* DINAMIC LOCAL */
        totalExenta: 0, /* STOCK */
        subTotalVentas: 30, /* DINAMIC LOCAL */
        totalGravada: 30, /* DINAMIC LOCAL */
        montoTotalOperacion: 30, /* DINAMIC LOCAL */
        descuNoSuj: 0,/* STOCK */
        descuExenta: 0,/* STOCK */
        descuGravada: 0,/* STOCK */
        porcentajeDescuento: 0,/* STOCK */
        totalDescu: 0, /* DINAMIC LOCAL */
        subTotal: 30, /* DINAMIC LOCAL */
        ivaRete1: 0,/* STOCK */
        reteRenta: 0,/* STOCK */
        totalNoGravado: 0,/* STOCK */
        totalPagar: 30 /* DINAMIC LOCAL */
      },
      extension: {
        docuEntrega: null,/* DONE  STOCK */
        nombRecibe: null,/* DONE  STOCK */
        observaciones: observaciones,/* DONE  STOCK */
        placaVehiculo: null,/* DONE  STOCK */
        nombEntrega: null, /* DONE  STOCK */
        docuRecibe: null /* DONE  STOCK */
      },
      apendice: null, /* DONE  STOCK */
      firma: null, /* Firm the document to the API */
    };

    console.log(data);
    const Firm = {
      nit: "02101601741065", /* QUEMADO */
      activo: true,
      passwordPri: "Halogenados2024",  /* QUEMADO */
      dteJson: data
    }

    const responsePlantilla = await PlantillaService.create(data,token, id_emisor);

    console.log("PlantillaService - Create");
    console.log(responsePlantilla);





  };

  /* ---------------------------------------------------------- */





  const goBackHandler = () => {
    navigate("/Principal");
  };
  /* Logic of select to go to bill or CF */
  const ChangeHandler = (selectedValue) => {
    if (selectedValue === "Factura") {
      console.log("Factura");
    } else if (selectedValue === "CF") {
      navigate("/crear/creditofiscal");
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    ChangeHandler(event.target.value);
  };

  /* Logic of renderize CF or NotCF */
  const handleSelectChangeCFClient = () => {
    setCF(!CF);
    console.log(client);
  };

  /* Logic of items */
  const handleSelectChangeItemsClient = () => {
    setItems(!Items);
  };



  /* utils ----------------------------------- */

  /**
 * Increments a number and returns it in the specified format.
 * 
 * @param {number} currentNumber - The current number to increment.
 * @param {number} totalDigits - The total number of digits for the output.
 * @returns {string} The incremented number in the desired format.
 */
function getNextFormattedNumber(currentNumber, totalDigits = 15) {
  // Increment the number by 1
  const incrementedNumber = currentNumber;

  // Convert the incremented number to a string
  let incrementedString = incrementedNumber.toString();

  // Pad with leading zeros to ensure the correct number of digits
  incrementedString = incrementedString.padStart(totalDigits, '0');

  // Format the output with the required prefix
  const formattedOutput = `DTE-01-00000000-${incrementedString}`;

  return formattedOutput;
}

  return (
    <form className="m-0 w-[430px] bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[17px] pb-3 pr-[15px] pl-5 box-border gap-[22px_0px] tracking-[normal]">
      <header className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start pt-4 pb-[15px] pr-3.5 pl-[17px] box-border top-[0] z-[99] sticky max-w-full">
        <div className="h-[66px] w-[390px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
        <div className="flex-1 rounded-mini bg-gainsboro-300 box-border flex flex-row items-start justify-between pt-[9px] pb-2.5 pr-[7px] pl-[15px] max-w-full gap-[20px] z-[1] border-[1px] border-solid border-white">
          <select
            onChange={handleSelectChange}
            className="h-[35px] w-[359px] relative  border-gainsboro-300 bg-gainsboro-300 border-2 max-w-full"
          >
            <option value="Factura">Factura</option>
            <option value="CF">Comprobante Credito Fiscal</option>
          </select>
          {/* Your other elements */}
        </div>
      </header>
      <section className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-6 box-border gap-[5px] max-w-full">
        <div className="self-stretch h-[163px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
          <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
          <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
            General
          </b>
          <div className="flex flex-col items-start justify-start pt-px px-0 pb-0">
            <img
              className="w-[18px] h-4 relative object-contain z-[2]"
              alt=""
              src="/atras-1@2x.png"
            />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-2.5 box-border max-w-full">
          
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
              <div className="flex flex-row items-start justify-start py-0 px-[3px]">
                Fecha
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <input
                className="w-full  [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="date"
                /* Onchange settime.date */
                onChange={(e) => handleChangeTime("date", e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      {CF ? (
        <BillCF handleSelectChangeCFClient={handleSelectChangeCFClient} setClient={setClient} />
      ) : (
        <BillnoCF handleSelectChangeCFClient={handleSelectChangeCFClient} setClient={setClient} />
      )}

      {Items ? (
        <AdvanceItemsComponentOnComponent
          handleSelectChangeItemsClient={handleSelectChangeItemsClient}
          itemsAdvancehandleRemove={itemsAdvancehandleRemove}
          itemsAdvancehandleAdd={itemsAdvancehandleAdd}
          itemsAdvance={itemsAdvance}

        />
      ) : (
        <AdvanceItemsComponent
          handleSelectChangeItemsClient={handleSelectChangeItemsClient}
          itemshandleRemove={itemshandleRemove}
          itemshandleAdd={itemshandleAdd}
          items={items}

        />
      )}

      <TreeNode subtotal="Subtotal" />
      <TreeNode subtotal="Total Tributos" />
      <TreeNode subtotal="Total a Pagar" />
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full">
        <form className="m-0 flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[25px] box-border gap-[10px] max-w-full">
          <div className="self-stretch h-[581px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-3 px-[9px] pb-[11px] box-border relative whitespace-nowrap max-w-full z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full z-[0]" />
            <img
              className="h-4 w-[18px] absolute !m-[0] top-[10px] right-[17px] object-contain z-[2]"
              alt=""
              src="/atras-1@2x.png"
            />
            <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
              Condiciones de la Operación
            </b>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[23.5px_0px] max-w-full">
              <div className="self-stretch flex flex-col items-start justify-start gap-[13px_0px] max-w-full">
                <div className="self-stretch flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
                  <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                    <div className="relative text-xs font-inria-sans text-black text-left z-[1]"></div>
                    <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                    <div>
                      <span className="text-black">Tipo</span>
                      <span className="text-tomato">*</span>
                    </div>
                    <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                      <select
                        className="w-full h-full relative  border-white bg-white border-2 max-w-full"
                        type="text"
                      >
                        <option value="1">Contado</option>
                        <option value="2">Crédito</option>
                        <option value="3">Otro</option>
                      </select>
                    </div>
                  </div>
                  <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
                </div>
                <div className="self-stretch flex flex-col items-end justify-start gap-[28px] max-w-full z-[1]">
                  {contents.map((content, index) => (
                    <TableOfContents
                      key={index}
                      content={content}
                      onRemove={() => handleRemove(index)}
                    />
                  ))}
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[13px_0px]">
                <TableOfContentsNew handleAdd={handleAdd} /> {/* TODO: Add the credit metod */}
              </div>
            </div>
          </div>
        </form>
      </section>
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0 pl-[5px] box-border max-w-full">
        <textarea
          className="[border:none] bg-white h-[163px] w-auto [outline:none] flex-1 rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-[11px] px-[17px] pb-2 box-border font-inria-sans font-bold text-mini text-black max-w-full"
          placeholder="Observaciones"
          rows={8}
          cols={20}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </section>
      <footer className="self-stretch flex flex-row items-start justify-center py-0 pr-5 pl-[27px]">
        <div className="flex flex-col items-start justify-start gap-[13px_0px]">
          <button
            onClick={addBillHandler}
            className="cursor-pointer [border:none] pt-[13px] pb-3 pr-[23px] pl-[29px] bg-steelblue-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap hover:bg-steelblue-100"
          >
            <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
              Añadir Factura
            </b>
          </button>
          <button
            onClick={goBackHandler}
            className="cursor-pointer [border:none] pt-3 pb-[13px] pr-11 pl-[49px] bg-indianred-500 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start hover:bg-indianred-100"
          >
            <div className="h-12 w-[158px] relative rounded-3xs bg-indianred-500 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-mini font-inria-sans text-white text-left z-[1]">
              Regresar
            </b>
          </button>
        </div>
      </footer>
    </form>
  );
};

export default Clientes;
