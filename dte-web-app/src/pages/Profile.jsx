import FrameComponent2 from "../components/ButtonsProfileComponent";
import userAPI from "../services/UserServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState , useEffect } from "react";
const Perfil = () => {
  const [name, setName] = useState('')
  const [nit , setNit] = useState('')
  const [nrc , setNrc] = useState('')
  const [actividad_economica , setActividad_economica] = useState('')
  const [direccion , setDireccion] = useState('')
  const [numero_de_telefono , setNumero_telefono] = useState('')
  const [correo_electronico , setCorreo_electronico] = useState('')
  const [nombre_comercial , setNombre_comercial] = useState('')
  const [id_usuario , setId_usuario] = useState(localStorage.getItem('user_id'))
  const [	tipo_de_establecimieto , setTipo_establecimiento] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await userAPI.getUserInfo(id_usuario, token);
        if (result.status === 404) {
          console.log('User not found');
          return;
        }
        setName(result.name);
        setNit(result.nit);
        setNrc(result.nrc);
        setActividad_economica(result.codactividad);
        setDireccion(result.direccion);
        setNumero_telefono(result.numero_de_telefono);
        setCorreo_electronico(result.correo_electronico);
        setNombre_comercial(result.nombre_comercial);
        setTipo_establecimiento(result.tipoestablecimiento);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [id_usuario, token]); // Dependency array


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
    <form className="m-0 w-full bg-steelblue-300 overflow-hidden flex flex-col items-end justify-start pt-[42px] px-5 pb-[182px] box-border gap-[25px_0px] tracking-[normal] ">
      <section className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[25px] box-border gap-[15px] max-w-full ch:w-1/3 ch:self-center">
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
                  value={name}
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
                  value={nit}
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
                value={nrc}
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
                  value={actividad_economica}
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
                value={direccion}
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
                value={numero_de_telefono}
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
                value={correo_electronico}
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
                value={nombre_comercial}
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
                value={tipo_de_establecimieto}
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
