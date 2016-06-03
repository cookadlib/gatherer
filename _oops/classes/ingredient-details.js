import {dependencies, singleton} from 'needlepoint';

import {db, sanitiseKey} from '../instances/firebase';

import {SemanticWeb} from './SemanticWeb';

@dependencies(SemanticWeb)
export default class IngredientDetails {

  static ref = db.ref('ingredients');

  constructor(semanticWeb) {
    this.semanticWeb = semanticWeb;
    console.log('semanticWeb', semanticWeb);
    this.key = sanitiseKey(this.data.result.name);
  }

  save(query) {

    this.query = query;

    if (this.data.result.description && this.data.result.description.length) {
      this.data.result.category = this.data.result.description;
    }

    ingredientsRef.child(this.key).once('value', (snapshot) => {

      ingredientsRef.child(this.key).update(this.data.result, (error) => {

        if (error) {
          console.error('Data could not be saved.', error);
        } else {
          console.info('Data saved successfully.');
        }

      });

    }, (error) => {
      ingredientsRef.child(this.key).push().set(this.data.result, (error) => {

        if (error) {
          console.error('Data could not be saved.', error);
        } else {
          console.info('Data saved successfully.');
        }

      });

    });

  }

}
