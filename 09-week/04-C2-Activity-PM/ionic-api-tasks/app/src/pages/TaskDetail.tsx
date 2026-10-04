import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getTaskById } from '../services/taskApi';
import type { Task } from '../types/Task';

const TaskDetail: React.FC = () => {
  const { id } = useParams<'id'>();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        setError('');

        if (!id) {
          throw new Error('Invalid task ID');
        }

        const data = await getTaskById(id);

        setTask(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>

          <IonTitle>Task Detail</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && (
          <div className="ion-text-center">
            <IonSpinner />
            <p>Loading task...</p>
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </IonText>
        )}

        {!loading && task && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{task.title}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>
                <strong>ID:</strong> {task.id}
              </p>

              <p>
                <strong>Description:</strong>
              </p>

              <p>{task.description}</p>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TaskDetail;