/**
 * Application entry point
 * Sets up the root React component with necessary providers
 */

import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element not found. Make sure you have a div with id="root" in your HTML.');
}

createRoot(rootElement).render(
  <HelmetProvider>
    <App />
    <Analytics />
  </HelmetProvider>
);
