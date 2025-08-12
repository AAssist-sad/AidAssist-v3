import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n/config'
import './index.css';

// Initialisation des métadonnées SEO de base
const initBaseSEO = () => {
  // Viewport
  let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(viewport);
  }

  // Charset
  let charset = document.querySelector('meta[charset]') as HTMLMetaElement;
  if (!charset) {
    charset = document.createElement('meta');
    charset.setAttribute('charset', 'UTF-8');
    document.head.insertBefore(charset, document.head.firstChild);
  }

  // Description par défaut
  let description = document.querySelector('meta[name="description"]') as HTMLMetaElement;
  if (!description) {
    description = document.createElement('meta');
    description.name = 'description';
    description.content = 'AidAssist - Plateforme d\'aide aux démarches administratives';
    document.head.appendChild(description);
  }

  // Robots
  let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
  if (!robots) {
    robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'index, follow';
    document.head.appendChild(robots);
  }
};

// Initialiser le SEO de base
initBaseSEO();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
       <App />
     </BrowserRouter>
  </StrictMode>
);
