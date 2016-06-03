import {singleton} from 'needlepoint';

import {search} from '../instances/google-kgsearch';
import {mediawiki} from '../instances/nodemw';

@singleton
export default class SemanticWeb {

  constructor() {
    this.knowledgeGraph();
    this.mediawiki();
  }

  knowledgeGraph() {
    this.data = data;

    let knowledgeGraphParameters = {
      query,
      types: 'Thing',
      limit: 10
    };

    search(knowledgeGraphParameters, (error, items) => {

      if (error) {
        console.error('error', error);
        return;
      }

      if (items && items.length) {

        for (let item of items) {
          let acceptItem = false;

          let types = item.result['@type'];

          for (let type of types) {

            if (type === 'Thing') {

              if (item.result.description && (config.descriptionsAccepted.indexOf(item.result.description) >= 0) && (config.descriptionsRejected.indexOf(item.result.description) === -1)) {
                acceptItem = true;
              }

            } else {

              if ((config.typesAccepted.indexOf(type) >= 0) && (config.typesRejected.indexOf(type) === -1)) {
                acceptItem = true;
              }

            }

          }

          if (acceptItem === true) {
            // this.mediawiki();
            // this.save();
          }

        }

      } else {
        console.log(`No results for "${this.query}"`);
      }

    });

  }

  mediawiki() {
    let query = this.query;

    mediawiki.search(query, (error, results) => {
    	// console.log('Search results:', results);

      if (results && results.length) {

        mediawiki.getArticle(results[0].title, function(error, data) {
          if (error) {
            console.error(error);
            return;
          }

          if (data && data.length) {

            mediawiki.parse(data, results[0].title, function(error, html, images) {
            	if (error) {
            		console.error(error);
            		return;
            	}

              // item.result.images = images;
              // item.result.wiki = html;

            	// console.log('HTML', html);
            	// console.log('Images', images);

              console.log('item', item);
              return item;
            });

          }

        });

      }

    });

  }

}
