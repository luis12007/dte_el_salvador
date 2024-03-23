const AdvanceItemsComponentOnComponent = ({handleSelectChangeItemsClient , itemsAdvancehandleRemove, itemsAdvancehandleAdd}) => {

    const handleUpdateAllAttributes = (event) => {
        /* event.preventDefault();
        const newData = {
          type: type,
          pay: pay,
          mount: mount,
          Doc: Doc,
        };
        handleAdd(newData); */
      };

    return (
<section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full">
            <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[17px] box-border gap-[9px] max-w-full">
                <div className="self-stretch h-[1153px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-[11px] px-[17px] pb-3 box-border relative whitespace-nowrap max-w-full z-[1]">
                    <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full z-[0]" />
                    <img
                        className="h-4 w-[18px] absolute !m-[0] right-[20px] bottom-[9px] object-contain z-[2]"
                        alt=""
                        src="/atras-1@2x.png"
                    />
                    <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
                        Datos del producto / Servicio
                    </b>
                </div>
                <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3 pb-[41px] box-border max-w-full">
                    <div className="flex-1 flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
                        <div className="flex flex-row items-start justify-start py-0 px-0.5">
                            <div className="flex flex-row items-start justify-start gap-[0px_6px]">
                                <div onClick={handleSelectChangeItemsClient} className="h-[19px] w-[30px] relative rounded-6xs bg-limegreen box-border z-[1] border-[0.2px] border-solid border-black">
                                    <div className="absolute top-[0px] left-[0px] rounded-6xs bg-limegreen box-border w-full h-full hidden border-[0.2px] border-solid border-black" />
                                    <div className="absolute top-[2px] left-[14px] rounded-6xs bg-white w-3.5 h-3.5 z-[1]" />
                                </div>
                                <div className="flex flex-col items-start justify-start pt-0.5 px-0 pb-0">
                                    <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                                        Configuración avanzada de items
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                                placeholder="datos personales datos personales"
                                type="text"
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
                </div>
                <div className="w-[380px] flex flex-row items-start justify-center py-0 px-5 box-border max-w-full">
                    <button onClick={itemsAdvancehandleAdd} className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
                        <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                        <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                            Nuevo Item
                        </b>
                    </button>
                </div>
                
                
            </div>
        </section>
    );
    }

export default AdvanceItemsComponentOnComponent;