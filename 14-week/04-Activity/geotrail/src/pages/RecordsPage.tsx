import { useCallback, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon,
  IonPage, IonSpinner, IonText, IonTitle, IonToolbar, useIonViewWillEnter,
} from '@ionic/react';
import { locationOutline, refreshOutline } from 'ionicons/icons';
import { ApiError, Checkpoint, getCheckpoints } from '../api/client';
import { useConnectivity } from '../hooks/useConnectivity';

type View = { state: 'loading' } | { state: 'data'; items: Checkpoint[] } | { state: 'error'; message: string };
interface Props { token: string; onUnauthorized(): void }

export function RecordsPage({ token, onUnauthorized }: Props) {
  const connected = useConnectivity();
  const [view, setView] = useState<View>({ state: 'loading' });

  const load = useCallback(async () => {
    setView({ state: 'loading' });
    try {
      const items = await getCheckpoints(token, connected);
      setView({ state: 'data', items });
    } catch (cause) {
      if (cause instanceof ApiError && cause.kind === 'unauthorized') {
        onUnauthorized();
        return;
      }
      setView({ state: 'error', message: cause instanceof Error ? cause.message : 'Unknown error.' });
    }
  }, [connected, onUnauthorized, token]);

  useIonViewWillEnter(() => { void load(); }, [load]);

  return <IonPage>
    <IonHeader><IonToolbar><IonTitle>Field log</IonTitle></IonToolbar></IonHeader>
    <IonContent>
      <main className="content-shell">
        <div className="page-intro">
          <p className="eyebrow">PROTECTED API / YOUR CHECKPOINTS</p>
          <h1>Recorded places</h1>
          <p className="muted">Only your authenticated session can read these records.</p>
          {!connected && <p className="offline-banner" role="status">No connection. Saved server records cannot be loaded.</p>}
        </div>
        {view.state === 'loading' && <div className="state-panel" role="status">
          <IonSpinner name="crescent" /><h2>Loading checkpoints</h2><p>Checking your private records…</p>
        </div>}
        {view.state === 'error' && <div className="state-panel" role="alert">
          <h2>Could not load records</h2><p>{view.message}</p>
          <IonButton onClick={() => { void load(); }}><IonIcon icon={refreshOutline} slot="start"/>Retry</IonButton>
        </div>}
        {view.state === 'data' && (view.items.length === 0 ? <div className="state-panel">
          <IonIcon icon={locationOutline} className="large-icon" />
          <h2>No checkpoints yet</h2><p>Visit the GPS tab to record your first location.</p>
          <IonButton routerLink="/capture">Capture a checkpoint</IonButton>
        </div> : <div aria-live="polite" className="card-list">
          <div className="section-header"><h2>{view.items.length} checkpoint{view.items.length === 1 ? '' : 's'}</h2>
            <IonButton fill="outline" size="small" onClick={() => { void load(); }}>Refresh</IonButton></div>
          {view.items.map((item) => <IonCard key={item.id} className="checkpoint-card">
            <IonCardContent>
              <div className="checkpoint-heading"><strong>{item.label}</strong><IonIcon icon={locationOutline}/></div>
              <IonText color="medium"><p>{new Date(item.createdAt).toLocaleString()}</p></IonText>
              <div className="coordinates"><span>Lat: {item.latitude.toFixed(5)}</span><span>Lng: {item.longitude.toFixed(5)}</span></div>
              <p className="small-note">Accuracy: about {Math.round(item.accuracy)} m</p>
            </IonCardContent>
          </IonCard>)}
        </div>)}
      </main>
    </IonContent>
  </IonPage>;
}
