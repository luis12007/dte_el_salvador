const TableOfContents = () => {
  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-[9px_0px] text-left text-xs text-black font-inria-sans">
      <div className="self-stretch flex flex-col items-start justify-start relative gap-[4px]">
        <div className="relative">Forma de pago</div>
        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
          <select
            className="w-full h-full relative  border-white bg-white border-2 max-w-full"
            type="text"

          >
            <option value="CF">Comprobante Credito Fiscal</option>
            <option value="Factura">Factura</option>
          </select>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[4px]">
        <div className="relative w-full text-xs font-inria-sans  text-black text-left z-[1]">
          <div className="pb-2">
            <span className="text-black">Monto</span>
            <span className="text-tomato">*</span>
          </div>
          <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
              className="w-full [border:none] pt-1 [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
              placeholder="datos personales datos personales"
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[6px]">
        <div className=" pt-2">
          <span className="text-black">N° Doc</span>
          <span className="text-tomato">*</span>
        </div>
        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
          <input
            className="w-full [border:none] pt-1 [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
            placeholder="datos personales datos personales"
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
