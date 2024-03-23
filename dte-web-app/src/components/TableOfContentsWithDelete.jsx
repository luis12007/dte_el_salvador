const TableOfContents = ({key, content, onRemove}) => {
      /* { type: 'Al contado', pay:'Section 2.1', mount:'Section 2.1', Doc:'Section 2.1', },*/
   
      
  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-[9px_0px] text-left text-xs text-black font-inria-sans">
      <div className="self-stretch flex flex-col items-start justify-start relative gap-[4px]">
        <div className="relative">Forma de pago</div>
        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
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
          <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
            <input
              className="w-full [border:none] pt-1 [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
              placeholder={`${content.mount}`}
              type="text"
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[6px]">
        <div className=" pt-2">
          <span className="text-black">N° Doc</span>
          <span className="text-tomato">*</span>
        </div>
        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
          <input
            className="w-full [border:none] pt-1 [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
            placeholder={`${content.Doc}`}
            type="text"
            readOnly
          />
        </div>
      </div>
      <div className="self-stretch h-[23px] flex flex-row items-start justify-start py-0 px-px box-border max-w-full">
        <button onClick={onRemove} className="self-stretch flex-1 rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-center pt-px px-5 pb-[11px] box-border max-w-full">
          <div className="h-[23px] w-[356px] relative rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
          <b className="self-stretch relative text-mini font-inria-sans text-white text-left z-[1]">
            Eliminar
          </b>
        </button>
      </div>
    </div>
  );
};

export default TableOfContents;
