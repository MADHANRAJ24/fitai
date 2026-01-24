import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mathan.fitai.app',
  appName: 'FitAI',
  webDir: 'out',
  // server: {
  //   url: 'https://fitai-virid.vercel.app',
  //   androidScheme: 'https'
  // }
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      forceCodeForRefreshToken: true,
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#06b6d4", // Cyan
      splashFullScreen: true,
      splashImmersive: true,
    },
    AdMob: {
      appId: 'ca-app-pub-3061696204290590~8295300012',
    },
  },
};

export default config;
