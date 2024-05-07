import userEvent from "@testing-library/user-event";
import FrameComponent3 from "./SwitchON";
import { useEffect } from "react";
import { useState } from "react";
const BillCF = ({handleSelectChangeCFClient, setClient}) => {

  useEffect(() => {
    setClient({
      documentType: null,
      name: null,
      document: null,
      address: null,
      email: null,
      phone: null,
      codActividad: null,
      nrc: null,
      descActividad: null,
    })

  }
  , []);

  const changeHandler = (field,e) => {

    if (field === "document") {
      setClient((prevClient) => ({
        ...prevClient, // Copiar el estado anterior
        ["documentType"]: "13", // Actualizar el campo específico
      }));
      
    }

    console.log(field)
    console.log(e.target.value)
    setClient((prevClient) => ({
      ...prevClient, // Copiar el estado anterior
      [field]: e.target.value, // Actualizar el campo específico
    }));
  };

  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans">
      <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0.5 px-0 pb-[29px] box-border gap-[14px] max-w-full">
        <div className="self-stretch h-[532px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <FrameComponent3 handleSelectChangeCFClient={handleSelectChangeCFClient} />
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">

          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`DUI`}</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                  <input
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                    placeholder="CF"
                    type="text"
                    onChange={(e) => changeHandler("document", e)}
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
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="Luis Alexander"
                type="text"
                onChange={(e) => changeHandler("name", e)}

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
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="Luishdezmtz12@gmail.con"
                type="text"
                onChange={(e) => changeHandler("email", e)}
              />
            </div>
          </div>
        </div>

        
        
      </div>
    </section >
  );
};

export default BillCF;
