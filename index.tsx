
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/app.jsx';
import Index from './src/pages/index/index.jsx';

const container = document.getElementById('root') || document.body;
const root = createRoot(container);

root.render(
  <App>
    <Index />
  </App>
);
