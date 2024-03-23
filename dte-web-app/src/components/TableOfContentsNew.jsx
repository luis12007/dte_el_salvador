import { useState } from "react";
const TableOfContentsNew = ({handleAdd }) => {
  const [type, setType] = useState("Al contado");
  const [pay, setPay] = useState("");
  const [mount, setMount] = useState("");
  const [Doc, setDoc] = useState("");

  const handleUpdateAllAttributes = (event) => {
    event.preventDefault();
    const newData = {
      type: type,
      pay: pay,
      mount: mount,
      Doc: Doc,
    };
    handleAdd(newData);
  };


  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-[9px_0px] text-left text-xs text-black font-inria-sans">
      <div className="self-stretch flex flex-col items-start justify-start relative gap-[4px]">
        <div className="relative">Forma de pago</div>
        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
          <select
          onChange={(e) => setType(e.target.value)}
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
            name="mount"
            onChange={(e) => setMount(e.target.value)}
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
        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
          <input
          onChange={(e) => setDoc(e.target.value)}
            name="Doc"
            className="w-full [border:none] pt-1 [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
            placeholder="datos personales datos personales"
            type="text"
          />
        </div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
        <button
          onClick={handleUpdateAllAttributes}
          className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray"
        >
          <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
            Nuevo Item
          </b>
        </button>
      </div>
    </div>
  );
};

export default TableOfContentsNew;
