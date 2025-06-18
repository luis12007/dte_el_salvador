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
    <div className="w-full min-h-screen bg-steelblue-300 flex flex-col items-center justify-center relative animate-fadeIn">
      {/* Hamburguer y Sidebar fuera del flujo principal */}
      <div className="absolute top-0 left-0 z-20 animate-slideInLeft">
        <HamburguerComponent sidebar={sidebar} visible={visible} />
      </div>
      <div className="absolute top-0 left-0 z-10 animate-slideInLeft">
        <SidebarComponent visible={visible} setVisible={setVisible} />
      </div>

      {/* Contenido principal alineado y centrado */}
      <main className="w-full flex flex-col items-center justify-center pt-16 pb-8 animate-fadeInUp">
        {/* Header */}
        <header className="w-full max-w-md flex flex-col items-center justify-center gap-8 animate-slideInDown animate-delay-200">
          <div className="relative w-full flex flex-col items-center">
            <div className="relative w-[320px] h-10 flex items-center justify-center mb-2 animate-bounceIn animate-delay-300">
              <img
                className="absolute left-0 top-0 w-full h-full rounded-xl transition-transform duration-300 hover:scale-105"
                loading="lazy"
                alt=""
                src="/rectangle-4.svg"
              />
              <span className="relative font-bold text-black text-2xl font-inter z-10 flex items-center justify-center w-full text-center pb-2 animate-pulse">
                BIENVENIDO!
              </span>
            </div>
            <img 
              className="h-52 sm:h-72 md:h-80 lg:h-[350px] mt-2 mb-6 animate-zoomIn animate-delay-500 transition-all duration-500 hover:scale-105 hover:rotate-1" 
              src={Homeimg} 
              alt="Homeimg" 
            />
          </div>
        </header>

        {/* Botones principales */}
        <div className="w-full max-w-md flex flex-col items-center gap-10 mt-8 animate-slideInUp animate-delay-700">
          <button
            className="w-full flex flex-row items-center bg-white rounded-xl shadow-lg px-6 py-4 mb-2 hover:scale-105 hover:shadow-2xl hover:bg-blue-50 active:scale-95 transition-all duration-300 animate-fadeInRight animate-delay-800 group"
            onClick={CreateBillHandler}
          >
            <img
              className="h-10 w-10 object-contain mr-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              alt=""
              src="/factura-2@2x.png"
            />
            <span className="text-xl font-inter text-black transition-all duration-300 group-hover:text-blue-600 group-hover:font-semibold">
              Crear Una Factura
            </span>
          </button>
          <button
            className="w-full flex flex-row items-center bg-white rounded-xl shadow-lg px-6 py-4 hover:scale-105 hover:shadow-2xl hover:bg-green-50 active:scale-95 transition-all duration-300 animate-fadeInLeft animate-delay-1000 group"
            onClick={SupportHandler}
          >
            <img
              className="h-10 w-10 object-contain mr-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              alt=""
              src={list}
            />
            <span className="text-xl font-inter text-black transition-all duration-300 group-hover:text-green-600 group-hover:font-semibold">
              Lista de Facturas
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="w-full max-w-md flex flex-col items-center mt-14 gap-4 animate-fadeInUp animate-delay-1200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black m-0 animate-bounceIn animate-delay-1400 hover:scale-110 transition-transform duration-300">
            Sistema de facturación
          </h2>
          <img
            className="h-12 sm:h-[55px] object-cover animate-rotateIn animate-delay-1600 hover:animate-spin transition-all duration-300 hover:scale-110"
            loading="lazy"
            alt=""
            src="/-cee3707255594486baada125edfbc74cremovebgpreview-2@2x.png"
          />
        </div>
      </main>
    </div>
  );
};

export default Home;