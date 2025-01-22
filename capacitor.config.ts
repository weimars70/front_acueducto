import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.weimar.acueductos',
  appName: 'weimar-acueductos',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    CapacitorSQLite: {
      iosKeepAspectRatio: true
    }
  }
};

export default config;