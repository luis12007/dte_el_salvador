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
import EditBill from "./pages/EditBill";
import EditCF from "./pages/EditCF";
import Private from './pages/Private'

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";


/* http://localhost:3000/#/ingresar the example route */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* public*/}
        <Route path="/*" element={<Login/>}/>
        <Route path="/ingresar" element={<Login/>}/>
        <Route path="/ingresar/HM" element={<Login/>}/>
        <Route path="/ingresar/DR" element={<Login/>}/>
        <Route path="/ingresar/ND" element={<Login/>}/>


        {/* private*/}
        <Route path="/principal" element={<Private> <Home/></Private>}/>

        <Route path="/facturas" element={<Private><HomeFacturas/></Private>}/> 
        <Route path="/detalles/:id" element={<Private><DetallesFactura/></Private>}/>
        <Route path="/facturas/:id" element={<Private><HomeFacturas/></Private>}/>
        <Route path="/editar/factura/:codigo_de_generacion" element={<Private><EditBill/></Private>}/>
        <Route path="/editar/CreditoFiscal/:codigo_de_generacion" element={<Private><EditCF/></Private>}/>

        <Route path="/clientes" element={<Private><ListClients/></Private>}/>
        <Route path="/items" element={<Private><ListItems/></Private>}/>
        <Route path="/agregar/cliente" element={<Private><AddClient/></Private>}/>
        <Route path="/agregar/item" element={<Private><AddItem/></Private>}/>
        <Route path="/cliente/:id" element={<Private><AddClient/></Private>}/>{/* TODO: edit  */}
        <Route path="/item/:id" element={<Private><AddItem/></Private>}/>{/* TODO: edit*/}

        <Route path="/perfil" element={<Private><Profile/></Private>}/>

        <Route path="/crear/factura" element={<Private><ClientesFacturaToFiscalProcess/></Private>}/> {/* Create FActura */}
        <Route path="/crear/creditofiscal" element={<Private><CreateCF/></Private>}/>
        <Route path="/sidebar" element={<Private><Sidebar/></Private>}/>
        

      </Routes>
      </HashRouter>
  );
}

