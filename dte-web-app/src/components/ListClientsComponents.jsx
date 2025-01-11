import UserLabel from "./UserLabel";
import { useNavigate } from "react-router-dom";
import React from "react";
const InnerFrame = () => {
  const navigate = useNavigate();
  const AddClientHandler = () => {
    navigate("/agregar/cliente");
  };

  const clients = [
    {
      nit: null,
      dui: null,
      nrc: null,
      actividad_economica: 86203,
      /* TODO: change this to dynamic */
      address: null,
      departament: null,
      municipio: null,
      email: "email",
      nombreComercial: null,
      id: 1,
      name: null,
      phone: null,
      tipo_establecimiento: 20
  },
    {
      id: 2,
      nit: "234567890",
      nrc: "876543210",
      actividad_economica: "Servicios",
      direccion: "456 Elm St, City, Country",
      email: "client2@example.com",
      nombre_comercial: "Servicios 2",
      id_usuario: 102,
      name: "Client Two",
      phone: "555-5678",
      tipo_establecimiento: "Oficina"
    },
    {
      id: 3,
      nit: "345678901",
      nrc: "765432109",
      actividad_economica: "Manufactura",
      direccion: "789 Oak St, City, Country",
      email: "client3@example.com",
      nombre_comercial: "Manufactura 3",
      id_usuario: 103,
      name: "Client Three",
      phone: "555-9012",
      tipo_establecimiento: "Fábrica"
    }
  ];

  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans">
      <div className="flex-1 flex flex-col items-start justify-start gap-[28px_0px] max-w-full">
        <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-6 pb-9 pr-[21px] pl-[17px] box-border gap-[11.5px] max-w-full">
          <div className="self-stretch h-0 flex flex-row items-start justify-start py-0 pr-0.5 pl-0 box-border max-w-full">
            <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
          </div>
          {clients.map((client, index) => (
            <React.Fragment key={index}>
              <UserLabel correoLuisAlexanderContaiPadding="0px 3px" client={client} />
              <div className="self-stretch h-0 flex flex-row items-start justify-start max-w-full">
                <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
                <div className="h-px flex-1 relative box-border max-w-full z-[2] ml-[-349px] border-t-[1px] border-solid border-black" />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
          <button onClick={AddClientHandler} className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-seagreen-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start hover:bg-seagreen-100">
            <div className="h-[47px] w-[138px] relative rounded-3xs bg-seagreen-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-lg font-inria-sans text-white text-left z-[1]">
              Agregar
            </b>
          </button>
        </div>
      </div>
    </section>
  );
};

export default InnerFrame;
