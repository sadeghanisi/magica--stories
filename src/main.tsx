import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext';
import { FirestoreProvider } from './contexts/FirestoreContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirestoreProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </FirestoreProvider>
  </StrictMode>
);