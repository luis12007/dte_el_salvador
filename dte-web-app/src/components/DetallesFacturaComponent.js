const FrameGroup = () => {
  return (
    <form className="m-0 self-stretch flex flex-col items-start justify-start gap-[26px_0px] max-w-full">
      <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[30px] box-border gap-[10px] max-w-full z-[1]">
        <div className="self-stretch h-[419px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch flex flex-col items-start justify-start gap-[5px_0px] max-w-full">
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
            <div className="h-3.5 w-11 relative">
              <b className="absolute top-[0px] left-[0px] text-xs inline-block font-inria-sans text-black text-left w-full h-full z-[2]">
                Detalles
              </b>
              <b className="absolute top-[0px] left-[0px] text-xs inline-block font-inria-sans text-black text-left w-full h-full z-[3]">
                Detalles
              </b>
            </div>
            <div className="flex flex-col items-start justify-start pt-px px-0 pb-0">
              <img
                className="w-[18px] h-4 relative object-contain z-[2]"
                alt=""
                src="/atras-1@2x.png"
              />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <input
                className="w-[23px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                placeholder="Tipo"
                type="text"
              />
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <input
                className="w-[31px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                placeholder="Fecha"
                type="text"
              />
              <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
              Estado
            </div>
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <input
              className="w-[61px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
              placeholder="Emitido por"
              type="text"
            />
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
              Receptor
            </div>
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-[15px] box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <input
              className="w-[26px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
              placeholder="Total"
              type="text"
            />
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <input
              className="w-[30px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
              placeholder="Firma"
              type="text"
            />
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
        <button className="cursor-pointer [border:none] pt-[11px] pb-3.5 pr-[31px] pl-9 bg-indianred-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start z-[1] hover:bg-lightcoral">
          <div className="h-[47px] w-[138px] relative rounded-3xs bg-indianred-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <b className="relative text-lg font-inria-sans text-white text-left z-[1]">
            Regresar
          </b>
        </button>
      </div>
    </form>
  );
};

export default FrameGroup;
