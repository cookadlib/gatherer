import _ from 'lodash';
import async from 'async';
import firebase, {db, sanitiseKey} from '../instance/firebase';

import httpGet from '../util/http-get';
import updateOrSet from '../util/update-or-set';

// Dietary elements, see https://en.wikipedia.org/wiki/Dietary_element
const dietaryElements = {
  common: [
    'C',
    'H',
    'N',
    'O'
  ],
  major: [
    'Ca',
    'P',
    'K',
    'S',
    'Na',
    'Cl',
    'Mg'
  ],
  trace: [
    'Fe',
    'Co',
    'Cu',
    'Zn',
    'Mn',
    'Mo',
    'I',
    'Br',
    'Se'
  ],
  ultratrace: [
     'B',
     'Cr',
     'As',
     'Ni',
     'Si',
     'V'
  ]
};

const chemical = db.ref('chemical');
chemical.child('element').remove();
chemical.child('element-test').remove();
chemical.child('element-test1').remove();
chemical.child('element-test2').remove();

const elementsRef = db.ref('chemical/element');

const elementsUrls = [
  'https://tools.wmflabs.org/ptable/api?props=elements'
];

export const worker = () => {

  async.map(elementsUrls, httpGet, (error, response) => {
    if (error) {
      return console.log(error);
    }

    const elements = response[0].elements;

    for (let element of elements) {

      const key = element.symbol.toLowerCase();

      const elementRef = elementsRef.child(key);

      const elementDetailsUrl = [
        `https://www.wikidata.org/wiki/Special:EntityData/${element.item_id}.json`
      ];

      async.map(elementDetailsUrl, httpGet, (error, response) => {
        if (error) {
          return console.log(error);
        }

        const details = response[0].entities[element.item_id];

        if (details.id === element.item_id) {
          delete element.item_id;
          delete element.label;
          _.merge(element, details);
        }

        if (dietaryElements.common.indexOf(element.symbol) !== -1) {
          element.dietary = {
            common: true
          };
        } else if (dietaryElements.major.indexOf(element.symbol) !== -1) {
          element.dietary = {
            major: true
          };
        } else if (dietaryElements.trace.indexOf(element.symbol) !== -1) {
          element.dietary = {
            trace: true
          };
        } else if (dietaryElements.ultratrace.indexOf(element.symbol) !== -1) {
          element.dietary = {
            ultratrace: true
          };
        }

        element.timestamp = firebase.database.ServerValue.TIMESTAMP;

        updateOrSet(elementsRef, key, element);
      });

    }

  });

};

export default worker;
