/**
 * @license AGPLv3 2014
 * @author indolering
 * TODO: util to search for URL in string, relative/absolute boolean
 */

'use strict';

var url = {

}

function init(value) {
  var url;

  //TODO: subdomains()
  //var i = url.host.lastIndexOf('.') - 1;
  //var temp = url.host.slice(0,i);
  //var j = temp.lastIndexOf('.') - 1;
  //return temp.slice(0,j);

  var Url;

  if (webkitURL) {
    var URL = webkitURL;
  }

  var protocol = new RegExp('^(?:[a-z]+:)', 'i');
  console.log(value);
  if (protocol.test(value)) {
    url = new URL(value);
  } else if (value.slice(0, 1) === '//') {
    url = new URL(window.location.protocol + value);
  } else {
    url = new URL(window.location.protocol + '//' + value);
  }

  //TODO: handle popular SLDs
  url.prototype.tld = function() {
    var index = url.host.lastIndexOf('.') + 1;
    return this.host.slice(index, host.length - 1);
  };

  url.prototype.postfix = function() {
    return this.pathway + this.search + this.hash;
  };

  return url;
}


module.exports = init;