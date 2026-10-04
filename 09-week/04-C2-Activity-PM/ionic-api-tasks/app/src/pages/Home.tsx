import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { createTask, getTasks } from '../services/taskApi';
import type { Task } from '../types/Task';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getTasks();
      setTasks(data);
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

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Please complete all fields.');
      return;
    }

    try {
      setCreating(true);
      setError('');

      const newTask = await createTask({
        title,
        description
      });

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask
      ]);

      setTitle('');
      setDescription('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Manager</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Create Task</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <form onSubmit={handleCreateTask}>
              <IonInput
                label="Title"
                labelPlacement="stacked"
                fill="outline"
                placeholder="Enter task title"
                value={title}
                onIonInput={(event) =>
                  setTitle(String(event.detail.value ?? ''))
                }
              />

              <br />

              <IonTextarea
                label="Description"
                labelPlacement="stacked"
                fill="outline"
                placeholder="Enter task description"
                value={description}
                autoGrow
                onIonInput={(event) =>
                  setDescription(String(event.detail.value ?? ''))
                }
              />

              <br />

              <IonButton
                expand="block"
                type="submit"
                disabled={creating}
              >
                {creating ? (
                  <IonSpinner name="crescent" />
                ) : (
                  'Create Task'
                )}
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>

        {error && (
          <IonText color="danger">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </IonText>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Tasks</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {loading ? (
              <div className="ion-text-center">
                <IonSpinner />
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <p>No tasks available.</p>
            ) : (
              <IonList>
                {tasks.map((task) => (
                  <IonItem
                    key={task.id}
                    routerLink={`/tasks/${task.id}`}
                    detail
                  >
                    <IonLabel>
                      <h2>{task.title}</h2>
                      <p>{task.description}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;