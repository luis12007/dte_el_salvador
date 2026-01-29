import TreeNode from "../components/TreeNode";
import TableOfContents from "../components/TableOfContentsWithDelete";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parse, v4 as uuidv4 } from "uuid";
import UserService from "../services/UserServices";
import TableOfContentsNew from "../components/TableOfContentsNew";
import AdvanceItemsComponent from "../components/AdvanceNoItemsComponent";
import BillnoCF from "../components/ClientBillCredit";
import PlantillaAPI from "../services/PlantillaService";
import PlantillaService from "../services/PlantillaService";
import EmisorService from "../services/emisor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeFacturasSelect from "./HomeFacturasSelect";

const CreateNC = () => {
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
  const [observaciones, setObservaciones] = useState("");
  const [Listitems, setListitems] = useState([]);
  const [items, setitems] = useState([]);
  const [contents, setContents] = useState([]);
  const [isVisibleClient, setIsVisibleClient] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [rentvalue, setRentvalue] = useState(0);
  const [numDTErefe, setNumDTErefe] = useState("reference");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [contentcf, setcontentcf] = useState("");


  const departmentsAndMunicipalities = {
        0: {
            departmentName: 'Otro Pais',
            municipalities: [
                { name: 'Otro Pais', index: 0 }
            ]
        },
        1: {
            departmentName: 'Ahuachapan',
            municipalities: [
                { name: 'Ahuachapan Norte', index: 13 },
                { name: 'Ahuachapan Centro', index: 14 },
                { name: 'Ahuachapan Sur', index: 15 }
            ]
        },
        2: {
            departmentName: 'Santa Ana',
            municipalities: [
                { name: 'Santa Ana Norte', index: 14 },
                { name: 'Santa Ana Centro', index: 15 },
                { name: 'Santa Ana Este', index: 16 },
                { name: 'Santa Ana Oeste', index: 17 }
            ]
        },
        3: {
            departmentName: 'Sonsonate',
            municipalities: [
                { name: 'Sonsonate Norte', index: 17 },
                { name: 'Sonsonate Centro', index: 18 },
                { name: 'Sonsonate Este', index: 19 },
                { name: 'Sonsonate Oeste', index: 20 }
            ]
        },
        4: {
            departmentName: 'Chalatenango',
            municipalities: [
                { name: 'Chalatenango Norte', index: 34 },
                { name: 'Chalatenango Centro', index: 35 },
                { name: 'Chalatenango Sur', index: 36 }
            ]
        },
        5: {
            departmentName: 'La Libertad',
            municipalities: [
                { name: 'La Libertad Norte', index: 23 },
                { name: 'La Libertad Centro', index: 24 },
                { name: 'La Libertad Oeste', index: 25 },
                { name: 'La Libertad Este', index: 26 },
                { name: 'La Libertad Costa', index: 27 },
                { name: 'La Libertad Sur', index: 28 }
            ]
        },
        6: {
            departmentName: 'San Salvador',
            municipalities: [
                { name: 'San Salvador Norte', index: 20 },
                { name: 'San Salvador Oeste', index: 21 },
                { name: 'San Salvador Este', index: 22 },
                { name: 'San Salvador Centro', index: 23 },
                { name: 'San Salvador Sur', index: 24 }
            ]
        },
        7: {
            departmentName: 'Cuscatlan',
            municipalities: [
                { name: 'Cuscatlan Norte', index: 17 },
                { name: 'Cuscatlan Sur', index: 18 }
            ]
        },
        8: {
            departmentName: 'La Paz',
            municipalities: [
                { name: 'La Paz Oeste', index: 23 },
                { name: 'La Paz Centro', index: 24 },
                { name: 'La Paz Este', index: 25 }
            ]
        },
        9: {
            departmentName: 'Cabanas',
            municipalities: [
                { name: 'Cabanas Oeste', index: 10 },
                { name: 'Cabanas Este', index: 11 }
            ]
        },
        10: {
            departmentName: 'San Vicente',
            municipalities: [
                { name: 'San Vicente Norte', index: 14 },
                { name: 'San Vicente Sur', index: 15 }
            ]
        },
        11: {
            departmentName: 'Usulutan',
            municipalities: [
                { name: 'Usulutan Norte', index: 24 },
                { name: 'Usulutan Este', index: 25 },
                { name: 'Usulutan Oeste', index: 26 }
            ]
        },
        12: {
            departmentName: 'San Miguel',
            municipalities: [
                { name: 'San Miguel Norte', index: 21 },
                { name: 'San Miguel Centro', index: 22 },
                { name: 'San Miguel Oeste', index: 23 }
            ]
        },
        13: {
            departmentName: 'Morazan',
            municipalities: [
                { name: 'Morazan Norte', index: 27 },
                { name: 'Morazan Sur', index: 28 }
            ]
        },
        14: {
            departmentName: 'La Union',
            municipalities: [
                { name: 'La Union Norte', index: 19 },
                { name: 'La Union Sur', index: 20 }
            ]
        }
    }; 

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const handleDepartmentChange = (event) => {
    const departmentKey = event.target.value; // Get the department key
    setSelectedDepartment(departmentKey); // Update selected department
    console.log("Municipality Index", departmentKey);
    console.log("Municipality Index", selectedMunicipality);
    setSelectedMunicipality(""); // Reset municipality when department changes
  };
  const handleMunicipalityChange = (event) => {
    const municipalityIndex = event.target.value; // Get the selected municipality index
    console.log("Municipality Index", municipalityIndex);
    setSelectedMunicipality(municipalityIndex); // Update selected municipality
  };

  const getMunicipalityNumber = () => {
    if (selectedDepartment !== null && selectedMunicipality) {
      const municipalityIndex =
        departmentsAndMunicipalities[selectedDepartment].municipalities.indexOf(
          selectedMunicipality
        );
      return municipalityIndex + 1;
    }
    return null;
  };

  const getDepartmentNumber = () => {
    return selectedDepartment ? parseInt(selectedDepartment) : null;
  };
  /* data for municipalities ------------------------------------ */

  /* Date */
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

  /* USEEFFECT */
  useEffect(() => {
    const fetchData = async () => {
      const response = await UserService.getUserInfo(id_emisor, token);
      console.log("User Data");
      console.log(response);
      setUserinfo(response);
    };
    fetchData();
  }, []);

  /* CLIENTE */
  var [client, setClient] = useState({
    name: null,
    document: null,
    address: null,
    email: null,
    phone: null,
    codActividad: "86203",
    nrc: null,
    descActividad: "Servicios de medicos",
    nit: null,
    nombreComercial: null,
    departamento: null,
    minicipio: null,
  });

  /* PAYMENT */
  var [payment, setpayment] = useState({
    paymentType: "1",
    paymentmethod: "01",
    numberdoc: "",
    mount: "",
  });

  /* -----------------------FUNCTIONS--------------------- */

  /* FOR CLIENTS */

  const itemshandleAdd = (newContents) => {

    if (newContents.cuantity === "" || newContents.price === "" || newContents.description === "") {
      toast.error("Por favor, llene todos los campos del item", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return;

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

    // Para usuarios 23 o 24: IVA se suma encima (precio no incluye IVA)
    const isIvaOnTop = id_emisor === "223" || id_emisor === "224";
    
    let priceunit;
    let ivaperitemfinal;
    
    if (isIvaOnTop) {
      // El precio ingresado es el precio neto (sin IVA)
      priceunit = pricefloat;
      ivaperitemfinal = pricefloat * cuantityint;
    } else {
      // Cálculo original: el precio incluye IVA, se extrae
      priceunit = pricefloat / 1.13;
      ivaperitemfinal = (pricefloat * cuantityint) / 1.13;
    }
    
    const newItem = {
      codTributo: null,
      descripcion: newContents.description,
      uniMedida: 99,
      codigo: null,
      cantidad: cuantityint,
      numItem: Listitems.length + 1,
      tributos: ["20"],
      noGravado: 0,
      psv: 0,
      montoDescu: 0,
      numeroDocumento: contentcf.codigo_de_generacion,
      precioUni: priceunit,
      ventaGravada: ivaperitemfinal,
      ventaExenta: 0,
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

    // isIvaOnTop ya fue declarado arriba
    
    let rawiva;
    let roundedSubtotal;
    let roundediva;
    let newtotal;
    
    if (isIvaOnTop) {
      rawiva = rawSubtotal * 0.13;
      roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
      roundediva = Math.round(rawiva * 100) / 100;
      
      setiva(roundediva.toFixed(2));
      setSubtotal(roundedSubtotal.toFixed(2));
      
      const value_rent = ((roundedSubtotal * percentage) / 100).toFixed(2);
      console.log(value_rent);
      setRentvalue(value_rent);
      
      newtotal = (roundedSubtotal + roundediva - parseFloat(value_rent)).toFixed(2);
      setTotal(newtotal);
    } else {
      rawiva = Listitemstrack.reduce(
        (total, item) => total + (item.ventaGravada * 0.13),
        0
      );
      roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
      roundediva = Math.round(rawiva * 100) / 100;

      setiva(roundediva.toFixed(2));
      setSubtotal(rawSubtotal.toFixed(2));

      const value_rent = ((rawSubtotal * percentage) / 100).toFixed(2);
      console.log(value_rent);
      setRentvalue(value_rent);
      const totalwithiva = roundedSubtotal + roundediva;
      setTotal((totalwithiva - value_rent).toFixed(2));
    }

    console.log("Subtotal", subtotal);
    console.log("Total", total);
  };

  const itemshandleRemove = (indexToRemove) => {
    setitems((prevContents) =>
      prevContents.filter((_, i) => i !== indexToRemove)
    );

    Listitems.splice(indexToRemove, 1);

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

    const rawSubtotal = Listitems.reduce(
      (total, item) => total + item.precioUni * item.cantidad,
      0
    );

    // Para usuarios 23 o 24: IVA se suma encima
    const isIvaOnTop = id_emisor === "223" || id_emisor === "224";
    
    let rawiva;
    let roundedSubtotal;
    let roundediva;
    let newtotal;
    
    if (isIvaOnTop) {
      rawiva = rawSubtotal * 0.13;
      roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
      roundediva = Math.round(rawiva * 100) / 100;
      
      setiva(roundediva.toFixed(2));
      setSubtotal(roundedSubtotal.toFixed(2));
      
      const value_rent = ((roundedSubtotal * percentage) / 100).toFixed(2);
      console.log(value_rent);
      setRentvalue(value_rent);
      
      newtotal = (roundedSubtotal + roundediva - parseFloat(value_rent)).toFixed(2);
      setTotal(newtotal);
    } else {
      rawiva = Listitems.reduce(
        (total, item) => total + item.ventaGravada * 0.13,
        0
      );
      roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
      roundediva = Math.round(rawiva * 100) / 100;

      setiva(roundediva);
      setSubtotal(rawSubtotal.toFixed(2));

      const value_rent = ((rawSubtotal * percentage) / 100).toFixed(2);
      console.log(value_rent);
      setRentvalue(value_rent);
      const totalwithiva = roundedSubtotal + roundediva;
      setTotal((totalwithiva - value_rent).toFixed(2));
    }

    console.log("Subtotal", subtotal);
    console.log("Total", total);
  };

  const handleSelectChangeItemsClient = () => {
    setItems(!Items);
  };

  const handleSelectChangeCFClient = () => {
    setCF(!CF);
    console.log(client);
  };

  /* PAGE */

  /* time */

  const handleChangeTime = (field, value) => {
    // Update the client state with the new value
    setTime((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };

  /* handlers */

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

  /* BUTTOMS */

  const goBackHandler = () => {
    navigate("/Principal");
  };

  /* --------------------------SEND DATA-------------------------------- */
  const addBillHandler = async (event) => {
    event.preventDefault();

    const myUuid = uuidv4().toUpperCase().toString();

    const conditionoperationint = parseInt(payment.paymentType);

    /* var data = {
          identificacion: {
            version: 3, 
            ambiente: userinfo.ambiente, 
            tipoDte: "03", 
            numeroControl: getNextFormattedNumber(count[0].count), 
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
    
            TODO: Just in case establecimiento  
            codEstableMH: null,
            codEstable: null, 
            codPuntoVentaMH: null, 
            codPuntoVenta: null 
          },
          receptor: {  TODO ADDRES 
            codActividad: client.codActividad,
            direccion:  client.address null, 
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
            totalIva: iva,    IVA 0.1154 percent -----------------
            saldoFavor: 0,   
            numPagoElectronico: null,  
            pagos: [
              {TODO: ADD MORE PAYMENTS 
                periodo: null, 
                plazo: null,  
                montoPago: total,  
                codigo: payment.paymentmethod, 
                referencia: null 
              }
            ],
            totalNoSuj: 0,
            tributos: null, 
            totalLetras: convertirDineroALetras(total),  
            totalExenta: 0,  
            subTotalVentas: total, 
            totalGravada: total,
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
        }; */



    var selectedDepartmentnum = selectedDepartment;
    /* if num is only 1 digit will be 0(digit) or if it is 9 it will be 09, it id 12 will be 12 */
    /*     if (selectedDepartmentnum < 10) {
          selectedDepartmentnum = "0" + selectedDepartmentnum;
        } */
    var selectedMunicipalitynum = selectedMunicipality;
    /*     if (selectedMunicipalitynum < 10) {
          selectedMunicipalitynum = "0" + selectedMunicipalitynum;
        } */

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

    Listitems.forEach((item) => {
      item.precioUni = Number(item.precioUni).toFixed(2);
      item.ventaGravada = Number(item.ventaGravada).toFixed(2);
    });

    const tipodocumento = "03"
    const tipoGeneracion = 1
    const numDocumento = contentcf.codigo_de_generacion
    const fecha = contentcf.fecha_y_hora_de_generacion
    const merge_data = "03" + "|" + tipoGeneracion + "|" + numDocumento + "|" + fecha
    const totaloperation = (Number(subtotal) + Number(iva));
    var data = {
      identificacion: {
        version: 3,
        ambiente: userinfo.ambiente,
        tipoDte: "05",
        numeroControl: getNextFormattedNumber(userinfo.count_fiscal + 1),
        codigoGeneracion: myUuid,
        tipoModelo: 1,
        tipoOperacion: 1,
        fecEmi: time.date.toString(),
        horEmi: time.time,
        tipoMoneda: "USD",
        tipoContingencia: null,
        motivoContin: null,
      },
      documentoRelacionado: merge_data,
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
                  codEstableMH: "M001",
          codEstable: "M001",
          codPuntoVentaMH: "P001",
          codPuntoVenta: "P001",
      },
      receptor: {
        /* TODO ADDRESS NIT nombre comercial  ADDED: nit , nombreComercial , DELETED: tipodedocumento*/
        codActividad: client.codActividad,
        direccion: {
          departamento: selectedDepartmentnum,
          municipio: selectedMunicipalitynum,
          complemento: client.address,
        },
        nrc: client.nrc,
        descActividad: client.descActividad,
        correo: client.email,
        nit: client.nit,
        nombre: client.name,
        telefono: client.phone,
        nombreComercial: client.nombreComercial,
      },
      otrosDocumentos: null,
      ventaTercero: null,
      cuerpoDocumento: Listitems,
      resumen: {
        /* ADDED ivaPercil */ condicionOperacion: conditionoperationint,
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
        tributos: [
          {
            codigo: "20",
            descripcion: "Impuesto al Valor Agregado 13%",
            valor: Number(iva).toFixed(2) /* TODO CHANGE */,
          },
        ],
        totalLetras: convertirDineroALetras(total),
        totalExenta: 0,
        subTotalVentas: subtotal,
        totalGravada: subtotal,
        montoTotalOperacion: totaloperation.toFixed(2), /* TODO */
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
        ivaPerci1: 0,
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

    if (client.phone === "") {
      data.receptor.telefono = null;
    }

    if (client.phone === "") {
      data.receptor.telefono = null;
    }

    if (client.nit === "" || client.nit === null) {
      toast.error("NIT no puede estar vacio");
      return;
    } else if (client.name === "" || client.name === null) {
      toast.error("Nombre no puede estar vacio");
      return;
    } else if (client.address === "" || client.address === null) {
      toast.error("Direccion no puede estar vacio");
      return;
    } else if (client.email === "" || client.email === null) {
      toast.error("Correo no puede estar vacio");
      return;
    } else if (client.codActividad === "" || client.codActividad === null) {
      toast.error("Codigo de actividad no puede estar vacio");
      return;
    } else if (client.nrc === "" || client.nrc === null) {
      toast.error("NRC no puede estar vacio");
      return;
    } else if (selectedDepartment === "" || selectedDepartment === null) {
      toast.error("Departamento no puede estar vacio");
      return;
    } else if (selectedMunicipality === "" || selectedMunicipality === null) {
      toast.error("Municipio no puede estar vacio");
      return;
    } else if (Listitems.length === 0) {
      toast.error("No hay items en la factura");
      return;
    } else if (time.date === "" || time.date === null) {
      toast.error("Fecha no puede estar vacio");
      return;
    }

    console.log("Data");
    console.log(data);
    try {
      const responsesum = await EmisorService.count_fiscal(id_emisor, token);
      console.log("Count Fiscal");
      console.log(responsesum);

      const responseincrement = await UserService.id_enviopus1(id_emisor, token);
      console.log("incremented");
      console.log(responseincrement);
    } catch (error) {
      console.log(error);
    }

    console.log("Data");
    console.log(data);

    const responsePlantilla = await PlantillaService.create(
      data,
      token,
      id_emisor
    );
    console.log("PlantillaService - Create");
    console.log(responsePlantilla);

    if (responsePlantilla.message === "Inserción exitosa") {
      toast.success("Nota de crédito creado con exito");

      /* wait 5 second and navigate to /facturas */
      setTimeout(() => {
        navigate("/facturas");
      }, 5000);
    } else {
      toast.error("NC no creado intentar de nuevo");
    }

    /* 
        TODO CHANGE THIS THE OTHER SIDE console.log(data);
         const Firm = {
           nit: userinfo.nit, 
           activo: true,
           passwordPri: userinfo.passwordPri, 
           dteJson: data
         } */

    /* 
            navigate("/facturas");  */
  };

  /* ---------------------------------------------------------- */

  const DeleteItemHander = () => {
    console.log("DeleteItemHander");
  };

  const AddItemHander = () => {
    console.log("AddItemHander");
  };

  const switchTypeItemHandler = () => {
    console.log("switchTypeItemHandler");
  };

  const ChangeHandler = (selectedValue) => {
    if (selectedValue === "Factura") {
      navigate("/crear/factura");
    } else if (selectedValue === "CF") {
      navigate("/crear/creditofiscal");
    } else if (selectedValue === "SU") {
      navigate("/crear/sujeto_excluido");
    } else if (selectedValue === "NC") {
      navigate("/crear/nota_credito");
    } else if (selectedValue === "ND") {
      navigate("/crear/Nota_debito");
    }else if (selectedValue === "CR") {
      navigate("/crear/Comprobante_Retencion");
    } else if (selectedValue === "CI") {
      navigate("/crear/Comprobante_Importacion");
  };
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    ChangeHandler(event.target.value);
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
    const formattedOutput = `DTE-05-M001P001-${incrementedString}`;

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

  const handleSelectClient = (event) => {
    event.preventDefault();
    setIsVisibleClient(!isVisibleClient);
  };




  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };


  const handlePercentageChange = (e) => {
    setPercentage(e.target.value);
    console.log("Percentage", e.target.value);

    const rawSubtotal = Listitems.reduce((total, item) => total + (item.precioUni * item.cantidad), 0);
    const rawiva = Listitems.reduce((total, item) => total + item.ventaGravada * 0.13, 0);
    // Round to two decimal places
    const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
    const roundediva = Math.round(rawiva * 100) / 100;

    setiva(roundediva); // Set the rounded subtotal
    setSubtotal(rawSubtotal.toFixed(2)); // Set the rounded subtotal

    const value_rent = ((rawSubtotal * e.target.value) / 100).toFixed(2);
    console.log(value_rent);
    setRentvalue(value_rent)
    const totalwithiva = roundedSubtotal + roundediva
    setTotal((totalwithiva - value_rent).toFixed(2))

    console.log("Subtotal", subtotal);
    console.log("Total", total);


  };

  const onSelectClient = (event, clientset) => {
    event.preventDefault();
    setClient({
      name: clientset.name,
      document: clientset.dui,
      address: clientset.direccion,
      email: clientset.correo_electronico,
      phone: clientset.numero_telefono,
      codActividad: clientset.actividad_economica,
      nrc: clientset.nrc,
      descActividad: "Servicios de medicos",
      nit: clientset.nit,
      nombreComercial: clientset.nombre_comercial,
      departamento: clientset.departament,
      municipio: clientset.municipio,
    });

    setSelectedDepartment(clientset.departament);
    setSelectedMunicipality(clientset.municipio);
    console.log(clientset);
  };

  const GetInf = (content) => {
    console.log(content);

    /* spliting address */
    const address = content.re_direccion.split("|");
    setClient({
      name: content.re_name,
      document: content.re_numdocumento,
      address: address[2],
      email: content.re_correo_electronico,
      phone: content.re_numero_telefono,
      codActividad: content.re_codactividad,
      nrc: content.re_nrc,
      descActividad: "Servicios de medicos",
      nit: content.re_nit,
      nombreComercial: content.re_nombre_comercial,
      departamento: address[0],
      municipio: address[1],
    });

    setSelectedDepartment(address[0]);
    setSelectedMunicipality(address[1]);
    setcontentcf(content);
    console.log(client)
    setIsModalOpen(false);

  }

  return (
    <form className="m-0 w-full bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[17px] pb-3 pr-[15px] pl-5 box-border gap-[22px_0px] tracking-[normal]">
      <header className="rounded-mini  bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-center justify-center pt-4 pb-[15px] pr-3.5 pl-[17px] box-border top-[0]  sticky max-w-full self-stretch ch:w-1/3 ch:self-center">
        <div className="h-[66px] w-[390px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
        <div className="flex-1 rounded-mini bg-gainsboro-300 box-border flex flex-row items-start justify-between pt-[9px] pb-2.5 pr-[7px] pl-[15px] max-w-full gap-[20px] z-[1] border-[1px] border-solid border-white ">
          <select
            onChange={handleSelectChange}
            className="h-[35px] w-full relative  border-gainsboro-300 bg-gainsboro-300 border-2 max-w-full"
          >
            <option value="NC">Nota de Crédito</option>
            <option value="Factura">Factura</option>
            <option value="CF">Comprobante Crédito Fiscal</option>
            <option value="SU">Factura de Sujeto Excluido</option>
            <option value="ND">Nota de Débito</option>
            <option value="CI">Comprobante de liquidación</option>


          </select>
          {/* Your other elements */}
        </div>
      </header>
      <header className="flex flex-col self-stretch rounded-mini bg-gainsboro-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] items-center justify-cneter   pr-3.5 pl-[17px] box-border top-[0]   ch:w-1/3 ch:self-center">
        <h1 className="[-webkit-text-stroke:1px_#000] h-2 pb-3">Nota de credito</h1>
        <div className="self-stretch  h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
        <h2 className=""> para CF de: {client.name}</h2>
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
            <HomeFacturasSelect GetInf={GetInf} setIsModalOpen={setIsModalOpen} />
          </div>
        </div>
      )}

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


      <TreeNode text="Subtotal" data={subtotal} />
      <TreeNode text="IVA" data={iva} />
      <TreeNode text="Renta Retenida" data={rentvalue} />
      <TreeNode text="Total a Pagar" data={total} />

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
        <ToastContainer />
      </footer>
    </form>
  );
};

export default CreateNC;
