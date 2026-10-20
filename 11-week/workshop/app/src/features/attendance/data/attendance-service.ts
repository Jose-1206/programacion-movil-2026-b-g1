
export interface Attendance {
  id: number;
  courseName: string;
  classSessionId: number;
  dateTime: string;
}

export type Scenario = 'datos' | 'vacio' | 'error';

const demoRecords: Attendance[] = [
  {
    id: 1,
    courseName: 'Programación Móvil',
    classSessionId: 11,
    dateTime: '2026-10-19T18:30:00',
  },
  {
    id: 2,
    courseName: 'Desarrollo Fullstack',
    classSessionId: 8,
    dateTime: '2026-10-16T10:00:00',
  },
];

export async function loadAttendance(
  scenario: Scenario = 'datos',
  delay = 1000,
): Promise<Attendance[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, delay));

  if (scenario === 'error') {
    throw new Error('No se pudo consultar el historial.');
  }

  return scenario === 'vacio' ? [] : demoRecords;
}
