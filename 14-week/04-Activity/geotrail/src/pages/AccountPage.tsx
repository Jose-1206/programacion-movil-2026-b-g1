import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useConnectivity } from '../hooks/useConnectivity';

export function AccountPage({ onLogout }: { onLogout(): void }) {
  const connected = useConnectivity();
  return <IonPage>
    <IonHeader><IonToolbar><IonTitle>Session & privacy</IonTitle></IonToolbar></IonHeader>
    <IonContent>
      <main className="content-shell">
        <div className="page-intro"><p className="eyebrow">TRUST / CONNECTIVITY</p><h1>Privacy controls</h1></div>
        <div className="form-card">
          <h2>Session</h2>
          <p>Authenticated. The short-lived JWT is held only in memory, never shown on this screen or stored in localStorage.</p>
          <h2>Network</h2>
          <p role="status" className={connected ? 'connected-tag' : 'offline-banner'}>
            {connected ? 'Network connection available' : 'No network connection'}
          </p>
          <h2>Location</h2>
          <p>We request location on demand only. GPS capture and server upload are separate actions. Checkpoint data is retained in the demo server memory until it restarts.</p>
          <IonButton color="medium" expand="block" onClick={onLogout}>Sign out & discard token</IonButton>
        </div>
      </main>
    </IonContent>
  </IonPage>;
}
