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
import { useParams } from "react-router-dom";
import BillsxItemsAPI from "../services/BIllxitemsService";

/* toastify */
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const EditBill = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [CF, setCF] = useState(false);
  const [Items, setItems] = useState(false);
  const token = localStorage.getItem("token");
  const id_emisor = localStorage.getItem("user_id");
  const [userinfo, setUserinfo] = useState({});
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setiva] = useState(0);
  const [plantilla, setPlantilla] = useState({});
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [namereceptor, setNamereceptor] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [rentvalue, setRentvalue] = useState(0);
  /* get codegeneration in the url http://localhost:3001/#/editar/factura/BC9241F4-058C-4490-AE32-1D5C5A294FB7 */
  const { codigo_de_generacion } = useParams();
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
    documentType: "36",
    name: "",
    document: "",
    address: "",
    email: null,
    phone: null,
    codActividad: "10005",
    nrc: null,
    descActividad: "Otros",
  });

  /* ToEdit */

  /* useefect */
  useEffect(() => {
    const fetchData = async () => {
      const response = await UserService.getUserInfo(id_emisor, token);
      const responsePlantilla = await PlantillaService.getcodegeneration(
        codigo_de_generacion,
        token,
        id_emisor
      );
      setUserinfo(response);
      console.log(responsePlantilla);
      const dacarurrent =
        responsePlantilla.plantilla[0].fecha_y_hora_de_generacion;
      /* SetTime just date */
      setTime((prevClient) => ({
        ...prevClient,
        date: dacarurrent,
      }));
      setNamereceptor(responsePlantilla.plantilla[0].re_name);
      setPlantilla(responsePlantilla);

      const initializeItems = async () => {
        try {
          // Iterate over each item in the response and add it using itemshandleAdd

          setListitems([]);
          responsePlantilla.items.forEach((item) => {
            const newContents = {
              type: item.tipoitem.toString(), // Assuming type is returned as a number and needs to be converted to a string
              cuantity: item.cantidad.toString(), // Assuming cantidad is returned as a number
              description: item.descripcion,
              price: item.preciouni.toString(), // Assuming preciouni is returned as a number
            };

            // Call itemshandleAdd with each item
            inicializeitems(newContents);
          });
        } catch (error) {
          console.error("Error initializing items:", error);
        }
      };

      if (Listitems.length === 0) {
        // Call initializeItems to initiate the process when needed
        initializeItems();
      }


      /* initialize the observations */
      setObservaciones(responsePlantilla.plantilla[0].observaciones);

      /* initialize the client */
      async function fetchClientData() {
        try {
          const responsePlantilla = await PlantillaService.getcodegeneration(
            codigo_de_generacion,
            token,
            id_emisor
          );


          // Map the response data to the client state

          if (responsePlantilla.plantilla[0].re_tipodocumento === "13") {
            setClient({
              documentType:
                responsePlantilla.plantilla[0].re_tipodocumento || "13",
              name: responsePlantilla.plantilla[0].re_name || "",
              document: removeDashes(responsePlantilla.plantilla[0].re_numdocumento) || "",
              address: responsePlantilla.plantilla[0].re_direccion || "",
              email: responsePlantilla.plantilla[0].re_correo_electronico || null,
              phone: responsePlantilla.plantilla[0].re_numero_telefono || "",
              codActividad:
                responsePlantilla.plantilla[0].re_codactividad || "10005",
              nrc: responsePlantilla.plantilla[0].re_nrc || null,
              descActividad:
                responsePlantilla.plantilla[0].re_actividad_economica || "Otros"
            });
          } else {
            setClient({
              documentType:
                responsePlantilla.plantilla[0].re_tipodocumento || "13",
              name: responsePlantilla.plantilla[0].re_name || "",
              document: responsePlantilla.plantilla[0].re_numdocumento || "",
              address: responsePlantilla.plantilla[0].re_direccion || "",
              email: responsePlantilla.plantilla[0].re_correo_electronico || null,
              phone: responsePlantilla.plantilla[0].re_numero_telefono || "",
              codActividad:
                responsePlantilla.plantilla[0].re_codactividad || "10005",
              nrc: responsePlantilla.plantilla[0].re_nrc || null,
              descActividad:
                responsePlantilla.plantilla[0].re_actividad_economica || "Otros",
            })
          };
          const retencionDeRenta = Number(responsePlantilla.plantilla[0].retencion_de_renta);
          setRentvalue(retencionDeRenta)
          const montototaloperacion = Number(responsePlantilla.plantilla[0].montototaloperacion);
          /* getting the percentage */
          const percentage = (retencionDeRenta / montototaloperacion) * 100;
          console.log("Percentage of retencion_de_renta relative to total_a_pagar:", percentage);

          // You can also set this percentage to a state if needed
          setPercentage(percentage.toFixed(0));

          /* setting subtotal */
          var subtotalaux = 0
          responsePlantilla.items.forEach(item => {
            subtotalaux += Number(item.preciouni); // Assuming each item has a 'preciouni' property
          });
          console.log(subtotalaux)
          setSubtotal(subtotalaux)

        } catch (error) {
          console.error("Failed to fetch client data", error);
        }
      }

      fetchClientData();

      const totalapagar = responsePlantilla.plantilla[0].montopago;
      setTotal(totalapagar);


    };
    fetchData();
  }, []);

  const [observaciones, setObservaciones] = useState("");

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

  const inicializeitems = (newContents) => {
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
      numItem: setListitems.length + 1,
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
    setListitems((prevListitems) => {
      const updatedList = [...prevListitems, newItem];

      // Set `setitems` with the content from `updatedList`
      setitems(updatedList.map(item => ({
        type: item.tipoItem,
        cuantity: item.cantidad,
        description: item.descripcion,
        price: item.precioUni,
      })));

      return updatedList;
    });

    const Listitemstrack = [...Listitems, newItem];

    /* map all newitems and sum the  precioUni*cantidad */
    // Calcular el subtotal sumando el producto de precioUni y cantidad para cada artículo
    const rawSubtotal = Listitemstrack.reduce(
      (total, item) => total + item.precioUni * item.cantidad,
      0
    );
    const rawiva = Listitemstrack.reduce(
      (total, item) => total + item.ivaItem * item.cantidad,
      0
    );
    // Round to two decimal places
    const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
    const roundediva = Math.round(rawiva * 100) / 100;

    setiva(roundediva); // Set the rounded subtotal
    console.log(roundedSubtotal)
    setSubtotal((roundedSubtotal - roundediva).toFixed(2)); // Set the rounded subtotal

    const value_rent = ((roundedSubtotal * percentage) / 100).toFixed(2);
    setRentvalue(value_rent)

    setTotal((roundedSubtotal - value_rent).toFixed(2))
    console.log("ListitemsAdd")
    console.log(Listitems)
  };

  const itemshandleRemove = (index) => {
    // Remove the item from the items list

    console.log("ListitemsAddbefore")
    console.log(Listitems)

    setitems((prevContents) => {
      const updatedItems = prevContents.filter((_, i) => i !== index);

      // Recalculate the totals based on the remaining items
      const rawSubtotal = updatedItems.reduce(
        (total, item) => total + item.price * item.cuantity,
        0
      );
      const rawiva = Listitems.reduce(
        (total, item) => total + item.ivaItem * item.cantidad,
        0
      );

      const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
      const roundedIva = Math.round(rawiva * 100) / 100;

      // Update the state with the new totals
      setiva(roundedIva);
      console.log(roundedIva)
      console.log(roundedIva)
      setSubtotal((roundedSubtotal - roundedIva).toFixed(2));

      const value_rent = ((roundedSubtotal * percentage) / 100).toFixed(2);
      setRentvalue(value_rent)

    setTotal((roundedSubtotal - value_rent).toFixed(2))

      return updatedItems;
    });
    /* delete that item in ListItem */
    setListitems((prevListitems) => {
      const updatedList = prevListitems.filter((_, i) => i !== index);
      return updatedList;
    });

    console.log("ListitemsAddafter")
    console.log(Listitems)



  };

  /*   const itemshandleAdd = (newContents) => {
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
        ventaGravada: pricefloat * cuantityint + ivarounded * cuantityint,
        ventaExenta: 0,
        ventaNoSuj: 0,
        tipoItem: typeitem,
      };
      // Update the list with the new item
      setListitems((prevListitems) => [...prevListitems, newItem]);
  
  
  
      setitems((prevContents) => [
          ...prevContents,
          {
            type: type,
            cuantity: newContents.cuantity,
            description: newContents.description,
            price: newContents.price,
          },
        ]);
  
      const Listitemstrack = [...Listitems, newItem];
  
  
      // Calcular el subtotal sumando el producto de precioUni y cantidad para cada artículo
      const rawSubtotal = Listitemstrack.reduce(
        (total, item) => total + item.precioUni * item.cantidad,
        0
      );
      const rawiva = Listitemstrack.reduce(
        (total, item) => total + item.ivaItem * item.cantidad,
        0
      );
      // Round to two decimal places
      const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
      const roundediva = Math.round(rawiva * 100) / 100;
  
      setiva(roundediva); // Set the rounded subtotal
      setSubtotal(roundedSubtotal - roundediva); // Set the rounded subtotal
      setTotal(roundedSubtotal); // Set the rounded subtotal
      console.log("ListitemsAddAfter")
      console.log(Listitems)
    };
  
   */

  const itemshandleAdd = (newContents) => {
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
      ventaExenta: pricefloat * cuantityint,
      ventaNoSuj: 0,
      tipoItem: typeitem,
    };
    // Update the list with the new item
    setListitems((prevListitems) => [...prevListitems, newItem]);

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

    const Listitemstrack = [...Listitems, newItem];

    /* map all newitems and sum the  precioUni*cantidad */
    // Calcular el subtotal sumando el producto de precioUni y cantidad para cada artículo
    const rawSubtotal = Listitemstrack.reduce(
      (total, item) => total + item.precioUni * item.cantidad,
      0
    );
    const rawiva = Listitemstrack.reduce(
      (total, item) => total + item.ivaItem * item.cantidad,
      0
    );
    // Round to two decimal places
    const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
    const roundediva = Math.round(rawiva * 100) / 100;

    setiva(roundediva); // Set the rounded subtotal
    setSubtotal((roundedSubtotal - roundediva).toFixed(2)); // Set the rounded subtotal

    const value_rent = ((roundedSubtotal * percentage) / 100).toFixed(2);
    setRentvalue(value_rent)

    setTotal((roundedSubtotal - value_rent).toFixed(2))


    console.log("ListitemsAddAfter")
    console.log(Listitems)
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

  /* navigate and fu */

  /* ---------------------------------------------------------- */
  const addBillHandler = async (event) => {
    /* Counting the sentences*/
    event.preventDefault();

    const conditionoperationint = parseInt(payment.paymentType);

    console.log("codes");
    console.log(plantilla.plantilla[0].numero_de_control);
    console.log(plantilla.plantilla[0].codigo_de_generacion);

    if (client.documentType === "13") {
      client.document = formatDUI(client.document);
    }
    console.log("TOTAL")
    console.log(total)
    const data = {
      identificacion: {
        version: 1,
        ambiente: userinfo.ambiente,
        tipoDte: "01",
        numeroControl: plantilla.plantilla[0].numero_de_control,
        codigoGeneracion: plantilla.plantilla[0].codigo_de_generacion,
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
        totalIva: 0 /* IVA 0.1154 percent -----------------*/,
        saldoFavor: 0,
        numPagoElectronico: null,
        pagos: [
          {
            /* TODO: ADD MORE PAYMENTS */ periodo: null,
            plazo: null,
            montoPago: total,
            codigo: payment.paymentmethod,
            referencia: null,
          },
        ],
        totalNoSuj: 0,
        tributos: null,
        totalLetras: convertirDineroALetras(Number(total).toFixed(2)),
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
      firma: null,
    };

    /* traverse data.cuerpoDocumento to set new values in propiety numItem */
    data.cuerpoDocumento.map((item, index) => {
      item.numItem = index + 1;
    });


    if (client.name === "") {
      data.receptor.nombre = null;
    }

    if (client.phone === "") {
      data.receptor.telefono = null;
    }

    if (client.email === "") {
      data.receptor.correo = null;
    }

    if (client.address === "") {
      data.receptor.direccion = null;
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

    const responsePlantilla = await PlantillaService.update(
      id_emisor,
      data,
      plantilla.items,
      token,
      data.identificacion.codigoGeneracion
    );

    console.log("PlantillaService - update?");
    console.log(responsePlantilla);

    if (responsePlantilla.message === "plantilla actualizado") {
      toast.success("Factura editada con éxito");

      /* wait 5 seconds */
      setTimeout(() => {
        navigate("/facturas");
      }, 5000);

      /*  navigate("/facturas");  */
    } else {
      toast.error("Error al editar la factura");
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
    incrementedString = incrementedString.padStart(totalDigits, "0");

    // Format the output with the required prefix
    const formattedOutput = `DTE-01-00000030-${incrementedString}`;

    return formattedOutput;
  }

  const convertirDineroALetras = (cantidad) => {


    // Asegurarse de que la cantidad tenga como máximo dos decimales
    const cantidadRedondeada = Math.round(cantidad * 100) / 100;
    const partes = cantidadRedondeada.toFixed(2).split('.'); // Divide la parte entera de los decimales

    const dolares = parseInt(partes[0], 10); // Parte entera
    const centavos = parseInt(partes[1], 10); // Parte decimal

    if (dolares > Number.MAX_SAFE_INTEGER) {
      throw new Error('La cantidad en dólares es demasiado grande para convertir.');
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
    const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE"];
    const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const centenas = ["", "CIEN", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    if (numero === 0) return "CERO";

    if (numero < 10) return unidades[numero];

    if (numero < 16) return especiales[numero - 10];

    if (numero < 20) return "DIECI" + unidades[numero - 10];

    if (numero < 30) return numero === 20 ? "VEINTE" : "VEINTI" + unidades[numero - 20];

    if (numero < 100) {
      const decena = Math.floor(numero / 10);
      const unidad = numero % 10;
      return decenas[decena] + (unidad > 0 ? " Y " + unidades[unidad] : "");
    }

    if (numero < 1000) {
      const centena = Math.floor(numero / 100);
      const resto = numero % 100;
      return (centena === 1 && resto > 0 ? "CIENTO" : centenas[centena]) + (resto > 0 ? " " + convertirNumeroALetras(resto) : "");
    }

    if (numero < 1000000) {
      const miles = Math.floor(numero / 1000);
      const resto = numero % 1000;
      return (miles === 1 ? "MIL" : convertirNumeroALetras(miles) + " MIL") + (resto > 0 ? " " + convertirNumeroALetras(resto) : "");
    }

    if (numero < 1000000000) {
      const millones = Math.floor(numero / 1000000);
      const resto = numero % 1000000;
      return (millones === 1 ? "UN MILLÓN" : convertirNumeroALetras(millones) + " MILLONES") + (resto > 0 ? " " + convertirNumeroALetras(resto) : "");
    }

    throw new Error("Número demasiado grande para convertir.");
  };


  function formatDUI(num) {
    const str = num.toString();
    return str.slice(0, -1) + "-" + str.slice(-1);
  }

  function removeDashes(str) {
    return str.replace(/-/g, "");
  }

  const handlePercentageChange = (e) => {
    setPercentage(e.target.value);
    console.log("Percentage", e.target.value);

    const value_rent = ((subtotal * e.target.value) / 100).toFixed(2);
    console.log(value_rent);
    setRentvalue(value_rent)

    setTotal((subtotal - value_rent).toFixed(2))

  };


  return (
    <form className="m-0 w-full bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[17px] pb-3 pr-[15px] pl-5 box-border gap-[22px_0px] tracking-[normal]">
      <header className="flex flex-col self-stretch rounded-mini bg-gainsboro-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] items-center justify-cneter   pr-3.5 pl-[17px] box-border top-[0]   ch:w-1/3 ch:self-center">
        <h1 className="[-webkit-text-stroke:1px_#000] h-2 pb-3">factura</h1>
        <div className="self-stretch  h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
        <h2 className="">{namereceptor}</h2>
      </header>
      <section className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-6 box-border gap-[5px] max-w-full ch:w-1/3 ch:self-center">
        <div className="self-stretch h-[163px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
          <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
          <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
            General
          </b>
          {/* <div className="flex flex-col items-start justify-start pt-px px-0 pb-0">
            <img
              className="w-[18px] h-4 relative object-contain z-[2]"
              alt=""
              src="/atras-1@2x.png"
            />
          </div> */}
        </div>
        <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-2.5 box-border max-w-full"></div>
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
                value={time.date}
                onChange={(e) => handleChangeTime("date", e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      {CF ? (
        <BillCF
          handleSelectChangeCFClient={handleSelectChangeCFClient}
          setClient={setClient}
          client={client}
        />
      ) : (
        <BillnoCF
          handleSelectChangeCFClient={handleSelectChangeCFClient}
          setClient={setClient}
          client={client}
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
      <TreeNode text="IVA" data={0} />
      <TreeNode text="Renta Retenida" data={rentvalue} />
      <TreeNode text="Total a Pagar" data={total} />
      {/* <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full ch:w-1/3 ch:self-center">
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
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full ">
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
                        onChange={(e) =>
                          setpayment({
                            ...payment,
                            paymentType: e.target.value,
                          })
                        }
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
                <TableOfContentsNew
                  handleAdd={handleAdd}
                  setpayment={setpayment}
                  total={total}
                />{" "}

              </div>
            </div>
          </div>
        </form>
      </section> */}
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0 pl-[5px] box-border max-w-full ch:w-1/3 ch:self-center">
        <textarea
          className="[border:none] bg-white h-[163px] w-auto [outline:none] flex-1 rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-[11px] px-[17px] pb-2 box-border font-inria-sans font-bold text-mini text-black max-w-full"
          placeholder="Observaciones"
          rows={8}
          cols={20}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </section>
      <footer className="self-stretch flex flex-row items-start justify-center py-0 pr-5 pl-[27px] ">
        <div className="flex flex-col items-start justify-start gap-[13px_0px] ">
          <button
            onClick={addBillHandler}
            className="cursor-pointer [border:none] pt-[13px] pb-3 pr-[23px] pl-[29px] bg-steelblue-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap hover:bg-steelblue-100"
          >
            <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
              Editar factura
            </b>
          </button>

          <button
            onClick={goBackHandler}
            className="cursor-pointer h-12 w-[143px] justify-center [border:none] pt-3 pb-[13px] text-center  bg-indianred-500 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start  hover:bg-indianred-100"
          >
            <div className="h-11 w-[120px] relative rounded-3xs bg-indianred-500 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-mini font-inria-sans text-white text-left z-[1]">
              Regresar
            </b>
          </button>
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
      </footer>
    </form>
  );
};

export default EditBill;
