import DocumentTypeFrame from "../components/DocumentTypeFrame";

const Clientes = () => {
  return (
    <div className="w-full relative bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-3 px-2.5 pb-[322px] box-border gap-[34px_0px] tracking-[normal]">
      <img
        className="w-[30px] h-[30px] relative object-cover"
        loading="lazy"
        alt=""
        src="/image-10-4@2x.png"
      />
      <DocumentTypeFrame />
    </div>
  );
};

export default Clientes;
