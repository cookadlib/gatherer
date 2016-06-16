import _ from 'lodash';
import async from 'async';
import errors from 'request-promise/errors';
import requestPromise from 'request-promise';

import firebase, {db, sanitiseKey} from '../instance/firebase';

import logger from '../util/logger';
import updateOrSet from '../util/update-or-set';

const preparationRef = db.ref('/preparation');

const worker = async function() {

  try {

  }
  catch (error) {
    return logger.error(error);
  }

};

export {worker};

export default worker;
