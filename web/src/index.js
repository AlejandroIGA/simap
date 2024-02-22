import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';
import './style.css';
import App from './App';

import reportWebVitals from './reportWebVitals';
import Paypal from './components/Paypal';
import Cultivos from './views/Cultivos';
import Cuenta from './views/Cuenta';
import Inicio from './views/Inicio';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}></Route>
        <Route path='/paypalMovil' element={<Paypal />}></Route>
        <Route path='/cultivos' element={<Cultivos />}></Route>
        <Route path='/cuenta' element={<Cuenta />}></Route>
        <Route path='/inicio' element={<Inicio />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
