import url from 'url';
import wikipedia from 'node-wikipedia';

let queryUrlSanitised = url.format(query);

wikipedia.page.data(queryUrlSanitised, {
  content: true
}, (response) => { // structured information on the page for Clifford Brown (wikilinks, references, categories, etc.)
  console.log('response', response);
});

wikipedia.revisions.all(queryUrlSanitised, {
  comment: true
}, (response) => { // info on each revision made to Miles Davis' page
  console.log('response', response);
});

wikipedia.categories.tree(
  queryUrlSanitised,
  (tree) => { //nested data on the category page for all Phillies players
    console.log('tree', tree);
  }
);
