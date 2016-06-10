import async from 'async';
import {search} from '../instance/google-kgsearch';

import httpGet from '../util/http-get';

// const urls= [
//   'http://data.okfn.org/data/core/language-codes/r/ietf-language-tags.json',
//   'http://data.okfn.org/data/core/language-codes/r/language-codes-full.json'
// ];

const query = 'chemical elements';

const params = {
  query,
  types: 'Thing',
  limit: 10
};

export const worker = () => {

  // async.map(urls, httpGet, (error, response) => {
  //   if (error) {
  //     return console.log(error);
  //   }
  //
  //   console.log(response);
  // });

  search(params, (error, items) => {
    if (error) {
      console.error('error', error);
      return;
    }

    if (items && items.length) {
      console.log(items);
    } else {
      console.log(`No results for "${query}"`);
    }

  });

}

export default worker;
