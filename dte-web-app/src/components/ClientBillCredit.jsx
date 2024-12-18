import React, { useState } from "react";

const ClietnBillCredit = ({
  handleSelectChangeCFClient,
  setClient,
  client,
  departmentsAndMunicipalities,
  handleDepartmentChange,
  handleMunicipalityChange,
  selectedMunicipality,
  getMunicipalityNumber,
  selectedDepartment,
  visible
}) => {
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
      descActividaddata2 =
        "Actividades de organizaciones y órganos extraterritoriales";
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
    }

    // Update the client state with the new value
    setClient((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };
  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans">
      <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0.5 px-0 pb-[29px] box-border gap-[14px] max-w-full">
        <div className="self-stretch h-[532px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch flex flex-col items-start justify-start gap-[9.5px_0px] max-w-full text-left text-xs text-black font-inria-sans">
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
            <b className="relative z-[2]">CLIENTE</b>
            <div className="flex flex-col items-start justify-start pt-px px-0 pb-0">
              <img
                className="w-[18px] h-4 relative object-contain z-[2]"
                alt=""
                src="/atras-1@2x.png"
              />
            </div>
          </div>
          <div className="flex flex-row items-start justify-start py-0 px-3.5">
            <div className="flex flex-row items-start justify-start gap-[0px_4px]"></div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`Nit`}</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <input
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                    placeholder="62486326-2"
                    type="text"
                    value={client.nit}
                    onChange={(e) => handleChange("nit", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`NRC `}</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <input
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                    placeholder="62486326-2"
                    type="text"
                    value={client.nrc}
                    onChange={(e) => handleChange("nrc", e.target.value)}
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
              <span className="text-black">{`Numero de telefono`}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="######"
                type="text"
                value={client.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-row items-start justify-start pl-4 py-1 pr-3 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Nombre Comercial. `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="62486326-2"
                type="text"
                value={client.nombreComercial}
                onChange={(e) =>
                  handleChange("nombreComercial", e.target.value)
                }
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Actividad economica`}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                value={client.codActividad}
                onChange={(e) => handleChange("codActividad", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Correo Eléctronico `}</span>
              <span className="text-tomato">*</span>
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
              <span className="text-tomato">*</span>
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
        <div>
          <div className="self-stretch flex flex-col items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            
                {/* municipality */}
                {/* Department selection */}
                {visible && (
<div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
  <div className="relative text-xs font-inria-sans text-left z-[1] mb-2">
    <span className="text-black">Departamento</span>
    <span className="text-tomato">*</span>
  </div>
  <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
    <select
      className="w-full h-full relative border-white bg-white border-2 max-w-full"
      value={selectedDepartment}
      onChange={handleDepartmentChange}
    >
      <option value="">Select a department</option>
      {Object.keys(departmentsAndMunicipalities).map((key) => (
        <option key={key} value={key}>
          {departmentsAndMunicipalities[key].departmentName}
        </option>
      ))}
    </select>
  </div>
</div>
                )}
                {visible && (
<div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full mt-4">
  <div className="relative text-xs font-inria-sans text-left z-[1] mb-2">
    <span className="text-black">Municipio</span>
    <span className="text-tomato">*</span>
  </div>
  <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
    <select
      className="w-full h-full relative border-white bg-white border-2 max-w-full"
      value={selectedMunicipality}
      onChange={handleMunicipalityChange}
      disabled={!selectedDepartment} // Disable if no department is selected
    >
      <option value="">Select a municipality</option>
      {selectedDepartment &&
        departmentsAndMunicipalities[selectedDepartment].municipalities.map(
          (municipality, index) => (
            <option key={index} value={municipality}>
              {municipality}
            </option>
          )
        )}
    </select>
  </div>
</div>
                )}

                {/* end municipality */}
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClietnBillCredit;