
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import AttendanceHistoryPage from './AttendanceHistoryPage';
import { loadAttendance } from '../data/attendance-service';

vi.mock('../data/attendance-service', () => ({
  loadAttendance: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

it('shows an error and requests attendance again on retry', async () => {
  const mockedLoad = vi.mocked(loadAttendance);

  mockedLoad
    .mockRejectedValueOnce(new Error('Connection failed'))
    .mockResolvedValueOnce([
      {
        id: 1,
        courseName: 'Programación Móvil',
        classSessionId: 11,
        dateTime: '2026-10-19T18:30:00',
      },
    ]);

  render(<AttendanceHistoryPage />);

  expect(
    await screen.findByText('No se pudo cargar el historial'),
  ).toBeInTheDocument();

  expect(mockedLoad).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByText('Reintentar'));

  await waitFor(() => {
    expect(mockedLoad).toHaveBeenCalledTimes(2);
  });

  expect(
    await screen.findByText('Programación Móvil'),
  ).toBeInTheDocument();
});
