import UserLabel from "./UserLabel";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReceptorService from "../services/receptor";

const InnerFrame = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const AddClientHandler = () => {
    navigate("/agregar/cliente");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await ReceptorService.Get_by_userid(id, token);
        console.log(clients);
        setClients(clients);
        } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function
  }, []); // Ensure this runs only once on mount


  const goBackHandler = () => {
    navigate("/Principal");
  };

  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans">
      <div className="flex-1 flex flex-col items-start justify-start gap-[28px_0px] max-w-full">
        <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-6 pb-9 pr-[21px] pl-[17px] box-border gap-[11.5px] max-w-full">
          <div className="self-stretch h-0 flex flex-row items-start justify-start py-0 pr-0.5 pl-0 box-border max-w-full">
            <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
          </div>
          {Array.isArray(clients) && clients.map((client, index) => (
            <React.Fragment key={index}>
              <UserLabel correoLuisAlexanderContaiPadding="0px 3px" client={client} />
              <div className="self-stretch h-0 flex flex-row items-start justify-start max-w-full">
                <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
                <div className="h-px flex-1 relative box-border max-w-full z-[2] ml-[-349px] border-t-[1px] border-solid border-black" />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="w-full flex flex-col items-center justify-center py-0 ">
          <button onClick={AddClientHandler} className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-seagreen-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-center justify-center hover:bg-seagreen-100 mb-4">
            <div className="h-[47px] w-[138px] relative rounded-3xs bg-seagreen-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-lg font-inria-sans text-white text-left z-[1]">
              Agregar
            </b>
          </button>

          <button
            onClick={goBackHandler}
            className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-9 bg-indianred-500 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-center justify-center hover:bg-indianred-100"
          >
            <div className="h-[47px] w-[138px] relative rounded-3xs bg-indianred-500 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-lg font-inria-sans text-white text-left z-[1]">
              Regresar
            </b>
          </button>
        </div>
        
      </div>
      
    </section>
  );
};

export default InnerFrame;
