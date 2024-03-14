import UserLabel from "./UserLabel";

const InnerFrame = () => {
  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans">
      <div className="flex-1 flex flex-col items-start justify-start gap-[28px_0px] max-w-full">
        <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-6 pb-9 pr-[21px] pl-[17px] box-border gap-[11.5px] max-w-full">
          <div className="w-[390px] h-[475px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
          <div className="self-stretch h-0 flex flex-row items-start justify-start py-0 pr-0.5 pl-0 box-border max-w-full">
            <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
          </div>
          <UserLabel />
          <div className="self-stretch h-0 flex flex-row items-start justify-start max-w-full">
            <div className="h-px flex-1 relative box-border max-w-[calc(100%_-_4px)] z-[1] border-t-[1px] border-solid border-black" />
            <div className="h-px flex-1 relative box-border max-w-[calc(100%_-_4px)] z-[1] ml-[-346px] border-t-[1px] border-solid border-black" />
          </div>
          <UserLabel correoLuisAlexanderContaiPadding="0px 3px" />
          <div className="self-stretch h-0 flex flex-row items-start justify-start max-w-full">
            <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
            <div className="h-px flex-1 relative box-border max-w-full z-[2] ml-[-349px] border-t-[1px] border-solid border-black" />
          </div>
          <UserLabel correoLuisAlexanderContaiPadding="0px 3px" />
          <div className="self-stretch h-0 flex flex-row items-start justify-start max-w-full">
            <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
            <div className="h-px flex-1 relative box-border max-w-full z-[2] ml-[-349px] border-t-[1px] border-solid border-black" />
          </div>
          <UserLabel correoLuisAlexanderContaiPadding="0px 3px" />
          <div className="self-stretch h-0 flex flex-row items-start justify-start max-w-full">
            <div className="h-px flex-1 relative box-border max-w-full z-[1] border-t-[1px] border-solid border-black" />
            <div className="h-px flex-1 relative box-border max-w-full z-[2] ml-[-349px] border-t-[1px] border-solid border-black" />
          </div>
          <UserLabel correoLuisAlexanderContaiPadding="0px 3px" />
          <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
        </div>
        <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
          <button className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-seagreen-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start hover:bg-seagreen-100">
            <div className="h-[47px] w-[138px] relative rounded-3xs bg-seagreen-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-lg font-inria-sans text-white text-left z-[1]">
              Agregar
            </b>
          </button>
        </div>
      </div>
    </section>
  );
};

export default InnerFrame;
