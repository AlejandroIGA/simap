import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './views/LandingPage.jsx';
import Paypal from './components/Paypal';
import Cultivos from './views/Cultivos';
import Cuenta from './views/Cuenta';
import Inicio from './views/Inicio';
import Dispositivos from './views/Dispositivos';
import Registro from './views/Registro';
import Login from './views/Login';
import MainAdmin from './views/mainAdmin';
import MainAdminFree from './views/mainAdminFree';
import PaypalWeb from './components/PaypalWeb';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />}></Route>
        <Route path='/paypal' element={<Paypal />}></Route>
        <Route path='/paypalWeb' element={<PaypalWeb />}></Route>
        <Route path='/cultivos' element={<Cultivos />}></Route>
        <Route path='/cuenta' element={<Cuenta />}></Route>
        <Route path='/inicio' element={<Inicio />}></Route>
        <Route path='/dispositivos' element={<Dispositivos />}></Route>
        <Route path='/registro' element={<Registro />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/mainAdmin' element={<MainAdmin />}></Route>
        <Route path='/mainAdminFree' element={<MainAdminFree />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
