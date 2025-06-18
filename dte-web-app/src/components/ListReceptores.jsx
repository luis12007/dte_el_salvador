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
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
        setFilteredClients(clients);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter clients based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => {
        const name = client.name || "";
        const email = client.correo_electronico || "";
        const phone = client.numero_telefono || "";
        
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               phone.includes(searchTerm);
      });
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const goBackHandler = () => {
    navigate("/Principal");
  };

  return (
    <div className="modal-overlay animate-fadeIn">
      <section className="modal-content animate-zoomIn">
        <div className="flex-1 flex flex-col items-start justify-start gap-[16px] max-w-full">
          {/* Header */}
          <div className="w-full flex flex-row items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Lista de Receptores
            </h2>
            <button
              onClick={handleSelectClient}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Filter */}
          <div className="w-full">
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="filter-input w-full"
            />
          </div>

          {/* Results counter */}
          <div>
            <p className="text-sm text-gray-600">
              {filteredClients.length} receptores
            </p>
          </div>

          {/* Clients List */}
          <div className="w-full">
            <div className="bg-white rounded-lg border border-gray-200 max-h-80 w-full overflow-y-auto">
              {Array.isArray(filteredClients) && filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <div key={client.id || index}>
                    <UserReceptorComponent 
                      correoLuisAlexanderContaiPadding="12px" 
                      client={client} 
                      onSelectClient={onSelectClient} 
                      handleSelectClient={handleSelectClient} 
                    />
                    {index < filteredClients.length - 1 && (
                      <div className="w-full h-px bg-gray-200" />
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-gray-500 text-center">
                    {searchTerm ? 'No se encontraron receptores' : 'No hay receptores registrados'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full flex justify-center">
            <button 
              onClick={AddClientHandler}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Agregar Receptor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};


export default ListReceptores;
