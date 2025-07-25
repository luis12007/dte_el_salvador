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
import ClientSubExCreate from "../components/ClientSubExCreate";

const CreateSubEx = () => {
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
          const [codepayment, setCodepayment] = useState("01");
    


    /* data for municipalities ------------------------------------ */
    const departmentsAndMunicipalities = {
        /* 1: {
                departmentName: "Otro pais",
                municipalities: [{ name: "Otro pais", index: 0 }]
            }, */
        1: {
            departmentName: "Ahuachapán",
            municipalities: [
                { name: "Ahuachapán", index: 1 },
                { name: "Apaneca", index: 2 },
                { name: "Atiquizaya", index: 3 },
                { name: "Concepción de Ataco", index: 4 },
                { name: "El Refugio", index: 5 },
                { name: "Guaymango", index: 6 },
                { name: "Jujutla", index: 7 },
                { name: "San Francisco Menéndez", index: 8 },
                { name: "San Lorenzo", index: 9 },
                { name: "San Pedro Puxtla", index: 10 },
                { name: "Tacuba", index: 11 },
                { name: "Turín", index: 12 },
            ],
        },
        2: {
            departmentName: "Santa Ana",
            municipalities: [
                { name: "Candelaria de la Frontera", index: 1 },
                { name: "Coatepeque", index: 2 },
                { name: "Chalchuapa", index: 3 },
                { name: "El Congo", index: 4 },
                { name: "El Porvenir", index: 5 },
                { name: "Masahuat", index: 6 },
                { name: "Metapán", index: 7 },
                { name: "San Antonio Pajonal", index: 8 },
                { name: "San Sebastián Salitrillo", index: 9 },
                { name: "Santa Ana", index: 10 },
                { name: "Santa Rosa Guachipilín", index: 11 },
                { name: "Santiago de la Frontera", index: 12 },
                { name: "Texistepeque", index: 13 },
            ],
        },
        3: {
            departmentName: "Sonsonate",
            municipalities: [
                { name: "Acajutla", index: 1 },
                { name: "Armenia", index: 2 },
                { name: "Caluco", index: 3 },
                { name: "Cuisnahuat", index: 4 },
                { name: "Izalco", index: 5 },
                { name: "Juayúa", index: 6 },
                { name: "Nahuizalco", index: 7 },
                { name: "Nahulingo", index: 8 },
                { name: "Salcoatitán", index: 9 },
                { name: "San Antonio del Monte", index: 10 },
                { name: "San Julián", index: 11 },
                { name: "Santa Catarina Masahuat", index: 12 },
                { name: "Santo Domingo de Guzmán", index: 13 },
                { name: "Sonsonate", index: 14 },
                { name: "Sonzacate", index: 15 },
            ],
        },
        4: {
            departmentName: "Chalatenango",
            municipalities: [
                { name: "Agua Caliente", index: 1 },
                { name: "Arcatao", index: 2 },
                { name: "Azacualpa", index: 3 },
                { name: "Chalatenango", index: 4 },
                { name: "Citalá", index: 5 },
                { name: "Comalapa", index: 6 },
                { name: "Concepción Quezaltepeque", index: 7 },
                { name: "Dulce Nombre de María", index: 8 },
                { name: "El Carrizal", index: 9 },
                { name: "El Paraíso", index: 10 },
                { name: "La Laguna", index: 11 },
                { name: "La Palma", index: 12 },
                { name: "Las Vueltas", index: 13 },
                { name: "Nombre de Jesús", index: 14 },
                { name: "Nueva Concepción", index: 15 },
                { name: "Nueva Trinidad", index: 16 },
                { name: "Ojos de Agua", index: 17 },
                { name: "Potonico", index: 18 },
                { name: "San Antonio de la Cruz", index: 19 },
                { name: "San Antonio Los Ranchos", index: 20 },
                { name: "San Fernando", index: 21 },
                { name: "San Francisco Lempa", index: 22 },
                { name: "San Francisco Morazán", index: 23 },
                { name: "San Ignacio", index: 24 },
                { name: "San Isidro Labrador", index: 25 },
                { name: "San Luis del Carmen", index: 26 },
                { name: "San Miguel de Mercedes", index: 27 },
                { name: "San Rafael", index: 28 },
                { name: "Santa Rita", index: 29 },
                { name: "Tejutla", index: 30 },
            ],
        },
        7: {
            departmentName: "Cuscatlán",
            municipalities: [
                { name: "Candelaria", index: 1 },
                { name: "Cojutepeque", index: 2 },
                { name: "El Carmen", index: 3 },
                { name: "El Rosario", index: 4 },
                { name: "Monte San Juan", index: 5 },
                { name: "Oratorio de Concepción", index: 6 },
                { name: "San Bartolomé Perulapía", index: 7 },
                { name: "San Cristóbal", index: 8 },
                { name: "San José Guayabal", index: 9 },
                { name: "San Pedro Perulapán", index: 10 },
                { name: "San Rafael Cedros", index: 11 },
                { name: "San Ramón", index: 12 },
                { name: "Santa Cruz Analquito", index: 13 },
                { name: "Santa Cruz Michapa", index: 14 },
                { name: "Suchitoto", index: 15 },
                { name: "Tenancingo", index: 16 },
            ],
        },
        5: {
            departmentName: "La Libertad",
            municipalities: [
                { name: "Antiguo Cuscatlán", index: 1 },
                { name: "Chiltiupán", index: 2 },
                { name: "Ciudad Arce", index: 3 },
                { name: "Colón", index: 4 },
                { name: "Comasagua", index: 5 },
                { name: "Huizúcar", index: 6 },
                { name: "Jayaque", index: 7 },
                { name: "Jicalapa", index: 8 },
                { name: "La Libertad", index: 9 },
                { name: "Santa Tecla", index: 10 },
                { name: "Nuevo Cuscatlán", index: 11 },
                { name: "Quezaltepeque", index: 12 },
                { name: "San Juan Opico", index: 13 },
                { name: "Sacacoyo", index: 14 },
                { name: "San José Villanueva", index: 15 },
                { name: "San Matías", index: 16 },
                { name: "San Pablo Tacachico", index: 17 },
                { name: "Talnique", index: 18 },
                { name: "Tamanique", index: 19 },
                { name: "Teotepeque", index: 20 },
                { name: "Tepecoyo", index: 21 },
                { name: "Zaragoza", index: 22 },
            ],
        },
        6: {
            departmentName: "San Salvador",
            municipalities: [
                { name: "Aguilares", index: 1 },
                { name: "Apopa", index: 2 },
                { name: "Ayutuxtepeque", index: 3 },
                { name: "Cuscatancingo", index: 4 },
                { name: "El Paisnal", index: 5 },
                { name: "Guazapa", index: 6 },
                { name: "Ilopango", index: 7 },
                { name: "Mejicanos", index: 8 },
                { name: "Nejapa", index: 9 },
                { name: "Panchimalco", index: 10 },
                { name: "Rosario de Mora", index: 11 },
                { name: "San Marcos", index: 12 },
                { name: "San Martín", index: 13 },
                { name: "San Salvador", index: 14 },
                { name: "Santiago Texacuangos", index: 15 },
                { name: "Santo Tomás", index: 16 },
                { name: "Soyapango", index: 17 },
                { name: "Tonacatepeque", index: 18 },
                { name: "Ciudad Delgado", index: 19 },
            ],
        },
        10: {
            departmentName: "San Vicente",
            municipalities: [
                { name: "Apastepeque", index: 1 },
                { name: "Guadalupe", index: 2 },
                { name: "San Cayetano Istepeque", index: 3 },
                { name: "San Esteban Catarina", index: 4 },
                { name: "San Ildefonso", index: 5 },
                { name: "San Lorenzo", index: 6 },
                { name: "San Sebastián", index: 7 },
                { name: "San Vicente", index: 8 },
                { name: "Santa Clara", index: 9 },
                { name: "Santo Domingo", index: 10 },
                { name: "Tecoluca", index: 11 },
                { name: "Tepetitán", index: 12 },
                { name: "Verapaz", index: 13 },
            ],
        },
        9: {
            departmentName: "Cabañas",
            municipalities: [
                { name: "Cinquera", index: 1 },
                { name: "Dolores", index: 2 },
                { name: "Guacotecti", index: 3 },
                { name: "Ilobasco", index: 4 },
                { name: "Jutiapa", index: 5 },
                { name: "San Isidro", index: 6 },
                { name: "Sensuntepeque", index: 7 },
                { name: "Tejutepeque", index: 8 },
                { name: "Victoria", index: 9 },
            ],
        },
        8: {
            departmentName: "La Paz",
            municipalities: [
                { name: "Cuyultitán", index: 1 },
                { name: "El Rosario", index: 2 },
                { name: "Jerusalén", index: 3 },
                { name: "Mercedes La Ceiba", index: 4 },
                { name: "Olocuilta", index: 5 },
                { name: "Paraíso de Osorio", index: 6 },
                { name: "San Antonio Masahuat", index: 7 },
                { name: "San Emigdio", index: 8 },
                { name: "San Francisco Chinameca", index: 9 },
                { name: "San Pedro Masahuat", index: 10 },
                { name: "San Juan Nonualco", index: 11 },
                { name: "San Juan Talpa", index: 12 },
                { name: "San Juan Tepezontes", index: 13 },
                { name: "San Luis La Herradura", index: 14 },
                { name: "San Luis Talpa", index: 15 },
                { name: "San Miguel Tepezontes", index: 16 },
                { name: "San Pedro Nonualco", index: 17 },
                { name: "Santa María Ostuma", index: 18 },
                { name: "Santiago Nonualco", index: 19 },
                { name: "Tapalhuaca", index: 20 },
                { name: "Zacatecoluca", index: 21 },
            ],
        },
        11: {
            departmentName: "Usulután",
            municipalities: [
                { name: "Alegría", index: 1 },
                { name: "Berlín", index: 2 },
                { name: "California", index: 3 },
                { name: "Concepción Batres", index: 4 },
                { name: "El Triunfo", index: 5 },
                { name: "Ereguayquín", index: 6 },
                { name: "Estanzuelas", index: 7 },
                { name: "Jiquilisco", index: 8 },
                { name: "Jucuapa", index: 9 },
                { name: "Jucuarán", index: 10 },
                { name: "Mercedes Umaña", index: 11 },
                { name: "Nueva Granada", index: 12 },
                { name: "Ozatlán", index: 13 },
                { name: "Puerto El Triunfo", index: 14 },
                { name: "San Agustín", index: 15 },
                { name: "San Buenaventura", index: 16 },
                { name: "San Dionisio", index: 17 },
                { name: "San Francisco Javier", index: 18 },
                { name: "Santa Elena", index: 19 },
                { name: "Santa María", index: 20 },
                { name: "Santiago de María", index: 21 },
                { name: "Tecapán", index: 22 },
                { name: "Usulután", index: 23 },
            ],
        },
        12: {
            departmentName: "San Miguel",
            municipalities: [
                { name: "Carolina", index: 1 },
                { name: "Chapeltique", index: 2 },
                { name: "Chinameca", index: 3 },
                { name: "Ciudad Barrios", index: 4 },
                { name: "Comacarán", index: 5 },
                { name: "El Tránsito", index: 6 },
                { name: "Lolotique", index: 7 },
                { name: "Moncagua", index: 8 },
                { name: "Nueva Guadalupe", index: 9 },
                { name: "Quelepa", index: 10 },
                { name: "San Antonio", index: 11 },
                { name: "San Gerardo", index: 12 },
                { name: "San Jorge", index: 13 },
                { name: "San Luis de la Reina", index: 14 },
                { name: "San Miguel", index: 15 },
                { name: "San Rafael Oriente", index: 16 },
                { name: "Sesori", index: 17 },
                { name: "Uluazapa", index: 18 },
            ],
        },
        13: {
            departmentName: "Morazán",
            municipalities: [
                { name: "Arambala", index: 1 },
                { name: "Cacaopera", index: 2 },
                { name: "Chilanga", index: 3 },
                { name: "Corinto", index: 4 },
                { name: "Delicias de Concepción", index: 5 },
                { name: "El Divisadero", index: 6 },
                { name: "El Rosario", index: 7 },
                { name: "Gualococti", index: 8 },
                { name: "Guatajiagua", index: 9 },
                { name: "Joateca", index: 10 },
                { name: "Jocoaitique", index: 11 },
                { name: "Jocoro", index: 12 },
                { name: "Lolotiquillo", index: 13 },
                { name: "Meanguera", index: 14 },
                { name: "Osicala", index: 15 },
                { name: "Perquín", index: 16 },
                { name: "San Carlos", index: 17 },
                { name: "San Fernando", index: 18 },
                { name: "San Francisco Gotera", index: 19 },
                { name: "San Isidro", index: 20 },
                { name: "San Simón", index: 21 },
                { name: "Sensembra", index: 22 },
                { name: "Sociedad", index: 23 },
                { name: "Torola", index: 24 },
                { name: "Yamabal", index: 25 },
                { name: "Yoloaiquín", index: 26 },
            ],
        },
        14: {
            departmentName: "La Unión",
            municipalities: [
                { name: "Anamorós", index: 1 },
                { name: "Bolívar", index: 2 },
                { name: "Concepción de Oriente", index: 3 },
                { name: "Conchagua", index: 4 },
                { name: "El Carmen", index: 5 },
                { name: "El Sauce", index: 6 },
                { name: "Intipucá", index: 7 },
                { name: "La Unión", index: 8 },
                { name: "Lislique", index: 9 },
                { name: "Meanguera del Golfo", index: 10 },
                { name: "Nueva Esparta", index: 11 },
                { name: "Pasaquina", index: 12 },
                { name: "Polorós", index: 13 },
                { name: "San Alejo", index: 14 },
                { name: "San José", index: 15 },
                { name: "Santa Rosa de Lima", index: 16 },
                { name: "Yayantique", index: 17 },
                { name: "Yucuaiquín", index: 18 },
            ],
        },
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
        documentType: "13",
        phone: null,
        codActividad: null,
        nrc: null,
        descActividad: null,
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

        const ivaperitem = pricefloat / 1.13;
        const ivaperitemfinal = ivaperitem * 0.13;
        const ivarounded = Math.round(ivaperitemfinal * 100) / 100;
        const newItem = {

            descripcion: newContents.description,
            cantidad: cuantityint,
            tipoItem: typeitem,
            precioUni: pricefloat,
            montoDescu: 0,
            uniMedida: 99,
            numItem: Listitems.length + 1,
            codigo: null,
            ventaExenta: pricefloat * cuantityint,
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
            (total, item) => total + item.ventaGravada * 0.13,
            0
        );
        // Round to two decimal places
        const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
        const roundediva = Math.round(rawiva * 100) / 100;

        setiva(0); // Set the rounded subtotal
        setSubtotal(roundedSubtotal.toFixed(2)); // Set the rounded subtotal

        const value_rent = ((rawSubtotal * percentage) / 100).toFixed(2);
        console.log(value_rent);
        setRentvalue(value_rent)
        const totalwithiva = roundedSubtotal + 0
        setTotal((totalwithiva - value_rent).toFixed(2))

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
        const rawiva = Listitems.reduce(
            (total, item) => total + item.ventaGravada * 0.13,
            0
        );
        // Round to two decimal places
        const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
        const roundediva = Math.round(rawiva * 100) / 100;

        setiva(0); // Set the rounded subtotal
        setSubtotal(rawSubtotal.toFixed(2)); // Set the rounded subtotal

        const value_rent = ((rawSubtotal * percentage) / 100).toFixed(2);
        console.log(value_rent);
        setRentvalue(value_rent)
        const totalwithiva = roundedSubtotal + 0
        setTotal((totalwithiva - value_rent).toFixed(2))

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


        var totalamountfixed = parseFloat(subtotal) + parseFloat(iva);
        var totalamount = totalamountfixed.toFixed(2);
        var selectedDepartmentnum = selectedDepartment;
        /* if num is only 1 digit will be 0(digit) or if it is 9 it will be 09, it id 12 will be 12 */
        if (selectedDepartmentnum < 10) {
            selectedDepartmentnum = "0" + selectedDepartmentnum;
        }
        var selectedMunicipalitynum = selectedMunicipality;
        if (selectedMunicipalitynum < 10) {
            selectedMunicipalitynum = "0" + selectedMunicipalitynum;
        }

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
                tipoDte: "14",
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
                /* TODO: Just in case establecimiento  */
                codEstableMH: null,
                codEstable: null,
                codPuntoVentaMH: null,
                codPuntoVenta: null,
            },
            sujetoExcluido: {
                /* TODO ADDRESS NIT nombre comercial  ADDED: nit , nombreComercial , DELETED: tipodedocumento*/
                codActividad: client.codActividad,
                direccion: {
                    departamento: selectedDepartmentnum,
                    municipio: selectedMunicipalitynum,
                    complemento: client.address,
                },
                numeroDocumento: client.document,
                descActividad: client.descActividad,
                correo: client.email,
                nombre: client.name,
                tipoDocumento: client.documentType,
                telefono: client.phone,
                nombreComercial: client.nombreComercial,
            },
            otrosDocumentos: null,
            ventaTercero: null,
            cuerpoDocumento: Listitems,
            resumen: {

                montoTotalOperacion: totalamount,
                descuExenta: 0,
                totalDescu: 0,
                subTotal: subtotal,
                ivaRete1: 0,
                reteRenta: rentvalue,
                totalPagar: total,
                totalLetras: convertirDineroALetras(total),
                pagos: [
                    {
                        periodo: null,
                        plazo: null,
                        montoPago: total,
                        codigo: codepayment,
                        referencia: null,
                    },
                ],
                observaciones: observaciones,
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

        if (client.name === "" || client.name === null) {
            toast.error("Nombre no puede estar vacio");
            return;
        } else if (client.address === "" || client.address === null) {
            toast.error("Direccion no puede estar vacio");
            return;
        } else if (client.email === "" || client.email === null) {
            toast.error("Correo no puede estar vacio");
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

        /* print data */
        console.log("Data");
        console.log(data);


        try {
            const responsesum = await EmisorService.count_fiscal(id_emisor, token);
            console.log("Count Fiscal");
            console.log(responsesum);

            const responseincrement = await UserService.id_enviopus1(id_emisor, token);
            console.log("incremented");
            console.log(responseincrement);


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
                toast.success("Sujeto excluido creado con exito");

                /* wait 5 second and navigate to /facturas */
                setTimeout(() => {
                    navigate("/facturas");
                }, 5000);
            } else {
                toast.error("Sujeto excluido no creado intentar de nuevo");
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
        } catch (error) {
            console.log(error);
            toast.error("Error al crear la factura de sujeto excluido");
        }
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
        } else if (selectedValue === "CR") {
            navigate("/crear/Comprobante_Retencion");
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
        const formattedOutput = `DTE-14-00000030-${incrementedString}`;

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

    const onSelectClient = (event, clientset) => {
        event.preventDefault();
        if (client.documentType == "36") {
            setClient({
                name: clientset.name,
                document: clientset.nit,
                address: clientset.direccion,
                email: clientset.correo_electronico,
                phone: clientset.numero_telefono,
                codActividad: null,
                nrc: clientset.nrc,
                descActividad: null,
                nombreComercial: clientset.nombre_comercial,
                departamento: clientset.departament,
                municipio: clientset.municipio,
                documentType: "36",
            });
        } else if (client.documentType == "13") {
            setClient({
                name: clientset.name,
                document: clientset.dui,
                address: clientset.direccion,
                email: clientset.correo_electronico,
                phone: clientset.numero_telefono,
                codActividad: null,
                nrc: clientset.nrc,
                descActividad: null,
                nit: clientset.nit,
                nombreComercial: clientset.nombre_comercial,
                departamento: clientset.departament,
                municipio: clientset.municipio,
                documentType: "13",
            });
        } else {
            setClient({
                name: clientset.name,
                document: clientset.dui,
                address: clientset.direccion,
                email: clientset.correo_electronico,
                phone: clientset.numero_telefono,
                codActividad: null,
                nrc: clientset.nrc,
                descActividad: null,
                nit: clientset.nit,
                nombreComercial: clientset.nombre_comercial,
                departamento: clientset.departament,
                municipio: clientset.municipio,
            });
        }

        setSelectedDepartment(clientset.departament);
        setSelectedMunicipality(clientset.municipio);
        console.log(clientset);
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

        setiva(0); // Set the rounded subtotal
        setSubtotal(rawSubtotal.toFixed(2)); // Set the rounded subtotal

        const value_rent = ((rawSubtotal * e.target.value) / 100).toFixed(2);
        console.log(value_rent);
        setRentvalue(value_rent)
        const totalwithiva = roundedSubtotal + 0
        setTotal((totalwithiva - value_rent).toFixed(2))

        console.log("Subtotal", subtotal);
        console.log("Total", total);


    };



    function formatDUI(num) {
        const str = num.toString();
        return str.slice(0, -1) + "-" + str.slice(-1);
    }
    return (
        <form className="m-0 w-full bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[17px] pb-3 pr-[15px] pl-5 box-border gap-[22px_0px] tracking-[normal]">
            <header className="rounded-mini  bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-center justify-center pt-4 pb-[15px] pr-3.5 pl-[17px] box-border top-[0] z-[99] sticky max-w-full self-stretch ch:w-1/3 ch:self-center">
                <div className="h-[66px] w-[390px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
                <div className="flex-1 rounded-mini bg-gainsboro-300 box-border flex flex-row items-start justify-between pt-[9px] pb-2.5 pr-[7px] pl-[15px] max-w-full gap-[20px] z-[1] border-[1px] border-solid border-white ">
                    <select
                        onChange={handleSelectChange}
                        className="h-[35px] w-full relative  border-gainsboro-300 bg-gainsboro-300 border-2 max-w-full"
                    >
                        <option value="SU">Factura de Sujeto Excluido</option>
                        <option value="Factura">Factura</option>
                        <option value="CF">Comprobante Crédito Fiscal</option>
                        <option value="NC">Nota de Crédito</option>
                        <option value="ND">Nota de Débito</option>

                    </select>
                    {/* Your other elements */}
                </div>
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

            <ClientSubExCreate
                handleSelectChangeCFClient={handleSelectChangeCFClient}
                setClient={setClient}
                client={client}
                departmentsAndMunicipalities={departmentsAndMunicipalities}
                handleDepartmentChange={handleDepartmentChange}
                handleMunicipalityChange={handleMunicipalityChange}
                selectedMunicipality={selectedMunicipality}
                getMunicipalityNumber={getMunicipalityNumber}
                selectedDepartment={selectedDepartment}
                visible={true}
                handleSelectClient={handleSelectClient}
                isVisibleClient={isVisibleClient}
                onSelectClient={onSelectClient}

            />

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

export default CreateSubEx;
