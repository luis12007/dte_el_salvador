const TableOfContents = () => {
  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-[9px_0px] text-left text-xs text-black font-inria-sans">
      <div className="self-stretch flex flex-col items-start justify-start relative gap-[4px]">
        <div className="relative">Forma de pago</div>
        <div className="self-stretch h-[23px] relative rounded-6xs box-border border-[0.3px] border-solid border-gray-100" />
        <img
          className="w-[18px] h-4 absolute !m-[0] right-[3px] bottom-[5px] object-contain z-[2]"
          alt=""
          src="/atras-1@2x.png"
        />
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[4px]">
        <input
          className="w-[35px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0"
          placeholder="Monto"
          type="text"
        />
        <div className="self-stretch h-[23px] relative rounded-6xs box-border border-[0.3px] border-solid border-gray-100" />
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[6px]">
        <input
          className="w-[39px] [border:none] [outline:none] bg-[transparent] h-3.5 flex flex-row items-start justify-start py-0 px-0.5 box-border font-inria-sans text-xs text-black"
          placeholder="N° Doc"
          type="text"
        />
        <div className="self-stretch h-[23px] relative rounded-6xs box-border border-[0.3px] border-solid border-gray-100" />
      </div>
    </div>
  );
};

export default TableOfContents;
