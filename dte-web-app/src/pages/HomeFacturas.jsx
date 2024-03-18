import FacturaUnSend from "../components/FacturaUnSend";
import FacturaSend from "../components/FacturaSend";
import HamburguerComponent from '../components/HamburguerComponent'
import { useState } from "react";
import SidebarComponent from "../components/SideBarComponent";

const HomeFacturas = () => {

  const [visible, setVisible] = useState(true);
    const sidebar = () => {
        setVisible(!visible);
    }

    const excelHandler = () => {
        console.log('Excel');
    }


  return (
    <div className="w-full relative bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[66px] pb-[33px] pr-[22px] pl-[18px] box-border gap-[495px_0px] tracking-[normal]">
      <section className="self-stretch flex flex-col items-start justify-start gap-[13px_0px] max-w-full">
      <SidebarComponent visible={visible}/>

        <FacturaUnSend />
        <FacturaSend />
      </section>
      <button onClick={excelHandler} className="cursor-pointer [border:none] pt-[11px] pb-3.5 pr-[49px] pl-12 bg-seagreen-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]
      flex flex-row items-start justify-start hover:bg-seagreen-100" clea>
        <div className="h-[47px] w-[138px] relative rounded-3xs bg-seagreen-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <b className="relative text-lg font-inria-sans text-white text-left z-[1]">
          Excel
        </b>
      </button>
      
      <HamburguerComponent sidebar={sidebar} visible={visible}/>
    </div>
  );
};

export default HomeFacturas;
