import BillnoCF from "../components/ClientBill";
import BillCF from "../components/ClientBillCF";
import TreeNode from "../components/TreeNode";
import TableOfContents from "../components/TableOfContentsWithDelete";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdvanceItemsComponentOnComponent from "../components/AdvanceItemsOnComponentl";
import AdvanceItemsComponent from "../components/AdvanceNoItemsComponent";
import TableOfContentsNew from "../components/TableOfContentsNew";
const Clientes = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [CF, setCF] = useState(false);
  const [Items, setItems] = useState(false);

  /* All inputs for Bill */



  /* Cliente array */
  const [client, setClient] = useState(
  );

  const HandleupdateClient = (event) => {
    event.preventDefault();
    const newClient = {
      name: event.target.name.value,
      nit: event.target.nit.value,
      address: event.target.address.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
      credit: event.target.credit.value,
    };
    
    setClient(newClient);
    console.log(client);
  };


  /* Const Condiciones Operaciones array op op */

  const [contents, setContents] = useState([

  ]);

  const handleRemove = (index) => {
    setContents((prevContents) =>
      prevContents.filter((_, i) => i !== index)
    );
  };

  const handleAdd = (newContents) => {
    setContents((prevContents) => [
      ...prevContents,
      { type: newContents.type, pay: newContents.pay, mount: newContents.mount, Doc: newContents.Doc },
    ]);
  };


  /* Services Add */
  const [items, setitems] = useState([

  ]);

  const [itemsAdvance, setitemsAdvance] = useState([

  ]);

  const itemshandleRemove = (index) => {
    setitems((prevContents) =>
      prevContents.filter((_, i) => i !== index)
    );
  };

  const itemshandleAdd = (newContents) => {
    console.log("itemshandleAdd");
    console.log(newContents);
    setitems((prevContents) => [
      ...prevContents,
      { type: newContents.type, cuantity: newContents.cuantity, description: newContents.description, price: newContents.price },
    ]);
    console.log(items);
  };

  const itemsAdvancehandleRemove = (index) => {
    setitemsAdvance((prevContents) =>
      prevContents.filter((_, i) => i !== index)
    );
  };

  const itemsAdvancehandleAdd = (newContents) => {
    setitemsAdvance((prevContents) => [
      ...prevContents,
      { type: newContents.type, quantity: newContents.quantity, code: newContents.code, units: newContents.units, description: newContents.description, saleType: newContents.saleType, price: newContents.price, taxes: newContents.taxes },
    ]);
  };


  /* navigate and fu */

  const navigate = useNavigate();



  const addBillHandler = () => {
    console.log("AddBillHandler");
  };

  const goBackHandler = () => {
    navigate("/Principal");
  };
  /* Logic of select to go to bill or CF */
  const ChangeHandler = (selectedValue) => {
    if (selectedValue === "Factura") {
      console.log("Factura");
    } else if (selectedValue === "CF") {
      navigate("/crear/creditofiscal");
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    ChangeHandler(event.target.value);
  };

  /* Logic of renderize CF or NotCF */
  const handleSelectChangeCFClient = () => {
    setCF(!CF);
  };

  /* Logic of items */
  const handleSelectChangeItemsClient = () => {
    setItems(!Items);
  };


  return (
    <form className="m-0 w-[430px] bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[17px] pb-3 pr-[15px] pl-5 box-border gap-[22px_0px] tracking-[normal]">
      <header className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start pt-4 pb-[15px] pr-3.5 pl-[17px] box-border top-[0] z-[99] sticky max-w-full">
        <div className="h-[66px] w-[390px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
        <div className="flex-1 rounded-mini bg-gainsboro-300 box-border flex flex-row items-start justify-between pt-[9px] pb-2.5 pr-[7px] pl-[15px] max-w-full gap-[20px] z-[1] border-[1px] border-solid border-white">
          <select
            onChange={handleSelectChange}
            className="h-[35px] w-[359px] relative  border-gainsboro-300 bg-gainsboro-300 border-2 max-w-full"
          >
            <option value="Factura">Factura</option>
            <option value="CF">Comprobante Credito Fiscal</option>
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
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
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
      {CF ? (
        <BillCF handleSelectChangeCFClient={handleSelectChangeCFClient} />
      ) : (
        <BillnoCF handleSelectChangeCFClient={handleSelectChangeCFClient} />
      )}

      {Items ? (
        <AdvanceItemsComponentOnComponent
          handleSelectChangeItemsClient={handleSelectChangeItemsClient}
          itemsAdvancehandleRemove={itemsAdvancehandleRemove}
          itemsAdvancehandleAdd={itemsAdvancehandleAdd}
          itemsAdvance={itemsAdvance}

        />
      ) : (
        <AdvanceItemsComponent
          handleSelectChangeItemsClient={handleSelectChangeItemsClient}
          itemshandleRemove={itemshandleRemove}
          itemshandleAdd={itemshandleAdd}
          items={items}

        />
      )}

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
                    <div className="relative text-xs font-inria-sans text-black text-left z-[1]"></div>
                    <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                    <div>
                      <span className="text-black">Tipo</span>
                      <span className="text-tomato">*</span>
                    </div>
                    <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                      <select
                        className="w-full h-full relative  border-white bg-white border-2 max-w-full"
                        type="text"
                      >
                        <option value="CF">Al contado</option>
                      </select>
                    </div>
                  </div>
                  <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
                </div>
                <div className="self-stretch flex flex-col items-end justify-start gap-[28px] max-w-full z-[1]">
                  {contents.map((content, index) => (
                    <TableOfContents
                      key={index}
                      content={content}
                      onRemove={() => handleRemove(index)}
                    />
                  ))}
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[13px_0px]">
                <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
                <TableOfContentsNew handleAdd={handleAdd} />
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
          <button
            onClick={addBillHandler}
            className="cursor-pointer [border:none] pt-[13px] pb-3 pr-[23px] pl-[29px] bg-steelblue-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap hover:bg-steelblue-100"
          >
            <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
              Añadir Factura
            </b>
          </button>
          <button
            onClick={goBackHandler}
            className="cursor-pointer [border:none] pt-3 pb-[13px] pr-11 pl-[49px] bg-indianred-500 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start hover:bg-indianred-100"
          >
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

export default Clientes;
