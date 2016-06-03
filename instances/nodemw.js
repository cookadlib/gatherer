import nodemw from 'nodemw';

import * as config from '../config';

export const mediawiki = new nodemw(config.nodemw);

export default nodemw;
