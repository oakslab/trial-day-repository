import { initializeApp } from '@firebase/app';
import firebaseConfigJson from '../firebase-config.json';

export const firebaseClientApp = initializeApp(firebaseConfigJson);
