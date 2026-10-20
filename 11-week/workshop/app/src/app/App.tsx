
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import {
  calendarOutline,
  personCircleOutline,
  qrCodeOutline,
} from 'ionicons/icons';

import AttendanceHistoryPage from '../features/attendance/presentation/AttendanceHistoryPage';

import {
  QrRegistrationPage,
  StudentProfilePage,
} from '../features/attendance/presentation/AttendanceSectionPage';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tabs/historial" component={AttendanceHistoryPage} />
          <Route exact path="/tabs/registrar" component={QrRegistrationPage} />
          <Route exact path="/tabs/perfil" component={StudentProfilePage} />
          <Route exact path="/">
            <Redirect to="/tabs/historial" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="historial" href="/tabs/historial">
            <IonIcon icon={calendarOutline} aria-hidden="true" />
            <IonLabel>Historial</IonLabel>
          </IonTabButton>
          <IonTabButton tab="registrar" href="/tabs/registrar">
            <IonIcon icon={qrCodeOutline} aria-hidden="true" />
            <IonLabel>Registrar QR</IonLabel>
          </IonTabButton>
          <IonTabButton tab="perfil" href="/tabs/perfil">
            <IonIcon icon={personCircleOutline} aria-hidden="true" />
            <IonLabel>Mi perfil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
