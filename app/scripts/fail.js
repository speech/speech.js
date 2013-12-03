var URI = require('scripts/libs/URI');

/**
 * Settings object for Fail errors.
 * @typedef {Object} failParams
 * @property {bit-value} value - this.message.value,
 * @property {number} code - this.message.code,
 * @property {string} name - this.message.name,
 * @property {string} message - this.message.message
 * */

/**
 * Factory for Fail (custom error) objects. Convenience method for packaging
 * the URL to the error page and translating error codes.
 * @param { failParams } failInfo
 * @constructor
 * @template Fail
 * @returns {Fail}
 */

function Fail(failInfo) {
  this.name = failInfo.name || "Fail";
  this.message = failInfo;
}

Fail.prototype = new Error();
Fail.prototype.over = function() {
  url = new URI();
  var e = {
    url    : url.href(),
    urn    : new URI().subdomain().split('.').slice(-1).pop(),
    value  : this.message.value,  //r.value...
    name   : this.message.name,
    message: this.message.message
  };

  if (e.urn === '') {
    if (url.hash() && url.hash[0] !== '!')
      e.urn = url.hash().slice(1, url.hash().length);
    else if (url.hostname() == 'localhost' || url.hostname() == '127.0.0.1') {
      e.urn = 'localhost';
    } else {
      e.urn = 'www';
    }
  }

  var redirect = new URI().path('error.html').subdomain('');


  switch (e.name.toLowerCase()) {
    case 'format':
      e.text = 'The name server was unable to interpret the query.';
      e.code = 1;
      break;
    case 'server':
      e.text = 'The name server was unable to process this query due to a problem with the name server.';
      e.code = 2;
      break;
    case 'name':
      e.text = 'Domain name referenced in the query does not exist.';
      e.code = 3;
      e.message = 'The domain name ' + e.urn + ' could not be found';
      //redirect.path('connect.html');
      break;
    case 'unimplemented':
      e.text = 'The name server does not support the requested kind of query.';
      e.code = 4;
      redirect.path('connect.html');
      break;
    case 'unauthorized':
      e.text = 'Authentication is required and has failed or has not yet been provided.';
      e.code = 401;
      break;
    case 'forbidden':
      e.text = 'Successful authentication but credentials do not grant the client permission to access the resource.';
      e.code = 403;
      break;
    case 'timeout':
      e.text = 'The server timed out waiting for the request.';
      e.code = 408;
      redirect.path('connect.html');
      break;
    case 'length':
      e.text = 'URI too long.';
      e.code = 414;
      break;
    case 'calm':
      e.text = 'The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes.';
      e.code = 420;
      break;
    case 'rate':
    case 'flood':
      e.text = 'The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes.';
      e.code = 429;
      break;
    case 'censored':
      e.text = 'Unavailable For Legal Reasons';
      e.code = 451;
      break;
    default:
      if (!e.code)
        e.code = -1;

      if (!e.name)
        e.name = 'unknown';

      if (!e.message)
        e.message = 'There was a problem looking up your request.';
  }

  console.log(e.name, e);

  location.href = new URI().
    path('error.html').
    subdomain('').
    addQuery(e).
    href();
};

module.exports = Fail;


