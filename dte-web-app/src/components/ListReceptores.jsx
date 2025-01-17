import UserReceptorComponent from "./UserReceptorComponent";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReceptorService from "../services/receptor";
import './styles.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListReceptores = ({onSelectClient, handleSelectClient}) => {
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
    <div className="modal-overlay">
      <section className="modal-content">
        <div className="flex-1 flex flex-col items-start justify-start gap-[28px_0px] max-w-full">
          <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-6 pb-9 pr-[21px] pl-[17px] box-border gap-[11.5px] max-w-full">
            <div className="self-stretch h-0 flex flex-row items-start justify-start py-0 pr-0.5 pl-0 box-border max-w-full">
              <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
            </div>
            {Array.isArray(clients) && clients.map((client, index) => (
              <React.Fragment key={index}>
                <UserReceptorComponent correoLuisAlexanderContaiPadding="0px 3px" client={client} onSelectClient={onSelectClient} handleSelectClient={handleSelectClient} />
                <div className="self-stretch  h-0 flex flex-row items-start justify-start max-w-full">
                  <div className="h-px flex-1  relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
                </div>
              </React.Fragment>
            ))}
          </div>
          <button className="bg-lightcoral mt-2 self-center text-white py-3 px-6 rounded-lg shadow-md text-lg" onClick={(event) => handleSelectClient(event)}>
              Cerrar
            </button>
        </div>

      </section>
    </div>
  );
};

export default ListReceptores;
