import camelCase from 'camelcase';
import minimist from 'minimist';
import replaceall from 'replaceall';

import logger from './util/logger';

import * as worker from './worker';

const argv = minimist(process.argv.slice(2));

if (argv.location) {

  const location = camelCase(replaceall('/', '-', argv.location));

  (async function() {

    logger.info(`Running ${argv.location} worker`);

    try {
      await worker[location]();
    }
    catch (error) {
      logger.error(error);
    }

  }());

} else {
  logger.error('Location parameter not defined');
  process.exit();
}
