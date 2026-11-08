import { useCallback, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp, IonIcon, IonLabel, IonRouterOutlet,
  IonTabBar, IonTabButton, IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { locationOutline, listOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { LoginPage } from './pages/LoginPage';
import { RecordsPage } from './pages/RecordsPage';
import { CapturePage } from './pages/CapturePage';
import { AccountPage } from './pages/AccountPage';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const clearSession = useCallback(() => setToken(null), []);

  return <IonApp>
    {token ? <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/records" render={() => <RecordsPage token={token} onUnauthorized={clearSession} />} />
          <Route exact path="/capture" render={() => <CapturePage token={token} onUnauthorized={clearSession} />} />
          <Route exact path="/account" render={() => <AccountPage onLogout={clearSession} />} />
          <Route exact path="/"><Redirect to="/records" /></Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="records" href="/records"><IonIcon icon={listOutline} /><IonLabel>Records</IonLabel></IonTabButton>
          <IonTabButton tab="capture" href="/capture"><IonIcon icon={locationOutline} /><IonLabel>GPS</IonLabel></IonTabButton>
          <IonTabButton tab="account" href="/account"><IonIcon icon={shieldCheckmarkOutline} /><IonLabel>Privacy</IonLabel></IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter> : <LoginPage onLogin={setToken} />}
  </IonApp>;
}
