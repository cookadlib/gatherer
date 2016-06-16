import _ from 'lodash';
import async from 'async';
import errors from 'request-promise/errors';
import requestPromise from 'request-promise';

import firebase, {db, sanitiseKey} from '../instance/firebase';
import {mediawiki} from '../instance/nodemw';

import logger from '../util/logger';
import updateOrSet from '../util/update-or-set';

const preparationRef = db.ref('/preparation/sauce');
const vitaminsRef = db.ref('/chemical/vitamin');

const worker = async function() {

  try {
    mediawiki.getPagesInCategory('Sauces', function(error, data) {
    if (error) {
      return logger.error(error);
    }

    return logger.log(data);

  });

    await vitaminsRef.orderByChild('class').equalTo('B3').once('value').then(async function (snapshot) {
      return logger.info(snapshot.val());
    });
  }
  catch (error) {
    return logger.error(error);
  }

};

export {worker};

export default worker;
