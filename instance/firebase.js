import firebase from 'firebase';

import * as config from '../config';

// export const instance = firebase.initializeApp({ //see https://firebase.google.com/docs/reference/node/firebase.app
const instance = firebase.initializeApp({
  serviceAccount: config.serviceAccountPath,
  databaseURL: config.databaseURL
});

export const db = firebase.database();

// UTF-8 encoded, cannot contain . $ # [ ] / or ASCII control characters 0-31 or 127
// see https://www.firebase.com/docs/web/guide/understanding-data.html
export function sanitiseKey(query) {
  return query.replace(/[.$\[\]#\/]/g, '_');
}

export {firebase};

export default firebase;
