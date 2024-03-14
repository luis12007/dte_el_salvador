import GroupComponent1 from "../components/GroupComponent1";
import DepartamentoText from "../components/DepartamentoText";

const PcViewAddClient = () => {
  return (
    <div className="w-full relative bg-steelblue-300 overflow-hidden flex flex-row items-start justify-start gap-[0px_53px] tracking-[normal] mq1700:flex-wrap mq900:gap-[0px_26px]">
      <GroupComponent1 />
      <header className="w-[1475px] flex flex-col items-start justify-start pt-[172px] px-0 pb-0 box-border max-w-full mq1325:pt-28 mq1325:box-border mq900:pt-[73px] mq900:box-border">
        <section className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[29.699999999999932px] box-border gap-[7.8px] max-w-full text-left text-[32px] text-black font-inria-sans">
          <div className="self-stretch h-[797px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-[7px] px-3 pb-[28.899999999999977px] box-border max-w-full z-[1]">
            <div className="h-[57.8px] w-[1475px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
            <b className="h-[21.9px] w-[398.2px] relative inline-block shrink-0 whitespace-nowrap max-w-full box-border pr-5 z-[2]">
              Datos del Receptor
            </b>
          </div>
          <DepartamentoText />
        </section>
      </header>
    </div>
  );
};

export default PcViewAddClient;
