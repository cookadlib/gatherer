import KGSearch from 'google-kgsearch';

import * as config from './config';

const kGraph = KGSearch(config.googleApisKey);

export const search = kGraph.search;

export default kGraph;
