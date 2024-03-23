import { useState } from "react";
const DataProductOnAdvanceComponentNew = ({ itemsAdvancehandleAdd }) => {
    const [type, setType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [code, setCode] = useState("");
    const [units, setUnits] = useState("");
    const [description, setDescription] = useState("");
    const [saleType, setSaleType] = useState("");
    const [price, setPrice] = useState("");
    const [taxes, setTaxes] = useState("");

    const handleUpdateAllAttributes = (event) => {
        event.preventDefault();

        const newData = {
            type: type,
            quantity: quantity,
            code: code,
            units: units,
            description: description,
            saleType: saleType,
            price: price,
            taxes: taxes,
        };
        if (newData.type === "") {
            newData.type = "Bienes";
        }
        itemsAdvancehandleAdd(newData);
      };


    return (
        <div className="self-stretch flex flex-col items-start justify-start mx-2 pr-0 pl-0.5 box-border max-w-full">
        <div className="self-stretch flex flex-row items-start justify-start  pr-0 pl-0.5 box-border max-w-full">
                            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                                </div>
                                    <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                                    <div>
                                    <span className="text-black">Tipo</span>
                            <span className="text-tomato">*</span>
                            </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
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
                        </div>
                        <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                                </div>
                                    <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                                    <div>
                                    <span className="text-black">Cantidad</span>
                            <span className="text-tomato">*</span>
                            </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <input
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                            />
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                                <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                <div>
                                    <span className="text-black">Codigo</span>
                            <span className="text-tomato">*</span>
                            </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <input
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                            />
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                            <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                <div>
                                    <span className="text-black">Unidades</span>
                            <span className="text-tomato">*</span>
                            </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <input
                                onChange={(e) => setUnits(e.target.value)}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                            />
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                            <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                <div>
                                    <span className="text-black">Descripción</span>
                            <span className="text-tomato">*</span>
                            </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <input
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                            />
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                            <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                <div>
                                    <span className="text-black">Tipo de venta</span>
                            <span className="text-tomato">*</span>
                            </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <input
                                onChange={(e) => setSaleType(e.target.value)}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                            />
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                            <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                <div>
                                    <span className="text-black">Precio</span>
                            <span className="text-tomato">*</span>
                            </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <input
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                            />
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                        <div className="relative w-full text-xs font-inria-sans text-black text-left z-[1]">
                                <div>
                                    <span className="text-black">Impuestos</span>
                            <span className="text-tomato">*</span>
                            </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <input
                                onChange={(e) => setTaxes(e.target.value)}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                            />
                                </div>
                                </div>
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-[11px] gap-[4px_0px]">
                                
                        </div>
                        <div className="w-[380px] flex flex-row items-start justify-center py-0 px-5 box-border max-w-full">
                    <button onClick={handleUpdateAllAttributes} className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
                        <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                        <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                            Nuevo Item
                        </b>
                    </button>
                </div>
        </div>
    );
}
export default DataProductOnAdvanceComponentNew;