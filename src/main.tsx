import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Fonts — import only the weights actually used (latin subset).
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/utilities.css';
import './styles/components.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
