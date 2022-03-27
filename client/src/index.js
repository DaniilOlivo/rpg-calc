import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ModalError from "./components/ModalError"

ReactDOM.render(
  <React.StrictMode>
    <ModalError>
      <App />
    </ModalError>
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals();
