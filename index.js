import {db} from './modules/firebase';
// import {search} from './modules/google-kgsearch';
import kGraph from './modules/google-kgsearch';

// Run this code on a user query if no
// match is found in the Firebase data.

// Run this code on a user query the match
// found in the Firebase data is stale.

// Run this code as a cron job that returns all stale
// data in the Firebase data

const ingredientsRef = db.ref('ingredients');

// ingredientsRef.once('value', function(snapshot) {
//   console.log(snapshot.val());
// });

const term = 'Lemon zest';
const query = term.toLowerCase();

const params = {
  query,
  types: 'Thing',
  limit: 10
};

const typesRejected = [
  'Organization',
  'Corporation',
  'Person',
  'MusicGroup',
  'MusicAlbum',
  'MusicRecording',
  'TVSeries',
  'Business',
  'LodgingBusiness'
];

kGraph.search(params, (error, items) => {
  if (error) {
    console.error('error', error);
  }

  if (items && items.length) {
    for (let item of items) {
      // console.log(item.resultScore, item.result.name.toLowerCase(), query);

      // if ((parseInt(item.resultScore) > 100) && (item.result.name.toLowerCase() === query)) {
        delete item['@type'];

        item.query = query;

        // console.log(item);

        let types = item.result['@type'];

        for (let type of types) {

          console.log(type, type);

          if (type.indexOf(typesRejected) !== -1) {

            console.log(item);

            ingredientsRef.push().set(item, (error) => {

              if (error) {
                console.log('Data could not be saved.', error);
              } else {
                console.log(`Database entry for "ingredient/${query}" updated successfully`);
              }

            });

          }

        }

      // }

    }
  } else {
    console.log(`No results for "${query}"`);
  }

});
