import React, { useEffect, useState } from 'react';

// Extend the Window event type for beforeinstallprompt
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }
}

const InstallPrompt: React.FC = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onBIP = (e: Event) => {
      // prevent mini-infobar on mobile
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBIP as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', onBIP as EventListener);
  }, []);

  useEffect(() => {
    const onInstalled = () => setVisible(false);
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } finally {
      setDeferred(null);
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16, right: 16, padding: 12, background: '#111', color: '#fff', borderRadius: 8, zIndex: 2000 }}>
      <div style={{ marginBottom: 8 }}>Install this app for a better experience.</div>
      <button onClick={handleInstall} style={{ padding: '8px 12px' }}>Install</button>
    </div>
  );
};

export default InstallPrompt;