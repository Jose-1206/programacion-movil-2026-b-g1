import {
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import {
  IonApp,
  setupIonicReact
} from '@ionic/react';

import {
  IonReactRouter
} from '@ionic/react-router';

import Home from './pages/Home';
import TaskDetail from './pages/TaskDetail';

import '@ionic/react/css/core.css';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Routes>
          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/tasks/:id"
            element={<TaskDetail />}
          />

          <Route
            path="/"
            element={
              <Navigate
                to="/home"
                replace
              />
            }
          />
        </Routes>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;