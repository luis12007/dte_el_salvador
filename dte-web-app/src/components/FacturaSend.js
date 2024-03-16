const FrameComponent = () => {

  const ViewBillHandler = () => {
    console.log('ViewBillHandler');
  }



  const DownloadBillHandler = () => {
    console.log('DownloadBillHandler');
  }





  return (
    <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-2 box-border relative gap-[1px_0px] max-w-full text-left text-xl text-black font-inria-sans">
      <div className="self-stretch h-[138px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden z-[0]" />
      <div className="w-[174px] h-px absolute !m-[0] top-[62px] left-[6px] box-border z-[1] border-t-[1px] border-solid border-black" />
      <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-px pb-0 pr-11 pl-1.5 box-border max-w-full gap-[20px] z-[1] mq450:flex-wrap mq450:pr-5 mq450:box-border">
        <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
        <div className="flex flex-col items-start justify-start pt-[5px] px-0 pb-0">
          <h1 className="m-0 relative text-inherit font-bold font-inherit z-[2]">
            Credito Fiscal
          </h1>
        </div>
        <div className="flex flex-row items-start justify-start gap-[0px_8px]">
          <div className="flex flex-col items-start justify-start pt-[3px] px-0 pb-0">
            <img
              className="w-[33px]  h-[33px] relative object-cover z-[2]"
              alt=""
              onClick={ViewBillHandler}
              src="/ver@2x.png"
            />
          </div>
          <img
            className="h-[33px] w-[30px] relative object-cover z-[2]"
            alt=""
            onClick={DownloadBillHandler}
            src="/descargar@2x.png"
          />
        </div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-start py-0 px-1.5 box-border max-w-full text-3xs">
        <div className="flex-1 flex flex-row flex-wrap items-end justify-start gap-[0px_48px] max-w-full mq450:gap-[0px_24px]">
          <div className="w-[152px] flex flex-col items-start justify-start pt-0 px-0 pb-1.5 box-border">
            <div className="self-stretch flex flex-col items-start justify-start gap-[7.67px_0px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="relative z-[1]">
                  Luis Alexander Hernández Martinez
                </div>
                <div className="w-0 flex flex-col items-start justify-start pt-[5px] px-0 pb-0 box-border ml-[-126px] text-xs font-inter">
                  <div className="w-0 h-[15px] relative">
                    <div className="absolute top-[0px] left-[0px] z-[2]">{` `}</div>
                    <div className="absolute top-[0px] left-[0px] z-[3]">{` `}</div>
                  </div>
                </div>
              </div>
              <div className="relative z-[1]">NIT: 123125412341231231231</div>
              <div className="relative z-[1]">
                Correo: luishdezmtz12@gmail.com
              </div>
              <div className="relative z-[1]">Telefono: 632323199</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end justify-start gap-[7px_0px] min-w-[112px]">
            <button className="cursor-pointer [border:none] pt-[7px] px-2 pb-1 bg-white rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-gainsboro-100">
              <div className="h-[47px] w-[172px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
              <b className="relative text-11xl font-inria-sans text-black text-left z-[2]">
                TOTAL: $233
              </b>
            </button>
            <div className="flex flex-row items-start justify-start gap-[0px_4px]">
              <button className="cursor-pointer [border:none] pt-3 pb-3.5 pr-[33px] pl-[11px] bg-whitesmoke rounded-11xl flex flex-row items-start justify-start z-[1] hover:bg-lightgray-100">
                <div className="h-[38px] w-[82px] relative rounded-11xl bg-whitesmoke hidden" />
                <div className="relative text-3xs font-inria-sans text-black text-left z-[2]">
                  Validado
                </div>
              </button>
              <button className="cursor-pointer [border:none] py-[13px] pr-8 pl-[15px] bg-whitesmoke rounded-11xl flex flex-row items-start justify-start z-[1] hover:bg-lightgray-100">
                <div className="h-[38px] w-[82px] relative rounded-11xl bg-whitesmoke hidden" />
                <div className="relative text-3xs font-inria-sans text-black text-left z-[2]">
                  Enviado
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameComponent;
