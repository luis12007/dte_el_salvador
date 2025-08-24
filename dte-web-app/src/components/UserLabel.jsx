import { useMemo } from "react";
import x from "../assets/imgs/x.png"
import ReceptorService from "../services/receptor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLabel = ({ correoLuisAlexanderContaiPadding , client = {}, onSelect }) => {
  const token = localStorage.getItem("token");

  const deletehandler = async (e) => {
    // Evitar que el clic en eliminar dispare la apertura del modal
    e?.stopPropagation?.();
    console.log("delete")
    const res = await ReceptorService.Delete_by_id(client.id, token)
    console.log(res)
    if(res.message === 'Cliente eliminado'){
      toast.success("Receptor eliminado")
      /* wait 7 seconds and reload */
      setTimeout(() => {
        window.location.reload();
      }
      , 5000);
    }else{
      toast.error("Error al eliminar Receptor")
    }
    
  }
  const userLabelStyle = useMemo(() => {
    return {
      padding: correoLuisAlexanderContaiPadding,
    };
  }, [correoLuisAlexanderContaiPadding]);

  return (
    <div
      className="w-full text-left text-sm text-gray-800 font-inria-sans"
      style={userLabelStyle}
      onClick={() => onSelect?.(client)}
      role="button"
      tabIndex={0}
    >
      <div className="w-full bg-white   shadow-sm px-4 py-3 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
        {/* Avatar */}
        <img
          className="w-12 h-13  object-cover"
          loading="lazy"
          alt="Avatar"
          src="/usuario-2@2x.png"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 leading-6 truncate">
            {client.name || 'Sin nombre'}
          </div>
          <div className="mt-1 flex flex-col gap-1 text-[13px] text-gray-600">
            <div className="flex items-center gap-2 min-w-0">
              {/* Mail icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-500">
                <path d="M1.5 6.75A2.25 2.25 0 0 1 3.75 4.5h16.5a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 20.25 19.5H3.75A2.25 2.25 0 0 1 1.5 17.25V6.75Zm2.25-.75a.75.75 0 0 0-.75.75v.268l8.358 5.575a.75.75 0 0 0 .834 0L21 7.018V6.75a.75.75 0 0 0-.75-.75H3.75Zm16.5 12h.75v-8.67l-7.692 5.13a2.25 2.25 0 0 1-2.316 0L3 9.33v8.67h17.25Z" />
              </svg>
              <span className="truncate" title={client.correo_electronico || ''}>
                {client.correo_electronico || 'Sin correo'}
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              {/* Phone icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-500">
                <path d="M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h2.25c.621 0 1.125.504 1.125 1.125V6.75c0 .621-.504 1.125-1.125 1.125H5.872a16.02 16.02 0 0 0 7.003 7.003V16.5c0 .621.504 1.125 1.125 1.125h3.375c.621 0 1.125.504 1.125 1.125V21a2.25 2.25 0 0 1-2.25 2.25h-1.5C7.27 23.25 2.25 18.23 2.25 12V10.5A2.25 2.25 0 0 1 4.5 8.25H6.75c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H5.25A13.5 13.5 0 0 0 12 18.75h1.125c.621 0 1.125.504 1.125 1.125V21h1.5c.414 0 .75-.336.75-.75v-1.5h-2.25A2.25 2.25 0 0 1 12 16.5V15.375A16.02 16.02 0 0 0 5.25 8.625V6.75A2.25 2.25 0 0 1 7.5 4.5H9.75c.621 0 1.125.504 1.125 1.125V7.5c0 .621-.504 1.125-1.125 1.125H9A.75.75 0 0 1 8.25 7.875V6h-1.5v1.875A.75.75 0 0 1 6 8.625H4.5A2.25 2.25 0 0 1 2.25 6.375V4.5Z" />
              </svg>
              <span className="truncate" title={client.numero_telefono || ''}>
                {client.numero_telefono || 'Sin teléfono'}
              </span>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={deletehandler}
          aria-label="Eliminar"
          className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-red-700 bg-transparent transition-colors"
          title="Eliminar receptor"
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

export default UserLabel;
