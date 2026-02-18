import ProveedorLabel from "./ProveedorLabel";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ProveedorService from "../services/ProveedorService";

const ListProveedoresComponents = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [editProveedor, setEditProveedor] = useState(null);
  const [notif, setNotif] = useState({ open: false, type: "info", message: "" });
  const id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  const AddProveedorHandler = () => {
    navigate("/agregar/proveedor");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ProveedorService.Get_by_userid(id, token);
        console.log(data);
        setProveedores(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const goBackHandler = () => {
    navigate("/Principal");
  };

  const handleSelectProveedor = (proveedor) => {
    setSelectedProveedor(proveedor);
    setEditProveedor(proveedor ? { ...proveedor } : null);
  };

  const handleChange = (field, value) => {
    setEditProveedor((prev) => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    setSelectedProveedor(null);
    setEditProveedor(null);
  };

  const handleSave = async () => {
    if (!editProveedor) return;
    try {
      const data = await ProveedorService.Edit_by_id(editProveedor.id, token, editProveedor);
      const msg = (data && (data.message || data.msg)) || "";
      if (data.message === "Proveedor actualizado") {
        setProveedores((prev) =>
          prev.map((p) => (p.id === editProveedor.id ? { ...editProveedor } : p))
        );
        closeModal();
        setNotif({ open: true, type: "success", message: msg || "Proveedor actualizado" });
      } else {
        setNotif({ open: true, type: "error", message: msg || "Error al actualizar proveedor" });
      }
    } catch (err) {
      setNotif({ open: true, type: "error", message: "Error al actualizar proveedor" });
    }
  };

  // Opciones para los selects
  const tipoOperacionOptions = [
    { value: "1", label: "1 - Gravada" },
    { value: "2", label: "2 - No gravada o exenta" },
    { value: "3", label: "3 - Excluido o no contribuyente (Renta)" },
    { value: "4", label: "4 - Mixta (régimen especial con incentivos)" },
    { value: "8", label: "8 - Informadas en más de 1 anexo" },
    { value: "9", label: "9 - Excepciones (instituciones públicas / no deducibles)" },
  ];

  const clasificacionOptions = [
    { value: "1", label: "1 - Costos" },
    { value: "2", label: "2 - Gastos" },
    { value: "8", label: "8 - Informadas en más de 1 anexo" },
    { value: "9", label: "9 - Excepciones (instituciones públicas / no IVA)" },
  ];

  const sectorOptions = [
    { value: "1", label: "1 - Industria" },
    { value: "2", label: "2 - Comercio" },
    { value: "3", label: "3 - Agropecuaria" },
    { value: "4", label: "4 - Servicios profesionales / artes / oficios" },
    { value: "8", label: "8 - Informadas en más de 1 anexo" },
    { value: "9", label: "9 - Excepciones" },
  ];

  const tipoCostoGastoOptions = [
    { value: "1", label: "1 - Gasto de venta sin donación" },
    { value: "2", label: "2 - Gasto de administración sin donación" },
    { value: "3", label: "3 - Gastos financieros sin donación" },
    { value: "4", label: "4 - Costo artículos producidos/comprados (import./intern.)" },
    { value: "5", label: "5 - Costo artículos producidos/comprados interno" },
    { value: "6", label: "6 - Costos indirectos de fabricación" },
    { value: "7", label: "7 - Mano de obra" },
    { value: "8", label: "8 - Informadas en más de 1 anexo" },
    { value: "9", label: "9 - Excepciones" },
  ];

  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans ch:w-1/3 ch:self-center overflow-y-auto">
      <div className="flex-1 flex flex-col items-start justify-start gap-[28px_0px] max-w-full">
        <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-6 pb-9 pr-[21px] pl-[17px] box-border gap-[11.5px] max-w-full">
          <div className="self-stretch h-0 flex flex-row items-start justify-start py-0 pr-0.5 pl-0 box-border max-w-full">
            <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
          </div>
          {/* Header */}
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-800">Proveedores</h2>
            <span className="text-sm text-gray-500">{proveedores.length} registros</span>
          </div>
          {/* Scrollable list container */}
          <div className="w-full max-h-[40vh] sm:max-h-[65vh] overflow-y-auto pr-2">
            {Array.isArray(proveedores) && proveedores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p>No hay proveedores registrados</p>
                <p className="text-xs mt-1">Haz clic en "Agregar" para crear uno</p>
              </div>
            ) : (
              proveedores.map((proveedor, index) => (
                <React.Fragment key={index}>
                  <ProveedorLabel
                    correoLuisAlexanderContaiPadding="0px 3px"
                    proveedor={proveedor}
                    onSelect={handleSelectProveedor}
                  />
                  <div className="self-stretch h-0 flex flex-row items-start justify-start max-w-full">
                    <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center py-0">
          <button
            onClick={AddProveedorHandler}
            className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-seagreen-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-center justify-center hover:bg-seagreen-100 mb-4"
          >
            <div className="h-[47px] w-[138px] relative rounded-3xs bg-seagreen-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-lg font-inria-sans text-white text-left z-[1]">Agregar</b>
          </button>

          <button
            onClick={goBackHandler}
            className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-9 bg-indianred-500 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-center justify-center hover:bg-indianred-100"
          >
            <div className="h-[47px] w-[138px] relative rounded-3xs bg-indianred-500 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-lg font-inria-sans text-white text-left z-[1]">Regresar</b>
          </button>
        </div>

        {/* Modal de detalles del proveedor */}
        {selectedProveedor && editProveedor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
            {/* Modal Card */}
            <div
              className="relative z-10 w-[92vw] max-w-2xl bg-white rounded-lg shadow-lg p-5 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Detalle del proveedor</h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
                {/* Campos obligatorios */}
                <Field
                  label="DUI del proveedor *"
                  value={editProveedor.dui}
                  onChange={(v) => handleChange("dui", v)}
                />
                <Field
                  label="Nombre proveedor *"
                  value={editProveedor.name}
                  onChange={(v) => handleChange("name", v)}
                />
                <Field
                  label="NIT proveedor *"
                  value={editProveedor.nit}
                  onChange={(v) => handleChange("nit", v)}
                />
                <Field
                  label="NRC proveedor"
                  value={editProveedor.nrc}
                  onChange={(v) => handleChange("nrc", v)}
                />

                {/* Campos de Renta */}
                <div className="sm:col-span-2 mt-3 mb-1">
                  <h4 className="text-sm font-semibold text-gray-800 border-b pb-1">
                    Información de Renta
                  </h4>
                </div>

                <SelectField
                  label="Tipo de operación (Renta) *"
                  value={editProveedor.tipo_operacion}
                  onChange={(v) => handleChange("tipo_operacion", v)}
                  options={tipoOperacionOptions}
                />

                <SelectField
                  label="Clasificación (Renta) *"
                  value={editProveedor.clasificacion}
                  onChange={(v) => handleChange("clasificacion", v)}
                  options={clasificacionOptions}
                />

                <SelectField
                  label="Sector (Renta) *"
                  value={editProveedor.sector}
                  onChange={(v) => handleChange("sector", v)}
                  options={sectorOptions}
                />

                <SelectField
                  label="Tipo de costo/gasto (Renta) *"
                  value={editProveedor.tipo_costo_gasto}
                  onChange={(v) => handleChange("tipo_costo_gasto", v)}
                  options={tipoCostoGastoOptions}
                />
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-seagreen-200 text-white hover:bg-seagreen-100"
                  onClick={handleSave}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de notificación */}
        {notif.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setNotif({ ...notif, open: false })}
            />
            <div
              className="relative z-10 w-[90vw] max-w-sm bg-white rounded-lg shadow-lg p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notif.type === "success"
                      ? "bg-green-100 text-green-600"
                      : notif.type === "error"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {notif.type === "success" ? "✓" : notif.type === "error" ? "!" : "i"}
                </div>
                <h4 className="text-base font-semibold text-gray-900">
                  {notif.type === "success" ? "Éxito" : notif.type === "error" ? "Error" : "Aviso"}
                </h4>
              </div>
              <p className="text-sm text-gray-700">{notif.message}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 rounded-md bg-seagreen-200 text-white hover:bg-seagreen-100"
                  onClick={() => setNotif({ ...notif, open: false })}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListProveedoresComponents;

// Campo de formulario reutilizable
const Field = ({
  label,
  value,
  onChange,
  disabled = false,
  textarea = false,
  type = "text",
  className = "",
}) => (
  <div className={`flex flex-col mx-1 ${className}`}>
    <label className="text-gray-500 text-xs mb-1">{label}</label>
    {textarea ? (
      <textarea
        className="w-full rounded-md border border-gray-300 px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-seagreen-200 disabled:bg-gray-100"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={3}
      />
    ) : (
      <input
        type={type}
        className="w-full rounded-md border border-gray-300 px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-seagreen-200 disabled:bg-gray-100"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
    )}
  </div>
);

// Campo de selección reutilizable
const SelectField = ({ label, value, onChange, options, disabled = false, className = "" }) => (
  <div className={`flex flex-col mx-1 ${className}`}>
    <label className="text-gray-500 text-xs mb-1">{label}</label>
    <select
      className="w-full rounded-md border border-gray-300 px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-seagreen-200 disabled:bg-gray-100"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    >
      <option value="">Seleccionar...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
