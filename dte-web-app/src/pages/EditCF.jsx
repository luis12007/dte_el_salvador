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
import { useParams } from "react-router-dom";


/* toastify */
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


const EditCF = () => {
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
  const [plantilla, setPlantilla] = useState({});
  const { codigo_de_generacion } = useParams();
  const [namereceptor , setNamereceptor] = useState("");

  /* data for municipalities ------------------------------------ */
  const departmentsAndMunicipalities = {
    0: { departmentName: "Otro pais", municipalities: ["Otro pais"] },
    1: {
      departmentName: "Ahuachapán",
      municipalities: [
        "Ahuachapán",
        "Apaneca",
        "Atiquizaya",
        "Concepción de Ataco",
        "El Refugio",
        "Guaymango",
        "Jujutla",
        "San Francisco Menéndez",
        "San Lorenzo",
        "San Pedro Puxtla",
        "Tacuba",
        "Turín",
      ],
    },
    2: {
      departmentName: "Santa Ana",
      municipalities: [
        "Candelaria de la Frontera",
        "Coatepeque",
        "Chalchuapa",
        "El Congo",
        "El Porvenir",
        "Masahuat",
        "Metapán",
        "San Antonio Pajonal",
        "San Sebastián Salitrillo",
        "Santa Ana",
        "Santa Rosa Guachipilín",
        "Santiago de la Frontera",
        "Texistepeque",
      ],
    },
    3: {
      departmentName: "Sonsonate",
      municipalities: [
        "Acajutla",
        "Armenia",
        "Caluco",
        "Cuisnahuat",
        "sta i ishuatan",
        "Izalco",
        "Juayúa",
        "Nahuizalco",
        "Nahulingo",
        "Salcoatitán",
        "San Antonio del Monte",
        "San Julián",
        "Santa Catarina Masahuat",
        "Santo Domingo de Guzmán",
        "Sonsonate",
        "Sonzacate",
      ],
    },
    4: {
      departmentName: "Chalatenango",
      municipalities: [
        "Agua Caliente",
        "Arcatao",
        "Azacualpa",
        "Citalá",
        "Comalapa",
        "Concepción Quezaltepeque",
        "Chalatenango",
        "Dulce Nombre de María",
        "El Carrizal",
        "El Paraíso",
        "La Laguna",
        "La Palma",
        "La Reina",
        "Las Vueltas",
        "Nombre de Jesús",
        "Nueva Concepción",
        "Nueva Trinidad",
        "Ojos de Agua",
        "Potonico",
        "San Antonio La Cruz",
        "San Antonio Los Ranchos",
        "San Fernando",
        "San Francisco Lempa",
        "San Francisco Morazán",
        "San Ignacio",
        "San Isidro Labrador",
        "San José Cancasque",
        "San José Flores",
        "San Luis del Carmen",
        "San Miguel de Mercedes",
        "San Rafael",
        "Santa Rita",
        "Tejutla",
      ],
    },
    5: {
      departmentName: "La Libertad",
      municipalities: [
        "Antiguo Cuscatlán",
        "Ciudad Arce",
        "Colón",
        "Comasagua",
        "Chiltiupán",
        "Huizúcar",
        "Jayaque",
        "Jicalapa",
        "La Libertad",
        "Nuevo Cuscatlán",
        "Santa tecla",
        "Quezaltepeque",
        "Sacacoyo",
        "San juan villanueva",
        "San Juan Opico",
        "San Matías",
        "San Pablo Tacachico",
        "Tamanique",
        "Talnique",
        "Teotepeque",
        "Tepecoyo",
        "Zaragoza",
      ],
    },
    6: {
      departmentName: "San Salvador",
      municipalities: [
        "Aguilares",
        "Apopa",
        "Ayutuxtepeque",
        "Cuscatancingo",
        "El Paisnal",
        "Guazapa",
        "Ilopango",
        "Mejicanos",
        "Nejapa",
        "Panchimalco",
        "Rosario de Mora",
        "San Marcos",
        "San Martín",
        "San Salvador",
        "Santiago Texacuangos",
        "Santo Tomás",
        "Soyapango",
        "Tonacatepeque",
        "Ciudad Delgado",
      ],
    },
    7: {
      departmentName: "Cuscatlán",
      municipalities: [
        "Candelaria",
        "Cojutepeque",
        "El Carmen",
        "El Rosario",
        "Monte San Juan",
        "Oratorio de Concepción",
        "San Bartolomé Perulapia",
        "San Cristóbal",
        "San José Guayabal",
        "San Pedro Perulapán",
        "San Rafael Cedros",
        "San Ramón",
        "Santa Cruz Analquito",
        "Santa Cruz Michapa",
        "Suchitoto",
        "Tenancingo",
      ],
    },
    8: {
      departmentName: "La Paz",
      municipalities: [
        "Cuyultitán",
        "El Rosario",
        "Jerusalén",
        "Mercedes La Ceiba",
        "Olocuilta",
        "Paraíso de Osorio",
        "San Antonio Masahuat",
        "San Emigdio",
        "San Francisco Chinameca",
        "San Juan Nonualco",
        "San Juan Talpa",
        "San Juan Tepezontes",
        "San Luis Talpa",
        "San Miguel Tepezontes",
        "San Pedro Masahuat",
        "San Pedro Nonualco",
        "San Rafael Obrajuelo",
        "Santa María Ostuma",
        "Santiago Nonualco",
        "Tapalhuaca",
        "Zacatecoluca",
        "San Luis La Herradura",
      ],
    },
    9: {
      departmentName: "Cabañas",
      municipalities: [
        "Cinquera",
        "Guacotecti",
        "Ilobasco",
        "Jutiapa",
        "San Isidro",
        "Sensuntepeque",
        "Tejutla",
        "Victoria",
        "Dolores",
      ],
    },
    10: {
      departmentName: "San Vicente",
      municipalities: [
        "Apastepeque",
        "Guadalupe",
        "San Cayetano Istepeque",
        "Santa Clara",
        "Santo Domingo",
        "San Esteban Catarina",
        "San Ildefonso",
        "San Lorenzo",
        "San Sebastián",
        "San Vicente",
        "Tecoluca",
        "Tepetitán",
        "Verapaz",
      ],
    },
    11: {
      departmentName: "Usulután",
      municipalities: [
        "Alegría",
        "Berlín",
        "California",
        "Concepción Batres",
        "El Triunfo",
        "Ereguayquín",
        "Estanzuelas",
        "Jiquilisco",
        "Jucuapa",
        "Jucuará",
        "Mercedes Umaña",
        "Nueva Granada",
        "Ozatlán",
        "Puerto El Triunfo",
        "San Agustín",
        "San Buenaventura",
        "San Dionisio",
        "Santa Elena",
        "San Francisco Javier",
        "Santa María",
        "Santiago de María",
        "Tecapán",
        "Usulután",
      ],
    },
    12: {
      departmentName: "San Miguel",
      municipalities: [
        "Carolina",
        "Ciudad Barrios",
        "Comacarán",
        "Chapeltiquex",
        "Chinameca",
        "Chirilagua",
        "El Tránsito",
        "Lolotique",
        "Moncagua",
        "Nueva Guadalupe",
        "Nuevo Edén de San Juan",
        "Quelepa",
        "San Antonio del Mosco",
        "San Gerardo",
        "San Jorge",
        "San Luis de la Reina",
        "San Miguel",
        "San Rafael Oriente",
        "Sesori",
        "Uluazapa",
      ],
    },
    13: {
      departmentName: "Morazán",
      municipalities: [
        "Arambala",
        "Cacaopera",
        "Corinto",
        "Chilanga",
        "Delicias de Concepción",
        "El Divisadero",
        "El Rosario",
        "Guatajiagua",
        "Joateca",
        "Jocoaitique",
        "Jocoro",
        "Lolotiquillo",
        "Meanguera",
        "Osicala",
        "Perquín",
        "San Carlos",
        "San Fernando",
        "San Francisco Gotera",
        "San Isidro",
        "San Simón",
        "Sensembra",
        "Sociedad",
        "Torola",
        "Yamabal",
        "Yoloaiquín",
      ],
    },
    14: {
      departmentName: "La Unión",
      municipalities: [
        "Anamorós",
        "Bolívar",
        "Concepción de Oriente",
        "Conchagua",
        "El Carmen",
        "El Sauce",
        "Intipucá",
        "La Unión",
        "Lislique",
        "Meanguera del Golfo",
        "Nueva Esparta",
        "Pasaquina",
        "Polorós",
        "San Alejo",
        "San José",
        "Santa Rosa de Lima",
        "Yayantique",
        "Yucuaiquín",
      ],
    },
    // You can add more departments and their municipalities as needed
  };

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const handleDepartmentChange = (event) => {
    const departmentIndex = event.target.value;
    setSelectedDepartment(departmentIndex);
    setSelectedMunicipality(""); // Reset municipality when department changes
  };

  const handleMunicipalityChange = (event) => {
    setSelectedMunicipality(event.target.value);
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

  /* USEEFFECT SET THE VALUES*/
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
            inicializeitems(newContents , responsePlantilla);
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
          const address = responsePlantilla.plantilla[0].re_direccion.split("|");

          // Map the response data to the client state
          setClient({
            nit:
              responsePlantilla.plantilla[0].re_nit,
            name: responsePlantilla.plantilla[0].re_name || "",
            document: responsePlantilla.plantilla[0].re_numdocumento || "",
            address: address[2],
            email: responsePlantilla.plantilla[0].re_correo_electronico || null,
            phone: responsePlantilla.plantilla[0].re_numero_telefono || "",
            codActividad:
              responsePlantilla.plantilla[0].re_codactividad || "10005",
            nrc: responsePlantilla.plantilla[0].re_nrc || null,
            descActividad:
              responsePlantilla.plantilla[0].re_actividad_economica || "Otros",
              nombreComercial: responsePlantilla.plantilla[0].re_numdocumento || null,
              departamento: address[0], 
              minicipio: address[1],
          });
          setSelectedDepartment(address[0]);
          setSelectedMunicipality(address[1]);
          if (
            responsePlantilla.plantilla[0].re_numero_telefono == null ||
            responsePlantilla.plantilla[0].re_numero_telefono == ""
          ) {
            setCF(true);
          }
        } catch (error) {
          console.error("Failed to fetch client data", error);
        }
      }

      fetchClientData();
    };
    fetchData();
  }, []);

  /* CLIENTE */
  var [client, setClient] = useState({
    name: "",
    document: "",
    address: "",
    email: null,
    phone: "",
    codActividad: "10005" /* TODO CODIGO */,
    nrc: null,
    descActividad: "Otros",
    nit: null,
    nombreComercial: null,
    departamento: null /* TODO */,
    minicipio: null /* TODO */,
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

    const ivaperitem = pricefloat / 1.13;
    const ivaperitemfinal = ivaperitem * 0.13;
    const ivarounded = Math.round(ivaperitemfinal * 100) / 100;
    const newItem = {
      /* DELETED ivaitem */ codTributo: null,
      descripcion: newContents.description,
      uniMedida: 99,
      codigo: null,
      cantidad: cuantityint,
      numItem: Listitems.length + 1,
      tributos: ["20"],
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
    const Listitemstrack = [...Listitems, newItem];
    console.log("Listitems", Listitemstrack);

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
    setSubtotal(roundedSubtotal - roundediva); // Set the rounded subtotal
    setTotal(roundedSubtotal); // Set the rounded subtotal

    /* for the moment TODO CHANGE */
    setiva(6.32);
    setSubtotal(roundedSubtotal);

    console.log("Subtotal", subtotal);
    console.log("Total", total);
  };

  const inicializeitems = (newContents ,responsePlantilla) => {
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
    console.log("responsePlantilla")
    console.log(responsePlantilla.items)

    const totalfinal = responsePlantilla.items.reduce((acc, item) => {
      return acc + (item.cantidad * item.preciouni);
  }, 0);
    console.log("totalfinal")
    console.log(totalfinal)
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
        tributos: ["20"],
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


    /* saving in a var */

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

    console.log(totalfinal)
    setiva(roundediva); // Set the rounded subtotal
    setSubtotal(roundedSubtotal - roundediva); // Set the rounded subtotal
    setTotal(totalfinal); // Set the rounded subtotal

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
      const rawIva = updatedItems.reduce(
        (total, item) => total + (item.price / 1.13) * 0.13 * item.cuantity,
        0
      );

      const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
      const roundedIva = Math.round(rawIva * 100) / 100;

      // Update the state with the new totals
      setiva(roundedIva);
      setSubtotal(roundedSubtotal - roundedIva);
      setTotal(roundedSubtotal);

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
  const addBillHandler = async () => {
    console.log("Sending data to the server...");
    console.log("Data to send:", plantilla.plantilla);
    const municipalities = plantilla.plantilla[0].re_direccion.split("|")[1];
    const department = plantilla.plantilla[0].re_direccion.split("|")[0];
    /* Counting the sentences*/
    const count = await PlantillaAPI.count(id_emisor, "01", token);

    const myUuid = uuidv4().toUpperCase().toString();

    const conditionoperationint = parseInt(payment.paymentType);

    

    var data = {
      identificacion: {
        version: 3,
        ambiente: userinfo.ambiente,
        tipoDte: "03",
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
        /* TODO ADDRESS NIT nombre comercial  ADDED: nit , nombreComercial , DELETED: tipodedocumento*/
        codActividad: client.codActividad,
        direccion: {
          departamento: department,
          municipio: municipalities,
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
            valor: iva /* TODO CHANGE */,
          },
        ],
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
        totalPagar: total,
        ivaPerci1: 0 /* TODO: CREATE AND FUNCTION JUST TO DO THIS VALUE */,
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
    };

    console.log("Data");
    console.log(data);

    const responsePlantilla = await PlantillaService.update(
      id_emisor,
      data,
      plantilla.items,
      token,
      data.identificacion.codigoGeneracion
    );

    console.log("PlantillaService - update?");
    console.log(responsePlantilla);

    /* toast.success("Factura creada con éxito");

        setTimeout(() => {
            navigate("/facturas");
        }, 5000); */

           /*  navigate("/facturas");  */

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
      console.log("CF");
    }
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
    const formattedOutput = `DTE-03-00000030-${incrementedString}`;

    return formattedOutput;
  }

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
  const especiales = [
    "",
    "ONCE",
    "DOCE",
    "TRECE",
    "CATORCE",
    "QUINCE",
    "DIECISÉIS",
    "DIECISIETE",
    "DIECIOCHO",
    "DIECINUEVE",
  ];
  const decenas = [
    "",
    "DIEZ",
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
    "CIENTO",
    "DOSCIENTOS",
    "TRESCIENTOS",
    "CUATROCIENTOS",
    "QUINIENTOS",
    "SEISCIENTOS",
    "SETECIENTOS",
    "OCHOCIENTOS",
    "NOVECIENTOS",
  ];

  const convertirDineroALetras = (numero) => {
    if (numero === 0) return "CERO";

    let letras = "";
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
        letras += " Y " + unidades[numero % 10];
      }
    } else if (numero < 1000) {
      letras = centenas[Math.floor(numero / 100)];
      if (numero % 100 !== 0) {
        letras += " " + convertirDineroALetras(numero % 100);
      }
    } else {
      letras = "NÚMERO DEMASIADO GRANDE PARA CONVERTIR";
    }

    return negativo ? "MENOS " + letras : letras;
  };

  return (
    <form className="m-0 w-[430px] bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[17px] pb-3 pr-[15px] pl-5 box-border gap-[22px_0px] tracking-[normal]">
      <header className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start pt-4 pb-[15px] pr-3.5 pl-[17px] box-border top-[0] z-[99] sticky max-w-full">
        <div className="h-[66px] w-[390px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
        <div className="flex-1 rounded-mini bg-gainsboro-300 box-border flex flex-row items-start justify-between pt-[9px] pb-2.5 pr-[7px] pl-[15px] max-w-full gap-[20px] z-[1] border-[1px] border-solid border-white">
         <h1>Credito Fiscal de {namereceptor}</h1>
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

      <BillnoCF
    handleSelectChangeCFClient={handleSelectChangeCFClient}
    setClient={setClient}
    client={client}
    departmentsAndMunicipalities={departmentsAndMunicipalities}
    handleDepartmentChange={handleDepartmentChange}
    handleMunicipalityChange={handleMunicipalityChange}
    selectedMunicipality={selectedMunicipality}
    getMunicipalityNumber={getMunicipalityNumber}
    selectedDepartment={selectedDepartment}
    visible={false}
  />

      <AdvanceItemsComponent
        handleSelectChangeItemsClient={handleSelectChangeItemsClient}
        itemshandleRemove={itemshandleRemove}
        itemshandleAdd={itemshandleAdd}
        setListitems={setListitems}
        items={items}
      />

      {/*             <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full">
                <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[17px] box-border gap-[9px] max-w-full">
                    <div className="self-stretch h-[1153px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                    <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-[11px] px-[17px] pb-3 box-border relative whitespace-nowrap max-w-full z-[1]">
                        <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full z-[0]" />
                        <img
                            className="h-4 w-[18px] absolute !m-[0] right-[20px] bottom-[9px] object-contain z-[2]"
                            alt=""
                            src="/atras-1@2x.png"
                        />
                        <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
                            Datos del producto / Servicio
                        </b>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3 pb-[41px] box-border max-w-full">
                        <div className="flex-1 flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
                            <div className="flex flex-row items-start justify-start py-0 px-0.5">
                                <div className="flex flex-row items-start justify-start gap-[0px_6px]">
                                    <div className="h-[19px] w-[30px] relative rounded-6xs bg-limegreen box-border z-[1] border-[0.2px] border-solid border-black">
                                        <div className="absolute top-[0px] left-[0px] rounded-6xs bg-limegreen box-border w-full h-full hidden border-[0.2px] border-solid border-black" />
                                        <div className="absolute top-[2px] left-[14px] rounded-6xs bg-white w-3.5 h-3.5 z-[1]" />
                                    </div>
                                    <div className="flex flex-col items-start justify-start pt-0.5 px-0 pb-0">
                                        <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                                            Configuración avanzada de items
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-0.5 box-border max-w-full">
                                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                    <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                                    </div>
                                        <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                                        <div>
                                        <span className="text-black">Tipo</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <select
                                    className="w-full h-full relative  border-white bg-white border-2 max-w-full"
                                    type="text"
                                    
                                >
                                    <option value="CF">Comprobante Credito Fiscal</option>
                                    <option value="Factura">Factura</option>
                                </select>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                    <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                                    </div>
                                        <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                                        <div>
                                        <span className="text-black">Cantidad</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                    <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                    <div>
                                        <span className="text-black">Codigo</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                    <div>
                                        <span className="text-black">Unidades</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                    <div>
                                        <span className="text-black">Descripción</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                    <div>
                                        <span className="text-black">Tipo de venta</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                    <div>
                                        <span className="text-black">Precio</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                            <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                    <div>
                                        <span className="text-black">Impuestos</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                                    </div>
                                    </div>
                            </div>
                            <div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-[11px] gap-[4px_0px]">
                                <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                    <div>
                                        <span className="text-black">Total</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                                    </div>
                                    </div>
                            </div>
                            <div className="self-stretch h-[23px] flex flex-row items-start justify-start py-0 pr-[3px] pl-[5px] box-border max-w-full">
                                <button onClick={DeleteItemHander} className="self-stretch flex-1 rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-center pt-px px-5 pb-[11px] box-border max-w-full z-[1]">
                                    <div className="h-[23px] w-[356px] relative rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
                                    <b className="self-stretch relative text-mini font-inria-sans text-white text-left z-[1]">
                                        Eliminar
                                    </b>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-[380px] flex flex-row items-start justify-center py-0 px-5 box-border max-w-full">
                        <button className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
                            <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                            <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                                Nuevo Item
                            </b>
                        </button>
                    </div>
                    
                    
                </div>
            </section> */}
      <TreeNode text="Subtotal" data={subtotal} />
      <TreeNode text="IVA" data={iva} />
      <TreeNode text="Total a Pagar" data={total} />
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
                {/* <div className="self-stretch flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
                                     <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                        <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                                        </div>
                                        <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                                        <div>
                                        <span className="text-black">Tipo</span>
                                <span className="text-tomato">*</span>
                                </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                             <select
                                    className="w-full h-full relative  border-white bg-white border-2 max-w-full"
                                    type="text"
                                    
                                >
                                    <option value="CF">Comprobante Credito Fiscal</option>
                                    <option value="Factura">Factura</option>
                              </select>  
                                    </div>
                                        </div>
                                    <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
                                </div> */}
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
                {/* TODO: Add the credit metod */}
              </div>
              {/*<div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
                                <button className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
                                    <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                                    <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                                        Nuevo Item
                                    </b>
                                </button>
                            </div> */}
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
          value={observaciones}
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
                Editar C Fiscal 
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

export default EditCF;
