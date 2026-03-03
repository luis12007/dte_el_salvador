import FrameComponent2 from "../components/ButtonsComponent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProveedorService from "../services/ProveedorService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProveedor = () => {
  const navigate = useNavigate();
  const id_emisor = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  const [proveedor, setProveedor] = useState({
    dui: null,
    name: null,
    nit: null,
    nrc: null,
    tipo_operacion: null,
    clasificacion: null,
    sector: null,
    tipo_costo_gasto: null,
    id_usuario: id_emisor,
  });

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

  const handleChange = (field, value) => {
    setProveedor((prev) => ({ ...prev, [field]: value }));
  };

  const AddProveedorHandler = async () => {
    // Validaciones
    if (!proveedor.dui || proveedor.dui.trim() === "") {
      toast.error("Ingrese el DUI del proveedor");
      return;
    }
    if (!proveedor.name || proveedor.name.trim() === "") {
      toast.error("Ingrese el nombre del proveedor");
      return;
    }
    if (!proveedor.nit || proveedor.nit.trim() === "") {
      toast.error("Ingrese el NIT del proveedor");
      return;
    }
    if (!proveedor.tipo_operacion) {
      toast.error("Seleccione el tipo de operación (Renta)");
      return;
    }
    if (!proveedor.clasificacion) {
      toast.error("Seleccione la clasificación (Renta)");
      return;
    }
    if (!proveedor.sector) {
      toast.error("Seleccione el sector (Renta)");
      return;
    }
    if (!proveedor.tipo_costo_gasto) {
      toast.error("Seleccione el tipo de costo/gasto (Renta)");
      return;
    }

    console.log("AddProveedorHandler", proveedor);

    try {
      const response = await ProveedorService.Add(id_emisor, token, proveedor);
      console.log(response);

      if (response.message === "Creado" || response.message === "Proveedor creado") {
        toast.success("Proveedor agregado exitosamente");
        setTimeout(() => {
          navigate("/proveedores");
        }, 3000);
      } else {
        toast.error(response.message || "Error al agregar proveedor");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar proveedor");
    }
  };

  const goBackHandler = () => {
    navigate("/proveedores");
  };

  return (
    <div className="w-full relative pt-20 bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start px-5 pb-[215px] box-border gap-[23px_0px] tracking-[normal]">
      <main className="self-stretch flex flex-col items-start justify-start gap-[35px_0px] max-w-full mq390:gap-[17px_0px] ch:w-1/3 ch:self-center">
        {/* Form Card */}
        <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start p-6 box-border gap-5 max-w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Agregar Proveedor</h2>

          {/* Información básica */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                DUI del proveedor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="00000000-0"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={proveedor.dui || ""}
                onChange={(e) => handleChange("dui", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                Nombre proveedor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nombre del proveedor"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={proveedor.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                NIT proveedor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="0000-000000-000-0"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={proveedor.nit || ""}
                onChange={(e) => handleChange("nit", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">NRC proveedor</label>
              <input
                type="text"
                placeholder="000000-0"
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={proveedor.nrc || ""}
                onChange={(e) => handleChange("nrc", e.target.value)}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-200 my-2"></div>

          {/* Información de Renta */}
          <h3 className="text-lg font-semibold text-gray-700">Información de Renta</h3>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                Tipo de operación (Renta) <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={proveedor.tipo_operacion || ""}
                onChange={(e) => handleChange("tipo_operacion", e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {tipoOperacionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                Clasificación (Renta) <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={proveedor.clasificacion || ""}
                onChange={(e) => handleChange("clasificacion", e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {clasificacionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                Sector (Renta) <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={proveedor.sector || ""}
                onChange={(e) => handleChange("sector", e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {sectorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1 font-medium">
                Tipo de costo/gasto (Renta) <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={proveedor.tipo_costo_gasto || ""}
                onChange={(e) => handleChange("tipo_costo_gasto", e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {tipoCostoGastoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <FrameComponent2 goBackHandler={goBackHandler} AddClientHandler={AddProveedorHandler} />

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>
    </div>
  );
};

export default AddProveedor;
