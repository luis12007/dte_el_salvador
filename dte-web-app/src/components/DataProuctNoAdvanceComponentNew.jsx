import { useState } from "react";
import AutocompleteInput from "./AutocompleteInput";
const DataProductNoAdvanceComponentNew = ({itemshandleAdd}) => {
    const [type, setType] = useState("");
    const [cuantity, setcuantity] = useState("");
    const [description, setdescription] = useState("");
    const [price, setPrice] = useState("");
    const suggestionsList = [
    'servicios de anestesia',
    'servicios de psirugia'
    ];

    /* TODO: do */
    const handleUpdateAllAttributes = (event) => {
        event.preventDefault();
        const newData = {
          type: type,
          cuantity: cuantity,
          description: description,
          price: price,
        };
        if (newData.type === "") {
            newData.type = "1";
        }
        console.log(newData);
        itemshandleAdd(newData);
        setcuantity("");
        setdescription("");
        setPrice("");
    };
  
    return (
        <div className="w-full pl-3 flex flex-row items-start justify-start pt-0  pr-3.5  box-border max-w-full">
                    <div className="flex-1 flex flex-col items-start justify-start gap-[5px_0px] max-w-full">
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
                                onChange={(e) => setType(e.target.value)}
                                    className="w-full h-full relative  border-white bg-white border-2 max-w-full"
                                    type="text"

                                >
                                    <option value="1">Bienes</option>
                                    <option value="2">Servicios</option>
                                    <option value="3">Bienes y servicios</option>
                                    <option value="4">Otro</option>
                                </select>
                                <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[1] border-[0.3px] border-solid border-gray-100" />

                            </div>
                        </div>
                        <div className="relative text-xs pt-2 h-full font-inria-sans text-black  text-left z-[1]">
                            <span className="text-black">{`Cantidad `}</span>
                            <span className="text-tomato">*</span>
                        </div>
                        <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                            <input
                            onChange={(e) => setcuantity(e.target.value)}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="###"
                                type="number"
                                value={cuantity}
                            />

                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px] relative text-xs pt-2 h-full font-inria-sans text-black  text-left z-[1]">
                            <div>
                                <span className="text-black">{`Descripción`}</span>
                                <span className="text-tomato">*</span>
                            </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                onChange={(e) => setdescription(e.target.value)}
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="Producto o servicio"
                                    type="text"
                                    value={description}
                                />
                            </div>
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px] relative text-xs pt-2 h-full font-inria-sans text-black  text-left z-[1]">
                            <div>
                                <span className="text-black">{`Precio`}</span>
                                <span className="text-tomato">*</span>
                            </div>
                            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                                <input
                                onChange={(e) => setPrice(e.target.value)}
                                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                    placeholder="###"
                                    type="number"
                                    value={price}
                                />
                            </div>
                        </div>

                        <div className="self-stretch flex flex-row items-center justify-center py-2 px-[11px] box-border max-w-full">
                    <button onClick={handleUpdateAllAttributes} className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
                        <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                        <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                            Añadir Item
                        </b>
                    </button>
                </div>
                    </div>

                </div>
    );
    }
    export default DataProductNoAdvanceComponentNew;