import { HashRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Login from './pages/Logins';
import Home from './pages/Home';
import HomeFacturas from './pages/HomeFacturas';
import DetallesFactura from './pages/DetallesFactura';
import AddClient from './pages/AddClient';
import ListClients from './pages/ListClients';
import Profile from './pages/Profile';
import CreateCF from './pages/CreateFiscalCredit';
import Sidebar from "./pages/Sidebar";
import ClientesFacturaToFiscalProcess from "./pages/CreateBill"
import ListItems from "./pages/ListItems";
import AddItem from "./pages/AddItem";


/* http://localhost:3000/#/ingresar the example route */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* ADD SIDEBAR ALL AND ADJUST*/}
        <Route path="/ingresar" element={<Login/>}/>
        <Route path="/principal" element={<Home/>}/>

        <Route path="/facturas" element={<HomeFacturas/>}/> 
        <Route path="/detalles/:id" element={<DetallesFactura/>}/>


        {/* TODO  */}
        <Route path="/clientes" element={<ListClients/>}/>
        <Route path="/items" element={<ListItems/>}/>
        <Route path="/agregar/cliente" element={<AddClient/>}/>
        <Route path="/agregar/item" element={<AddItem/>}/>
        <Route path="/cliente/:id" element={<AddClient/>}/>{/* TODO: edit  */}
        <Route path="/item/:id" element={<AddItem/>}/>{/* TODO: edit*/}


        <Route path="/perfil" element={<Profile/>}/>

        {/* Working at */}
        <Route path="/crear/factura" element={<ClientesFacturaToFiscalProcess/>}/> {/* Create FActura */}
        <Route path="/crear/creditofiscal" element={<CreateCF/>}/>
        <Route path="/sidebar" element={<Sidebar/>}/>
        

      </Routes>
    </Router>
  );
}

