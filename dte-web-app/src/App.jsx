import React from 'react';
import Login from './pages/Logins';
import Login_LH from './pages/Logins_LH';
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
import Invalidate from './pages/Invalidate'
import Testbill from './pages/testbill';
import TestCF from './pages/TestCF';
import CreateSubEx from './pages/CreateSubEx';
import EditSujEx from './pages/EditSujEx';
import CreateNC from './pages/CreateNC';
import EditNC from './pages/EditNC';

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateND from './pages/CreateND';
import EditND from './pages/EditND';
import BooksComponent from './components/BooksComponent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateCR from './pages/CreateCR';
import CreateCI from './pages/CreateCI';
import DownloadDTEs from './pages/DownloadDTEs';

/* http://localhost:3000/#/ingresar the example route */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* public*/}
        <Route path="/*" element={<Login/>}/>
        <Route path="/ingresar" element={<Login/>}/>
        <Route path="/ingresar/LH" element={<Login_LH/>}/>
        <Route path="/ingresar/HM" element={<Login/>}/>
        <Route path="/ingresar/DR" element={<Login/>}/>
        <Route path="/ingresar/ND" element={<Login/>}/>
        

        {/* private*/}
        <Route path="/principal" element={<Private> <Home/></Private>}/>

        <Route path="/facturas" element={<Private><HomeFacturas/></Private>}/> 

{/* BILL AND CF */}
        <Route path="/crear/factura" element={<Private><ClientesFacturaToFiscalProcess/></Private>}/> 
        <Route path="/crear/creditofiscal" element={<Private><CreateCF/></Private>}/>

        <Route path="/editar/factura/:codigo_de_generacion" element={<Private><EditBill/></Private>}/>
        <Route path="/editar/CreditoFiscal/:codigo_de_generacion" element={<Private><EditCF/></Private>}/>

{/* Others */}
        <Route path="/crear/sujeto_excluido" element={<Private><CreateSubEx/></Private>}/> 
        <Route path="/crear/Comprobante_Retencion" element={<Private><CreateCR/></Private>}/> 
        <Route path="/crear/nota_credito" element={<Private><CreateNC/></Private>}/> 
        <Route path="/crear/Nota_debito" element={<Private><CreateND/></Private>}/> 
        <Route path="/crear/Comprobante_Liquidacion" element={<Private><CreateCI/></Private>}/> 

        <Route path="/editar/sujEx/:codigo_de_generacion" element={<Private><EditSujEx/></Private>}/>
        <Route path="/editar/NC/:codigo_de_generacion" element={<Private><EditNC/></Private>}/>
        <Route path="/editar/ND/:codigo_de_generacion" element={<Private><EditND/></Private>}/>


{/* Books */}
        <Route path="/facturas/libros" element={<Private><BooksComponent/></Private>}/> 



        <Route path="/clientes" element={<Private><ListClients/></Private>}/>
        <Route path="/agregar/cliente" element={<Private><AddClient/></Private>}/>


        <Route path="/invalidar" element={<Private><Invalidate/></Private>}/> 
        <Route path="/descargar-dtes" element={<Private><DownloadDTEs/></Private>}/> 

        <Route path="/perfil" element={<Private><Profile/></Private>}/>

        <Route path="/sidebar" element={<Private><Sidebar/></Private>}/>

        <Route path="/detalles/:id" element={<Private><DetallesFactura/></Private>}/>
        <Route path="/facturas/:id" element={<Private><HomeFacturas/></Private>}/>
        <Route path="/items" element={<Private><ListItems/></Private>}/>
        <Route path="/agregar/item" element={<Private><AddItem/></Private>}/>
        <Route path="/cliente/:id" element={<Private><AddClient/></Private>}/>{/* TODO: edit  */}
        <Route path="/item/:id" element={<Private><AddItem/></Private>}/>{/* TODO: edit*/}

        <Route path="/testadmin/sendfacturas" element={<Private><Testbill/></Private>}/>
        <Route path="/testadmin/sendCF" element={<Private><TestCF/></Private>}/>

      </Routes>
      </HashRouter>
  );
}

