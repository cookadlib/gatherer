// Run this code on a user query if no match is found in the Firebase data.
// Run this code on a user query the match found in the Firebase data is stale.
// Run this code on a cron job that returns all stale data in the Firebase data.

import {Client as Client} from 'node-rest-client';
import KGSearch from 'google-kgsearch';
import url from 'url';
import wikipedia from 'node-wikipedia';

const client = new Client();
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
let query = 'Red pepper';
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

let types = 'Thing';
// let types = 'Person';
// let types = 'Recipe';
// let types = 'Creature';

let descriptions = [
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
  'Food',
  'Food'
];

// if the description field value is not in the descriptions array then check the detailedDescription field value for key words such as 'dish', 'sauce', etc.
// Use the values in the descritions descriptions array?

// How do we populate all of the levels of

let params = {
  query,
  types,
  limit: 10
};

kGraph.search(params, (error, items) => {
  if (error) {
    console.error('error', error);
  }

  if (items && items.length) {
    for (let item of items) {
      console.log(item.result);
    }
  } else {
    console.log(`No results for "${query}"`);
  }

});

// let queryUrlSanitised = url.format(query);

// wikipedia.page.data(queryUrlSanitised, {
//   content: true
// }, (response) => { // structured information on the page for Clifford Brown (wikilinks, references, categories, etc.)
//   console.log('response', response);
// });
//
// wikipedia.revisions.all(queryUrlSanitised, {
//   comment: true
// }, (response) => { // info on each revision made to Miles Davis' page
//   console.log('response', response);
// });

// wikipedia.categories.tree(
// 	queryUrlSanitised,
// 	(tree) => { //nested data on the category page for all Phillies players
//     console.log('tree', tree);
// 	}
// );

// let usdaBrandId = '513fcc648110a4cafb90ca5e';
//
// let args = {
// 	parameters: {
//     results: '0:20',
//     brand_id: usdaBrandId,
//     cal_min: '0',
//     cal_max: '50000',
//     fields: 'item_name,brand_name,item_id,brand_id',
//     appId: '9222c28f',
//     appKey: '7399db084eca25e644a3b4ce47e9d4bf'
//   }
// };
//
// let term = query;
//
// client.registerMethod('jsonMethod', `https://api.nutritionix.com/v1_1/search/${term}`, 'GET');
//
// client.methods.jsonMethod(args, function (data, response) {
// 	console.log(data); // parsed response body as js object
//   for (let hit of data.hits) {
//     console.log(hit.fields);
//   }
//
// 	console.log(response); // raw response
// });
