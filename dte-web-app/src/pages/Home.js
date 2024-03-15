import Homeimg from '../assets/imgs/homeimg.webp'
const Home = () => {

  


  return (
    <div className="w-full relative bg-steelblue-300 overflow-hidden flex flex-col items-end justify-start pt-3.5 pb-1.5 pr-[62px] pl-[18px] box-border gap-[47px_0px] tracking-[normal]">
      <section className="self-stretch  flex flex-row items-start justify-start pt-0 pb-[420px] pr-[31px] pl-0">
        <header className="flex-1 flex flex-col items-start justify-start gap-[10px_0px] text-left text-xs text-black font-inter">
          <img
            className="w-[30px] h-[30px] relative object-contain"
            loading="lazy"
            alt=""
            src="/image-10-4@2x.png"
          />
          <div className="self-stretch  flex flex-row items-start  justify-end">
            <div className="h-[54px] w-[294px] relative">
              <img
                className="absolute rounded-mini  h-8"
                loading="lazy"
                alt=""
                src="/rectangle-4.svg"
              />
              
              <div className="absolute top-[5px]  ml-3 font-light inline-block w-60 h-11 [-webkit-text-stroke:1px_#000] ">{`BIENVENIDO! `}</div>
            </div>
          </div>
        </header> 
        <img className='bg-green-200' src='/rectangle-4.svg' alt='Homeimg'/>
      </section >
      <div className="w-[303px]  flex flex-row items-start justify-start py-0 px-[15px] box-border">
        <button className="cursor-pointer [border:none] p-0 bg-[transparent] flex-1 flex flex-row items-start justify-start gap-[0px_15px] mq328:flex-wrap">
          <img
            className="h-[63px] w-[65px]  relative object-cover z-[1]"
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
              <div className="h-[31px] relative text-3xl font-light font-inter text-black text-left inline-block [-webkit-text-stroke:1px_#000] z-[1]">
                Crear Una Factura
              </div>
            </div>
          </div>
        </button>
      </div>
      <section className="w-[312px] flex flex-col items-start justify-start py-0 pr-0 pl-5 box-border gap-[63px_0px] text-left text-xl text-black font-inria-sans mq312:gap-[31px_0px]">
        <button className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch flex flex-row flex-wrap items-start justify-start gap-[0px_20px]">
          <div className="flex flex-row items-start justify-start relative">
            <img
              className="h-[97px] w-[309px] absolute !m-[0] right-[-214px] bottom-[-12px] rounded-mini"
              alt=""
              src="/rectangle-5.svg"
            />
            <img
              className="h-[78px] w-[79px] relative object-cover z-[1]"
              alt=""
              src="/apoyotecnico-1@2x.png"
            />
          </div>
          <div className="flex-1 flex flex-col items-start justify-start pt-[26px] px-0 pb-0 box-border min-w-[125px]">
            <div className="self-stretch h-[31px] relative text-3xl font-light font-inter text-black text-left inline-block shrink-0 [-webkit-text-stroke:1px_#000] z-[1]">
              Soporte
            </div>
          </div>
        </button>
        <div className="w-[278px] flex flex-col items-start justify-start gap-[9px_0px]">
          <h2 className="m-0 relative text-inherit font-bold font-inherit">
            Sistema creado por MySoftware
          </h2>
          <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
            <img
              className="h-[65px] w-[98px] relative object-cover"
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
