import { HashRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import HomeFacturas from './pages/HomeFacturas';

/* http://localhost:3000/#/ingresar the example route */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ingresar" element={<Login/>}/>
        <Route path="/principal" element={<Home/>}/>

        <Route path="/facturas" element={<HomeFacturas/>}/>
        <Route path="/detalles/:id" element={<Login/>}/>

        <Route path="/agregar/cliente" element={<Login/>}/>
        <Route path="/agregar/item" element={<Login/>}/>
        <Route path="/cliente/:id" element={<Login/>}/>
        <Route path="/item/:id" element={<Login/>}/>


        <Route path="/perfil" element={<Login/>}/>

        {/* Create Credito Fiscal in components and profile in components and clients in pages*/}
        <Route path="/crear/factura" element={<Login/>}/>
        <Route path="/crear/creditofiscal" element={<Login/>}/>

      </Routes>
    </Router>
  );
}

