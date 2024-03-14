const GroupComponent = () => {
  return (
    <div className="w-[202px] rounded-11xl bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start py-[19px] pr-[23px] pl-[18px] box-border gap-[55px] text-left text-xs text-black font-inter">
      <div className="w-[202px] h-[396px] relative rounded-11xl bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
      <div className="self-stretch flex flex-col items-end justify-start gap-[26px_0px]">
        <img
          className="w-[15px] h-[15px] relative object-cover z-[1]"
          loading="lazy"
          alt=""
          src="/x-1@2x.png"
        />
        <div className="self-stretch flex flex-row items-start justify-start py-0 pr-[23px] pl-0">
          <nav className="m-0 flex-1 flex flex-col items-start justify-start gap-[11px_0px] text-left text-xs text-black font-inter">
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="flex flex-row items-start justify-start gap-[0px_9px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/workfromhome-2@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-2 px-0 pb-0">
                  <div className="relative z-[1]">Home</div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="flex flex-row items-start justify-start gap-[0px_13px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/facturasdepapel-1@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-2 px-0 pb-0">
                  <div className="relative z-[1]">Facturas</div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-start justify-start py-0 px-0.5">
              <div className="flex flex-row items-start justify-start gap-[0px_14px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/usuario-1@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-[3px] px-0 pb-0">
                  <div className="relative z-[1]">Perfil</div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-start justify-start py-0 pr-0 pl-[3px]">
              <div className="flex flex-row items-start justify-start gap-[0px_13px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/factura-1@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-2 px-0 pb-0">
                  <div className="relative z-[1]">Agregar Factura</div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-start justify-start gap-[0px_14px]">
              <img
                className="h-8 w-8 relative object-cover z-[1]"
                loading="lazy"
                alt=""
                src="/personas-1@2x.png"
              />
              <div className="flex flex-col items-start justify-start pt-[9px] px-0 pb-0">
                <div className="relative z-[1]">Clientes</div>
              </div>
            </div>
            <div className="flex flex-row items-start justify-start py-0 px-[3px]">
              <div className="flex flex-row items-start justify-start gap-[0px_9px]">
                <img
                  className="h-[30px] w-[30px] relative object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/articulo-1@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-2 px-0 pb-0">
                  <div className="relative z-[1]">Añadir servicio</div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="flex flex-row items-start justify-start py-0 px-[3px]">
        <div className="flex flex-row items-start justify-start gap-[0px_5px]">
          <img
            className="h-[25px] w-[25px] relative object-cover z-[1]"
            loading="lazy"
            alt=""
            src="/salida-1@2x.png"
          />
          <div className="flex flex-col items-start justify-start pt-[5px] px-0 pb-0">
            <div className="relative z-[1]">Salir</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupComponent;
