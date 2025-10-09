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
        actividad_economica: null, /* TODO: change this to dynamic */
        address: null,
        departament: null,
        municipio: null,
        email: null,
        nombreComercial: null,
        id_usuario: id_emisor,
        name: null,
        phone: null,
        tipo_establecimiento: 20,
        otro: null,
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

        console.log('AddClientHandler')

        const response = await ReceptorService.Add(id_emisor, token, client);
        console.log(response)
        console.log(client)

        

        if (response.message == "Creado") {
            toast.success("Cliente agregado exitosamente")
            /* wait 3 seconds and navigate to /clientes */
            setTimeout(() => {
                navigate("/clientes");
            }, 3000);
        }else{
            toast.error("Error al agregar cliente")
        }
    }

    const goBackHandler = () => {
        navigate("/clientes");
    }

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      };


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
