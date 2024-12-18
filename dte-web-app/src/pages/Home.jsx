import Homeimg from '../assets/imgs/homeimg.webp'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hamburgerimg from '../assets/imgs/hamburguerimg.png'
import SidebarComponent from '../components/SideBarComponent';
import HamburguerComponent from '../components/HamburguerComponent';

import list from '../assets/imgs/portapapeles.png';

const Home = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const SupportHandler = () => {
    /* window.open("https://wa.link/h382bz", "_blank"); */
  navigate("/facturas");

  }

  const CreateBillHandler = () => {

  navigate("/crear/factura");

  }

    const sidebar = () => {
        setVisible(!visible);
    }

  return (
    <div className="w-full relative bg-steelblue-300 overflow-hidden flex flex-col items-end justify-start pt-3.5 pb-1.5 pr-[62px] pl-[18px] box-border gap-[47px_0px] tracking-[normal]">
      <HamburguerComponent sidebar={sidebar} visible={visible}/>

      <section className="self-stretch  flex flex-row items-start pt-8  justify-start  pb-[420px] pr-[31px] pl-0">

      <SidebarComponent visible={visible} setVisible={setVisible}/>
        <header className="flex-1 flex flex-col items-start   justify-start gap-[10px_0px] text-left text-xs text-black font-inter">
          <div className="self-stretch pt-6 left-4  flex flex-row items-start  justify-end">
            <div className="h-[54px] w-[294px] relative">
              <img
                className="absolute rounded-mini  h-8"
                loading="lazy"
                alt=""
                src="/rectangle-4.svg"
              />
              
              <div className="absolute top-[5px]   ml-3 font-light inline-block w-60 h-11 [-webkit-text-stroke:1px_#000] ">{`BIENVENIDO! ${username}`}</div>
        <img className='h-96 top-20 absolute' src={Homeimg} alt='Homeimg'/>

            </div>

          </div>
        </header> 
      </section >
      <div className="w-[303px]  flex flex-row items-start justify-start py-0 px-[15px] box-border">
        <button className="cursor-pointer [border:none] p-0 bg-[transparent] flex-1 flex flex-row items-start justify-start gap-[0px_15px] mq328:flex-wrap" onClick={CreateBillHandler}>
          <img
            className="h-[63px] bottom-2 w-[65px]  relative object-cover z-[1]"
            alt=""
            src="/factura-2@2x.png"
          />
          <div className="flex-1 flex flex-col items-start justify-start pt-5 pb-0 pr-2 pl-0 box-border min-w-[125px] min-h-[51px] mq328:min-h-[auto]">
            <div className="self-stretch h-[16.5px] flex flex-row items-start justify-start relative">
              <img
                className="h-[97px] w-[309px] absolute !m-[0] bottom-[-41.7px] left-[-101.4px] rounded-mini"
                alt=""
                src="/rectangle-5.svg"
              />
              <div className="h-[31px] bottom-4 relative text-3xl font-light font-inter text-black text-left inline-block [-webkit-text-stroke:1px_#000] z-[1]">
                Crear Una Factura
              </div>
            </div>
          </div>
        </button>
      </div>
      <section className="w-[312px]  flex flex-col items-start justify-start py-0 pr-0 pl-5 box-border gap-[63px_0px] text-left text-xl text-black font-inria-sans mq312:gap-[31px_0px]">
        <button className="cursor-pointer  [border:none] p-0 bg-[transparent] self-stretch flex flex-row flex-wrap items-start justify-start gap-[0px_20px]" onClick={SupportHandler}>
          <div className="flex flex-row  items-start justify-start relative">
            <img
              className="h-[97px]  w-[309px] absolute !m-[0] right-[-214px] bottom-[-12px] rounded-mini"
              alt=""
              src="/rectangle-5.svg"
            />
            <img
              className="h-[78px] pb-1 left-2 w-[79px] relative object-cover z-[1]"
              alt=""
              src={list}
            />
          </div>
          <div className="flex-1 flex flex-col items-start justify-start pt-[26px] px-0 pb-0 box-border min-w-[125px]">
            <div className="self-stretch   h-[31px] relative text-3xl font-light font-inter text-black text-left inline-block shrink-0 [-webkit-text-stroke:1px_#000] z-[1]">
              Lista de Facturas
            </div>
          </div>
        </button>
        <div className="w-[278px] flex flex-col items-center justify-center gap-[9px_0px]">
          <h2 className="m-0 relative text-inherit font-bold font-inherit">
            Sistema de facturación
          </h2>
          <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
            <img
              className="h-[55px] relative object-cover"
              loading="lazy"
              alt=""
              src="/-cee3707255594486baada125edfbc74cremovebgpreview-2@2x.png"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
