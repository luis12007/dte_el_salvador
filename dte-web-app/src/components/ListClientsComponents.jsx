import UserLabel from "./UserLabel";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReceptorService from "../services/receptor";

const InnerFrame = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
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
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans ch:w-1/3 ch:self-center overflow-y-auto">
      <div className="flex-1 flex flex-col items-start justify-start gap-[28px_0px] max-w-full">
        <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-6 pb-9 pr-[21px] pl-[17px] box-border gap-[11.5px] max-w-full">
          <div className="self-stretch h-0 flex flex-row items-start justify-start py-0 pr-0.5 pl-0 box-border max-w-full">
            <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
          </div>
          {/* Scrollable list container */}
          <div className="w-full max-h-[40vh] sm:max-h-[65vh] overflow-y-auto pr-2">
            {Array.isArray(clients) && clients.map((client, index) => (
              <React.Fragment key={index}>
                <UserLabel correoLuisAlexanderContaiPadding="0px 3px" client={client} onSelect={setSelectedClient} />
                <div className="self-stretch h-0 flex flex-row items-start justify-start max-w-full">
                  <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
                </div>
              </React.Fragment>
            ))}
          </div>
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
        {/* Modal de detalles del cliente */}
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedClient(null)} />
            {/* Modal Card */}
            <div className="relative z-10 w-[92vw] max-w-xl bg-white rounded-lg shadow-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Detalle del cliente</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedClient(null)} aria-label="Cerrar">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <Detail label="ID" value={selectedClient.id} />
                <Detail label="Nombre" value={selectedClient.name} />
                <Detail label="Nombre comercial" value={selectedClient.nombre_comercial} />
                <Detail label="Correo" value={selectedClient.correo_electronico} />
                <Detail label="Teléfono" value={selectedClient.numero_telefono} />
                <Detail label="Dirección" value={selectedClient.direccion} className="sm:col-span-2" />
                <Detail label="Actividad económica" value={selectedClient.actividad_economica} />
                <Detail label="Tipo establecimiento" value={selectedClient.tipo_establecimiento} />
                <Detail label="Departamento" value={selectedClient.departament} />
                <Detail label="Municipio" value={selectedClient.municipio} />
                <Detail label="NIT" value={selectedClient.nit} />
                <Detail label="NRC" value={selectedClient.nrc} />
                <Detail label="DUI" value={selectedClient.dui} />
                <Detail label="Otro" value={selectedClient.otro} />
                <Detail label="Usuario ID" value={selectedClient.id_usuario} />
              </div>
              <div className="mt-5 flex justify-end">
                <button className="px-4 py-2 rounded-md bg-seagreen-200 text-white hover:bg-seagreen-100" onClick={() => setSelectedClient(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </section>
  );
};

export default InnerFrame;

// Subcomponente para fila de detalle
const Detail = ({ label, value, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <span className="text-gray-500 text-xs">{label}</span>
    <span className="font-medium break-words">{value ?? '—'}</span>
  </div>
);
