import FrameComponent2 from "../components/ButtonsComponent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BillnoCF from "../components/ClientBillAddNew";
import ReceptorService from "../services/receptor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CardOfClientAndAddClient = () => {
    const navigate = useNavigate();
    const id_emisor = localStorage.getItem("user_id");
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const token = localStorage.getItem("token");
    const [client, setClient] = useState({
        nit: null,
        dui: null,
        nrc: null,
        actividad_economica: 86203, /* TODO: change this to dynamic */
        address: null,
        departament: null,
        municipio: null,
        email: null,
        nombreComercial: null,
        id_usuario: id_emisor,
        name: null,
        phone: null,
        tipo_establecimiento: 20
    })


    const AddClientHandler = async () => {
        client.departament = selectedDepartment;
        client.municipio = selectedMunicipality;

        if (client.actividad_economica === null) {
            toast.error("Seleccione una actividad económica")
            return;
        }
        if (client.departament === null) {
            toast.error("Seleccione un departamento")
            return;
        }
        if (client.municipio === null) {
            toast.error("Seleccione un municipio")
            return;
        }
        if (client.email === null) {
            toast.error("Ingrese un correo electrónico")
            return;
        }

        if (client.name === null) {
            toast.error("Ingrese un nombre")
            return;
        }


        if (client.address === null) {
            toast.error("Ingrese una dirección")
            return;
        }

        console.log('AddClientHandler')

        const response = await ReceptorService.Add(id_emisor, token, client);
        console.log(response)
        console.log(client)

        

        if (response.message == "Creado") {
            toast.success("Cliente agregado exitosamente")
        }else{
            toast.error("Error al agregar cliente")
        }
    }

    const goBackHandler = () => {
        navigate("/clientes");
    }

    const departmentsAndMunicipalities = {
        /* 0: {
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







    return (
        <div className="w-full relative pt-20 bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start  px-5 pb-[215px] box-border gap-[23px_0px] tracking-[normal]">
            <main className="self-stretch flex flex-col items-start justify-start gap-[35px_0px] max-w-full mq390:gap-[17px_0px] ch:w-1/3 ch:self-center">
                <BillnoCF setClient={setClient} client={client} departmentsAndMunicipalities={departmentsAndMunicipalities} handleDepartmentChange={handleDepartmentChange} handleMunicipalityChange={handleMunicipalityChange} selectedMunicipality={selectedMunicipality} getMunicipalityNumber={getMunicipalityNumber} selectedDepartment={selectedDepartment} visible={true} />
                <FrameComponent2 goBackHandler={goBackHandler} AddClientHandler={AddClientHandler} />
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
            </main>
        </div>
    );
};

export default CardOfClientAndAddClient;
