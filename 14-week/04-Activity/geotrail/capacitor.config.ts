
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.corhuila.geotrail.week14',
  appName: 'GeoTrail',
  webDir: 'dist',

  // Development configuration for the local Android emulator.
  server: {
    cleartext: true,
  },

  android: {
    allowMixedContent: true,
  },
};

export default config;
