import { useNavigate } from "react-router-dom";
import receipt from "../assets/imgs/receipt.png";
import customers from "../assets/imgs/customers.png";
const GroupComponent = ({visible, setVisible}) => {
  const navigate = useNavigate();
  if (visible === true) {
    var sidebar = "visible invisible ch:visible ch:self-start ";
    var w = "mc:w-0";
    var img = "md:visible mc:invisible ";
    
}else if (visible === false) {
    var sidebar = "md:invisible mc:visible ";
    var w = "";
    var img = "md:visible mc:invisible";
    
}

const GoHomeHandler = () => {
  navigate("/principal");
}

const GoHomeFacturasHandler = () => {
  navigate("/facturas");

}

const GoProfileHandler = () => {
  navigate("/perfil");
}

const GoAddBillsHandler = () => {
  navigate("/crear/factura");
}

const GoClientsHandler = () => {
  navigate("/clientes");

}

const GoAddServiceHandler = () => {
  navigate("/items");
}

const GoCancelBill = () => {
  navigate("/invalidar");
}

const CloseHandler = () => {
  navigate("/ingresar");
}


  return (
    <div className={`absolute w-[202px] mt-6 ml-2  z-50 rounded-11xl bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start py-[19px] pr-[23px]
    pl-[18px] box-border gap-[55px] text-left text-xs text-black font-inter ${sidebar} ${w}`}>
      <div className="w-[202px] h-[396px] relative rounded-11xl bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
      <div className="self-stretch flex flex-col items-end justify-start gap-[26px_0px]">
        {/* <img
          className="w-[15px] h-[15px] relative object-cover z-[1]"
          loading="lazy"
          alt=""
          src="/x-1@2x.png"
          onClick={() => setVisible(!visible)} 
        /> */}
        <div className="self-stretch flex flex-row items-start justify-start">
          <nav className="m-0 flex-1 flex flex-col  items-start justify-start gap-[11px_0px] text-left text-xs text-black font-inter">
            <button onClick={GoHomeHandler} className="flex bg-white flex-row items-start w-full justify-start py-0 px-[3px]">
              <div className="flex  flex-row items-start justify-start gap-[0px_9px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/workfromhome-2@2x.png"
                />
                <div className="flex flex-col items-start justify-start  pt-2 px-0 pb-0">
                  <div className="relative z-[1]">Home</div>
                </div>
              </div>
            </button>
            <button onClick={GoHomeFacturasHandler} className="flex flex-row items-start bg-white w-full justify-start py-0 px-[3px]">
              <div className="flex flex-row items-start justify-start gap-[0px_9px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/facturasdepapel-1@2x.png"
                />
                <div className="flex flex-col  items-start justify-start pt-2 px-0 pb-0 ">
                  <div className="relative z-[1]">Facturas</div>
                </div>
              </div>
            </button>
            
            <button onClick={GoAddBillsHandler} className="flex flex-row w-full bg-white items-start justify-start py-0 pr-0 pl-[3px]">
              <div className="flex flex-row items-start justify-start gap-[0px_9px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/factura-1@2x.png"
                />
                <div  className="flex w-full bg-white flex-col items-start justify-start pt-2 px-0 pb-0">
                  <div className="relative z-[1]">Agregar Factura</div>
                </div>
              </div>
            </button>
            
            <button onClick={GoCancelBill} className="flex bg-white flex-row items-start w-full justify-start py-0 px-[3px]">
              <div className="flex  flex-row items-start justify-start gap-[0px_9px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src={receipt}
                />
                <div className="flex flex-col items-start justify-start  pt-2 px-0 pb-0">
                  <div className="relative z-[1]">Invalidar factura</div>
                </div>
              </div>
            </button>
            <button onClick={GoClientsHandler} className="flex bg-white flex-row items-start w-full justify-start py-0 px-[3px]">
              <div className="flex  flex-row items-start justify-start gap-[0px_9px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src={customers}
                />
                <div className="flex flex-col items-start justify-start  pt-2 px-0 pb-0">
                  <div className="relative z-[1]">Clientes</div>
                </div>
              </div>
            </button>
            <button onClick={GoProfileHandler} className="flex flex-row w-full bg-white items-start justify-start py-0 px-0.5">
              <div className="flex flex-row items-start justify-start gap-[0px_9px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/usuario-1@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-2 px-0 pb-0">
                  <div className="relative z-[1]  pt-0.5">Perfil</div>
                </div>
              </div>
            </button>
          </nav>
        </div>
      </div>
      <button onClick={CloseHandler} className="flex w-full bg-white flex-row items-start justify-start py-0 px-[3px]">
        <div className="flex flex-row items-start justify-start gap-[0px_9px]">
          <img
            className="h-[27px] w-[27px] relative object-cover z-[1]"
            loading="lazy"
            alt=""
            src="/salida-1@2x.png"
          />
          <div className="flex flex-col items-start justify-start pt-[5px] px-0 pb-0">
            <div className="relative z-[1]">Salir</div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default GroupComponent;
