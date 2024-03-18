import InnerFrame from "../components/ListClientsComponents";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HamburguerComponent from "../components/HamburguerComponent";
import SidebarComponent from "../components/SideBarComponent";
const ListaDeServicioOClientes = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);


  const sidebar = () => {
    setVisible(!visible);
}
  return (
    <div className="w-full relative bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-3 px-2.5 pb-[316px] box-border gap-[22px_0px] tracking-[normal]">
            <HamburguerComponent sidebar={sidebar} visible={visible}/>
            <SidebarComponent visible={visible} setVisible={setVisible}/>
<div className="w-full flex flex-col items-start mt-20 justify-start gap-[22px_0px]">

      <InnerFrame />
      </div>
    </div>
  );
};

export default ListaDeServicioOClientes;
