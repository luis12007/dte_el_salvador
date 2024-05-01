import FrameComponent2 from "../components/ButtonsProfileComponent";
import userAPI from "../services/UserServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
const Perfil = () => {
  const [name, setName] = useState('')
  const [nit , setNit] = useState('')
  const [nrc , setNrc] = useState('')
  const [actividad_economica , setActividad_economica] = useState('')
  const [direccion , setDireccion] = useState('')
  const [numero_de_telefono , setNumero_telefono] = useState('')
  const [correo_electronico , setCorreo_electronico] = useState('')
  const [nombre_comercial , setNombre_comercial] = useState('')
  const [id_usuario , setId_usuario] = useState(localStorage.getItem('user'))
  const [	tipo_de_establecimieto , setTipo_establecimiento] = useState('')
  const token = localStorage.getItem('token')

  const handleSubmit = async (e) => {

    const result = await userAPI.updateUser({
      name,
      nit,
      nrc,
      actividad_economica,
      direccion,
      numero_de_telefono,
      correo_electronico,
      nombre_comercial,
      id_usuario,
      tipo_de_establecimieto
    },token)

    const departmentsAndMunicipalities = {
      0: { departmentName: 'Otro pais', municipalities: ["Otro pais"] },
      1: {
        departmentName: 'Ahuachapán',
        municipalities: [
          'Ahuachapán',
          'Apaneca',
          'Atiquizaya',
          'Concepción de Ataco',
          'El Refugio',
          'Guaymango',
          'Jujutla',
          'San Francisco Menéndez',
          'San Lorenzo',
          'San Pedro Puxtla',
          'Tacuba',
          'Turín',
        ],
      },
      2: {
        departmentName: 'Santa Ana',
         municipalities: [
          'Candelaria de la Frontera', 
          'Coatepeque',
          'Chalchuapa',
          'El Congo',
          'El Porvenir',
          'Masahuat',
          'Metapán',
          'San Antonio Pajonal',
          'San Sebastián Salitrillo',
          'Santa Ana',
          'Santa Rosa Guachipilín',
          'Santiago de la Frontera',
          'Texistepeque',
        ],
      },
      3: {
        departmentName: 'Sonsonate',
        municipalities: [
          'Acajutla',
          'Armenia',
          'Caluco',
          'Cuisnahuat',
          'sta i ishuatan',
          'Izalco',
          'Juayúa',
          'Nahuizalco',
          'Nahulingo',
          'Salcoatitán',
          'San Antonio del Monte',
          'San Julián',
          'Santa Catarina Masahuat',
          'Santo Domingo de Guzmán',
          'Sonsonate',
          'Sonzacate',
        ],
      },
      4: {
        departmentName: 'Chalatenango',
        municipalities: [
          'Agua Caliente',
          'Arcatao',
          'Azacualpa',
          'Citalá',
          'Comalapa',
          'Concepción Quezaltepeque',
          'Chalatenango',
          'Dulce Nombre de María',
          'El Carrizal',
          'El Paraíso',
          'La Laguna',
          'La Palma',
          'La Reina',
          'Las Vueltas',
          'Nombre de Jesús',
          'Nueva Concepción',
          'Nueva Trinidad',
          'Ojos de Agua',
          'Potonico',
          'San Antonio La Cruz',
          'San Antonio Los Ranchos',
          'San Fernando',
          'San Francisco Lempa',
          'San Francisco Morazán',
          'San Ignacio',
          'San Isidro Labrador',
          'San José Cancasque',
          'San José Flores',
          'San Luis del Carmen',
          'San Miguel de Mercedes',
          'San Rafael',
          'Santa Rita',
          'Tejutla',
        ],
      },
      5: {
        departmentName: 'La Libertad',
        municipalities: [
          'Antiguo Cuscatlán',
          'Ciudad Arce',
          'Colón',
          'Comasagua',
          'Chiltiupán',
          'Huizúcar',
          'Jayaque',
          'Jicalapa',
          'La Libertad',
          'Nuevo Cuscatlán',
          'Santa tecla',
          'Quezaltepeque',
          'Sacacoyo',
          'San juan villanueva',
          'San Juan Opico',
          'San Matías',
          'San Pablo Tacachico',
          'Tamanique',
          'Talnique',
          'Teotepeque',
          'Tepecoyo',
          'Zaragoza',
        ],
      },
      6: {
        departmentName: 'San Salvador',
        municipalities: [
          'Aguilares',
          'Apopa',
          'Ayutuxtepeque',
          'Cuscatancingo',
          'El Paisnal',
          'Guazapa',
          'Ilopango',
          'Mejicanos',
          'Nejapa',
          'Panchimalco',
          'Rosario de Mora',
          'San Marcos',
          'San Martín',
          'San Salvador',
          'Santiago Texacuangos',
          'Santo Tomás',
          'Soyapango',
          'Tonacatepeque',
          'Ciudad Delgado',
        ],
      },
      7: {
        departmentName: 'Cuscatlán',
        municipalities:  [
          'Candelaria',
          'Cojutepeque',
          'El Carmen',
          'El Rosario',
          'Monte San Juan',
          'Oratorio de Concepción',
          'San Bartolomé Perulapia',
          'San Cristóbal',
          'San José Guayabal',
          'San Pedro Perulapán',
          'San Rafael Cedros',
          'San Ramón',
          'Santa Cruz Analquito',
          'Santa Cruz Michapa',
          'Suchitoto',
          'Tenancingo',
        ],
      },
      8: {
        departmentName: 'La Paz',
        municipalities: [
          'Cuyultitán',
          'El Rosario',
          'Jerusalén',
          'Mercedes La Ceiba',
          'Olocuilta',
          'Paraíso de Osorio',
          'San Antonio Masahuat',
          'San Emigdio',
          'San Francisco Chinameca',
          'San Juan Nonualco',
          'San Juan Talpa',
          'San Juan Tepezontes',
          'San Luis Talpa',
          'San Miguel Tepezontes',
          'San Pedro Masahuat',
          'San Pedro Nonualco',
          'San Rafael Obrajuelo',
          'Santa María Ostuma',
          'Santiago Nonualco',
          'Tapalhuaca',
          'Zacatecoluca',
          'San Luis La Herradura',
        ],
      },
      9: {
        departmentName: 'Cabañas',
        municipalities: [
          'Cinquera',
          'Guacotecti',
          'Ilobasco',
          'Jutiapa',
          'San Isidro',
          'Sensuntepeque',
          'Tejutla',
          'Victoria',
          'Dolores',
        ],
      },
      10: {
        departmentName: 'San Vicente',
        municipalities: [
          'Apastepeque',
          'Guadalupe',
          'San Cayetano Istepeque',
          'Santa Clara',
          'Santo Domingo',
          'San Esteban Catarina',
          'San Ildefonso',
          'San Lorenzo',
          'San Sebastián',
          'San Vicente',
          'Tecoluca',
          'Tepetitán',
          'Verapaz',
        ],
      },
      11: {
        departmentName: 'Usulután',
        municipalities: [
          'Alegría',
          'Berlín',
          'California',
          'Concepción Batres',
          'El Triunfo',
          'Ereguayquín',
          'Estanzuelas',
          'Jiquilisco',
          'Jucuapa',
          'Jucuará',
          'Mercedes Umaña',
          'Nueva Granada',
          'Ozatlán',
          'Puerto El Triunfo',
          'San Agustín',
          'San Buenaventura',
          'San Dionisio',
          'Santa Elena',
          'San Francisco Javier',
          'Santa María',
          'Santiago de María',
          'Tecapán',
          'Usulután',
        ],
      },
      12: {
        departmentName: 'San Miguel',
        municipalities: [
          'Carolina',
          'Ciudad Barrios',
          'Comacarán',
          'Chapeltiquex',
          'Chinameca',
          'Chirilagua',
          'El Tránsito',
          'Lolotique',
          'Moncagua',
          'Nueva Guadalupe',
          'Nuevo Edén de San Juan',
          'Quelepa',
          'San Antonio del Mosco',
          'San Gerardo',
          'San Jorge',
          'San Luis de la Reina',
          'San Miguel',
          'San Rafael Oriente',
          'Sesori',
          'Uluazapa',
        ],
      },
      13: {
        departmentName: 'Morazán',
        municipalities: [
          'Arambala',
          'Cacaopera',
          'Corinto',
          'Chilanga',
          'Delicias de Concepción',
          'El Divisadero',
          'El Rosario',
          'Guatajiagua',
          'Joateca',
          'Jocoaitique',
          'Jocoro',
          'Lolotiquillo',
          'Meanguera',
          'Osicala',
          'Perquín',
          'San Carlos',
          'San Fernando',
          'San Francisco Gotera',
          'San Isidro',
          'San Simón',
          'Sensembra',
          'Sociedad',
          'Torola',
          'Yamabal',
          'Yoloaiquín',
        ],
      },
      14: {
        departmentName: 'La Unión',
        municipalities: [
          'Anamorós',
          'Bolívar',
          'Concepción de Oriente',
          'Conchagua',
          'El Carmen',
          'El Sauce',
          'Intipucá',
          'La Unión',
          'Lislique',
          'Meanguera del Golfo',
          'Nueva Esparta',
          'Pasaquina',
          'Polorós',
          'San Alejo',
          'San José',
          'Santa Rosa de Lima',
          'Yayantique',
          'Yucuaiquín',
        ],
      },
      // You can add more departments and their municipalities as needed
    };
    /* const initialDepartmentId = Object.keys(departmentsAndMunicipalities)[0];
  const [selectedDepartment, setSelectedDepartment] = useState(initialDepartmentId);
  const [selectedMunicipality, setSelectedMunicipality] = useState(
    departmentsAndMunicipalities[initialDepartmentId].municipalities[0]
  );

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setClient((prevClient) => ({
      ...prevClient,
      department: departmentId,
    }));

    // Reset the selected municipality to the first in the new department
    setSelectedMunicipality(departmentsAndMunicipalities[departmentId].municipalities[0]);
    const themunicipality = departmentsAndMunicipalities[initialDepartmentId].municipalities.indexOf(departmentsAndMunicipalities[initialDepartmentId].municipalities[0]) +1
    setClient((prevClient) => ({
      ...prevClient,
      municipality: themunicipality.toString(),
    }));
  };

  const handleMunicipalityChange = (e) => {
    const newMunicipality = e.target.value;
  
    setSelectedMunicipality(newMunicipality);
  
    // Find the one-based index of the selected municipality
    const municipalityIndex = departmentsAndMunicipalities[selectedDepartment].municipalities.indexOf(newMunicipality) + 1;
  
    setClient((prevClient) => ({
      ...prevClient,
      municipality: municipalityIndex.toString(), // Store the index as a string
    }));
  }; */
    console.log(result)

    if(result.message === "Usuario actualizado correctamente"){
      toast.success('Usuario actualizado correctamente')
    }

    
    if(result.status === 404){
      console.log('entro')
      const result2 = await userAPI.createUser({
        name,
        nit,
        nrc,
        actividad_economica,
        direccion,
        numero_de_telefono,
        correo_electronico,
        nombre_comercial,
        id_usuario,
        tipo_de_establecimieto
      },token)

      console.log(result2)
      if(result2.message === "Usuario creado correctamente"){
        toast.success('Usuario creado correctamente')
      }
    }
  }





  return (
    <form className="m-0 w-[430px] bg-steelblue-300 overflow-hidden flex flex-col items-end justify-start pt-[42px] px-5 pb-[182px] box-border gap-[25px_0px] tracking-[normal]">
      <section className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[25px] box-border gap-[15px] max-w-full">
        <div className="self-stretch h-[575px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
            <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
              Datos Personales
            </b>
            <div className="flex flex-col items-start justify-start pt-px px-0 pb-0">
              <img
                className="w-[18px] h-4 relative object-contain z-[2]"
                alt=""
                src="/atras-1@2x.png"
              />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[9px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
              <div className="flex flex-row items-start justify-start py-0 px-[3px]">
                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                  Nombre o razón social
                </div>
              </div>
              <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
                <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
                <input
                  className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                  placeholder="datos personales datos personales"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
              <div className="flex flex-row items-start justify-start py-0 px-[3px]">
                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                  NIT
                </div>
              </div>
              <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
                <div className="h-[23px] w-full  relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
                <div className="relative text-xs font-inria-sans  text-darkslategray w-full text-left z-[2]">
                <input
                  className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                  placeholder="datos personales datos personales"
                  type="text"
                  onChange={(e) => setNit(e.target.value)}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                NRC
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                onChange={(e) => setNrc(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                Actividad Económica
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <div className="relative text-xs font-inria-sans text-darkslategray w-full text-left z-[2]">
              <input
                  className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                  placeholder="datos personales datos personales"
                  type="text"
                  onChange={(e) => setActividad_economica(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                Dirección
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                onChange={(e) => setDireccion(e.target.value)}

              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                Numero de teléfono
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                onChange={(e) => setNumero_telefono(e.target.value)}

              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                Correo Electrónico
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                onChange={(e) => setCorreo_electronico(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                Nombre Comercial
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <div className="relative text-xs font-inria-sans w-full text-darkslategray text-left z-[2]">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                onChange={(e) => setNombre_comercial(e.target.value)}
              />
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full">
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                Tipo de establecimiento
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-full relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                onChange={(e) => setTipo_establecimiento(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      <FrameComponent2
        actionFrameAlignSelf="center"
        actionFramePadding="unset"
        actionFrameWidth="382px"
        updateControlsBackgroundColor="#a85050"
        rectangleDivBackgroundColor="#a85050"
        handleSubmit={handleSubmit}
      />
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
    </form>
    
  );
};

export default Perfil;
