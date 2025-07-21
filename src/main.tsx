import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryProvider } from './lib/QueryProvider';
import App from './App.tsx';
import { store } from './store';
import './index.css';
import './styles/theme-enhancements.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryProvider>
  </React.StrictMode>,
);
