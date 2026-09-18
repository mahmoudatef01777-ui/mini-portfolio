import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from '@/i18n/lang';
import { RouteProvider } from '@/lib/router';
import App from '@/App';
import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <RouteProvider>
        <App />
      </RouteProvider>
    </LanguageProvider>
  </StrictMode>,
);
