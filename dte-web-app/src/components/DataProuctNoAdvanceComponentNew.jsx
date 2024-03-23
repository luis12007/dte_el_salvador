import { useState } from "react";
const DataProductNoAdvanceComponentNew = ({itemshandleAdd}) => {
    const [type, setType] = useState("");
    const [cuantity, setPay] = useState("");
    const [description, setMount] = useState("");
    const [price, setPrice] = useState("");

    /* TODO: do */
    const handleUpdateAllAttributes = (event) => {
        event.preventDefault();
        const newData = {
          type: type,
          cuantity: cuantity,
          description: description,
          price: price,
        };
        console.log(newData);
        itemshandleAdd(newData);
    };
  
    return (
        <div className="w-[376px] flex flex-row items-start justify-start pt-0 pb-[29px] pr-3.5 pl-0 box-border max-w-full">
                    <div className="flex-1 flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
                        <div className="flex flex-row items-start justify-start py-0 px-[3px]">
                            <div className="flex flex-row items-start justify-start gap-[0px_5px]">

                            </div>
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                            <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                                <span className="text-black">{`Tipo `}</span>
                                <span className="text-tomato">*</span>
                            </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <select
                                    className="w-full h-full relative  border-white bg-white border-2 max-w-full"
                                    type="text"

                                >
                                    <option value="CF">Comprobante Credito Fiscal</option>
                                    <option value="Factura">Factura</option>
                                </select>
                                <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[1] border-[0.3px] border-solid border-gray-100" />

                            </div>
                        </div>
                        <div className="self-stretch flex  items-start justify-start ">
                            <span className="text-black">{`Cantidad `}</span>
                            <span className="text-tomato">*</span>
                        </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <input
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                            />

                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                            <div>
                                <span className="text-black">{`Descripción`}</span>
                                <span className="text-tomato">*</span>
                            </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                            <div>
                                <span className="text-black">{`Precio`}</span>
                                <span className="text-tomato">*</span>
                            </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="datos personales datos personales"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="self-stretch flex flex-row items-center justify-center py-0 px-[11px] box-border max-w-full">
                    <button onClick={handleUpdateAllAttributes} className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
                        <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                        <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                            Nuevo Item
                        </b>
                    </button>
                </div>
                    </div>

                </div>
    );
    }
    export default DataProductNoAdvanceComponentNew;