import InnerFrame from "../components/InnerFrame";

const ListaDeServicioOClientes = () => {
  return (
    <div className="w-full relative bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-3 px-2.5 pb-[316px] box-border gap-[22px_0px] tracking-[normal]">
      <img
        className="w-[30px] h-[30px] relative object-cover"
        loading="lazy"
        alt=""
        src="/image-10-4@2x.png"
      />
      <InnerFrame />
    </div>
  );
};

export default ListaDeServicioOClientes;
