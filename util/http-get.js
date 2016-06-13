import request from 'request';

export const httpGet = (url, callback) => {

  const options = {
    headers: {
      'User-Agent': 'request'
    },
    url,
    json: true
  };

  request(options, (err, res, body) => {
    callback(err, body);
  });

};

export default httpGet;
