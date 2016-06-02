import firebase, {db, sanitise} from './modules/firebase';
import {search} from './modules/google-kgsearch';
import {mediawiki} from './modules/nodemw';

import * as config from './modules/config';

// Run this code on a user query if no
// match is found in the Firebase data.

// Run this code on a user query the match
// found in the Firebase data is stale.

// Run this code as a cron job that returns all stale
// data in the Firebase data

// If the description field value is not in the descriptions array then check the detailedDescription field value for key words such as 'dish', 'sauce', etc.
// Should we use the values in the descritions descriptions array?

// How do we populate all of the levels of the taxonomy?  "Instance of" Triples?

class SemanticWeb {
  constructor(query) {
    this.query = query;

    this.knowledgeGraphParameters = {
      query,
      types: 'Thing',
      limit: 10
    };

  }

  static knowledgeGraph() {
    let knowledgeGraphParameters = this.knowledgeGraphParameters;

    search(knowledgeGraphParameters, (error, items) => {
      if (error) {
        console.error('error', error);
        return;
      }

      if (items && items.length) {

        for (let item of items) {
          let acceptItem = false;

          let types = item.result['@type'];

          for (let type of types) {

            if (type === 'Thing') {

              if (item.result.description && (config.descriptionsAccepted.indexOf(item.result.description) >= 0) && (config.descriptionsRejected.indexOf(item.result.description) === -1)) {
                acceptItem = true;
              }

            } else {

              if ((config.typesAccepted.indexOf(type) >= 0) && (config.typesRejected.indexOf(type) === -1)) {
                acceptItem = true;
              }

            }

          }

          if (acceptItem === true) {
            // this.wikiData();
            // this.save();
          }

        }

      } else {
        console.log(`No results for "${this.query}"`);
      }

    });

  }

  static wikiData() {
    mediawiki.search(query, (error, results) => {
    	// console.log('Search results:', results);

      if (results && results.length) {

        mediawiki.getArticle(results[0].title, function(error, data) {
          if (error) {
            console.error(error);
            return;
          }

          if (data && data.length) {

            mediawiki.parse(data, results[0].title, function(error, html, images) {
            	if (error) {
            		console.error(error);
            		return;
            	}

              // item.result.images = images;
              // item.result.wiki = html;

            	// console.log('HTML', html);
            	// console.log('Images', images);

              console.log('item', item);
              return item;
            });

          }

        });

      }

    });

  }

}

class IngredientSearch {
  constructor(query, data) {
    this.query = query;

    this.data = data;

    this.key = sanitise(query);

    this.ref = db.ref('queries');
  }

  static save() {

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

class IngredientDetails {
  constructor(query, data) {
    this.query = query;

    this.data = data;

    this.key = sanitise(this.data.result.name);

    this.ref = db.ref('ingredients');
  }

  static save() {
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

const query = 'Oranges';

const semanticWeb = new SemanticWeb(query);

let knowledgeGraph = semanticWeb.knowledgeGraph();
// let wikiData = semanticWeb.wikiData();

// console.log('knowledgeGraph', knowledgeGraph);
// console.log('wikiData', wikiData);

const ingredientSearch = new IngredientSearch(query, knowledgeGraph);
const ingredientDetails = new IngredientDetails(query, knowledgeGraph);
//
// ingredientSearch.save()
// ingredientDetails.save();
