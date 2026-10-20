import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ShopProvider } from './shop/ShopContext';
import { AccountProvider } from './account/AccountContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AccountProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </AccountProvider>
    </BrowserRouter>
  </StrictMode>,
);
