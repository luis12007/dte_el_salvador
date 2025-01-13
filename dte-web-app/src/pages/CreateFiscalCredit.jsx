import TreeNode from "../components/TreeNode";
import TableOfContents from "../components/TableOfContentsWithDelete";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parse, v4 as uuidv4 } from 'uuid';
import UserService from "../services/UserServices";
import TableOfContentsNew from "../components/TableOfContentsNew";
import AdvanceItemsComponent from "../components/AdvanceNoItemsComponent";
import BillnoCF from "../components/ClientBillCredit";
import PlantillaAPI from '../services/PlantillaService';
import PlantillaService from "../services/PlantillaService";
import EmisorService from "../services/emisor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrearCreditoFiscal = () => {
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
    const [items, setitems] = useState([])
    const [contents, setContents] = useState([]);
    


    /* data for municipalities ------------------------------------ */
    /* TODO */
    /* const departmentsAndMunicipalities = {
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
    }; */


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
                { name: "Turín", index: 12 }
            ]
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
                { name: "Texistepeque", index: 13 }
            ]
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
                { name: "Sonzacate", index: 15 }
            ]
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
                { name: "Tejutla", index: 30 }
            ]
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
                { name: "Tenancingo", index: 16 }
            ]
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
                { name: "Zaragoza", index: 22 }
            ]
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
                { name: "Ciudad Delgado", index: 19 }

            ]
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
                { name: "Verapaz", index: 13 }
            ]
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
                { name: "Victoria", index: 9 }
            ]
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
                { name: "Zacatecoluca", index: 21 }
            ]
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
                { name: "Usulután", index: 23 }
            ]
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
                { name: "Uluazapa", index: 18 }
            ]
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
                { name: "Yoloaiquín", index: 26 }
            ]
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
                { name: "Yucuaiquín", index: 18 }
            ]
        }
    };
    

    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState('');

    const handleDepartmentChange = (event) => {
        const departmentKey = event.target.value; // Get the department key
        setSelectedDepartment(departmentKey); // Update selected department
        console.log("Municipality Index", departmentKey);
        console.log("Municipality Index", selectedMunicipality);
        setSelectedMunicipality(''); // Reset municipality when department changes
      };
      const handleMunicipalityChange = (event) => {
        const municipalityIndex = event.target.value; // Get the selected municipality index
        console.log("Municipality Index", municipalityIndex);
        setSelectedMunicipality(municipalityIndex); // Update selected municipality
      };

    const getMunicipalityNumber = () => {
        if (selectedDepartment !== null && selectedMunicipality) {
            const municipalityIndex = departmentsAndMunicipalities[selectedDepartment].municipalities.indexOf(selectedMunicipality);
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
    const hours = String(now.getHours()).padStart(2, '0'); // Ensure 2 digits with leading zero
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensure 2 digits
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Ensure 2 digits

    // Format the time in HH:MM:SS
    const time24Hour = `${hours}:${minutes}:${seconds}`;

    const [time, setTime] = useState({
        date: "",
        time: time24Hour.toString(),
    })


    /* USEEFFECT */
    useEffect(() => {
        const fetchData = async () => {
            const response = await UserService.getUserInfo(id_emisor, token);
            console.log("User Data");
            console.log(response);
            setUserinfo(response);
        }
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
    }
    );

    /* PAYMENT */
    var [payment, setpayment] = useState({
        paymentType: "1",
        paymentmethod: "01",
        numberdoc: "",
        mount: "",
    }
    );

    /* -----------------------FUNCTIONS--------------------- */


    /* FOR CLIENTS */

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
            tributos: ["20"],
            noGravado: 0,
            psv: 0,
            montoDescu: 0,
            numeroDocumento: null,
            precioUni: pricefloat,
            ventaGravada: pricefloat * cuantityint,
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
        const rawSubtotal = Listitemstrack.reduce((total, item) => total + (item.precioUni * item.cantidad), 0);
        const rawiva = Listitemstrack.reduce((total, item) => total + item.ventaGravada * 0.13, 0);
        // Round to two decimal places
        const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
        const roundediva = Math.round(rawiva * 100) / 100;

        setiva(roundediva); // Set the rounded subtotal
        setSubtotal(rawSubtotal); // Set the rounded subtotal
        setTotal(roundedSubtotal + roundediva); // Set the rounded subtotal
        
        console.log("Subtotal", subtotal);
        console.log("Total", total);
    };

    const itemshandleRemove = (indexToRemove) => {
        setitems((prevContents) =>
            prevContents.filter((_, i) => i !== indexToRemove)
        );


        Listitems.splice(indexToRemove, 1);
        setListitems(Listitems);

        console.log("Listitems", Listitems);

        const rawSubtotal = Listitems.reduce((total, item) => total + (item.precioUni * item.cantidad), 0);
        const rawiva = Listitems.reduce((total, item) => total + item.ventaGravada * 0.13, 0);
        // Round to two decimal places
        const roundedSubtotal = Math.round(rawSubtotal * 100) / 100;
        const roundediva = Math.round(rawiva * 100) / 100;

        setiva(roundediva); // Set the rounded subtotal
        setSubtotal(rawSubtotal); // Set the rounded subtotal
        setTotal(roundedSubtotal + roundediva); // Set the rounded subtotal
        
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
    }

    /* handlers */

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
        
        try {
            const responsesum = await EmisorService.count_fiscal(id_emisor, token);
            console.log("Count Fiscal");
            console.log(responsesum);
        } catch (error) {
            console.log(error);
        }


        var selectedDepartmentnum = selectedDepartment
        /* if num is only 1 digit will be 0(digit) or if it is 9 it will be 09, it id 12 will be 12 */
        if(selectedDepartmentnum < 10){
            selectedDepartmentnum = "0" + selectedDepartmentnum;
        }
        var selectedMunicipalitynum = selectedMunicipality
        if(selectedMunicipalitynum < 10){
            selectedMunicipalitynum = "0" + selectedMunicipalitynum;
        }


        var data = {
            identificacion: {
                version: 3,
                ambiente: userinfo.ambiente,
                tipoDte: "03",
                numeroControl: getNextFormattedNumber(userinfo.count_fiscal + 1),
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
                codPuntoVenta: null
            },
            receptor: { /* TODO ADDRESS NIT nombre comercial  ADDED: nit , nombreComercial , DELETED: tipodedocumento*/
                codActividad: client.codActividad,
                direccion:
                {
                    departamento: selectedDepartmentnum,
                    municipio: selectedMunicipalitynum,
                    complemento: client.address
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
            resumen: { /* ADDED ivaPercil */
                condicionOperacion: conditionoperationint,
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
                totalNoSuj: 0,
                tributos: [
                    {
                        codigo: "20",
                        descripcion: "Impuesto al Valor Agregado 13%",
                        valor: iva /* TODO CHANGE */
                    }
                ],
                totalLetras: convertirDineroALetras(total),
                totalExenta: 0,
                subTotalVentas: subtotal,
                totalGravada: subtotal,
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
                ivaPerci1: 0 
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


        if (client.phone === ""){
            data.receptor.telefono = null;
        }
        
        if(client.nit === "" || client.nit === null){
            toast.error("NIT no puede estar vacio");
            return;
        }else if(client.name === "" || client.name === null){
            toast.error("Nombre no puede estar vacio");
            return;

        }else if(client.address === "" || client.address === null){
            toast.error("Direccion no puede estar vacio");
            return;

        }else if(client.email === "" || client.email === null){
            toast.error("Correo no puede estar vacio");
            return;

        }else if(client.codActividad === "" || client.codActividad === null){
            toast.error("Codigo de actividad no puede estar vacio");
            return;

        }else if(client.nrc === "" || client.nrc === null){
            toast.error("NRC no puede estar vacio");
            return;

        }else if(selectedDepartment === "" || selectedDepartment === null){
            toast.error("Departamento no puede estar vacio");
            return;

        }else if(selectedMunicipality === "" || selectedMunicipality === null){
            toast.error("Municipio no puede estar vacio");
            return;

        }else if (Listitems.length === 0) {
            toast.error("No hay items en la factura");
            return;
        }

        console.log("Data");
        console.log(data);

        const responsePlantilla = await PlantillaService.create(data, token, id_emisor);
        console.log("PlantillaService - Create");
        console.log(responsePlantilla);

        if (responsePlantilla.message === "Inserción exitosa") {
            toast.success("Credito Fiscal creado con exito");

            /* wait 5 second and navigate to /facturas */
            setTimeout(() => {
                navigate("/facturas");
            }, 5000);
        }else{
            toast.error("CF no creado intentar de nuevo");
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
        console.log('DeleteItemHander');
    }

    const AddItemHander = () => {
        console.log('AddItemHander');
    }

    const switchTypeItemHandler = () => {
        console.log('switchTypeItemHandler');
    }

    const ChangeHandler = (selectedValue) => {
        if (selectedValue === "Factura") {
            navigate("/crear/factura");

        } else if (selectedValue === "CF") {
            console.log('CF');

        }
    }

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        ChangeHandler(event.target.value);
    }


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
        const formattedOutput = `DTE-03-00000030-${incrementedString}`;

        return formattedOutput;
    }

    const convertirDineroALetras = (cantidad) => {
        if (typeof cantidad !== 'number' || isNaN(cantidad)) {
            throw new Error('La cantidad debe ser un número válido.');
        }
    
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
    
    
    return (
        <form className="m-0 w-full bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[17px] pb-3 pr-[15px] pl-5 box-border gap-[22px_0px] tracking-[normal]">
            <header className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start pt-4 pb-[15px] pr-3.5 pl-[17px] box-border top-[0] z-[99] sticky max-w-full">
                <div className="h-full w-full relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
                <div className="flex-1 rounded-mini bg-gainsboro-300 box-border flex flex-row items-start justify-between pt-[9px] pb-2.5 pr-[7px] pl-[15px] max-w-full gap-[20px] z-[1] border-[1px] border-solid border-white">

                    <select onChange={handleSelectChange} className="h-[35px] w-full relative  border-gainsboro-300 bg-gainsboro-300 border-2 max-w-full">
                        <option value="CF">Comprobante Credito Fiscal</option>
                        <option value="Factura">Factura</option>
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

            <BillnoCF handleSelectChangeCFClient={handleSelectChangeCFClient} setClient={setClient} client={client} departmentsAndMunicipalities={departmentsAndMunicipalities} handleDepartmentChange={handleDepartmentChange} handleMunicipalityChange={handleMunicipalityChange} selectedMunicipality={selectedMunicipality} getMunicipalityNumber={getMunicipalityNumber} selectedDepartment={selectedDepartment} visible={true} />


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
                                <TableOfContentsNew handleAdd={handleAdd} setpayment={setpayment} total={total} /> {/* TODO: Add the credit metod 
                            </div>
                            <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
                                <button className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
                                    <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                                    <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                                        Nuevo Item
                                    </b>
                                </button>
                            </div> 



                        </div>
                    </div>
                </form>
            </section> */}
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
                <ToastContainer />
            </footer>
        </form>
    );
};

export default CrearCreditoFiscal;
