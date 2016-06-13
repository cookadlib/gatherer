import _ from 'lodash';
import async from 'async';
import request from 'request';

import firebase, {db, sanitiseKey} from '../instance/firebase';

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

const elementsRef = db.ref('/chemical/element');

function processElement(element) {
  const key = element.symbol.toLowerCase();

  const options = {
    headers: {
      'User-Agent': 'request'
    },
    url: `https://www.wikidata.org/wiki/Special:EntityData/${element.item_id}.json`,
    json: true
  };

  request(options, (error, response, body) => {
    if (error) {
      return console.log(error);
    }

    const details = body.entities[element.item_id];

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

export const worker = () => {

  const options = {
    headers: {
      'User-Agent': 'request'
    },
    url: 'https://tools.wmflabs.org/ptable/api?props=elements',
    json: true
  };

  request(options, (error, response, body) => {
    if (error) {
      return console.log(error);
    }

    const elements = body.elements;

    for (let element of elements) {
      processElement(element);
    }

  });

};

export default worker;
