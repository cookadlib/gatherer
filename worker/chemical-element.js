import _ from 'lodash';
import async from 'async';
import errors from 'request-promise/errors';
import requestPromise from 'request-promise';

import firebase, {db, sanitiseKey} from '../instance/firebase';

import updateOrSet from '../util/update-or-set';

// Dietary elements, see https://en.wikipedia.org/wiki/Dietary_element
const dietaryElements = {
  common: ['C', 'H', 'N', 'O'],
  major: ['Ca', 'P', 'K', 'S', 'Na', 'Cl', 'Mg'],
  trace: ['Fe', 'Co', 'Cu', 'Zn', 'Mn', 'Mo', 'I', 'Br', 'Se'],
  ultratrace: ['B', 'Cr', 'As', 'Ni', 'Si', 'V']
};

const elementsRef = db.ref('/chemical/element');

const processElement = async function(element) {

  try {

    const options = {
      headers: {
        'User-Agent': 'request'
      },
      url: `https://www.wikidata.org/wiki/Special:EntityData/${element.item_id}.json`,
      json: true
    };

    await requestPromise(options)
    .then(async function(body) {
      const key = element.symbol.toLowerCase();

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

      await updateOrSet(elementsRef, key, element);
    })
    .catch(errors.StatusCodeError, (reason) => {
      // The server responded with a status codes other than 2xx.
      // Check reason.statusCode
      console.error(reason.statusCode);
    })
    .catch(errors.RequestError, (reason) => {
      // The request failed due to technical reasons.
      // reason.cause is the Error object Request would pass into a callback.
      console.error(reason.cause);
    })
    .catch((error) => {
      console.error(error);
    });

  }
  catch (error) {
    return console.error(error);
  }

};

const worker = async function() {

  try {

    db.ref('/chemical/element1').remove;
    db.ref('/chemical/element4').remove;

    setTimeout(() => process.exit(), 3000);

    const options = {
      headers: {
        'User-Agent': 'request'
      },
      url: 'https://tools.wmflabs.org/ptable/api?props=elements',
      json: true
    };

    await requestPromise(options)
    .then(async function(body) {
      const elements = body.elements;

      for (let element of elements) {
        await processElement(element);
      }
    })
    .catch(errors.StatusCodeError, (reason) => {
      // The server responded with a status codes other than 2xx.
      // Check reason.statusCode
      console.error(reason.statusCode);
    })
    .catch(errors.RequestError, (reason) => {
      // The request failed due to technical reasons.
      // reason.cause is the Error object Request would pass into a callback.
      console.error(reason.cause);
    })
    .catch((error) => {
      console.error(error);
    });

  }
  catch (error) {
    return console.error(error);
  }

};

export {worker};

export default worker;
