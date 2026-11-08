import { useState } from 'react';
import {
  IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage,
  IonSpinner, IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { ApiError, saveCheckpoint } from '../api/client';
import { useConnectivity } from '../hooks/useConnectivity';
import { getUserLocation, MeasuredLocation } from '../services/location';

interface Props { token: string; onUnauthorized(): void }

export function CapturePage({ token, onUnauthorized }: Props) {
  const connected = useConnectivity();
  const [label, setLabel] = useState('');
  const [location, setLocation] = useState<MeasuredLocation | null>(null);
  const [busyGPS, setBusyGPS] = useState(false);
  const [busySave, setBusySave] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function capture() {
    setBusyGPS(true); setError(null); setSaved(false); setLocation(null);
    try { setLocation(await getUserLocation()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'GPS failed.'); }
    finally { setBusyGPS(false); }
  }

  async function save() {
    if (!location || !label.trim()) { setError('Add a name and capture GPS first.'); return; }
    setBusySave(true); setError(null);
    try {
      await saveCheckpoint(token, { label: label.trim(), ...location }, connected);
      setSaved(true); setLocation(null); setLabel('');
    } catch (cause) {
      if (cause instanceof ApiError && cause.kind === 'unauthorized') { onUnauthorized(); return; }
      setError(cause instanceof Error ? cause.message : 'Could not save.');
    } finally { setBusySave(false); }
  }

  return <IonPage>
    <IonHeader><IonToolbar><IonTitle>GPS capture</IonTitle></IonToolbar></IonHeader>
    <IonContent>
      <main className="content-shell">
        <div className="page-intro">
          <p className="eyebrow">EXPLICIT CONSENT / HARDWARE</p>
          <h1>New checkpoint</h1>
          <p className="muted">Your location is requested only when you press the GPS button. It is not sent to the API until you choose Save.</p>
        </div>
        <section className="form-card" aria-label="Location capture form">
          <h2>1. Describe the place</h2>
          <IonItem>
            <IonInput label="Checkpoint name" labelPlacement="stacked" placeholder="e.g. Library north entrance"
              maxlength={80} value={label} onIonInput={(event) => setLabel(String(event.detail.value ?? ''))} />
          </IonItem>
          <h2>2. Read your location</h2>
          <p className="muted">A permission dialog may appear. If denied, enable location in system settings and retry.</p>
          <IonButton expand="block" fill="outline" disabled={busyGPS} onClick={() => { void capture(); }}>
            {busyGPS ? <IonSpinner name="crescent" /> : 'Ask permission & get GPS'}
          </IonButton>
          {location && <div className="location-preview" role="status">
            <strong>Location ready (not yet uploaded)</strong>
            <div className="coordinates"><span>Lat {location.latitude.toFixed(5)}°</span><span>Lng {location.longitude.toFixed(5)}°</span></div>
            <p className="small-note">Estimated accuracy: {Math.round(location.accuracy)} meters</p>
          </div>}
          <h2>3. Save securely</h2>
          {!connected && <p className="offline-banner" role="status">Offline: GPS may still work, but uploading requires internet/API connectivity.</p>}
          <IonButton expand="block" disabled={!connected || !location || !label.trim() || busySave} onClick={() => { void save(); }}>
            {busySave ? <IonSpinner name="crescent"/> : 'Save via protected API'}
          </IonButton>
          {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
          {saved && <div className="success-note" role="status">
            <strong>Checkpoint saved.</strong> You can see it in your private log.
            <IonButton size="small" fill="clear" routerLink="/records">View records</IonButton>
          </div>}
        </section>
      </main>
    </IonContent>
  </IonPage>;
}
