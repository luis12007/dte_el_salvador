import { HashRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import HomeFacturas from './pages/HomeFacturas';
import DetallesFactura from './pages/DetallesFactura';
import AddClient from './pages/AddClient';
import ListClients from './pages/ListClients';
import Profile from './pages/Profile';
import CreateCF from './pages/CreateFiscalCredit';
import Sidebar from "./pages/Sidebar";


/* http://localhost:3000/#/ingresar the example route */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* ADD SIDEBAR ALL */}
        <Route path="/ingresar" element={<Login/>}/>
        <Route path="/principal" element={<Home/>}/>

        <Route path="/facturas" element={<HomeFacturas/>}/> 
        <Route path="/detalles/:id" element={<DetallesFactura/>}/>

        <Route path="/clientes" element={<ListClients/>}/> {/* edit */}
        <Route path="/items" element={<ListClients/>}/> {/* Edit */}
        <Route path="/agregar/cliente" element={<AddClient/>}/>
        <Route path="/agregar/item" element={<AddClient/>}/> {/* pendiente agregar de items */}
        <Route path="/cliente/:id" element={<AddClient/>}/>{/* Pendiente arreglar  */}
        <Route path="/item/:id" element={<Login/>}/>{/* Pendiente tambien */}


        <Route path="/perfil" element={<Profile/>}/>

        {/* Create Credito Fiscal in components and profile in components and clients in pages*/}
        <Route path="/crear/factura" element={<CreateCF/>}/> {/* Create FActura */}
        <Route path="/crear/creditofiscal" element={<CreateCF/>}/>
        <Route path="/sidebar" element={<Sidebar/>}/>
        

      </Routes>
    </Router>
  );
}

