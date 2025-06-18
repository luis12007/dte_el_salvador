import personas from '../assets/imgs/personas.png';
import ListReceptores from '../components/ListReceptores';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SwitchOFF = ({handleSelectClient, isVisibleClient , onSelectClient}) => {
    return (
      <div className="animate-fadeInUp self-stretch flex flex-col items-start justify-start gap-[9.5px_0px] max-w-full text-left text-xs text-black font-inria-sans">
        <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
          <div className="h-[40px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
          <b className="relative z-[2] text-lg w-2 pt-1 animate-fadeIn">Receptor</b>
          <button 
            className='bg-lightgray-200 hover:bg-gray-300 rounded-lg flex flex-row items-center justify-center px-3 py-1 w-1/3 h-9 transition-all duration-200 hover:scale-105 animate-slideInRight'
            onClick={handleSelectClient}
          >
            <div className="flex items-center justify-center gap-2">
              <h1 className='text-xs font-medium'>Receptores</h1>
              <img
                className="w-4 h-4 z-[2] transition-transform duration-200 hover:scale-110"
                alt=""
                src={personas}
              />
            </div>
          </button>
        </div>
        {isVisibleClient && (
          <div className="modal">
            <ListReceptores onSelectClient={onSelectClient} handleSelectClient={handleSelectClient} />
          </div>
        )}
      </div>
    );
  };
  
  export default SwitchOFF;
