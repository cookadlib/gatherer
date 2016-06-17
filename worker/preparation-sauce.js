import _ from 'lodash';
import async from 'async';
import errors from 'request-promise/errors';
import requestPromise from 'request-promise';
import requestDebug from 'request-debug';

import firebase, {db, sanitiseKey} from '../instance/firebase';

import logger from '../util/logger';
import updateOrSet from '../util/update-or-set';

const preparationRef = db.ref('/preparation/sauce');
const vitaminsRef = db.ref('/chemical/vitamin');

requestDebug(requestPromise);

let matches = [];

const scrapeCategory = async function(categoryName, ignoreSubCategories, matchSubCategories) {

  try {

    const options = {
      headers: {
        'User-Agent': 'request'
      },
      qs: {
        action: 'query',
        list: 'categorymembers',
        cmtitle: categoryName,
        cmlimit: '500',
        continue: '',
        format: 'json'
      },
      url: `https://en.wikipedia.org/w/api.php`,
      json: true,
      simple: false
    };

    await requestPromise(options)
    .then(async function(body) {
      // let matches = [];

      for (let categorymember of body.query.categorymembers) {

        if (matchSubCategories.indexOf(categorymember.title) !== -1) {
          await scrapeCategory(categorymember.title, ignoreSubCategories, matchSubCategories);
          // logger.info('Scrape', categorymember.title);
        } else if (categorymember.title.indexOf('Category:') === 0) {
          await scrapeCategory(categorymember.title, ignoreSubCategories, matchSubCategories);
          // logger.info('Scrape', categorymember.title);
        } else if ( (ignoreSubCategories.indexOf(categorymember.title) === -1) && (categorymember.title.indexOf('Category:') === -1) ) {
          await matches.push(categorymember);
        }

      }

      logger.info('categoryName', categoryName);
      // logger.info('matches', matches);
      // logger.info('body', body);
      // return matches;
    })
    .catch(errors.StatusCodeError, (reason) => {
      // The server responded with a status codes other than 2xx.
      // Check reason.statusCode
      return logger.error(reason.statusCode);
    })
    .catch(errors.RequestError, (reason) => {
      // The request failed due to technical reasons.
      // reason.cause is the Error object Request would pass into a callback.
      return logger.error(reason.cause);
    })
    .catch((error) => {
      return logger.error(error);
    })
    .finally(() => {
      // This is called after the request finishes either successful or not successful.
      return logger.log('finally');
    });

  }
  catch (error) {
    return logger.error(error);
  }

};

const worker = async function() {

  try {

    let categoryName = 'Category:Sauce';
    let ignoreSubCategories = ['Sauce', 'List of sauces'];
    let matchSubCategories = ['List of sauces'];

    await scrapeCategory(categoryName, ignoreSubCategories, matchSubCategories);

    logger.info('matches', matches);
  }
  catch (error) {
    return logger.error(error);
  }

};

export {worker};

export default worker;
