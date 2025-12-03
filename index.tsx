import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/index/index'; 

const container = document.getElementById('root') || document.body;
const root = createRoot(container);
root.render(<App />);
