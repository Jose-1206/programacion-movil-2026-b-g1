import { FormEvent, useState } from 'react';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage, IonSpinner, IonText } from '@ionic/react';
import { ApiError, login } from '../api/client';
import { useConnectivity } from '../hooks/useConnectivity';

interface Props { onLogin(token: string): void }

export function LoginPage({ onLogin }: Props) {
  const connected = useConnectivity();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(null);
    try {
      const session = await login(email.trim(), password, connected);
      onLogin(session.accessToken);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        setError('Incorrect email or password.');
      } else {
        setError(cause instanceof Error ? cause.message : 'Login failed.');
      }
    } finally { setBusy(false); }
  }

  return <IonPage>
    <IonContent fullscreen>
      <main className="login-shell">
        <div className="brand-mark" aria-hidden="true">◎</div>
        <p className="eyebrow">FIELD NOTES / WEEK 14</p>
        <h1>GeoTrail</h1>
        <p className="muted">A private field log where you decide when your location is captured.</p>
        <form className="form-card" onSubmit={(event) => { void submit(event); }}>
          <h2>Sign in</h2>
          <IonItem>
            <IonInput label="Email" labelPlacement="stacked" type="email" autocomplete="username"
              required value={email} onIonInput={(event) => setEmail(String(event.detail.value ?? ''))} />
          </IonItem>
          <IonItem>
            <IonInput label="Password" labelPlacement="stacked" type="password" autocomplete="current-password"
              required value={password} onIonInput={(event) => setPassword(String(event.detail.value ?? ''))} />
          </IonItem>
          {!connected && <IonText color="warning"><p role="status">Offline: sign-in requires a connection.</p></IonText>}
          {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
          <IonButton expand="block" type="submit" disabled={busy || !connected}>
            {busy ? <IonSpinner name="crescent" /> : 'Access my field log'}
          </IonButton>
          <IonLabel className="small-note">Demo credentials are documented in the README. No token is saved to local storage.</IonLabel>
        </form>
      </main>
    </IonContent>
  </IonPage>;
}
