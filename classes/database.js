import {dependencies, singleton} from 'needlepoint';
import firebase from 'firebase';

@dependencies(Config)
@singleton
export default class Database {
  constructor(config) {
    this.config = config;

    this.configureDatabase();
  }

  configureDatabase() {
    // ... configure the database with the current configuration instance
    this.app = firebase.initializeApp({
      serviceAccount: this.config.serviceAccountPath,
      databaseURL: this.config.databaseURL
    });

    this.db = this.app.database();
  }

  create(id) {

  }

  read(id) {
    this.ref.child(id).once('value').then(function(snapshot) {
      // The Promise was "fulfilled" (it succeeded).
      return snapshot.val();
    }, function(error) {
      // The Promise was rejected.
      console.error(error);
    });

  }

  update(id) {

    this.ref.child(id).update(queryEntry, (error) => {

      if (error) {
        console.error('Data could not be saved.', error);
      } else {
        console.info('Data saved successfully.');
      }

    });

  }

  delete(id) {

  }

  sanitiseKey(query) {
    return query.replace(/[.$\[\]#\/]/g, '_');
  }

}
