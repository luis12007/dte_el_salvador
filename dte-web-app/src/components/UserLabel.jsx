import { useMemo } from "react";
import x from "../assets/imgs/x.png"
import ReceptorService from "../services/receptor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLabel = ({ correoLuisAlexanderContaiPadding , client }) => {
  const token = localStorage.getItem("token");

  const deletehandler = async () => {
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
      className="self-stretch flex flex-row items-start justify-start text-left text-xs text-black font-inria-sans"
      style={userLabelStyle}
    >
      <div className="flex flex-ro items-end justify-start gap-[0px_11px]">
        <div className="flex flex-col items-start justify-start pt-0 px-0 pb-1.5">
          <img
            className="w-[43px] h-[47px] relative object-cover z-[1]"
            loading="lazy"
            alt=""
            src="/usuario-2@2x.png"
          />
          
        </div>
        <div className="flex flex-col items-start justify-start gap-[9px_0px]">
          <div className="relative z-[1]">
            <b>Nombre:</b>
            <span> {client.name}</span>
          </div>
          <div className="relative z-[1]">
            <b>Correo:</b>
            <span> {client.correo_electronico}</span>
          </div>
          <div className="relative z-[1]">
            <b>Numero de teléfono:</b>
            <span> {client.numero_telefono}</span>
          </div> 
        </div>
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
      <img src={x} onClick={deletehandler} alt="delete" className="flex h-4 w-4 ml-auto pr-1"/>
    </div>
  );
};

export default UserLabel;
