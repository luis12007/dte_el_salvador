import FrameComponent3 from "./FrameComponent3";

const DocumentTypeFrame = () => {
  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans">
      <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0.5 px-0 pb-[29px] box-border gap-[14px] max-w-full">
        <div className="self-stretch h-[532px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <FrameComponent3 />
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative z-[3]">
              Tipo de Documento de Identificación
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-end pt-[3px] px-[3px] pb-1 max-w-full z-[3] border-[0.3px] border-solid border-gray-100">
              <img
                className="h-4 w-[18px] relative object-contain z-[1]"
                alt=""
                src="/atras-1@2x.png"
              />
              <div className="h-[23px] w-[359px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <input
              className="w-[43px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[3]"
              placeholder="Nombre"
              type="text"
            />
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[3] border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <input
              className="w-[45px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[3]"
              placeholder="Teléfono"
              type="text"
            />
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[3] border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <input
              className="w-[95px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[3]"
              placeholder="Correo electrónico"
              type="text"
            />
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[3] border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <input
              className="w-[49px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[3]"
              placeholder="Dirección"
              type="text"
            />
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[3] border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative z-[3]">Departamento</div>
            <div className="self-stretch h-[23px] rounded-6xs box-border flex flex-row items-start justify-start relative max-w-full z-[3] border-[0.3px] border-solid border-gray-100">
              <img
                className="h-4 w-[18px] absolute !m-[0] top-[3px] right-[3px] object-contain z-[1]"
                alt=""
                src="/atras-1@2x.png"
              />
              <div className="self-stretch w-[359px] relative rounded-6xs box-border hidden max-w-full z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative z-[3]">Municipio</div>
            <div className="self-stretch h-[23px] rounded-6xs box-border flex flex-row items-start justify-start relative max-w-full z-[3] border-[0.3px] border-solid border-gray-100">
              <img
                className="h-4 w-[18px] absolute !m-[0] right-[3px] bottom-[3px] object-contain z-[1]"
                alt=""
                src="/atras-1@2x.png"
              />
              <div className="self-stretch w-[359px] relative rounded-6xs box-border hidden max-w-full z-[1] border-[0.3px] border-solid border-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentTypeFrame;
