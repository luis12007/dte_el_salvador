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
  const ambiente = localStorage.getItem("ambiente");
  const userNumber = localStorage.getItem("userNumber");
  
  const getAmbienteText = (ambienteValue) => {
    if (ambienteValue === "01") return "PRODUCCIÓN";
    if (ambienteValue === "00") return "PRUEBAS";
    return ambienteValue;
  };

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
  <HamburguerComponent sidebar={sidebar} open={visible} />
      </div>
      <div className="absolute top-0 left-0 z-10 animate-slideInLeft">
        <SidebarComponent visible={visible} setVisible={setVisible} />
      </div>

      {/* Contenido principal alineado y centrado */}
      <main className="w-full flex flex-col items-center justify-center pt-16 pb-8 animate-fadeInUp">
        {/* Header */}
        <header className="w-full max-w-md flex flex-col items-center justify-center gap-8">
          {/* Información del usuario - Una sola tarjeta */}
          <div className="w-[90%] sm:w-full flex flex-col items-center gap-3 mb-8 animate-slideInDown animate-delay-200">
            {/* Tarjeta única con toda la información */}
            <div className="w-full bg-white rounded-xl p-3 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center space-y-2">
                {/* Mensaje de bienvenida en la parte superior */}
                <div className="text-center pb-2 border-b border-gray-100 w-full">
                  <h1 className="text-xl font-bold text-black">
                    ¡BIENVENIDO!
                  </h1>
                  <p className="text-xs text-gray-600">Sistema de Facturación DTE</p>
                </div>
                
                {/* Fila con usuario y ambiente */}
                <div className="w-full flex justify-between items-center gap-4 py-1">
                  {/* Usuario a la izquierda */}
                  {username && (
                    <div className="flex-1 text-left">
                      <p className="text-xs text-gray-500">Usuario</p>
                      <h2 className="text-base font-bold text-black">
                        {username.toUpperCase()}
                      </h2>
                    </div>
                  )}
                  
                  {/* División vertical mínima */}
                  <div className="w-px h-8 bg-gray-200"></div>
                  
                  {/* Ambiente a la derecha */}
                  {ambiente && (
                    <div className="flex-1 text-right">
                      <p className="text-xs text-gray-500">Ambiente</p>
                      <h2 className="text-base font-bold text-black">
                        {getAmbienteText(ambiente)}
                      </h2>
                    </div>
                  )}
                </div>
                
                {/* Número de usuario en la parte inferior */}
                {userNumber && (
                  <div className="text-center pt-1 border-t border-gray-100 w-full">
                    <span className="text-xs text-gray-600">
                      Usuario #{userNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative w-full flex flex-col items-center animate-zoomIn animate-delay-400">
            <img 
              className="h-52 sm:h-72 md:h-80 lg:h-[350px] mt-2 mb-6 transition-all duration-500 hover:scale-105 hover:rotate-1" 
              src={Homeimg} 
              alt="Homeimg" 
            />
          </div>
        </header>

        {/* Botones principales */}
        <div className="w-full max-w-md flex flex-col items-center gap-10 mt-8 animate-slideInUp animate-delay-600">
          <button
            className="w-full flex flex-row items-center bg-white rounded-xl shadow-lg px-6 py-4 mb-2 hover:scale-105 hover:shadow-2xl hover:bg-blue-50 active:scale-95 transition-all duration-300 group"
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
            className="w-full flex flex-row items-center bg-white rounded-xl shadow-lg px-6 py-4 hover:scale-105 hover:shadow-2xl hover:bg-green-50 active:scale-95 transition-all duration-300 group"
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
        <div className="w-full max-w-md flex flex-col items-center mt-14 gap-4 animate-fadeInUp animate-delay-800">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black m-0 hover:scale-110 transition-transform duration-300">
            Sistema de facturación
          </h2>
          <img
            className="h-12 sm:h-[55px] object-cover hover:animate-spin transition-all duration-300 hover:scale-110"
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