import FrameComponent3 from "./SwitchOFF";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DocumentTypeFrame = ({ handleSelectClient, setClient , client, isVisibleClient, onSelectClient}) => {
  // Extended list of departments and their corresponding municipalities
  const handleChange = (field, value) => {

    var descActividaddata2 = "Otros";
    if (value == "10005") {
      descActividaddata2 = "Otros";
    } else if (value == "10001") {
      descActividaddata2 = "Empleados";
    } else if (value == "10003") {
      descActividaddata2 = "Estudiante";
    } else if (value == "97000") {
      descActividaddata2 = "empleadores de personal doméstico";
    } else if (value == "99000") {
      descActividaddata2 = "Actividades de organizaciones y órganos extraterritoriales";
    } else if (value == "10004") {
      descActividaddata2 = "Desempleado";
    }

    if (field == "codActividad") {
      setClient((prevClient) => ({
        ...prevClient,
        [field]: value,
        descActividad: descActividaddata2,
      }));
      return;
    };

    // Update the client state with the new value
    setClient((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };
  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans ch:w-1/3 ch:self-center">
      <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start px-0 pb-[29px] box-border gap-[14px] max-w-full">
        <div className="self-stretch h-[532px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <FrameComponent3
          handleSelectClient={handleSelectClient} isVisibleClient={isVisibleClient} onSelectClient={onSelectClient}
        />
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Tipo de documento de identificación `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <select
              value={client.documentType}
                onChange={(e) => handleChange("documentType", e.target.value)}
                className="w-full relative  bg-white border-2 max-w-full"
              >
                <option value="13">DUI</option>
                <option value="36">NIT </option>
                <option value="03">Pasaporte</option>
                <option value="37">Otro</option>
                {/* <option value="02">Carnet de residencia</option>
                 */}
              </select>
              <div className="h-[23px] w-[359px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
            </div>

            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`Documento de identificación `}</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <input
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2] no-spinner"
                    placeholder="Documento sin guiones ni espacios"
                    type="Number"
                    value={client.document}
                    onChange={(e) => handleChange("document", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Nombre `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                value={client.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Teléfono `}</span>
              {/* <span className="text-tomato">*</span> */}
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                value={client.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Correo Eléctronico `}</span>
              <span className="text-lime-700">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                value={client.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Dirección `}</span>
              {/* <span className="text-tomato">*</span> */}
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                value={client.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* <div className="self-stretch px-3">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Tipo de documento de identificación `}</span>
              <span className="text-tomato">*</span> 
            </div>
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100 px-3">
              <select
              value={client.codActividad}
                onChange={(e) => handleChange("codActividad", e.target.value)}
                className="w-full relative  bg-white border-2 max-w-full"
              >
                <option value="10005">Otros</option>
                <option value="10001">Empleados</option>
                <option value="10003">Estudiante</option>
                <option value="97000">empleadores de personal doméstico</option>
                <option value="99000">Actividades de organizaciones y órganos extraterritoriales </option>
                <option value="10004">Desempleado</option>
              </select>
              <div className="h-[23px] w-[359px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
            </div>
            </div>  */}
      </div>
      
    </section>
  );
};

export default DocumentTypeFrame;
