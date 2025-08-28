import UserLabel from "./UserLabel";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReceptorService from "../services/receptor";

const InnerFrame = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editClient, setEditClient] = useState(null);
  const [notif, setNotif] = useState({ open: false, type: 'info', message: '' });
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

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setEditClient(client ? { ...client } : null);
  };

  const handleChange = (field, value) => {
    setEditClient((prev) => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    setSelectedClient(null);
    setEditClient(null);
  };

  const handleSave = async () => {
    if (!editClient) return;
    try {
      const data = await ReceptorService.Edit_by_id(editClient.id, token, editClient);
      const msg = (data && (data.message || data.msg)) || '';
      if (data.message === 'Cliente actualizado') {
        // Refrescar en memoria
        setClients((prev) => prev.map((c) => (c.id === editClient.id ? { ...editClient } : c)));
        closeModal();
        setNotif({ open: true, type: 'success', message: msg || 'Cliente actualizado' });
      } else {
        setNotif({ open: true, type: 'error', message: msg || 'Error al actualizar cliente' });
      }
    } catch (err) {
      setNotif({ open: true, type: 'error', message: 'Error al actualizar cliente' });
    }
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
        <UserLabel correoLuisAlexanderContaiPadding="0px 3px" client={client} onSelect={handleSelectClient} />
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
        {selectedClient && editClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
            {/* Modal Card */}
            <div className="relative z-10 w-[92vw] max-w-xl bg-white rounded-lg shadow-lg p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Detalle del cliente</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={closeModal} aria-label="Cerrar">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
                <Field label="Nombre" value={editClient.name} onChange={(v) => handleChange('name', v)} />
                <Field label="Nombre comercial" value={editClient.nombre_comercial} onChange={(v) => handleChange('nombre_comercial', v)} />
                <Field label="Correo" value={editClient.correo_electronico} onChange={(v) => handleChange('correo_electronico', v)} type="email" />
                <Field label="Teléfono" value={editClient.numero_telefono} onChange={(v) => handleChange('numero_telefono', v)} />
                <Field label="Actividad económica" value={editClient.actividad_economica} onChange={(v) => handleChange('actividad_economica', v)} />
                <Field label="Tipo establecimiento" value={editClient.tipo_establecimiento} onChange={(v) => handleChange('tipo_establecimiento', v)} />
                <Field label="Departamento" value={editClient.departament} onChange={(v) => handleChange('departament', v)} />
                <Field label="Municipio" value={editClient.municipio} onChange={(v) => handleChange('municipio', v)} />
                <Field label="NIT" value={editClient.nit} onChange={(v) => handleChange('nit', v)} />
                <Field label="NRC" value={editClient.nrc} onChange={(v) => handleChange('nrc', v)} />
                <Field label="DUI" value={editClient.dui} onChange={(v) => handleChange('dui', v)} />
                <Field label="Otro" value={editClient.otro} onChange={(v) => handleChange('otro', v)} />
                <div className="sm:col-span-2">
                  <Field label="Dirección" value={editClient.direccion} onChange={(v) => handleChange('direccion', v)} textarea />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={closeModal}>Cancelar</button>
                <button className="px-4 py-2 rounded-md bg-seagreen-200 text-white hover:bg-seagreen-100" onClick={handleSave}>Guardar</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de notificación */}
        {notif.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setNotif({ ...notif, open: false })} />
            <div className="relative z-10 w-[90vw] max-w-sm bg-white rounded-lg shadow-lg p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notif.type === 'success' ? 'bg-green-100 text-green-600' : notif.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {notif.type === 'success' ? '✓' : notif.type === 'error' ? '!' : 'i'}
                </div>
                <h4 className="text-base font-semibold text-gray-900">
                  {notif.type === 'success' ? 'Éxito' : notif.type === 'error' ? 'Error' : 'Aviso'}
                </h4>
              </div>
              <p className="text-sm text-gray-700">{notif.message}</p>
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 rounded-md bg-seagreen-200 text-white hover:bg-seagreen-100" onClick={() => setNotif({ ...notif, open: false })}>OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </section>
  );
};

export default InnerFrame;

// Campo de formulario reutilizable
const Field = ({ label, value, onChange, disabled = false, textarea = false, type = 'text', className = "" }) => (
  <div className={`flex flex-col mx-1 ${className}`}>
    <label className="text-gray-500 text-xs mb-1">{label}</label>
    {textarea ? (
      <textarea
        className="w-full rounded-md border border-gray-300 px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-seagreen-200 disabled:bg-gray-100"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={3}
      />
    ) : (
      <input
        type={type}
        className="w-full rounded-md border border-gray-300 px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-seagreen-200 disabled:bg-gray-100"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
    )}
  </div>
);
