import InnerFrame from "../components/ListClientsComponents";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HamburguerComponent from "../components/HamburguerComponent";
import SidebarComponent from "../components/SideBarComponent";
const ListaDeServicioOClientes = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);


  const sidebar = () => {
    setVisible(!visible);
}
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-steelblue-300 px-3 py-6 box-border sm:px-6 sm:py-10 animate-fadeIn">
      <HamburguerComponent sidebar={sidebar} open={visible} />
      <SidebarComponent visible={visible} setVisible={setVisible} />
      <div className="mt-12 sm:mt-2">
        <InnerFrame />
      </div>
    </div>
  );
};

export default ListaDeServicioOClientes;
