import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export interface MeasuredLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export class LocationError extends Error {
  constructor(message: string) { super(message); this.name = 'LocationError'; }
}

export async function getUserLocation(): Promise<MeasuredLocation> {
  try {
    // Web asks when getCurrentPosition() is called. Native can check/request explicitly.
    if (Capacitor.isNativePlatform()) {
      const current = await Geolocation.checkPermissions();
      if (current.location !== 'granted' && current.coarseLocation !== 'granted') {
        const updated = await Geolocation.requestPermissions({ permissions: ['location'] });
        if (updated.location !== 'granted' && updated.coarseLocation !== 'granted') {
          throw new LocationError('Location permission denied. Enable it in your device settings.');
        }
      }
    }

    const location = await Geolocation.getCurrentPosition({
  enableHighAccuracy: false,
  timeout: 60000,
  maximumAge: 10000,
});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
    };
  } catch (cause) {
    if (cause instanceof LocationError) throw cause;
    const error = cause as { code?: string | number; message?: string };
    const code = String(error?.code ?? '');
    if (['1', 'OS-PLUG-GLOC-0003', 'OS-PLUG-GLOC-0008'].includes(code)) {
      throw new LocationError('Location permission denied. Review the app permissions in Settings.');
    }
    if (['3', 'OS-PLUG-GLOC-0010'].includes(code)) {
      throw new LocationError('GPS timed out. Move outdoors or try again.');
    }
    if (['OS-PLUG-GLOC-0007', 'OS-PLUG-GLOC-0017'].includes(code)) {
      throw new LocationError('Location services are off. Turn on GPS and retry.');
    }
    throw new LocationError('Could not read GPS. Verify location services and permissions.');
  }
}
