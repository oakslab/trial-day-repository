import firebase from 'firebase-admin';
const credentials = require('../gcp-service-account.json');

export let firebaseAdminApp: firebase.app.App;

if (firebase.apps.length) {
  firebaseAdminApp = firebase.apps[0]!;
} else {
  firebaseAdminApp = firebase.initializeApp({
    credential: firebase.credential.cert(credentials),
  });
}
