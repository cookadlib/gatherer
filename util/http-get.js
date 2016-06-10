import request from 'request';

export const httpGet = (url, callback) => {

  const options = {
    url :  url,
    json : true
  };

  request(options, (err, res, body) => {
    callback(err, body);
  });

}

export default httpGet;
