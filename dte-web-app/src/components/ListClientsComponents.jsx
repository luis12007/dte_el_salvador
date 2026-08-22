import UserLabel from "./UserLabel";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import ReceptorService from "../services/receptor";

const InnerFrame = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
        const data = await ReceptorService.Get_by_userid(id, token);
        setClients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the async function
  }, []); // Ensure this runs only once on mount

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((client) => {
      const name = (client.name || "").toLowerCase();
      const email = (client.correo_electronico || "").toLowerCase();
      const phone = (client.numero_telefono || "").toLowerCase();
      return name.includes(term) || email.includes(term) || phone.includes(term);
    });
  }, [clients, searchTerm]);

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
    <section className="w-full max-w-full text-left text-xs text-black font-inria-sans">
      <div className="mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl animate-fadeInUp">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 bg-steelblue-300 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 sm:h-11 sm:w-11">
              <svg className="h-5 w-5 text-white sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-4a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-tight text-white sm:text-lg">Clientes</h1>
              <p className="truncate text-xs text-white/80">
                {loading ? 'Cargando…' : `${filteredClients.length} de ${clients.length} cliente${clients.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
          <button
            onClick={goBackHandler}
            className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/25 sm:px-4 sm:py-2 sm:text-sm"
          >
            Volver
          </button>
        </header>

        {/* Search bar: its own section, outside the list's scroll container, so it can never lose space to that scrollbar */}
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, correo o teléfono..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none focus:border-steelblue-200 focus:ring-2 focus:ring-steelblue-100"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Client list: the only scrolling region, kept separate from the search bar above */}
        <div className="max-h-[65vh] overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-steelblue-200 border-t-transparent" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center text-sm text-slate-500">
                {searchTerm ? 'No se encontraron clientes.' : 'No hay clientes registrados.'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredClients.map((client, index) => (
                  <div key={client.id ?? index} className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <UserLabel correoLuisAlexanderContaiPadding="0px" client={client} onSelect={handleSelectClient} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-100 p-4 sm:px-6">
          <button
            onClick={AddClientHandler}
            className="w-full rounded-lg bg-seagreen-200 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-seagreen-100 sm:w-auto"
          >
            + Agregar cliente
          </button>
        </div>
      </div>

      {/* Modal de detalles del cliente */}
      {selectedClient && editClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Detalle del cliente</h3>
              <button
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                onClick={closeModal}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 px-6 py-6 pr-7 text-sm text-gray-700 sm:grid-cols-2 sm:pr-8">
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
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-5 sm:flex-row sm:justify-end">
              <button className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={closeModal}>Cancelar</button>
              <button className="rounded-lg bg-seagreen-200 px-5 py-2.5 text-sm font-semibold text-white hover:bg-seagreen-100" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de notificación */}
      {notif.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" onClick={() => setNotif({ ...notif, open: false })}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${notif.type === 'success' ? 'bg-green-100 text-green-600' : notif.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                {notif.type === 'success' ? '✓' : notif.type === 'error' ? '!' : 'i'}
              </div>
              <h4 className="text-base font-semibold text-gray-900">
                {notif.type === 'success' ? 'Éxito' : notif.type === 'error' ? 'Error' : 'Aviso'}
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">{notif.message}</p>
            <div className="mt-5 flex justify-end">
              <button className="rounded-lg bg-seagreen-200 px-5 py-2.5 text-sm font-semibold text-white hover:bg-seagreen-100" onClick={() => setNotif({ ...notif, open: false })}>OK</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InnerFrame;

// Campo de formulario reutilizable
const Field = ({ label, value, onChange, disabled = false, textarea = false, type = 'text', className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="mb-1.5 text-xs font-medium text-gray-500">{label}</label>
    {textarea ? (
      <textarea
        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-steelblue-200 focus:ring-2 focus:ring-steelblue-100 disabled:bg-gray-100"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={3}
      />
    ) : (
      <input
        type={type}
        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-steelblue-200 focus:ring-2 focus:ring-steelblue-100 disabled:bg-gray-100"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
    )}
  </div>
);
