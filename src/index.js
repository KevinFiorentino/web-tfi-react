import React from 'react';
import ReactDOM from 'react-dom';

import './assets/css/bootstrap-v4.0.0.css';
import './assets/css/style.css';

import AppClima from './components/AppClima';
import AppCiudades from './components/AppCiudades';

ReactDOM.render(
  <React.StrictMode>
    <AppClima />
  </React.StrictMode>,
  document.getElementById('AppClima')
);

ReactDOM.render(
  <React.StrictMode>
    <AppCiudades />
  </React.StrictMode>,
  document.getElementById('AppCiudades')
);