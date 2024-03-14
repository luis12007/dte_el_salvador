const DepartamentoText = () => {
  return (
    <div className="self-stretch flex flex-row items-start justify-start py-0 pr-[53px] pl-[52.89999999999963px] box-border max-w-full text-left text-xl text-black font-inria-sans mq1325:pl-[26px] mq1325:pr-[26px] mq1325:box-border">
      <div className="flex-1 flex flex-col items-start justify-start pt-0 px-0 pb-[5.684341886080803e-14px] box-border gap-[15.6px_0px] max-w-full">
        <div className="self-stretch flex flex-col items-start justify-start gap-[6.3px_0px]">
          <div className="w-[102.1px] relative inline-block whitespace-nowrap z-[1]">
            <span>{`DUI `}</span>
            <span className="text-tomato">*</span>
          </div>
          <div className="self-stretch h-[35.9px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
        </div>
        <div className="w-[1357.8px] flex flex-col items-start justify-start gap-[6.3px_0px] max-w-full">
          <div className="w-[113.5px] relative inline-block whitespace-nowrap z-[1]">
            <span>NRC</span>
            <span className="text-red-200">{` `}</span>
            <span className="text-tomato">*</span>
          </div>
          <div className="self-stretch h-[35.9px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
        </div>
        <div className="w-[1357.8px] flex flex-col items-start justify-start gap-[6.3px_0px] max-w-full">
          <div className="w-[189.1px] relative inline-block whitespace-nowrap z-[1]">
            <span>Nombre</span>
            <span className="text-red-200">{` `}</span>
            <span className="text-tomato">*</span>
          </div>
          <div className="self-stretch h-[35.9px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
        </div>
        <div className="w-[1357.8px] flex flex-col items-start justify-start gap-[6.3px_0px] max-w-full shrink-0">
          <div className="w-[393.3px] relative inline-block whitespace-nowrap max-w-full z-[1]">
            <span>Nombre Comercial</span>
            <span className="text-red-200">{` `}</span>
            <span className="text-tomato">*</span>
          </div>
          <input
            className="[outline:none] bg-[transparent] self-stretch h-[35.9px] relative rounded-6xs box-border min-w-[250px] z-[1] border-[0.3px] border-solid border-gray-100"
            type="text"
          />
        </div>
        <div className="w-[1357.8px] flex flex-col items-start justify-start gap-[6.3px_0px] max-w-full shrink-0">
          <div className="w-[434.9px] relative inline-block whitespace-nowrap max-w-full z-[1]">
            <span>{`Actividad economica `}</span>
            <span className="text-tomato">*</span>
          </div>
          <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-end pt-[5.400000000000006px] px-[15.699999999999818px] pb-[4.5px] max-w-full z-[2] border-[0.3px] border-solid border-gray-100">
            <img
              className="h-[26px] w-[34px] relative object-contain z-[1]"
              alt=""
              src="/atras-2@2x.png"
            />
            <div className="h-[35.9px] w-[1357.8px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 pr-1 pl-[3.800000000000182px] box-border max-w-full shrink-0">
          <div className="flex-1 flex flex-col items-start justify-start gap-[6.3px_0px] max-w-full">
            <div className="w-[385.8px] relative inline-block whitespace-nowrap max-w-full z-[1]">
              <span>Correo electronico</span>
              <span className="text-red-200">{` `}</span>
              <span className="text-tomato">*</span>
            </div>
            <input
              className="[outline:none] bg-[transparent] self-stretch h-[35.9px] relative rounded-6xs box-border min-w-[250px] z-[1] border-[0.3px] border-solid border-gray-100"
              type="text"
            />
          </div>
        </div>
        <div className="w-[1357.8px] flex flex-col items-start justify-start pt-0 px-0 pb-0 box-border gap-[6.3px_0px] max-w-full">
          <div className="w-[211.8px] relative inline-block whitespace-nowrap z-[1]">
            <span>Dirección</span>
            <span className="text-red-200">{` `}</span>
            <span className="text-tomato">*</span>
          </div>
          <div className="self-stretch h-[35.9px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
        </div>
        <footer className="w-[1357.8px] flex flex-col items-start justify-start gap-[6.3px_0px] max-w-full text-left text-xl text-black font-inria-sans">
          <div className="w-[317.7px] relative inline-block whitespace-nowrap z-[1]">
            <span>Departamento</span>
            <span className="text-red-200">{` `}</span>
            <span className="text-tomato">*</span>
          </div>
          <div className="self-stretch h-[35.9px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
        </footer>
        <div className="w-[1357.8px] flex flex-col items-start justify-start gap-[6.3px_0px] max-w-full">
          <div className="w-[223.1px] relative inline-block whitespace-nowrap z-[1]">
            <span>Municipio</span>
            <span className="text-red-200">{` `}</span>
            <span className="text-tomato">*</span>
          </div>
          <div className="self-stretch h-[35.9px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
        </div>
      </div>
    </div>
  );
};

export default DepartamentoText;
