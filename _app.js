import firebase, {db, sanitiseKey} from './instances/firebase';
import {search} from './instances/google-kgsearch';
import {mediawiki} from './instances/nodemw';

import * as config from './config';

// Run this code on a user query if no
// match is found in the Firebase data.

// Run this code on a user query the match
// found in the Firebase data is stale.

// Run this code as a cron job that returns all stale
// data in the Firebase data

// If the description field value is not in the descriptions array then check the detailedDescription field value for key words such as 'dish', 'sauce', etc.
// Should we use the values in the descritions descriptions array?

// How do we populate all of the levels of the taxonomy?  "Instance of" Triples?

const dishRef = db.ref('dish');
const ingredientRef = db.ref('ingredient');
const nutrientRef = db.ref('nutrient');
const queryRef = db.ref('query');
const recipeRef = db.ref('recipe');
const userRef = db.ref('user');

const query = 'Oranges';

const params = {
  query,
  types: 'Thing',
  limit: 10
};

function getWikiData(item) {
  mediawiki.search(query, (error, results) => {
  	// console.log('Search results:', results);

    if (results && results.length) {

      mediawiki.getArticle(results[0].title, function(error, data) {
        if (error) {
          console.error(error);

          saveIngredient(item);

          return;
        }

        if (data && data.length) {

          mediawiki.parse(data, results[0].title, function(error, html, images) {
          	if (error) {
          		console.error(error);

              saveIngredient(item);

          		return;
          	}

            // item.result.images = images;
            // item.result.wiki = html;

          	// console.log('HTML', html);
          	// console.log('Images', images);

            console.log('item', item);

            saveIngredient(item);
          });

        } else {
          saveIngredient(item);
        }

      });

    } else {
      saveIngredient(item);
    }

  });

  // mediawiki.getArticleCategories(query, function(error, categories) {
  // 	if (error) {
  // 		console.error(error);
  // 		return;
  // 	}
  // 	console.log(query, ' categories:');
  // 	console.log(categories);
  // });
  //
  // mediawiki.getCategories(function(error, cats) {
  // 	console.log('All categories:');
  // 	console.log(JSON.stringify(cats));
  // });
  //
  // mediawiki.getCategories('K', function(error, cats) {
  // 	console.log('All categories starting with K:');
  // 	console.log(JSON.stringify(cats));
  // });

}

function saveQuery(item, query) {
  let key = sanitiseKey(query);

  let queryEntry = {
    kgid: item.result['@id'],
    resultScore: item.resultScore,
    updated: firebase.database.ServerValue.TIMESTAMP
  };

  queriesRef.child(key).once('value', (snapshot) => {

    queriesRef.child(key).update(queryEntry, (error) => {

      if (error) {
        console.error('Data could not be saved.', error);
      } else {
        console.info('Data saved successfully.');
      }

    });

  }, (error) => {
    queriesRef.child(key).push().set(queryEntry, (error) => {

      if (error) {
        console.error('Data could not be saved.', error);
      } else {
        console.info('Data saved successfully.');
      }

    });

  });

}

function saveIngredient(item) {
  let key = sanitiseKey(item.result.name);

  let ingredientEntry = item.result;

  if (item.result.description && item.result.description.length) {
    ingredientEntry.category = item.result.description;
  }

  ingredientsRef.child(key).once('value', (snapshot) => {

    ingredientsRef.child(key).update(ingredientEntry, (error) => {

      if (error) {
        console.error('Data could not be saved.', error);
      } else {
        console.info('Data saved successfully.');
      }

    });

  }, (error) => {
    ingredientsRef.child(key).push().set(ingredientEntry, (error) => {

      if (error) {
        console.error('Data could not be saved.', error);
      } else {
        console.info('Data saved successfully.');
      }

    });

  });

}

search(params, (error, items) => {
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
        getWikiData(item);
      }

      saveQuery(item, query);
    }

    process.exitCode = 0;
  } else {
    console.log(`No results for "${query}"`);
    process.exitCode = 1;
  }

});
