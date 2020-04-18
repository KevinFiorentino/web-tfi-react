import React from 'react';
import ReactDOM from 'react-dom';

/* Import de CSS */
import './assets/css/bootstrap-v4.0.0.css';
import './assets/css/style.css';

/* Importamos componentes */
import AppClima from './components/AppClima';
import AppCiudades from './components/AppCiudades';

/* Renderizamos a la vista public/index.html los dos componentes que se construyeron */

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