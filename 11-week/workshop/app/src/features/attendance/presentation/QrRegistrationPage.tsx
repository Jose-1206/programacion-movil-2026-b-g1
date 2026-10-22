
import { useState, type FormEvent } from 'react';
import {
  IonAlert, IonButton, IonContent, IonHeader, IonInput, IonItem,
  IonNote, IonPage, IonSpinner, IonTitle, IonToast, IonToolbar,
} from '@ionic/react';

type Feedback = { message: string; color: 'success' | 'danger' };

async function validateDemoCode(code: string): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 1200));
  if (code === 'ERROR-DEMO') {
    throw new Error('Simulated request failure');
  }
}

export default function QrRegistrationPage() {
  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const invalid = code.trim().length === 0;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (invalid || sending) return;

    setSending(true);
    try {
      await validateDemoCode(code.trim());
      setFeedback({
        color: 'success',
        message: 'Simulación completada. No se registró asistencia real.',
      });
      setCode('');
      setTouched(false);
    } catch {
      setFeedback({
        color: 'danger',
        message: 'No se pudo validar el código. Intenta nuevamente.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Registro con QR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding attendance-registration">
        <h2>Ingresar código de la clase</h2>
        <p>
          Introduce el código generado por el profesor. Este formulario
          funciona en modo demostración, sin guardar asistencias reales.
        </p>
        <form onSubmit={(event) => void submit(event)} noValidate>
          <IonItem>
            <IonInput
              label="Código del QR"
              labelPlacement="stacked"
              aria-label="Código QR de la sesión"
              value={code}
              onIonInput={(event) => setCode(event.detail.value ?? '')}
              onIonBlur={() => setTouched(true)}
              disabled={sending}
              required
            />
          </IonItem>
          {touched && invalid && (
            <IonNote color="danger" role="alert">
              Ingresa el código de la sesión para continuar.
            </IonNote>
          )}
          <IonButton
            expand="block"
            type="submit"
            disabled={invalid || sending}
          >
            {sending ? (
              <>
                <IonSpinner name="crescent" aria-hidden="true" />
                Validando...
              </>
            ) : 'Validar código'}
          </IonButton>
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => setConfirmDiscard(true)}
            disabled={!code || sending}
          >
            Cancelar registro
          </IonButton>
        </form>
        <IonAlert
          isOpen={confirmDiscard}
          onDidDismiss={() => setConfirmDiscard(false)}
          header="¿Descartar el código escrito?"
          message="Perderás el texto que ingresaste."
          buttons={[
            { text: 'Seguir editando', role: 'cancel' },
            {
              text: 'Descartar',
              role: 'destructive',
              handler: () => { setCode(''); setTouched(false); },
            },
          ]}
        />
        <IonToast
          isOpen={feedback !== null}
          onDidDismiss={() => setFeedback(null)}
          message={feedback?.message}
          color={feedback?.color}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
}
