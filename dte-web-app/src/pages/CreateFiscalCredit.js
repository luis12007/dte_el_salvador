import TreeNode from "../components/TreeNode";
import TableOfContents from "../components/TableOfContents";

const CrearCreditoFiscal = () => {
  return (
    <form className="m-0 w-[430px] bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[17px] pb-3 pr-[15px] pl-5 box-border gap-[22px_0px] tracking-[normal]">
      <header className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start pt-4 pb-[15px] pr-3.5 pl-[17px] box-border top-[0] z-[99] sticky max-w-full">
        <div className="h-[66px] w-[390px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
        <div className="flex-1 rounded-mini bg-gainsboro-300 box-border flex flex-row items-start justify-between pt-[9px] pb-2.5 pr-[7px] pl-[15px] max-w-full gap-[20px] z-[1] border-[1px] border-solid border-white">
          
          <select className="h-[35px] w-[359px] relative   bg-gainsboro-300  max-w-full">
          <option value="CF">Comprobante Credito Fiscal</option>
          <option value="Factura">Factura</option>
  </select>
  {/* Your other elements */}
        </div>
      </header>
      <section className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-6 box-border gap-[5px] max-w-full">
        <div className="self-stretch h-[163px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
          <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
          <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
            General
          </b>
          <div className="flex flex-col items-start justify-start pt-px px-0 pb-0">
            <img
              className="w-[18px] h-4 relative object-contain z-[2]"
              alt=""
              src="/atras-1@2x.png"
            />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-2.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Modelo de Facturacion `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
            </div>

          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
                Dirección
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <input
                className="w-full  [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="date"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-[5px] pr-[5px] pl-0 box-border max-w-full">
        <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[19px] box-border gap-[5px] max-w-full">
          <div className="self-stretch h-[510px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
            <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
              Datos del Receptor
            </b>
            <div className="flex flex-col items-start justify-start pt-px px-0 pb-0">
              <img
                className="w-[18px] h-4 relative object-contain z-[2]"
                alt=""
                src="/atras-1@2x.png"
              />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`DUI `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
            </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">NRC</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
            </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">Nombre</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
            </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">Nombre Comercial</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
            </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">{`Actividad economica `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
      
                <div className="self-stretch w-[359px] relative rounded-6xs box-border hidden max-w-full z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-[15px] pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">Correo electronico</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
            </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">Dirección</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
            </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">Departamento</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
            </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
            <span className="text-black">{`Municipio `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
            <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
              />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-[9px] pr-[5px] pl-0 box-border max-w-full">
        <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-0 px-0 pb-[102px] box-border gap-[9px] max-w-full mq408:pb-[43px] mq408:box-border">
          <div className="self-stretch h-[816px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-[11px] px-[17px] pb-3 box-border relative whitespace-nowrap max-w-full z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full z-[0]" />
            <img
              className="h-4 w-[18px] absolute !m-[0] right-[20px] bottom-[9px] object-contain z-[2]"
              alt=""
              src="/atras-1@2x.png"
            />
            <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
              Datos del producto / Servicio
            </b>
          </div>
          <div className="w-[376px] flex flex-row items-start justify-start pt-0 pb-[29px] pr-3.5 pl-0 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
              <div className="flex flex-row items-start justify-start py-0 px-[3px]">
                <div className="flex flex-row items-start justify-start gap-[0px_5px]">
                  <div className="h-[19px] w-[30px] relative rounded-6xs bg-red-100 box-border z-[1] border-[0.2px] border-solid border-black">
                    <div className="absolute top-[0px] left-[0px] rounded-6xs bg-red-100 box-border w-full h-full hidden border-[0.2px] border-solid border-black" />
                    <div className="absolute top-[2px] left-[2px] rounded-6xs bg-white w-3.5 h-3.5 z-[1]" />
                  </div>
                  <div className="flex flex-col items-start justify-start pt-0.5 px-0 pb-0">
                    <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                      Configuración avanzada de items
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                  Tipo
                </div>
                <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-2 pb-1.5 relative max-w-full z-[2] border-[0.3px] border-solid border-gray-100">
                  <img
                    className="h-4 w-[18px] absolute !m-[0] top-[3px] right-[6px] object-contain z-[1]"
                    alt=""
                    src="/atras-1@2x.png"
                  />
                  <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[1] border-[0.3px] border-solid border-gray-100" />
                  <div className="relative text-xs font-inria-sans text-dimgray text-left z-[3]">
                    Bienes
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <input
                  className="w-[47px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                  placeholder="Cantidad"
                  type="text"
                />
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <input
                  className="w-[61px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                  placeholder="Descripción"
                  type="text"
                />
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <input
                  className="w-[33px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                  placeholder="Precio"
                  type="text"
                />
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-1 gap-[4px_0px]">
                <input
                  className="w-[26px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                  placeholder="Total"
                  type="text"
                />
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch h-[23px] flex flex-row items-start justify-start py-0 px-[3px] box-border max-w-full">
                <div className="self-stretch flex-1 rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-center pt-px px-5 pb-[11px] box-border max-w-full z-[1]">
                  <div className="h-[23px] w-[356px] relative rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
                  <b className="self-stretch relative text-mini font-inria-sans text-white text-left z-[1]">
                    Eliminar
                  </b>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-[11px] box-border max-w-full">
            <form className="m-0 flex-1 flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                  Tipo
                </div>
                <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-2 pb-1.5 relative max-w-full z-[2] border-[0.3px] border-solid border-gray-100">
                  <img
                    className="h-4 w-[18px] absolute !m-[0] top-[2px] right-[6px] object-contain z-[1]"
                    alt=""
                    src="/atras-1@2x.png"
                  />
                  <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[1] border-[0.3px] border-solid border-gray-100" />
                  <div className="relative text-xs font-inria-sans text-dimgray text-left z-[3]">
                    Bienes
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <input
                  className="w-[47px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                  placeholder="Cantidad"
                  type="text"
                />
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <input
                  className="w-[61px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                  placeholder="Descripción"
                  type="text"
                />
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <input
                  className="w-[33px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                  placeholder="Precio"
                  type="text"
                />
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-4 gap-[4px_0px]">
                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                  Total
                </div>
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
                <button className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
                  <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                  <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                    Nuevo Item
                  </b>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full">
        <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[17px] box-border gap-[9px] max-w-full">
          <div className="self-stretch h-[1153px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-[11px] px-[17px] pb-3 box-border relative whitespace-nowrap max-w-full z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full z-[0]" />
            <img
              className="h-4 w-[18px] absolute !m-[0] right-[20px] bottom-[9px] object-contain z-[2]"
              alt=""
              src="/atras-1@2x.png"
            />
            <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
              Datos del producto / Servicio
            </b>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3 pb-[41px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
              <div className="flex flex-row items-start justify-start py-0 px-0.5">
                <div className="flex flex-row items-start justify-start gap-[0px_6px]">
                  <div className="h-[19px] w-[30px] relative rounded-6xs bg-limegreen box-border z-[1] border-[0.2px] border-solid border-black">
                    <div className="absolute top-[0px] left-[0px] rounded-6xs bg-limegreen box-border w-full h-full hidden border-[0.2px] border-solid border-black" />
                    <div className="absolute top-[2px] left-[14px] rounded-6xs bg-white w-3.5 h-3.5 z-[1]" />
                  </div>
                  <div className="flex flex-col items-start justify-start pt-0.5 px-0 pb-0">
                    <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                      Configuración avanzada de items
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                    Tipo
                  </div>
                  <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-2 pb-1.5 relative max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
                    <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                    <div className="relative text-xs font-inria-sans text-dimgray text-left z-[2]">
                      Bienes
                    </div>
                    <img
                      className="h-4 w-[18px] absolute !m-[0] top-[3px] right-[6px] object-contain z-[2]"
                      alt=""
                      src="/atras-1@2x.png"
                    />
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                    Cantidad
                  </div>
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                    Codigo
                  </div>
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <input
                    className="w-[37px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                    placeholder="Unidad"
                    type="text"
                  />
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <input
                    className="w-[61px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                    placeholder="Descripción"
                    type="text"
                  />
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <input
                    className="w-[71px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                    placeholder="Tipo de Venta"
                    type="text"
                  />
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <input
                    className="w-[33px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                    placeholder="Precio"
                    type="text"
                  />
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <input
                  className="w-[55px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                  placeholder="Impuestos"
                  type="text"
                />
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-[11px] gap-[4px_0px]">
                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                  Total
                </div>
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch h-[23px] flex flex-row items-start justify-start py-0 pr-[3px] pl-[5px] box-border max-w-full">
                <div className="self-stretch flex-1 rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-center pt-px px-5 pb-[11px] box-border max-w-full z-[1]">
                  <div className="h-[23px] w-[356px] relative rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
                  <b className="self-stretch relative text-mini font-inria-sans text-white text-left z-[1]">
                    Eliminar
                  </b>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start pt-0 px-2.5 pb-3 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
              <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                    Tipo
                  </div>
                  <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-2 pb-1.5 relative max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
                    <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                    <div className="relative text-xs font-inria-sans text-dimgray text-left z-[2]">
                      Bienes
                    </div>
                    <img
                      className="h-4 w-[18px] absolute !m-[0] top-[3px] right-[6px] object-contain z-[2]"
                      alt=""
                      src="/atras-1@2x.png"
                    />
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                    Cantidad
                  </div>
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                    Codigo
                  </div>
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <input
                    className="w-[37px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                    placeholder="Unidad"
                    type="text"
                  />
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <input
                    className="w-[61px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                    placeholder="Descripción"
                    type="text"
                  />
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <input
                    className="w-[71px] [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-black text-left inline-block p-0 z-[1]"
                    placeholder="Tipo de Venta"
                    type="text"
                  />
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0.5 box-border max-w-full">
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                    Precio
                  </div>
                  <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                  Impuestos
                </div>
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px]">
                <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                  Total
                </div>
                <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" />
              </div>
            </div>
          </div>
          <div className="w-[380px] flex flex-row items-start justify-center py-0 px-5 box-border max-w-full">
            <button className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
              <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
              <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                Nuevo Item
              </b>
            </button>
          </div>
        </div>
      </section>
      <TreeNode subtotal="Subtotal" />
      <TreeNode subtotal="Total Tributos" />
      <TreeNode subtotal="Total a Pagar" />
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full">
        <form className="m-0 flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[25px] box-border gap-[10px] max-w-full">
          <div className="self-stretch h-[581px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-3 px-[9px] pb-[11px] box-border relative whitespace-nowrap max-w-full z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full z-[0]" />
            <img
              className="h-4 w-[18px] absolute !m-[0] top-[10px] right-[17px] object-contain z-[2]"
              alt=""
              src="/atras-1@2x.png"
            />
            <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
              Condiciones de la Operación
            </b>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[23.5px_0px] max-w-full">
              <div className="self-stretch flex flex-col items-start justify-start gap-[13px_0px] max-w-full">
                <div className="self-stretch flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
                  <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                    <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
                      Tipo
                    </div>
                    <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-2 pb-1.5 relative max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
                      <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                      <div className="relative text-xs font-inria-sans text-dimgray text-left z-[2]">
                        Al Contado
                      </div>
                      <img
                        className="h-4 w-[18px] absolute !m-[0] top-[3px] right-[6px] object-contain z-[2]"
                        alt=""
                        src="/atras-1@2x.png"
                      />
                    </div>
                  </div>
                  <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
                </div>
                <div className="self-stretch flex flex-col items-end justify-start gap-[28px] max-w-full z-[1]">
                  <TableOfContents />
                  <div className="self-stretch h-[23px] flex flex-row items-start justify-start py-0 px-px box-border max-w-full">
                    <div className="self-stretch flex-1 rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-center pt-px px-5 pb-[11px] box-border max-w-full">
                      <div className="h-[23px] w-[356px] relative rounded-3xs bg-red-100 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
                      <b className="self-stretch relative text-mini font-inria-sans text-white text-left z-[1]">
                        Eliminar
                      </b>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[13px_0px]">
                <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
                <TableOfContents />
              </div>
              <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
                <button className="cursor-pointer [border:none] pt-3 pb-[13px] pr-[35px] pl-10 bg-steelblue-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-slategray">
                  <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                  <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
                    Nuevo Item
                  </b>
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0 pl-[5px] box-border max-w-full">
        <textarea
          className="[border:none] bg-white h-[163px] w-auto [outline:none] flex-1 rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-[11px] px-[17px] pb-2 box-border font-inria-sans font-bold text-mini text-black max-w-full"
          placeholder="Observaciones"
          rows={8}
          cols={20}
        />
      </section>
      <footer className="self-stretch flex flex-row items-start justify-center py-0 pr-5 pl-[27px]">
        <div className="flex flex-col items-start justify-start gap-[13px_0px]">
          <button className="cursor-pointer [border:none] pt-[13px] pb-3 pr-[23px] pl-[29px] bg-steelblue-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap hover:bg-steelblue-100">
            <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
              Añadir Factura
            </b>
          </button>
          <button className="cursor-pointer [border:none] pt-3 pb-[13px] pr-11 pl-[49px] bg-indianred-500 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start hover:bg-indianred-100">
            <div className="h-12 w-[158px] relative rounded-3xs bg-indianred-500 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-mini font-inria-sans text-white text-left z-[1]">
              Regresar
            </b>
          </button>
        </div>
      </footer>
    </form>
  );
};

export default CrearCreditoFiscal;
