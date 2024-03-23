import DataProductOnAdvanceComponent from "./DataProductOnAdvanceComponent";
import DataProductOnAdvanceComponentNew from "./DataProductOnAdvanceComponentNEW";
import DataProductNoAdvanceComponent from "./DataProuctNoAdvanceComponent";
import DataProductNoAdvanceComponentNew from "./DataProuctNoAdvanceComponentNew";

const AdvanceItemsComponentOnComponent = ({itemsAdvance,handleSelectChangeItemsClient , itemsAdvancehandleRemove, itemsAdvancehandleAdd}) => {

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
                <div className="self-stretch  flex flex-row items-start justify-start pt-0 px-3  box-border max-w-full">
                    <div className="flex-1  flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
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
                        
                    </div>
                </div>
                {itemsAdvance.map((content, index) => (
                    <DataProductOnAdvanceComponent
                      key={index}
                      content={content}
                      itemsAdvancehandleRemove={() => itemsAdvancehandleRemove(index)}
                    />
                  ))}

                <DataProductOnAdvanceComponentNew itemsAdvancehandleAdd={itemsAdvancehandleAdd} />

                
            </div>
        </section>
    );
    }

export default AdvanceItemsComponentOnComponent;