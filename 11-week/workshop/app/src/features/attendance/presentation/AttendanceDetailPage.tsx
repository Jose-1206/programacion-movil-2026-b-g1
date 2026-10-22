
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  IonBackButton, IonButton, IonButtons, IonCard, IonCardContent,
  IonContent, IonHeader, IonPage, IonSkeletonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { loadAttendance, type Attendance, type Scenario } from '../data/attendance-service';

type DetailState =
  | { kind: 'loading' | 'error' | 'missing' }
  | { kind: 'ready'; record: Attendance };

export default function AttendanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<DetailState>({ kind: 'loading' });

  useEffect(() => {
    let active = true;
    const requested = new URLSearchParams(location.search).get('escenario');
    const scenario: Scenario = requested === 'error' || requested === 'vacio'
      ? requested : 'datos';
    setState({ kind: 'loading' });

    loadAttendance(scenario).then((records) => {
      if (!active) return;
      const record = records.find((item) => String(item.id) === id);
      setState(record ? { kind: 'ready', record } : { kind: 'missing' });
    }).catch(() => {
      if (active) setState({ kind: 'error' });
    });
    return () => { active = false; };
  }, [id, location.search, attempt]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/historial" text="Volver" />
          </IonButtons>
          <IonTitle>Detalle de asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding attendance-history">
        {state.kind === 'loading' && (
          <section role="status" aria-label="Cargando detalle">
            <p>Consultando asistencia...</p>
            <IonSkeletonText animated style={{ width: '70%', height: 24 }} />
            <IonSkeletonText animated style={{ width: '45%', height: 18 }} />
            <IonSkeletonText animated style={{ width: '60%', height: 18 }} />
          </section>
        )}

        {state.kind === 'error' && (
          <section role="alert">
            <h2>No se pudo consultar la asistencia</h2>
            <p>Comprueba la conexión e inténtalo otra vez.</p>
            <IonButton onClick={() => setAttempt((value) => value + 1)}>
              Reintentar
            </IonButton>
          </section>
        )}

        {state.kind === 'missing' && (
          <section role="status">
            <h2>Registro no encontrado</h2>
            <p>No hay una asistencia con el identificador {id}.</p>
            <IonButton routerLink="/tabs/historial">Volver al historial</IonButton>
          </section>
        )}

        {state.kind === 'ready' && (
          <IonCard>
            <IonCardContent>
              <h2>{state.record.courseName}</h2>
              <p>Registro: {state.record.id}</p>
              <p>Sesión: {state.record.classSessionId}</p>
              <p>Fecha: {new Date(state.record.dateTime).toLocaleString('es-CO')}</p>
              <p>Datos de demostración. Sin conexión al backend.</p>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
}
