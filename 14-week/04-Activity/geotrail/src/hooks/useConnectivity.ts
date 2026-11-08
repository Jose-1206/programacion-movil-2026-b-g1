import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';
import type { PluginListenerHandle } from '@capacitor/core';

export function useConnectivity(): boolean {
  const [connected, setConnected] = useState(() => navigator.onLine);

  useEffect(() => {
    let mounted = true;
    let listener: PluginListenerHandle | undefined;

    void Network.getStatus().then((status) => {
      if (mounted) setConnected(status.connected);
    }).catch(() => {});

    void Network.addListener('networkStatusChange', ({ connected: next }) => {
      if (mounted) setConnected(next);
    }).then((handle) => {
      if (mounted) listener = handle;
      else void handle.remove();
    }).catch(() => {});

    // Browser fallback for environments without native Network events.
    const online = () => setConnected(true);
    const offline = () => setConnected(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);

    return () => {
      mounted = false;
      void listener?.remove();
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);

  return connected;
}
