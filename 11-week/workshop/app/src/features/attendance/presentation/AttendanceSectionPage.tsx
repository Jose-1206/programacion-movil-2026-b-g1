
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

interface SectionProps {
  title: string;
  description: string;
}

const AttendanceSection = ({ title, description }: SectionProps) => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <IonCard className="attendance-section">
        <IonCardContent>
          <h2>{title}</h2>
          <p>{description}</p>
          <p className="attendance-section__status">
            La conexión con el backend está pendiente.
          </p>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
);

export const AttendanceHistoryPage = () => (
  <AttendanceSection
    title="Historial de asistencias"
    description="Consulta el curso y la fecha de tus registros de asistencia."
  />
);

export const QrRegistrationPage = () => (
  <AttendanceSection
    title="Registro mediante QR"
    description="Registra tu asistencia utilizando el código de tu clase."
  />
);

export const StudentProfilePage = () => (
  <AttendanceSection
    title="Mi perfil"
    description="Consulta tu nombre, correo y rol dentro del sistema."
  />
);
