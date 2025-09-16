
import React, { useEffect, useState } from 'react';
import AppRouter from './routes';
import './App.css';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setShowInstall(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="app">
      <AppRouter />
      {showInstall && (
        <button
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            padding: '1em 2em',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontSize: '1rem',
          }}
          onClick={handleInstallClick}
        >
          Install App
        </button>
      )}
    </div>
  );
}

export default App;
