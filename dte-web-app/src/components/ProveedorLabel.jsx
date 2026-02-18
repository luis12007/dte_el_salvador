import { useMemo } from "react";
import x from "../assets/imgs/x.png";
import ProveedorService from "../services/ProveedorService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProveedorLabel = ({ correoLuisAlexanderContaiPadding, proveedor = {}, onSelect }) => {
  const token = localStorage.getItem("token");

  const deletehandler = async (e) => {
    e?.stopPropagation?.();
    console.log("delete");
    const res = await ProveedorService.Delete_by_id(proveedor.id, token);
    console.log(res);
    if (res.message === "Proveedor eliminado") {
      toast.success("Proveedor eliminado");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } else {
      toast.error("Error al eliminar Proveedor");
    }
  };

  const userLabelStyle = useMemo(() => {
    return {
      padding: correoLuisAlexanderContaiPadding,
    };
  }, [correoLuisAlexanderContaiPadding]);

  // Opciones para mostrar labels
  const tipoOperacionLabels = {
    "1": "Gravada",
    "2": "No gravada o exenta",
    "3": "Excluido (Renta)",
    "4": "Mixta",
    "8": "Más de 1 anexo",
    "9": "Excepciones",
  };

  return (
    <div
      className="w-full text-left text-sm text-gray-800 font-inria-sans"
      style={userLabelStyle}
      onClick={() => onSelect?.(proveedor)}
      role="button"
      tabIndex={0}
    >
      <div className="w-full bg-white shadow-sm px-4 py-3 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-600"
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
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 leading-6 truncate">
            {proveedor.name || "Sin nombre"}
          </div>
          <div className="mt-1 flex flex-col gap-1 text-[13px] text-gray-600">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-gray-500 font-medium">NIT:</span>
              <span className="truncate">{proveedor.nit || "Sin NIT"}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-gray-500 font-medium">NRC:</span>
              <span className="truncate">{proveedor.nrc || "Sin NRC"}</span>
            </div>
            {proveedor.tipo_operacion && (
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-gray-500 font-medium">Op:</span>
                <span className="truncate text-xs bg-blue-50 px-2 py-0.5 rounded">
                  {tipoOperacionLabels[proveedor.tipo_operacion] || proveedor.tipo_operacion}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={deletehandler}
          aria-label="Eliminar"
          className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-red-700 bg-transparent transition-colors"
          title="Eliminar proveedor"
        >
          <img src={x} alt="Eliminar" className="w-3.5 h-3.5" />
        </button>

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
      </div>
    </div>
  );
};

export default ProveedorLabel;
