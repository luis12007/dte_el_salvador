import { useMemo } from "react";
import x from "../assets/imgs/x.png"
import ReceptorService from "../services/receptor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserReceptorComponent = ({ correoLuisAlexanderContaiPadding , client , onSelectClient , handleSelectClient}) => {
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

  const callfunctions = (event) => {
    event.preventDefault();
    onSelectClient(event,client);
    handleSelectClient(event);
  }

  return (
    <div
      className="client-card animate-fadeInUp self-stretch flex flex-row items-start justify-start text-left text-xs text-black font-inria-sans"
      style={userLabelStyle}
      onClick={callfunctions}
    >
      <div className="flex flex-row items-center justify-start gap-[12px] w-full">
        <div className="flex flex-col items-start justify-start">
          <img
            className="client-avatar w-[32px] h-[32px] relative object-cover z-[1]"
            loading="lazy"
            alt=""
            src="/usuario-2@2x.png"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-[4px] flex-1">
          <div className="relative z-[1] text-sm">
            <span className="font-medium">{client.name}</span>
          </div>
          <div className="relative z-[1] text-xs text-gray-600">
            {client.correo_electronico}
          </div>
          <div className="relative z-[1] text-xs text-gray-500">
            {client.numero_telefono}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReceptorComponent;
