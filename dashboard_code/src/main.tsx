import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import store from './store/AppStore';
import { Provider } from 'mobx-react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router basename='dashboard'>
        <App />
      </Router>
    </Provider >
  </React.StrictMode>
);
