import { HashRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Login from './pages/Login';

/* http://localhost:3000/#/ingresar the example route */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ingresar" element={<Login/>}/>
      </Routes>
    </Router>
  );
}

