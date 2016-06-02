import KGSearch from 'google-kgsearch';

const googleApisKey = 'AIzaSyDgKIwWkoMwhRb6qwv2wkZ62UKDrKEgmcw';

const kGraph = KGSearch(googleApisKey);

// let query = 'Taylor Swift';
// let query = 'Puerto Rico';
// let query = 'Bread';
// let query = 'Tomato';
// let query = 'Beef';
// let query = 'Mustard';
// let query = 'Soup';
// let query = 'Black Pepper';
// let query = 'Red pepper';
// let query = 'Salt';
// let query = 'Monosodium glutamate';
// let query = 'Rose water';
// let query = 'Charcoal';
// let query = 'Chicken';
// let query = 'Pork';
// let query = 'Cod';
// let query = 'Cricket';
// let query = 'Vodka';
// let query = 'Orange juice';
// let query = 'Old Fashioned'; // todo: failure
// let query = 'Bloody Mary';
// let query = 'Black Label Whisky';
// let query = 'Tomato soup';
// let query = 'Ketchup';
// let query = 'Quinoa';
// let query = 'Asafoetida';
// let query = 'red food colouring'; // todo: failure
// let query = 'cochineal';
// let query = 'Rabbit';
// let query = 'Snake';
// let query = 'Snake heart';
// let query = 'Garter snake';
// let query = 'maldon salt';
// let query = 'salt pig';
// let query = 'Botillo';
// let query = 'Penne Arrabiata';
// let query = 'Ginger';
// let query = 'Basil';
// let query = 'Olive oil';
// let query = 'Lard';
// let query = 'Offal';
// let query = 'Sausage';
// let query = 'Blackberry';
// let query = 'lemon rind';
// let query = 'lemon zest';

// let types = 'Thing';

let typesAccepted = [
  'Food',
  'Spice',
  'Condiment',
  'Meat',
  'Vegetable',
  'Fruit',
  'Plant',
  'Prescription drug, Over-the-counter drug', // Charcoal
  'Poultry',
  'Insect',
  'Alcoholic beverage',
  'Cocktail',
  'Fruit',
  'Soup',
  'Sauce',
  'Snake',
  'Thing',
  'Herb',
  'Oil',
  'Animal fat'
];

let descriptionsAccepted = [
  'Food',
  'Spice',
  'Condiment',
  'Meat',
  'Vegetable',
  'Fruit',
  'Plant',
  'Prescription drug, Over-the-counter drug', // Charcoal
  'Poultry',
  'Insect',
  'Alcoholic beverage',
  'Cocktail',
  'Fruit',
  'Soup',
  'Sauce',
  'Snake',
  'Thing',
  'Herb',
  'Oil',
  'Animal fat'
];

let typesRejected = [
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

let descriptionsRejected = [
  'Song by',
  'Album by',
  'Musical Group',
  'Hotel',
  'Rock band',
];

// if the description field value is not in the descriptions array then check the detailedDescription field value for key words such as 'dish', 'sauce', etc.
// Use the values in the descritions descriptions array?

// How do we populate all of the levels of the taxonomy?  "Instance of" Triples?

// let params = {
//   query,
//   types,
//   limit: 10
// };

// export const search = (params) => {
//
//   kGraph.search(params, (error, items) => {
//     if (error) {
//       console.error('error', error);
//     }
//
//     if (items && items.length) {
//       for (let item of items) {
//         // console.log(item);
//
//         if (parseInt(item.resultScore) < 200) {
//           continue;
//         }
//
//         if (item.result.name.toLowerCase() !== params.query.toLowerCase()) {
//           continue;
//         }
//
//         return item;
//       }
//     } else {
//       console.log(`No results for "${query}"`);
//     }
//
//   });
//
// };

export default kGraph;
