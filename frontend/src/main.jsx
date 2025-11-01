// Enable additional React checks and warnings in development mode
import { StrictMode } from 'react';

// React API for rendering to the DOM in modern React (v18+)
import { createRoot } from 'react-dom/client';

// Global styles (Tailwind + base CSS)
import './index.css';

// Main application component
import App from './App.jsx';

/**
 * Entry point for the React application.
 *
 * - Finds the root DOM element
 * - Creates a React rendering root
 * - Wraps the app in <StrictMode> to catch potential issues in development
 * - Renders the App component into the DOM
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
