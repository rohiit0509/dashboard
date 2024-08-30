import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { ConfigProvider } from 'antd';

const popupConfig = (node: HTMLElement | undefined) => {
  if (node) return node.parentNode as HTMLElement;
  return document.body;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#7F56D9' },
      }}
      getPopupContainer={popupConfig}
    >
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </React.StrictMode>,
);
