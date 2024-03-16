const FrameComponent1 = () => {
  const ViewBillHandler = () => {
    console.log('ViewBillHandler');
  }

  const EditBillHandler = () => {
    console.log('EditBillHandler');
  }

  const DownloadBillHandler = () => {
    console.log('DownloadBillHandler');
  }

  const ValidateBillHandler = () => {
    console.log('ValidateBillHandler');
  }

  const SendBillHandler = () => {
    console.log('SendBillHandler');
  }


  return (
    <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-2 box-border top-[0]  sticky max-w-full text-left text-3xs text-black font-inria-sans">
      <div className="self-stretch h-[138px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
      <header className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-0.5 pb-0 pr-[52px] pl-[15px] box-border max-w-full gap-[20px]  text-left text-xl text-black font-inria-sans mq450:pr-5 mq450:box-border">
        <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
        <div className="flex flex-col items-start justify-start pt-1 px-0 pb-0">
          <h1 className="m-0 relative text-inherit font-bold font-inherit z-[3]">
            Factura
          </h1>
        </div>
        <div className="flex flex-row items-start justify-start gap-[0px_8px]">
          <div className="flex flex-col items-start justify-start pt-0.5 px-0 pb-0">
            <img
              className="w-[33px] h-[33px] relative object-cover z-[3]"
              loading="lazy"
              onClick={ViewBillHandler}
              alt=""
              src="/ver@2x.png"
            />
          </div>
          <div className="flex flex-col  items-start justify-start pt-1 px-0 pb-0">
            <img
              className="w-[26px]  h-[26px] relative object-cover z-[3]"
              loading="lazy"
            onClick={EditBillHandler}

              alt=""
              src="/editar@2x.png"
            />
          </div>
          <img
            className="h-[33px]  w-[30px] relative object-cover z-[3]"
            onClick={DownloadBillHandler}
            loading="lazy"
            alt=""
            src="/descargar@2x.png"
          />
        </div>
      </header>
      <div className="self-stretch flex flex-row items-start justify-start py-0 px-[7px] box-border max-w-full">
        <div className="flex-1 flex flex-row items-start justify-start gap-[0px_21px] max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start pt-[7px] px-0 pb-0">
            <div className="self-stretch flex flex-col items-start justify-start gap-[7px_0px]">
              <div className="self-stretch h-[21px] flex flex-col items-start justify-start pt-0 px-0 pb-1 box-border gap-[5px_0px]">
                <div className="relative whitespace-nowrap z-[1]">
                  Luis Alexander Hernández Martinez
                </div>
                <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
              </div>
              <div className="relative whitespace-nowrap z-[1]">
                NIT: 123125412341231231231
              </div>
              <div className="relative whitespace-nowrap z-[1]">
                Correo: luishdezmtz12@gmail.com
              </div>
              <div className="relative whitespace-nowrap z-[1]">
                Telefono: 63232teamo3199
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end justify-start gap-[8px_0px]">
            <button className="cursor-pointer [border:none] pt-[7px] px-2 pb-1 bg-white rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-gainsboro-100">
              <div className="h-[47px] w-[172px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
              <b className="relative text-11xl font-inria-sans text-black text-left whitespace-nowrap z-[2]">
                TOTAL: $233
              </b>
            </button>
            <div className="flex flex-row items-start justify-start py-0 pr-[3px] pl-0">
              <div className="flex flex-row items-start justify-start gap-[0px_11px]">
                <div className="flex flex-row items-start justify-start relative">
                  <div className="h-full w-full absolute !m-[0] right-[-3px] bottom-[-4px] rounded-11xl bg-lightgray-200 z-[1]" />
                  <button onClick={ValidateBillHandler} className="cursor-pointer [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] bg-whitesmoke rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100">
                    <div className="h-[38px] w-[82px] relative rounded-11xl bg-whitesmoke hidden" />
                    <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
                      validar
                    </div>
                  </button>
                </div>
                <div className="flex flex-row items-start justify-start relative">
                  <div className="h-full w-full absolute !m-[0] right-[-3px] bottom-[-4px] rounded-11xl bg-lightgray-200 z-[1]" />
                  <button onClick={SendBillHandler} className="cursor-pointer [border:none] pt-[11px] pb-[13px] pr-[22px] pl-7 bg-whitesmoke rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100">
                    <div className="h-[38px] w-[82px] relative rounded-11xl bg-whitesmoke hidden" />
                    <div className="relative text-xs font-light font-inria-sans text-black text-left z-[3]">
                      enviar
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameComponent1;
