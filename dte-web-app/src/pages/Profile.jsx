import FrameComponent2 from "../components/ButtonsProfileComponent";
import userAPI from "../services/UserServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DEPARTAMENTOS,
  MUNICIPIOS_POR_DEPARTAMENTO,
  DISTRITOS_POR_DEPARTAMENTO,
} from "../data/catalogosUbicacion";
import { DISTRITOS_POR_MUNICIPIO } from "../utils/dteSchemaAdapter";

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
  const [descActividad, setDescActividad] = useState("");
  // Dirección fiscal para los DTE (CAT-012 / CAT-013 / CAT-008).
  // Si el distrito queda vacío, los DTE usan San Salvador / San Salvador Centro / San Salvador.
  const [departamento, setDepartamento] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [distrito, setDistrito] = useState('')
  const token = localStorage.getItem('token')
  const navigate = useNavigate();

  // Lista de actividades económicas
  const actividadesEconomicas = [
    { code: "45100", desc: "Venta de vehículos automotores" },
    { code: "86203", desc: "Servicios médicos" },
    { code: "86201", desc: "Clínicas médicas" },
    { code: "96091", desc: "clínicas médicas, Spa" },
    { code: "96092", desc: "Servicios n.c.p." },
    { code: "86901", desc: "Servicios de análisis y estudios de diagnóstico" },
  ];

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
        // Buscar la descripción correspondiente
        const found = actividadesEconomicas.find(a => a.code === result.codactividad);
        setDescActividad(found ? found.desc : "");
        setDireccion(result.direccion);
        setNumero_telefono(result.numero_de_telefono);
        setCorreo_electronico(result.correo_electronico);
        setNombre_comercial(result.nombre_comercial);
        setTipo_establecimiento(result.tipoestablecimiento);
        setDepartamento(result.departamento ?? '');
        setMunicipio(result.municipio ?? '');
        setDistrito(result.distrito ?? '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [id_usuario, token]); // Dependency array


  const handleSubmit = async (e) => {

    // Si se elige distrito, departamento y municipio deben corresponder.
    if (distrito) {
      const municipiosValidos = MUNICIPIOS_POR_DEPARTAMENTO[departamento] || [];
      const distritosValidos = DISTRITOS_POR_MUNICIPIO[`${departamento}-${municipio}`] || [];
      if (!municipiosValidos.some((m) => m.code === municipio)) {
        toast.error('Seleccione un municipio del departamento elegido');
        return;
      }
      if (!distritosValidos.includes(distrito)) {
        toast.error('Seleccione un distrito que pertenezca al municipio elegido');
        return;
      }
    }

    const result = await userAPI.updateUser({
      ...(distrito ? { departamento, municipio } : {}),
      distrito: distrito || null,
      name,
      nit,
      nrc,
      actividad_economica,
      descactividad: descActividad,
      direccion,
      numero_de_telefono,
      correo_electronico,
      nombre_comercial,
      id_usuario,
      tipo_de_establecimieto
    },token)

    console.log(result)

    if(result.message === "Usuario actualizado correctamente"){
      try {
        localStorage.setItem(`emisor_distrito_${id_usuario}`, distrito || '')
      } catch (err) { /* localStorage no disponible */ }
      toast.success('Usuario actualizado correctamente')
      setTimeout(() => {
        navigate('/principal')
      }, 3000)
    }

    
    if(result.status === 404){
      console.log('entro')
      const result2 = await userAPI.createUser({
        name,
        nit,
        nrc,
        actividad_economica,
        descactividad: descActividad,
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
        setTimeout(() => {
          navigate('/principal')
        }, 1500)
      }
    }
  }

  const handleDepartamentoChange = (e) => {
    setDepartamento(e.target.value);
    setMunicipio('');
    setDistrito('');
  };

  const municipiosDisponibles = MUNICIPIOS_POR_DEPARTAMENTO[departamento] || [];
  // Solo los distritos que pertenecen al municipio elegido (Hacienda rechaza otros).
  const codigosDistritoMunicipio = DISTRITOS_POR_MUNICIPIO[`${departamento}-${municipio}`] || [];
  const distritosDisponibles = (DISTRITOS_POR_DEPARTAMENTO[departamento] || []).filter((d) =>
    codigosDistritoMunicipio.includes(d.code)
  );

  // Handler para el cambio en el dropdown
  const handleActividadChange = (e) => {
    const desc = e.target.value;
    setDescActividad(desc);
    const found = actividadesEconomicas.find(a => a.desc === desc);
    if (found) setActividad_economica(found.code);
  };



  return (
    <form className="min-h-screen w-full bg-steelblue-300 flex flex-col items-center justify-start py-8 px-2 sm:px-0">
      <section className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-blue-200 flex flex-col items-center justify-start py-8 px-4 sm:px-8 gap-6 transition-all duration-300 hover:shadow-blue-300">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 tracking-wide">Perfil de Usuario</h2>
        <div className="self-stretch h-[575px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch flex flex-col items-start justify-start gap-[6px_0px] max-w-full">

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
                Actividad económica
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <select
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                value={descActividad}
                onChange={handleActividadChange}
              >
                <option value="">Selecciona una actividad</option>
                {actividadesEconomicas.map((a) => (
                  <option key={a.code} value={a.desc}>{a.desc}</option>
                ))}
              </select>
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
          <div className="flex-1 flex flex-col items-start justify-start gap-[6px_0px] max-w-full rounded-lg border border-blue-100 bg-blue-50/40 p-3">
            <div className="relative text-xs font-inria-sans font-bold text-black text-left">
              Ubicación fiscal para DTE (departamento, municipio y distrito)
            </div>
            <p className="text-[11px] font-inria-sans text-darkslategray m-0">
              {distrito
                ? 'Esta ubicación se usará en la dirección del emisor de todos sus DTE.'
                : 'Sin distrito: sus DTE usan San Salvador / San Salvador Centro / San Salvador.'}
            </p>
            <label className="text-xs font-inria-sans text-black mt-1">Departamento</label>
            <select
              className="w-full font-inria-sans text-xs text-darkslategray p-1 rounded border border-gray-300 bg-white"
              value={departamento}
              onChange={handleDepartamentoChange}
            >
              <option value="">Seleccione un departamento</option>
              {DEPARTAMENTOS.map((d) => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
            <label className="text-xs font-inria-sans text-black mt-1">Municipio</label>
            <select
              className="w-full font-inria-sans text-xs text-darkslategray p-1 rounded border border-gray-300 bg-white"
              value={municipiosDisponibles.some((m) => m.code === municipio) ? municipio : ''}
              onChange={(e) => {
                setMunicipio(e.target.value);
                setDistrito('');
              }}
              disabled={!departamento}
            >
              <option value="">Seleccione un municipio</option>
              {municipiosDisponibles.map((m) => (
                <option key={m.code} value={m.code}>{m.name}</option>
              ))}
            </select>
            <label className="text-xs font-inria-sans text-black mt-1">Distrito</label>
            <select
              className="w-full font-inria-sans text-xs text-darkslategray p-1 rounded border border-gray-300 bg-white"
              value={distritosDisponibles.some((d) => d.code === distrito) ? distrito : ''}
              onChange={(e) => setDistrito(e.target.value)}
              disabled={!departamento || !municipio}
            >
              <option value="">Usar ubicación por defecto (San Salvador)</option>
              {distritosDisponibles.map((d) => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
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
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-4 mb-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition-colors"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => navigate("/principal")}
            className="w-full sm:w-1/2 bg-indianred-500 hover:bg-indianred-400 text-white font-semibold py-2 rounded-lg shadow transition-colors"
          >
            Cancelar
          </button>
        </div>
      </section>
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
