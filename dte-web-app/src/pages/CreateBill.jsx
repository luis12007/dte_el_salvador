import React from "react";
import { v4 as uuidv4 } from "uuid";
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
import PlantillaAPI from "../services/PlantillaService";
import UserService from "../services/UserServices";
import EmisorService from "../services/emisor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isVisible } from "@testing-library/user-event/dist/utils";
import "./style.css";

const Clientes = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isVisibleClient, setIsVisibleClient] = useState(false);
  const [CF, setCF] = useState(false);
  const [Items, setItems] = useState(false);
  const token = localStorage.getItem("token");
  const id_emisor = localStorage.getItem("user_id");
  const [userinfo, setUserinfo] = useState({});
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setiva] = useState(0);
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(0);
  const [rentvalue, setRentvalue] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [valueexcenta, setValueexcenta] = useState("");
      const [isLoading, setIsLoading] = useState(false);
      const [codepayment, setCodepayment] = useState("01");
  

  const toggleButton = (event) => {
    event.preventDefault();
    if(isActivated == true){
      setValueexcenta("");
    }
    setIsActivated(!isActivated);
  };
  /* useefect */
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching user info");
      console.log("ID Emisor:", id_emisor);
      console.log("Token:", token);
      
      const response = await UserService.getUserInfo(id_emisor, token);
      console.log("User Data");
      console.log(response);
      if (response.payment === false) {
        toast.error("Error al procesar pago, por favor contacta a soporte!", {
          position: "top-center",
          autoClose: 3000, // Auto close after 3 seconds
          hideProgressBar: false, // Display the progress bar
          closeOnClick: true, // Close the toast when clicked
          draggable: true, // Allow dragging the toast
          style: { zIndex: 200000 } // Correct way to set z-index
        });
        navigate("/ingresar");
      }
      setUserinfo(response);
    };
    fetchData();
  }, []);
  /* Data of the DTE ------------------------------------ */

  const [observaciones, setObservaciones] = useState("");

  /* Call to the info of user */
  // Get the current date
  const now = new Date();

  // Get hours, minutes, and seconds
  const hours = String(now.getHours()).padStart(2, "0"); // Ensure 2 digits with leading zero
  const minutes = String(now.getMinutes()).padStart(2, "0"); // Ensure 2 digits
  const seconds = String(now.getSeconds()).padStart(2, "0"); // Ensure 2 digits

  // Format the time in HH:MM:SS
  const time24Hour = `${hours}:${minutes}:${seconds}`;

  const [time, setTime] = useState({
    date: "",
    time: time24Hour.toString(),
  });
  /* Cliente array */
  var [client, setClient] = useState({
    documentType: "13",
    name: "",
    document: null,
    address: "",
    email: null,
    phone: null,
    codActividad: "10005",
    nrc: null,
    descActividad: "Otros",
    otro: null,
  });

  var [payment, setpayment] = useState({
    paymentType: "1",
    paymentmethod: "01",
    numberdoc: "",
    mount: "",
  });

  const [Listitems, setListitems] = useState([]);

  const [items, setitems] = useState([]);

  /* Const Condiciones Operaciones array op op */

  const [contents, setContents] = useState([]);

  const handleRemove = (index) => {
    setContents((prevContents) => prevContents.filter((_, i) => i !== index));
  };

  const handleAdd = (newContents) => {
    setContents((prevContents) => [
      ...prevContents,
      {
        type: newContents.type,
        pay: newContents.pay,
        mount: newContents.mount,
        Doc: newContents.Doc,
      },
    ]);
  };

  /* Services Add */
  const [itemsAdvance, setitemsAdvance] = useState([]);

  /* Set Data ----------------------------------------------- */

  const handleChangeTime = (field, value) => {
    // Update the client state with the new value
    setTime((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };

  const itemshandleRemove = (index) => {
    setitems((prevContents) => prevContents.filter((_, i) => i !== index));

    Listitems.splice(index, 1);

    /* mapping the Listitems to reset the numItem and put 1 2 and 3 so on*/
    const Listitemsmap = Listitems.map((item, index) => {
      return {
        ...item,
        numItem: index + 1,
      };
    });
    console.log("Listitemsmap", Listitemsmap);
    setListitems(Listitemsmap);

    console.log("Listitems", Listitems);
    /* map all newitems and sum the  precioUni*cantidad */
    // Calcular el subtotal sumando el producto de precioUni y cantidad para cada artículo
    const rawSubtotal = Listitems.reduce(
      (total, item) => total + item.precioUni * item.cantidad,
      0
    );
    const rawiva = Listitems.reduce(
      (total, item) => total + (((item.ventaExenta) / 1.13) * 0.13),
      0
    );
    // Round to two decimal places
    const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
    const roundediva = Math.round(rawiva * 100) / 100;

    setiva(roundediva.toFixed(2)); // Set the rounded subtotal
    setSubtotal((roundedSubtotal - 0).toFixed(2)); // Set the rounded subtotal



    const value_rent = ((roundedSubtotal * percentage) / 100).toFixed(2);
    setRentvalue(value_rent)

    var newtotal = (roundedSubtotal - value_rent).toFixed(2);
    setTotal(newtotal)
    console.log("Subtotal", subtotal);
    console.log("Total", total);
  };


  
  /* Adding factura without IVA */
  const itemshandleAdd = (newContents) => {

    if (newContents.price === "") {
      toast.error("Item no tiene precio!", {
        position: "top-center",
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: false, // Display the progress bar
        closeOnClick: true, // Close the toast when clicked
        draggable: true, // Allow dragging the toast
        style: { zIndex: 200000 } // Correct way to set z-index
      });
      return
    }

    if (newContents.cuantity === "") {
      toast.error("Item no tiene cantidad!", {
        position: "top-center",
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: false, // Display the progress bar
        closeOnClick: true, // Close the toast when clicked
        draggable: true, // Allow dragging the toast
        style: { zIndex: 200000 } // Correct way to set z-index
      });
      return
    }

    if (newContents.description === "") {
      toast.error("Item sin descripción!", {
        position: "top-center",
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: false, // Display the progress bar
        closeOnClick: true, // Close the toast when clicked
        draggable: true, // Allow dragging the toast
        style: { zIndex: 200000 } // Correct way to set z-index
      });
      return
    }


    var type = "bienes";
    if (newContents.type === "1") {
      type = "Bienes";
    } else if (newContents.type === "2") {
      type = "Servicios";
    } else if (newContents.type === "3") {
      type = "Bienes y Servicios";
    } else if (newContents.type === "4") {
      type = "Otro";
    }

    /* add items*/
    setitems((prevContents) => [
      ...prevContents,
      {
        type: type,
        cuantity: newContents.cuantity,
        description: newContents.description,
        price: newContents.price,
      },
    ]);

    const cuantityint = parseInt(newContents.cuantity);
    const pricefloat = parseFloat(newContents.price);
    const typeitem = parseInt(newContents.type);

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
      ventaExenta: pricefloat * cuantityint,
      ventaNoSuj: 0,
      tipoItem: typeitem,
    };
    // Update the list with the new item
    setListitems((prevListitems) => [...prevListitems, newItem]);
    const Listitemstrack = [...Listitems, newItem];
    console.log("Listitems", Listitemstrack);

    /* map all newitems and sum the  precioUni*cantidad */
    // Calcular el subtotal sumando el producto de precioUni y cantidad para cada artículo
    const rawSubtotal = Listitemstrack.reduce(
      (total, item) => total + item.precioUni * item.cantidad,
      0
    );
    const rawiva = Listitemstrack.reduce(
      (total, item) => total + (((item.ventaExenta) / 1.13) * 0.13),
      0
    );
    
    console.log("rawiva:", rawiva);
    console.log("rawiva", rawiva);

    // Round to two decimal places
    const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
    const roundediva = Math.round(rawiva * 100) / 100;


    setiva(rawiva.toFixed(2)); // Set the rounded subtotal
    setSubtotal((roundedSubtotal - 0).toFixed(2)); // Set the rounded subtotal

    const value_rent = ((roundedSubtotal * percentage) / 100).toFixed(2);
    setRentvalue(value_rent)

    var newtotal = (roundedSubtotal - value_rent).toFixed(2);
    setTotal(newtotal)
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
      {
        type: newContents.type,
        quantity: newContents.quantity,
        code: newContents.code,
        units: newContents.units,
        description: newContents.description,
        saleType: newContents.saleType,
        price: newContents.price,
        taxes: newContents.taxes,
      },
    ]);

  };


  /* ---------------------------------------------------------- */
  const addBillHandler = async (event) => {
    event.preventDefault();


    try {
      /* EmisorService */

      if (Listitems.length === 0) {
        toast.error("Factura no items en factura!", {
          position: "top-center",
          autoClose: 3000, // Auto close after 3 seconds
          hideProgressBar: false, // Display the progress bar
          closeOnClick: true, // Close the toast when clicked
          draggable: true, // Allow dragging the toast,
          style: { zIndex: 200000 } // Correct way to set z-index
        });
        return;
      }
      console.log("document");
      console.log(client.document);
      if (client.document === "") {
        toast.error("El documeno no puede tener guiones!", {
          position: "top-center",
          autoClose: 3000, // Auto close after 3 seconds
          hideProgressBar: false, // Display the progress bar
          closeOnClick: true, // Close the toast when clicked
          draggable: true, // Allow dragging the toast,
          style: { zIndex: 200000 } // Correct way to set z-index

        });
        return;
      }
      if (time.date === "") {
        toast.error("Factura no fecha!", {
          position: "top-center",
          autoClose: 3000, // Auto close after 3 seconds
          hideProgressBar: false, // Display the progress bar
          closeOnClick: true, // Close the toast when clicked
          draggable: true, // Allow dragging the toast
          style: { zIndex: 200000 } // Correct way to set z-index

        });
        return;

      }

    } catch (error) {
      console.log(error);
    }

    /* Counting the sentences*/
    /* const count = await PlantillaAPI.count(id_emisor, "01", token) */

    try {
      const myUuid = uuidv4().toUpperCase().toString();

      const conditionoperationint = parseInt(payment.paymentType);

      if (client.documentType === "13") {
        /* if has already - dont */
        if (client.document === null || client.document === undefined) {
          toast.error("Error el documento del cliente no puede estar vacío!")
          return;
        }
        if (client.document.includes("-")) {
          toast.error("Error el documento del cliente no puede tener guiones!")
          return;
        } else {
          client.document = formatDUI(client.document);
        }
      }

      /* validating the email form of email */
      if (client.email !== null) {
        if (!validateEmail(client.email)) {
          toast.error("Formato de correo electrónico no válido!", {
            position: "top-center",
            autoClose: 3000, // Auto close after 3 seconds
            hideProgressBar: false, // Display the progress bar
            closeOnClick: true, // Close the toast when clicked
            draggable: true, // Allow dragging the toast
            style: { zIndex: 200000 } // Correct way to set z-index
          });
          return;
        }
      }

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
          motivoContin: null,
        },
        documentoRelacionado: null,
        emisor: {
          direccion: {
            municipio: userinfo.municipio,
            departamento: userinfo.departamento,
            complemento: userinfo.direccion,
          },
          nit: userinfo.nit,
          nrc: userinfo.nrc,
          nombre: userinfo.name,
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
          codPuntoVenta: null,
        },
        receptor: {
          /* TODO ADDRES */ codActividad: client.codActividad,
          direccion: client.address,
          nrc: client.nrc,
          descActividad: client.descActividad,
          correo: client.email,
          tipoDocumento: client.documentType,
          nombre: client.name,
          telefono: client.phone,
          numDocumento: client.document,
        },
        otrosDocumentos: null,
        ventaTercero: null,
        cuerpoDocumento: Listitems,
        resumen: {
          condicionOperacion: conditionoperationint,
          totalIva: 0 /* totalIva: iva, IVA 0.1154 percent ----------------- Eliminated here*/,
          saldoFavor: 0,
          numPagoElectronico: null,
          pagos: [
            {
              /* TODO: ADD MORE PAYMENTS */ periodo: null,
              plazo: null,
              montoPago: total,
              codigo: codepayment,
              referencia: null,
            },
          ],
          /* Changing the agravada for exenta */
          totalNoSuj: 0,
          tributos: null,
          totalLetras: convertirDineroALetras(total),
          totalExenta: subtotal,
          subTotalVentas: subtotal,
          totalGravada: 0,
          montoTotalOperacion: subtotal,
          descuNoSuj: 0,
          descuExenta: 0,
          descuGravada: 0,
          porcentajeDescuento: 0,
          totalDescu: 0,
          subTotal: subtotal,
          ivaRete1: 0,
          reteRenta: rentvalue,
          totalNoGravado: 0,
          totalPagar: total,
        },
        extension: {
          docuEntrega: null,
          nombRecibe: null,
          observaciones: observaciones,
          placaVehiculo: null,
          nombEntrega: null,
          docuRecibe: null,
        },
        apendice: null,
        id_envio: userinfo.id_envio,
      };

      /* exento to agravado */
    if (valueexcenta == "" || valueexcenta == null) {
      
    const updatedListitems = Listitems.map(item => {
    const priceunit = item.precioUni / 1.13;
    const ivaperitemfinal = (item.precioUni * item.cantidad) / 1.13;
    console.log("Priceunit", ivaperitemfinal);
    const ivaItemcount = (ivaperitemfinal * 0.13);
      const updatedItem = {
        ...item,
        ventaGravada: (item.precioUni * item.cantidad).toFixed(2),
        ventaExenta: 0,
        tributos: null,
        ivaItem: ivaperitemfinal * 0.13,
        precioUni: item.precioUni.toFixed(2),
      };
      return updatedItem;
    });
    console.log("UpdatedListitems");
    console.log(updatedListitems);

    const rawiva = updatedListitems.reduce(
      (total, item) => total + Number(item.ivaItem),
      0
    );

        const rawSubtotal = updatedListitems.reduce(
          (total, item) => total + item.precioUni * item.cantidad,
          0
        );
        console.log("Data");
        console.log(rawiva);
        const subtotalplusiva = rawSubtotal + rawiva;
        const totalpagar = rawSubtotal - rentvalue;
        data.resumen.totalIva = rawiva.toFixed(2);
        data.resumen.totalGravada = rawSubtotal.toFixed(2);
        data.resumen.subTotal = rawSubtotal.toFixed(2);
        data.resumen.pagos[0].montoPago = rawSubtotal.toFixed(2);
        data.resumen.totalExenta = 0;
        data.resumen.montoTotalOperacion = rawSubtotal.toFixed(2);
        data.resumen.totalPagar = totalpagar.toFixed(2);

        data.resumen.totalLetras = convertirDineroALetras(rawSubtotal.toFixed(2));
        data.resumen.subTotalVentas = rawSubtotal.toFixed(2);

        
        data.cuerpoDocumento = updatedListitems;

      }

      if (client.name === "") {
        toast.error("Factura no tiene nombre de cliente!");
        return;
      }

      if (client.phone === "") {
        data.receptor.telefono = null;
      }

      if (client.address === "") {
        data.receptor.direccion = null;
      }

      const response = await EmisorService.count_factura(id_emisor, token);
      console.log("Count Factura");
      console.log(response);

      const responseincrement = await UserService.id_enviopus1(id_emisor, token);
      console.log("incremented");
      console.log(responseincrement);

      console.log("Data");
      console.log(data);
      setIsLoading(true);

      /* 
    TODO CHANGE THIS THE OTHER SIDE console.log(data);
     const Firm = {
       nit: userinfo.nit, 
       activo: true,
       passwordPri: userinfo.passwordPri, 
       dteJson: data
     } */

      const responsePlantilla = await PlantillaService.create(
        data,
        token,
        id_emisor
      );
      setIsLoading(false);
      console.log("PlantillaService - Create");
      console.log(responsePlantilla.message);
      if (responsePlantilla.message === "Error en el servidor") {
        toast.error("Factura no creada!", {
          position: "top-center",
          autoClose: 3000, // Auto close after 3 seconds
          hideProgressBar: false, // Display the progress bar
          closeOnClick: true, // Close the toast when clicked
          draggable: true, // Allow dragging the toast
        });
        return;
      }
      

      if (responsePlantilla.message != "Error en el servidor") {
        toast.success("Factura creada!", {
          position: "top-center",
          autoClose: 3000, // Auto close after 3 seconds
          hideProgressBar: false, // Display the progress bar
          closeOnClick: true, // Close the toast when clicked
          draggable: true, // Allow dragging the toast
        });

        /* wait 5 seconds and navigate */
        setTimeout(() => {

          navigate("/facturas");

        }, 4000);


        return;
      }

      /* 
    navigate("/facturas");  */
    } catch (error) {
      toast.error("Factura no creada!", {
        position: "top-center",
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: false, // Display the progress bar
        closeOnClick: true, // Close the toast when clicked
        draggable: true, // Allow dragging the toast
      });
      console.log(error);
    }
  };

  /* ---------------------------------------------------------- */

  /* Logic of validating email */
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const goBackHandler = () => {
    navigate("/Principal");
  };
  /* Logic of select to go to bill or CF */
  const ChangeHandler = (selectedValue) => {
    if (selectedValue === "Factura") {
      console.log("Factura");
    } else if (selectedValue === "CF") {
      navigate("/crear/creditofiscal");
    } else if (selectedValue === "SU") {
      navigate("/crear/sujeto_excluido");
    } else if (selectedValue === "NC") {
      navigate("/crear/nota_credito");
    } else if (selectedValue === "ND") {
      navigate("/crear/Nota_debito");
    } else if (selectedValue === "CR") {
      navigate("/crear/Comprobante_Retencion");
    }
  };

  const handleSelectChange = (event) => {
    event.preventDefault();
    setSelectedOption(event.target.value);
    ChangeHandler(event.target.value);
  };

  /* Logic of renderize CF or NotCF */
  const handleSelectClient = (event) => {
    event.preventDefault();
    setIsVisibleClient(!isVisibleClient);
  };

  const onSelectClient = (event, clientset) => {
    event.preventDefault();

    if (client.documentType == "36") {
      setClient({
        documentType: "36",
        name: clientset.name || "",
        document: clientset.nit || "",
        address: clientset.direccion || "",
        email: clientset.correo_electronico || "",
        phone: clientset.numero_telefono || "",
        codActividad: clientset.actividad_economica || "",
        nrc: null,
        descActividad: "Otros",
      });
    
    } else if (client.documentType == "37") {
        setClient({
        documentType: "37",
        name: clientset.name,
        document: clientset.otro,
        address: clientset.direccion,
        email: clientset.correo_electronico,
        phone: clientset.numero_telefono,
        codActividad: clientset.actividad_economica,
        nrc: null,
        descActividad: "Otros",
      });
    } else {
      setClient({
        documentType: "13",
        name: clientset.name,
        document: clientset.dui,
        address: clientset.direccion,
        email: clientset.correo_electronico,
        phone: clientset.numero_telefono,
        codActividad: clientset.actividad_economica,
        nrc: null,
        descActividad: "Otros",
      });
    }
    console.log(clientset);
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
    incrementedString = incrementedString.padStart(totalDigits, "0");

    // Format the output with the required prefix
    const formattedOutput = `DTE-01-00000${userinfo.ambiente}0-${incrementedString}`;

    return formattedOutput;
  }

  const convertirDineroALetras = (cantidad) => {


    // Asegurarse de que la cantidad tenga como máximo dos decimales
    const cantidadRedondeada = Math.round(cantidad * 100) / 100;
    const partes = cantidadRedondeada.toFixed(2).split("."); // Divide la parte entera de los decimales

    const dolares = parseInt(partes[0], 10); // Parte entera
    const centavos = parseInt(partes[1], 10); // Parte decimal

    if (dolares > Number.MAX_SAFE_INTEGER) {
      throw new Error(
        "La cantidad en dólares es demasiado grande para convertir."
      );
    }

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

  const convertirNumeroALetras = (numero) => {
    const unidades = [
      "",
      "UNO",
      "DOS",
      "TRES",
      "CUATRO",
      "CINCO",
      "SEIS",
      "SIETE",
      "OCHO",
      "NUEVE",
    ];
    const especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE"];
    const decenas = [
      "",
      "",
      "VEINTE",
      "TREINTA",
      "CUARENTA",
      "CINCUENTA",
      "SESENTA",
      "SETENTA",
      "OCHENTA",
      "NOVENTA",
    ];
    const centenas = [
      "",
      "CIEN",
      "DOSCIENTOS",
      "TRESCIENTOS",
      "CUATROCIENTOS",
      "QUINIENTOS",
      "SEISCIENTOS",
      "SETECIENTOS",
      "OCHOCIENTOS",
      "NOVECIENTOS",
    ];

    if (numero === 0) return "CERO";

    if (numero < 10) return unidades[numero];

    if (numero < 16) return especiales[numero - 10];

    if (numero < 20) return "DIECI" + unidades[numero - 10];

    if (numero < 30)
      return numero === 20 ? "VEINTE" : "VEINTI" + unidades[numero - 20];

    if (numero < 100) {
      const decena = Math.floor(numero / 10);
      const unidad = numero % 10;
      return decenas[decena] + (unidad > 0 ? " Y " + unidades[unidad] : "");
    }

    if (numero < 1000) {
      const centena = Math.floor(numero / 100);
      const resto = numero % 100;
      return (
        (centena === 1 && resto > 0 ? "CIENTO" : centenas[centena]) +
        (resto > 0 ? " " + convertirNumeroALetras(resto) : "")
      );
    }

    if (numero < 1000000) {
      const miles = Math.floor(numero / 1000);
      const resto = numero % 1000;
      return (
        (miles === 1 ? "MIL" : convertirNumeroALetras(miles) + " MIL") +
        (resto > 0 ? " " + convertirNumeroALetras(resto) : "")
      );
    }

    if (numero < 1000000000) {
      const millones = Math.floor(numero / 1000000);
      const resto = numero % 1000000;
      return (
        (millones === 1
          ? "UN MILLÓN"
          : convertirNumeroALetras(millones) + " MILLONES") +
        (resto > 0 ? " " + convertirNumeroALetras(resto) : "")
      );
    }

    throw new Error("Número demasiado grande para convertir.");
  };


  /* Function i will give it a number like 063842754 and it will gives me a string 06384275-4 */
  function formatDUI(num) {
    const str = num.toString();
    return str.slice(0, -1) + "-" + str.slice(-1);
  }

  /* examples of input and output */



  const handlePercentageChange = (e) => {
    setPercentage(e.target.value);
    console.log("Percentage", e.target.value);

    const value_rent = ((subtotal * e.target.value) / 100).toFixed(2);
    console.log(value_rent);
    setRentvalue(value_rent)

    var newtotal = (subtotal - value_rent).toFixed(2);
    setTotal(newtotal)

  };

  return (
    <form className="m-0 w-full bg-steelblue-300 overflow-hidden flex flex-col items-center justify-center text-center pt-[17px] pb-5 pr-[15px] pl-5 box-border gap-[22px_0px]  ">
      <header className="rounded-mini  bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-center justify-center pt-4 pb-[15px] pr-3.5 pl-[17px] box-border top-[0] z-[99] sticky max-w-full self-stretch ch:w-1/3 ch:self-center">
        <div className="h-[66px] w-[390px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
        <div className="flex-1 rounded-mini bg-gainsboro-300 box-border flex flex-row items-start justify-between pt-[9px] pb-2.5 pr-[7px] pl-[15px] max-w-full gap-[20px] z-[1] border-[1px] border-solid border-white ">
          <select
            onChange={handleSelectChange}
            className="h-[35px] w-full relative  border-gainsboro-300 bg-gainsboro-300 border-2 max-w-full"
          >
            <option value="Factura">Factura</option>
            <option value="CF">Comprobante Crédito Fiscal</option>
            <option value="SU">Factura de Sujeto Excluido</option>
            <option value="NC">Nota de Crédito</option>
            <option value="ND">Nota de Débito</option>

          </select>
          {/* Your other elements */}
        </div>
      </header>
      <section className=" rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-6 box-border gap-[5px] max-w-full self-stretch  ch:w-1/3 ch:self-center">
        <div className="self-stretch h-[163px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden " />
        <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1] ">
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
        <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-2.5 box-border max-w-full"></div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
              <div className="flex flex-row items-start justify-start py-0 px-[3px]">
                Fecha
                <span className="text-tomato pl-1"> *</span>
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
        <BillCF
          handleSelectClient={handleSelectClient}
          setClient={setClient}
          client={client}
        />
      ) : (
        <BillnoCF
          handleSelectClient={handleSelectClient}
          setClient={setClient}
          client={client}
          isVisibleClient={isVisibleClient}
          onSelectClient={onSelectClient}
        />
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
          percentage={percentage}
          rentvalue={rentvalue}
          handlePercentageChange={handlePercentageChange}
        />
      )}

      {/* <TreeNode text="Subtotal" data={subtotal} />
      <TreeNode text="IVA" data={iva} />
      <TreeNode text="Total a Pagar" data={total} /> */}
      <TreeNode text="Subtotal" data={subtotal} />
      <TreeNode text="IVA" data={iva} />
      <TreeNode text="Renta Retenida" data={rentvalue} />
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

        {/* Tarjeta para seleccionar el medio de pago */}
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0 pl-[5px] box-border max-w-full ch:w-1/3 ch:self-center">
        <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-5 box-border gap-[10px] max-w-full z-[1]">
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-center justify-between pt-[11px] px-[17px] pb-2 box-border relative max-w-full z-[2]">
            <b className="relative z-[3] text-xs font-inria-sans text-black">Metodo de Pago</b>
          </div>
          <div className="max-w-full self-stretch px-[17px] py-2 ">
            <select
              value={codepayment}
              onChange={e => setCodepayment(e.target.value)}
              className="w-full h-[35px] border border-gray-300 rounded-md bg-white text-xs font-inria-sans text-black"
            >
              <option value="01">Billetes y monedas</option>
              <option value="02">Tarjeta Débito</option>
              <option value="03">Tarjeta Crédito</option>
              <option value="04">Cheque</option>
              <option value="05">Transferencia / Depósito Bancario</option>
              <option value="06">Vales o Cupones</option>
              <option value="08">Dinero electrónico</option>
              <option value="09">Monedero electrónico</option>
              <option value="10">Certificado o tarjeta de regalo</option>
              <option value="11">Bitcoin</option>
              <option value="12">Otras Criptomonedas</option>
              <option value="13">Cuentas por pagar del receptor</option>
              <option value="14">Giro bancario</option>
            </select>
          </div>
        </div>
      </section>

      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full text-left text-mini text-black font-inria-sans ch:w-1/3 ch:self-center">
        <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-5 box-border gap-[14px] max-w-full z-[1]">
          <div className="self-stretch h-[101px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <div className="self-stretch h-[101px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-[11px] px-[17px] pb-2 box-border relative max-w-full z-[2]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full z-[0]" />
            {/* <img
            className="h-4 w-[18px] absolute !m-[0] right-[20px] bottom-[9px] object-contain z-[3]"
            alt=""
            src="/atras-1@2x.png"
          /> */}
            <b className="relative z-[3]">Exento</b>
          </div>
          <div className="flex flex-row items-start justify-start py-0 px-[17px] text-6xl">
            <div className="relative flex whitespace-nowrap z-[2]">
              <button
                onClick={(event) => toggleButton(event)}
                className={`px-4 py-2 rounded-md text-white font-bold transition-transform duration-200 ${isActivated ? 'bg-steelblue-200' : 'bg-indianred-300'
                  } ${isActivated ? 'transform scale-95' : 'transform scale-100'}`}
              >
                {isActivated ? 'Activado' : 'Desactivado'}
              </button>
              {isActivated && <input type="text" className="border border-black rounded-lg ml-4 pl-3 " placeholder="codigo de exento"  onChange={(e) => setValueexcenta(e.target.value)}/>}
            </div>
          </div>
        </div>
      </section>
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0 pl-[5px] box-border max-w-full ch:w-1/3 ch:self-center">
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
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}
      <ToastContainer className={"toast-notification"} />
    </form>
  );
};

export default Clientes;
