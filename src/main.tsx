// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. 라우터 import
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter> {/* 2. App을 BrowserRouter로 감싸기 */}
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
    