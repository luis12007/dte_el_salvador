const DataProductOnAdvanceComponent = ({content,itemsAdvancehandleRemove }) => {
    return (
        <div className="self-stretch flex flex-col items-start justify-start mx-2 pr-0 pl-0.5 box-border max-w-full">
        <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-0.5 box-border max-w-full">
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
                                className="w-full h-full relative  border-white bg-white border-2 max-w-full"
                                type="text"
                                
                            >
                                <option value={`${content.type}`}>{content.type}</option>

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
                                value={content.quantity}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                                readOnly
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
                                value={content.code}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                                readOnly
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
                                value={content.units}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                                readOnly
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
                            value={content.description}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                                readOnly
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
                            value={content.saleType}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                                readOnly
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
                            value={content.price}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                                readOnly
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
                            value={content.taxes}
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
                                readOnly
                            />
                                </div>
                                </div>
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-[11px] gap-[4px_0px]">
                                
                        </div>
                        <div className="self-stretch h-[23px] flex flex-row items-start justify-start py-0 pr-[3px] pl-[5px] box-border max-w-full">
                            <button onClick={itemsAdvancehandleRemove} className="self-stretch flex-1 rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-center pt-px px-5 pb-[11px] box-border max-w-full z-[1]">
                                <div className="h-[23px] w-[356px] relative rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
                                <b className="self-stretch relative text-mini font-inria-sans text-white text-left z-[1]">
                                    Eliminar
                                </b>
                            </button>
                        </div>
        </div>
    );
}
export default DataProductOnAdvanceComponent;