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
import EmisorService from '../services/emisor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Clientes = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [CF, setCF] = useState(false);
  const [Items, setItems] = useState(false);
  const token = localStorage.getItem("token");
  const id_emisor = localStorage.getItem("user_id");
  const [userinfo, setUserinfo] = useState({});
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setiva] = useState(0);
  const navigate = useNavigate();


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
    documentType: "36",
    name: "",
    document: "",
    address: "",
    email: null,
    phone: null,
    codActividad: "10005",
    nrc: null,
    descActividad: "Otros",
  }
  );

  var [payment, setpayment] = useState({
    paymentType: "1",
    paymentmethod: "01",
    numberdoc: "",
    mount: "",
  }
  );

  const [Listitems, setListitems] = useState([
  ]);

  const [items, setitems] = useState([])



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

 /* before with IVA
 const itemshandleAdd = (newContents) => {

    var type = "bienes"
    if (newContents.type === "1") {
      type = "Bienes";
    } else if (newContents.type === "2") {
      type = "Servicios";
    }
    else if (newContents.type === "3") {
      type = "Bienes y Servicios";
    }
    else if (newContents.type === "4") {
      type = "Otro";
    }

    setitems((prevContents) => [
      ...prevContents,
      { type: type, cuantity: newContents.cuantity, description: newContents.description, price: newContents.price },
    ]);

    const cuantityint = parseInt(newContents.cuantity);
    const pricefloat = parseFloat(newContents.price);
    const typeitem = parseInt(newContents.type);

    const ivaperitem = pricefloat / 1.13;
    const ivaperitemfinal = ivaperitem * 0.13;
    const ivarounded = Math.round(ivaperitemfinal * 100) / 100;
    const newItem = {
      codTributo: null,
      descripcion: newContents.description, 
      uniMedida: 99,
      codigo: null,
      cantidad: cuantityint, 
      numItem: Listitems.length + 1, 
      tributos: null,
      ivaItem: ivarounded, 
      noGravado: 0,
      psv: 0, 
      montoDescu: 0, 
      numeroDocumento: null, 
      precioUni: pricefloat, 
      ventaGravada: (pricefloat*cuantityint) + ivarounded*cuantityint, 
      ventaExenta: 0, 
      ventaNoSuj: 0, 
      tipoItem: typeitem, 
    };
    // Update the list with the new item
    setListitems((prevListitems) => [...prevListitems, newItem]);
    const Listitemstrack = [...Listitems, newItem];
    console.log("Listitems", Listitemstrack);


    // Calcular el subtotal sumando el producto de precioUni y cantidad para cada artículo
    const rawSubtotal = Listitemstrack.reduce((total, item) => total + (item.precioUni * item.cantidad), 0);
    const rawiva = Listitemstrack.reduce((total, item) => total + (item.ivaItem * item.cantidad), 0);
    // Round to two decimal places
    const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
    const roundediva = Math.round(rawiva * 100) / 100;

    setiva(roundediva); // Set the rounded subtotal
    setSubtotal(roundedSubtotal - roundediva); // Set the rounded subtotal
    setTotal(roundedSubtotal); // Set the rounded subtotal

    console.log("Subtotal", subtotal);
    console.log("Total", total);
  }; */

  /* Adding factura without IVA */
  const itemshandleAdd = (newContents) => {

    var type = "bienes"
    if (newContents.type === "1") {
      type = "Bienes";
    } else if (newContents.type === "2") {
      type = "Servicios";
    }
    else if (newContents.type === "3") {
      type = "Bienes y Servicios";
    }
    else if (newContents.type === "4") {
      type = "Otro";
    }

    /* add items*/
    setitems((prevContents) => [
      ...prevContents,
      { type: type, cuantity: newContents.cuantity, description: newContents.description, price: newContents.price },
    ]);

    const cuantityint = parseInt(newContents.cuantity);
    const pricefloat = parseFloat(newContents.price);
    const typeitem = parseInt(newContents.type);

    const ivaperitem = pricefloat / 1.13;
    const ivaperitemfinal = ivaperitem * 0.13;
    const ivarounded = Math.round(ivaperitemfinal * 100) / 100;
    const newItem = {
      codTributo: null,
      descripcion: newContents.description, 
      uniMedida: 99,
      codigo: null,
      cantidad: cuantityint, 
      numItem: Listitems.length + 1, 
      tributos: null,
      ivaItem: 0, 
      noGravado: 0,
      psv: 0, 
      montoDescu: 0, 
      numeroDocumento: null, 
      precioUni: pricefloat, 
      ventaGravada: 0, 
      ventaExenta: pricefloat*cuantityint, 
      ventaNoSuj: 0, 
      tipoItem: typeitem, 
    };
    // Update the list with the new item
    setListitems((prevListitems) => [...prevListitems, newItem]);
    const Listitemstrack = [...Listitems, newItem];
    console.log("Listitems", Listitemstrack);

    /* map all newitems and sum the  precioUni*cantidad */
    // Calcular el subtotal sumando el producto de precioUni y cantidad para cada artículo
    const rawSubtotal = Listitemstrack.reduce((total, item) => total + (item.precioUni * item.cantidad), 0);
    const rawiva = Listitemstrack.reduce((total, item) => total + (item.ivaItem * item.cantidad), 0);
    // Round to two decimal places
    const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
    const roundediva = Math.round(rawiva * 100) / 100;

    setiva(roundediva); // Set the rounded subtotal
    setSubtotal(roundedSubtotal - roundediva); // Set the rounded subtotal
    setTotal(roundedSubtotal); // Set the rounded subtotal

    console.log("Subtotal", subtotal);
    console.log("Total", total);
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


const testbill = async () => {
// add a json mock with the structure of the data
/* const count = await PlantillaAPI.count(id_emisor, "01", token) */

try {
  /* EmisorService */
  const response = await EmisorService.count_factura(id_emisor, token);
  console.log("Count Factura");
  console.log(response);
} catch (error) {
  console.log(error);
}

    const myUuid = uuidv4().toUpperCase().toString();

    const conditionoperationint = parseInt(payment.paymentType);

    var data = {
      identificacion: {
        version: 1, 
        ambiente: "00", 
        tipoDte: "01", 
        numeroControl: userinfo.id_emisor + 1, 
        codigoGeneracion: myUuid,
        tipoModelo: 1, 
        tipoOperacion: 1, 
        fecEmi: "2024-02-02",
        horEmi: time.time,
        tipoMoneda: "USD", 
        tipoContingencia: null, 
        motivoContin: null 
      },
      documentoRelacionado: null,
      emisor: {
        direccion: {
          municipio: 1, 
          departamento: 1, 
          complemento: "userinfo.direccion" 
        },
        nit: "userinfo.nit",
        nrc: "userinfo.nrc" ,
        nombre: "userinfo.name" ,
        codActividad: "userinfo.codactividad",
        descActividad: "userinfo.descactividad", 
        telefono: "userinfo.numero_de_telefono", 
        correo: "userinfo.correo_electronico", 
        nombreComercial: "userinfo.nombre_comercial",
        tipoEstablecimiento: "userinfo.tipoestablecimiento",

        /* TODO: Just in case establecimiento  */
        codEstableMH: null,
        codEstable: null, 
        codPuntoVentaMH: null, 
        codPuntoVenta: null 
      },
      receptor: { /* TODO ADDRES */
        codActividad: "client.codActividad",
        direccion: /* client.address */null, 
        nrc: "client.nrc", 
        descActividad: "client.descActividad",
        correo: "client.email",
        tipoDocumento: "client.documentType",
        nombre: "client.name", 
        telefono: "client.phone", 
        numDocumento:" client.document"
      },
      otrosDocumentos: null, 
      ventaTercero: null, 
      cuerpoDocumento: [{
        codTributo: null,
        descripcion: "newContents.description", 
        uniMedida: 99,
        codigo: null,
        cantidad: 1, 
        numItem: 1, 
        tributos: null,
        ivaItem: 20.2, 
        noGravado: 0,
        psv: 0, 
        montoDescu: 0, 
        numeroDocumento: null, 
        precioUni: 20.2, 
        ventaGravada: 20.2, 
        ventaExenta: 0, 
        ventaNoSuj: 0, 
        tipoItem: 1, 
      }] ,
      resumen: {
        condicionOperacion: 20, 
        totalIva: 0.1154,   /* IVA 0.1154 percent -----------------*/
        saldoFavor: 0,   
        numPagoElectronico: null,  
        pagos: [
          {/* TODO: ADD MORE PAYMENTS */
            periodo: null, 
            plazo: null,  
            montoPago: 200,  
            codigo: "CODIGO DE PRODUCTO", 
            referencia: null 
          }
        ],
        totalNoSuj: 0,
        tributos: null, 
        totalLetras: "DOSCIENTOS DOLARES",  
        totalExenta: 0,  
        subTotalVentas: 200, 
        totalGravada: 200,
        montoTotalOperacion: 200, 
        descuNoSuj: 0,
        descuExenta: 0,
        descuGravada: 0,
        porcentajeDescuento: 0,
        totalDescu: 0, 
        subTotal: subtotal, 
        ivaRete1: 0,
        reteRenta: 0,
        totalNoGravado: 0,
        totalPagar: 200
      },
      extension: {
        docuEntrega: null,
        nombRecibe: null,
        observaciones: "observaciones",
        placaVehiculo: null,
        nombEntrega: null, 
        docuRecibe: null 
      },
      apendice: null,
    };

    
    console.log("Data");
    console.log(data);

    const responsePlantilla = await PlantillaService.create(data, token, id_emisor);

    console.log("PlantillaService - Create");
    console.log(responsePlantilla);
    /*  */


}
  /* ---------------------------------------------------------- */
  const addBillHandler = async (event) => {
    event.preventDefault();
    try {
      /* EmisorService */

      if (Listitems.length === 0) {
        toast.error("Factura no items en factura!", {
          position: "top-center",
          autoClose: 3000,  // Auto close after 3 seconds
          hideProgressBar: false,  // Display the progress bar
          closeOnClick: true,  // Close the toast when clicked
          draggable: true,  // Allow dragging the toast
        });
        return
      }

      if (client.document === "") {
        toast.error("Factura no cliente!", {
          position: "top-center",
          autoClose: 3000,  // Auto close after 3 seconds
          hideProgressBar: false,  // Display the progress bar
          closeOnClick: true,  // Close the toast when clicked
          draggable: true,  // Allow dragging the toast
        });
        return
      }





      const response = await EmisorService.count_factura(id_emisor, token);
      console.log("Count Factura");
      console.log(response);
    } catch (error) {
      console.log(error);
    }


    /* Counting the sentences*/
    /* const count = await PlantillaAPI.count(id_emisor, "01", token) */

    try {
      

    const myUuid = uuidv4().toUpperCase().toString();

    const conditionoperationint = parseInt(payment.paymentType);

    var data = {
      identificacion: {
        version: 1, 
        ambiente: userinfo.ambiente, 
        tipoDte: "01", 
        numeroControl: getNextFormattedNumber(userinfo.count_factura + 1), 
        codigoGeneracion: myUuid,
        tipoModelo: 1, 
        tipoOperacion: 1, 
        fecEmi: time.date.toString(),
        horEmi: time.time,
        tipoMoneda: "USD", 
        tipoContingencia: null, 
        motivoContin: null 
      },
      documentoRelacionado: null,
      emisor: {
        direccion: {
          municipio: userinfo.municipio, 
          departamento: userinfo.departamento, 
          complemento: userinfo.direccion 
        },
        nit: userinfo.nit,
        nrc: userinfo.nrc ,
        nombre: userinfo.name ,
        codActividad: userinfo.codactividad,
        descActividad: userinfo.descactividad, 
        telefono: userinfo.numero_de_telefono, 
        correo: userinfo.correo_electronico, 
        nombreComercial: userinfo.nombre_comercial,
        tipoEstablecimiento: userinfo.tipoestablecimiento,

        /* TODO: Just in case establecimiento  */
        codEstableMH: null,
        codEstable: null, 
        codPuntoVentaMH: null, 
        codPuntoVenta: null 
      },
      receptor: { /* TODO ADDRES */
        codActividad: client.codActividad,
        direccion: /* client.address */null, 
        nrc: client.nrc, 
        descActividad: client.descActividad,
        correo: client.email,
        tipoDocumento: client.documentType,
        nombre: client.name, 
        telefono: client.phone, 
        numDocumento: client.document
      },
      otrosDocumentos: null, 
      ventaTercero: null, 
      cuerpoDocumento: Listitems ,
      resumen: {
        condicionOperacion: conditionoperationint, 
        totalIva: 0,   /* totalIva: iva, IVA 0.1154 percent ----------------- Eliminated here*/
        saldoFavor: 0,   
        numPagoElectronico: null,  
        pagos: [
          {/* TODO: ADD MORE PAYMENTS */
            periodo: null, 
            plazo: null,  
            montoPago: total,  
            codigo: payment.paymentmethod, 
            referencia: null 
          }
        ],
        /* Changing the agravada for exenta */
        totalNoSuj: 0,
        tributos: null, 
        totalLetras: convertirDineroALetras(total),  
        totalExenta: total,  
        subTotalVentas: total, 
        totalGravada: 0,
        montoTotalOperacion: total, 
        descuNoSuj: 0,
        descuExenta: 0,
        descuGravada: 0,
        porcentajeDescuento: 0,
        totalDescu: 0, 
        subTotal: subtotal, 
        ivaRete1: 0,
        reteRenta: 0,
        totalNoGravado: 0,
        totalPagar: total 
      },
      extension: {
        docuEntrega: null,
        nombRecibe: null,
        observaciones: observaciones,
        placaVehiculo: null,
        nombEntrega: null, 
        docuRecibe: null 
      },
      apendice: null,
    };

    if (client.name === "") {
      data.receptor.nombre = null;
    }

    if (client.phone === "") {
      data.receptor.telefono = null;
    }
    
    console.log("Data");
    console.log(data);

    /* 
    TODO CHANGE THIS THE OTHER SIDE console.log(data);
     const Firm = {
       nit: userinfo.nit, 
       activo: true,
       passwordPri: userinfo.passwordPri, 
       dteJson: data
     } */

    const responsePlantilla = await PlantillaService.create(data, token, id_emisor);

    console.log("PlantillaService - Create");
    console.log(responsePlantilla.message);
    if (responsePlantilla.message === "Error en el servidor") {
        toast.error("Factura no creada!", {
        position: "top-center",
        autoClose: 3000,  // Auto close after 3 seconds
        hideProgressBar: false,  // Display the progress bar
        closeOnClick: true,  // Close the toast when clicked
        draggable: true,  // Allow dragging the toast
      });
      return
    } 

    if (responsePlantilla.message != "Error en el servidor") {
      toast.success("Factura creada!", {
        position: "top-center",
        autoClose: 3000,  // Auto close after 3 seconds
        hideProgressBar: false,  // Display the progress bar
        closeOnClick: true,  // Close the toast when clicked
        draggable: true,  // Allow dragging the toast
      });

      return
    }

/* 
    navigate("/facturas");  */

  } catch (error) {
    toast.error("Factura no creada!", {
      position: "top-center",
      autoClose: 3000,  // Auto close after 3 seconds
      hideProgressBar: false,  // Display the progress bar
      closeOnClick: true,  // Close the toast when clicked
      draggable: true,  // Allow dragging the toast
    });

  }

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
    const formattedOutput = `DTE-01-00000${userinfo.ambiente}0-${incrementedString}`;

    return formattedOutput;
  }


  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const especiales = ['', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  const convertirNumeroALetras = (numero) => {
    if (numero === 0) return 'CERO';

    let letras = '';
    let negativo = false;

    if (numero < 0) {
      negativo = true;
      numero = Math.abs(numero);
    }

    if (numero < 10) {
      letras = unidades[numero];
    } else if (numero < 20) {
      letras = especiales[numero - 10];
    } else if (numero < 100) {
      letras = decenas[Math.floor(numero / 10)];
      if (numero % 10 !== 0) {
        letras += ' Y ' + unidades[numero % 10];
      }
    } else if (numero < 1000) {
      letras = centenas[Math.floor(numero / 100)];
      if (numero % 100 !== 0) {
        letras += ' ' + convertirNumeroALetras(numero % 100);
      }
    } else {
      letras = 'NÚMERO DEMASIADO GRANDE PARA CONVERTIR';
    }

    return negativo ? 'MENOS ' + letras : letras;
  };

  const convertirDineroALetras = (cantidad) => {
    // Asegurarse de tener dos decimales
    const cantidadRedondeada = cantidad.toFixed(2);
    const partes = cantidadRedondeada.split('.'); // Divide la parte entera de los decimales
    const dolares = parseInt(partes[0], 10); // Parte entera
    const centavos = parseInt(partes[1], 10); // Parte decimal

    // Convierte las partes a palabras
    const dolaresEnLetras = convertirNumeroALetras(dolares);
    const centavosEnLetras = convertirNumeroALetras(centavos);

    // Construye la representación en palabras
    let resultado = `${dolaresEnLetras} DÓLARES`;

    if (centavos > 0) {
      resultado += ` CON ${centavosEnLetras} CENTAVOS`;
    }

    return resultado;
  };
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
        <BillCF handleSelectChangeCFClient={handleSelectChangeCFClient} setClient={setClient}  client={client}/>
      ) : (
        <BillnoCF handleSelectChangeCFClient={handleSelectChangeCFClient} setClient={setClient} client={client} />
      )}

      {Items ? (
        <AdvanceItemsComponentOnComponent
          handleSelectChangeItemsClient={handleSelectChangeItemsClient}
          itemsAdvancehandleRemove={itemsAdvancehandleRemove}
          itemsAdvancehandleAdd={itemsAdvancehandleAdd}
          itemsAdvance={itemsAdvance}
          items={items}
        />
      ) : (
        <AdvanceItemsComponent
          handleSelectChangeItemsClient={handleSelectChangeItemsClient}
          itemshandleRemove={itemshandleRemove}
          itemshandleAdd={itemshandleAdd}
          setListitems={setListitems}
          items={items}
        />
      )}

      {/* <TreeNode text="Subtotal" data={subtotal} />
      <TreeNode text="IVA" data={iva} />
      <TreeNode text="Total a Pagar" data={total} /> */}
      <TreeNode text="Subtotal" data={total} />
      <TreeNode text="IVA" data={0} />
      <TreeNode text="Total a Pagar" data={total} />
      {/* <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full">
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
                        onChange={(e) => setpayment({ ...payment, paymentType: e.target.value })}
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
                <TableOfContentsNew handleAdd={handleAdd} setpayment={setpayment} total={total} /> 
              </div>
            </div>
          </div>
        </form>
      </section>

       */}
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

          {/* <button
            onClick={testbill}
            className="cursor-pointer [border:none] pt-[13px] pb-3 pr-[23px] pl-[29px] bg-steelblue-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap hover:bg-steelblue-100"
          >

            <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
              probar factura
            </b>
          </button> */}


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
      <ToastContainer />
    </form>
  );
};

export default Clientes;
