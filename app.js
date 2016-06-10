import camelCase from 'camelcase';
import minimist from 'minimist';

import * as worker from './worker';

const argv = minimist(process.argv.slice(2));

const location = camelCase(argv.location.replace('/', '-'));

console.log(`Running ${argv.location} worker`);

worker[location]();
