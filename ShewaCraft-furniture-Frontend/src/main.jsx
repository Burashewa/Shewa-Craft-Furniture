import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CatalogProvider } from './context/CatalogContext.jsx';
import { ShopProvider } from './context/ShopContext.jsx';
import { ChatSocketProvider } from './context/ChatSocketContext.jsx';
import { MessagesProvider } from './context/MessagesContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatSocketProvider>
        <CatalogProvider>
          <ShopProvider>
            <MessagesProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </MessagesProvider>
          </ShopProvider>
        </CatalogProvider>
      </ChatSocketProvider>
    </AuthProvider>
  </BrowserRouter>
);
