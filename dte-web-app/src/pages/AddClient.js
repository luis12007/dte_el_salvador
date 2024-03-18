import FrameComponent2 from "../components/ButtonsComponent";
import { useNavigate } from "react-router-dom";
const CardOfClientAndAddClient = () => {
  const navigate = useNavigate();

  const AddClientHandler = () => {
    /* navigate("/agregar/cliente"); */
    console.log('AddClientHandler')
  }

  const goBackHandler = () => {
    navigate("/clientes");
  }
  return (
    <div className="w-full relative pt-20 bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start  px-5 pb-[215px] box-border gap-[23px_0px] tracking-[normal]">
      {/* <img
        className="w-[30px] h-[30px] relative object-cover"
        loading="lazy"
        alt=""
        src="/image-10-4@2x.png"
      /> */}
      <main className="self-stretch flex flex-col items-start justify-start gap-[35px_0px] max-w-full mq390:gap-[17px_0px]">
        <section className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[19px] box-border gap-[5px] max-w-full text-left text-xs text-black font-inria-sans">
          <div className="self-stretch h-[510px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <select className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 [border:none] flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border font-inria-sans font-bold text-xs text-black max-w-full gap-[20px] z-[1]" />
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative z-[1]">
                <span>{`DUI `}</span>
                <span className="text-tomato">*</span>
              </div>
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative z-[1]">
                <span>NRC</span>
                <span className="text-red-200">{` `}</span>
                <span className="text-tomato">*</span>
              </div>
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative z-[1]">
                <span>Nombre</span>
                <span className="text-red-200">{` `}</span>
                <span className="text-tomato">*</span>
              </div>
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative z-[1]">
                <span>Nombre Comercial</span>
                <span className="text-red-200">{` `}</span>
                <span className="text-tomato">*</span>
              </div>
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative z-[1]">
                <span>{`Actividad economica `}</span>
                <span className="text-tomato">*</span>
              </div>
              <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-end pt-[3px] px-[7px] pb-1 max-w-full z-[2] border-[0.3px] border-solid border-gray-100">
                <img
                  className="h-4 w-[18px] relative object-contain z-[1]"
                  alt=""
                  src="/atras-1@2x.png"
                />
                <div className="h-[23px] w-[359px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-[15px] pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative z-[1]">
                <span>Correo electronico</span>
                <span className="text-red-200">{` `}</span>
                <span className="text-tomato">*</span>
              </div>
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative z-[1]">
                <span>Dirección</span>
                <span className="text-red-200">{` `}</span>
                <span className="text-tomato">*</span>
              </div>
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative z-[1]">
                <span>Departamento</span>
                <span className="text-red-200">{` `}</span>
                <span className="text-tomato">*</span>
              </div>
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <input
                className="w-[59px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-left inline-block p-0 z-[1]"
                placeholder="Municipio *"
                type="text"
              />
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
        </section>
        <FrameComponent2 goBackHandler={goBackHandler}  AddClientHandler={AddClientHandler}/>
      </main>
    </div>
  );
};

export default CardOfClientAndAddClient;
