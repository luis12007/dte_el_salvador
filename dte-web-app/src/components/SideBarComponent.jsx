import { useNavigate } from "react-router-dom";
import receipt from "../assets/imgs/receipt.png";
import book from "../assets/imgs/book.png";
import customers from "../assets/imgs/customers.png";

const GroupComponent = ({ visible, setVisible }) => {
  const navigate = useNavigate();

  const GoHomeHandler = () => navigate("/principal");
  const GoHomeFacturasHandler = () => navigate("/facturas");
  const GoProfileHandler = () => navigate("/perfil");
  const GoAddBillsHandler = () => navigate("/crear/factura");
  const GoClientsHandler = () => navigate("/clientes");
  const GoAddServiceHandler = () => navigate("/items");
  const GoCancelBill = () => navigate("/invalidar");
  const GoBooksBill = () => navigate("/facturas/libros");
  const CloseHandler = () => navigate("/ingresar");

  return (
    <>
      {/* Overlay para cerrar al hacer click afuera */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40"
          onClick={() => setVisible(false)}
        />
      )}

      {/* Drawer lateral */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 sm:w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!visible}
      >
        <div className="flex items-center px-4 py-3 border-b">
          <span className="text-sm font-semibold text-gray-700">Menú</span>
        </div>

        <nav className="h-[calc(100vh-56px)] overflow-y-auto p-3 space-y-1">
          <button onClick={GoHomeHandler} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition group">
            <img className="h-6 w-6 object-contain" alt="" src="/workfromhome-2@2x.png" />
            <span className="text-sm text-gray-800 group-hover:text-sky-700">Home</span>
          </button>

          <button onClick={GoHomeFacturasHandler} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition group">
            <img className="h-6 w-6 object-contain" alt="" src="/facturasdepapel-1@2x.png" />
            <span className="text-sm text-gray-800 group-hover:text-sky-700">Facturas</span>
          </button>

          <button onClick={GoAddBillsHandler} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition group">
            <img className="h-6 w-6 object-contain" alt="" src="/factura-1@2x.png" />
            <span className="text-sm text-gray-800 group-hover:text-sky-700">Agregar Factura</span>
          </button>

          <button onClick={GoCancelBill} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition group">
            <img className="h-6 w-6 object-contain" alt="" src={receipt} />
            <span className="text-sm text-gray-800 group-hover:text-sky-700">Invalidar factura</span>
          </button>

          <button onClick={GoClientsHandler} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition group">
            <img className="h-6 w-6 object-contain" alt="" src={customers} />
            <span className="text-sm text-gray-800 group-hover:text-sky-700">Receptores</span>
          </button>

          <button onClick={GoProfileHandler} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition group">
            <img className="h-6 w-6 object-contain" alt="" src="/usuario-1@2x.png" />
            <span className="text-sm text-gray-800 group-hover:text-sky-700">Perfil</span>
          </button>

          <button onClick={GoBooksBill} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition group">
            <img className="h-6 w-6 object-contain" alt="" src={book} />
            <span className="text-sm text-gray-800 group-hover:text-sky-700">Reportes</span>
          </button>

          <div className="pt-2 mt-2 border-t">
            <button onClick={CloseHandler} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 transition group">
              <img className="h-6 w-6 object-contain" alt="" src="/salida-1@2x.png" />
              <span className="text-sm text-gray-800 group-hover:text-red-700">Salir</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default GroupComponent;
