import firebase from 'firebase';

import * as config from './config';

export const app = firebase.initializeApp({
  serviceAccount: config.serviceAccountPath,
  databaseURL: config.databaseURL
});

export const db = firebase.database();

export function sanitise(query) {
  // UTF-8 encoded, cannot contain . $ # [ ] / or ASCII control characters 0-31 or 127
  // see https://www.firebase.com/docs/web/guide/understanding-data.html
  if (query) {
    return query.replace(/[.$\[\]#\/]/g, '_');
  }

}

export default firebase;
