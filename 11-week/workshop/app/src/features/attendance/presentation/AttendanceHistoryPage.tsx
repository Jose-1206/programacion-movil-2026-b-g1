
import { useCallback, useEffect, useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  loadAttendance,
  type Attendance,
  type Scenario,
} from '../data/attendance-service';

export default function AttendanceHistoryPage() {
  const query = new URLSearchParams(window.location.search);
  const requested = query.get('escenario');
  const scenario: Scenario =
    requested === 'error' || requested === 'vacio'
      ? requested
      : 'datos';

  const [records, setRecords] = useState<Attendance[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const result = await loadAttendance(scenario);
      setRecords(result);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [scenario]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Historial de asistencias</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {status === 'loading' && (
          <section aria-label="Cargando asistencias">
            <p>Consultando registros...</p>
            {[1, 2, 3].map((row) => (
              <IonCard key={row}>
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: '75%', height: 22 }} />
                  <IonSkeletonText animated style={{ width: '55%', height: 16 }} />
                  <IonSkeletonText animated style={{ width: '40%', height: 16 }} />
                </IonCardContent>
              </IonCard>
            ))}
          </section>
        )}

        {status === 'error' && (
          <section role="alert">
            <h2>No se pudo cargar el historial</h2>
            <p>Revisa tu conexión e intenta nuevamente.</p>
            <IonButton onClick={() => void reload()}>
              Reintentar
            </IonButton>
          </section>
        )}

        {status === 'ready' && records.length === 0 && (
          <section>
            <h2>Aún no tienes asistencias registradas</h2>
            <p>Cuando registres una asistencia aparecerá aquí.</p>
            <IonButton routerLink="/tabs/registrar">
              Registrar QR
            </IonButton>
          </section>
        )}

        {status === 'ready' && records.map((record) => (
          <IonCard key={record.id}>
            <IonCardContent>
              <h2>{record.courseName}</h2>
              <p>Sesión: {record.classSessionId}</p>
              <p>
                Fecha: {new Date(record.dateTime).toLocaleString('es-CO')}
              </p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
}
