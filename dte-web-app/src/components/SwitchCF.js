const FrameComponent3 = () => {
  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-[9.5px_0px] max-w-full text-left text-xs text-black font-inria-sans">
      <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
        <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
        <b className="relative z-[2]">CLIENTE</b>
        <div className="flex flex-col items-start justify-start pt-px px-0 pb-0">
          <img
            className="w-[18px] h-4 relative object-contain z-[2]"
            alt=""
            src="/atras-1@2x.png"
          />
        </div>
      </div>
      <div className="flex flex-row items-start justify-start py-0 px-3.5">
        <div className="flex flex-row items-start justify-start gap-[0px_4px]">
          <div className="h-[19px] w-[30px] relative rounded-6xs bg-limegreen box-border z-[1] border-[0.2px] border-solid border-black">
            <div className="absolute top-[0px] left-[0px] rounded-6xs bg-limegreen box-border w-full h-full hidden border-[0.2px] border-solid border-black" />
            <div className="absolute top-[2px] left-[14px] rounded-6xs bg-white w-3.5 h-3.5 z-[1]" />
          </div>
          <div className="h-[19px] w-[30px] relative rounded-6xs bg-red-100 box-border z-[3] border-[0.2px] border-solid border-black">
            <div className="absolute top-[0px] left-[0px] rounded-6xs bg-red-100 box-border w-full h-full hidden border-[0.2px] border-solid border-black" />
            <div className="absolute top-[2px] left-[2px] rounded-6xs bg-white w-3.5 h-3.5 z-[1]" />
          </div>
          <div className="flex flex-col items-start justify-start pt-0.5 px-0 pb-0">
            <div className="relative z-[3]">Consumidor Final</div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
        <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
          <div className="relative z-[3]">Documento de identificación</div>
          <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[3] border-[0.3px] border-solid border-gray-100" />
        </div>
      </div>
    </div>
  );
};

export default FrameComponent3;
