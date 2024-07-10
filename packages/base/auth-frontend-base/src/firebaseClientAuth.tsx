import {
  initializeAuth,
  browserLocalPersistence,
  connectAuthEmulator,
  ReactNativeAsyncStorage,
  Auth,
} from '@firebase/auth';
import { firebaseClientApp } from './firebaseClientApp';
import { unstable_getReactNativePersistence } from './unstable_getReactNativePersistence';

export class FirebaseAuth {
  static auth: Auth;

  constructor(storage?: ReactNativeAsyncStorage, hostUrl?: string) {
    if (!FirebaseAuth.auth) {
      FirebaseAuth.auth = this.initializeAuth(storage, hostUrl);
    }
  }

  private initializeAuth(storage?: ReactNativeAsyncStorage, hostUrl?: string) {
    const clientAuth = initializeAuth(firebaseClientApp, {
      persistence: storage
        ? unstable_getReactNativePersistence(storage)
        : browserLocalPersistence,
    });

    const url =
      storage && hostUrl
        ? this.structureUrl(hostUrl)
        : process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

    if (url) connectAuthEmulator(clientAuth, url, { disableWarnings: true });

    return clientAuth;
  }

  private structureUrl(hostUrl: string) {
    return (
      'http://' +
      hostUrl
        .split(`:`)
        .shift()
        ?.concat(`:${process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT}`)
    );
  }
}
