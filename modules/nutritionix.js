import {Client as NodeRestClient} from 'node-rest-client';

const client = new NodeRestClient();

let usdaBrandId = '513fcc648110a4cafb90ca5e';

let args = {
  parameters: {
    results: '0:20',
    brand_id: usdaBrandId,
    cal_min: '0',
    cal_max: '50000',
    fields: 'item_name,brand_name,item_id,brand_id',
    appId: '9222c28f',
    appKey: '7399db084eca25e644a3b4ce47e9d4bf'
  }
};

let term = query;

client.registerMethod('jsonMethod', `https://api.nutritionix.com/v1_1/search/${term}`, 'GET');

client.methods.jsonMethod(args, function(data, response) {
  console.log(data); // parsed response body as js object
  for (let hit of data.hits) {
    console.log(hit.fields);
  }

  console.log(response); // raw response
});
