import {dependencies, singleton} from 'needlepoint';

import firebase, {db, sanitiseKey} from '../instances/firebase';

import {SemanticWeb} from './SemanticWeb';

@dependencies(SemanticWeb)
export default class IngredientQueries {

  static ref = db.ref('queries/ingredients');

  constructor(semanticWeb) {
    this.semanticWeb = semanticWeb;
    console.log('semanticWeb', semanticWeb);
    this.key = sanitiseKey(query);
  }

  save(query) {

    this.query = query;

    let queryEntry = {
      kgid: this.data.result['@id'],
      resultScore: this.data.resultScore,
      updated: firebase.database.ServerValue.TIMESTAMP
    };

    ref.child(this.key).once('value', (snapshot) => {

      ref.child(this.key).update(queryEntry, (error) => {

        if (error) {
          console.error('Data could not be saved.', error);
        } else {
          console.info('Data saved successfully.');
        }

      });

    }, (error) => {
      ref.child(this.key).push().set(queryEntry, (error) => {

        if (error) {
          console.error('Data could not be saved.', error);
        } else {
          console.info('Data saved successfully.');
        }

      });

    });

  }

}
