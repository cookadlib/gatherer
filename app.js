import camelCase from 'camelcase';
import minimist from 'minimist';
import replaceall from 'replaceall';

import * as worker from './worker';

const argv = minimist(process.argv.slice(2));

const location = camelCase(replaceall('/', '-', argv.location));

(async function() {
  console.log(`Running ${argv.location} worker`);

  try {
    await worker[location]();
  }
  catch (error) {
    console.error(error);
  }
}());
