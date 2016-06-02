import firebase from 'firebase';

const serviceAccountPath = '/Users/karl/Library/Mobile Documents/com~apple~CloudDocs/Credentials/Google/gatherer@cookadlib-2016.iam.gserviceaccount.com/cookadlib-c1b63c8b161c.json';

const app = firebase.initializeApp({
  serviceAccount: serviceAccountPath,
  databaseURL: 'https://cookadlib-2016.firebaseio.com/'
});

export const db = firebase.database();

export default app;
