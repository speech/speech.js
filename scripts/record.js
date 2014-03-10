'use strict';

var URI = require('./libs/uri.js/src/URI');
//    SecondLevelDomains = require('SecondLevelDomains');
//    punycode = require('punycode');

/**
 * Valid 'value' field from .bit domain name spec.
 * @typedef {Object} bit-value
 * @property {(string | Array.<string>)} service,
 * @property {(string | Array.<string>)} ip,
 * @property {(string | Array.<string>)} ip6,
 * @property {(string | Array.<string>)} tor,
 * @property {(string | Array.<string>)} i2p,
 * @property {(string | Array.<string>)} freenet,
 * @property {(string | Array.<string>)} alias,
 * @property {(string | Array.<string>)} translate,
 * @property {(string | Array.<string>)} email,
 * @property {(string | Array.<string>)} loc,
 * @property {(string | Array.<string>)} info,
 * @property {(string | Array.<string>)} ns,
 * @property {(string | Array.<string>)} delegate,
 * @property {(string | Array.<string>)} import,
 * @property {Object} map,
 * @property {Object} tls
 * */


/**
 * Record for DNS entries.
 * @typedef {Object} Record
 * @property {String} name - Name of domain, assumes '.bit'
 * @property {bit-value} value - 'value' field from .bit domain name spec.
 * @property {Object} $jsdns - convenience used by JSDNS, not standard.
 * */

/**
 * Factory for DNS objects.
 * @param { string } n Name field for record.
 * @param {( string | {bit-value} )} v DNS value field for record.
 * @constructor
 * @template Record
 * @returns {Record}
 */
function Record(n, v) {

//  var test = {"_id": "khal", "_rev": "1-dd43b1813fb425fb1e8900570062df1d", "value": {"info": {"registrar": "http://register.dot-bit.org"}, "ns": ["ns0.web-sweet-web.net", "ns1.web-sweet-web.net"], "map": {"": {"ns": ["ns0.web-sweet-web.net", "ns1.web-sweet-web.net"]}}, "expires": 166459}}

  this._id = n; //duplicate
  this.name = n;
  this.value = v;
  this.$jsdns = {
    uris: []
  };

  //TODO: Here we are basically scavenging for any way to connect to the server.
  //It does not work very well, and should first try to find a translate field
  //and then dig around with the IP address.
  var uris = this.$jsdns.uris;

  Object.keys(v).forEach(function(key) {
    if ([
      'ip', //will only work if IP is dedicated
      'translate',
      'http',
      'link'
      //'ip6', //will require connectivity testing
      //'ns',  //will require ajax "frame" injection.
    ].indexOf(key) > -1) {

      //spec store single entries as String and multiple entries as an array
      var temp = v[key];
      if (!(temp instanceof Array)) {
        temp = new Array(temp);
      }

      //TODO: extend uri.js to accept IP's as the hostname by default
      temp.forEach(function(uri) {
        if (key === 'ip' || key === 'ip6') {
          uri = '//' + uri;
        }
        uris.push(new URI(uri).href());
        //.href() because local storage is messing up the functions. Temp Fix.
      });

    }
  });
  return this;
}

/*
 * TODO: extend URI.js to include 'tor' etc and store type as number
 * TODO: sort URI array by network size:
 *
 * this.$jsdns.uris.sort(function(a,b){
 *   ...
 * });
 *
 * ~log(relative network size) * 10:
 * freenet/tor*100           = Log(~1) * 10 = 10
 * i2p/torr*100              = ~10          = 20
 * tor/tor*100               = 100          = 30
 * translate -> .bit (why?)  = 1000         = 40
 * ipv6/ipv4 ~.1 *100 *.bit  = 10000        = 50
 * ipv4/ipv4 * * 100 * .bit  = 100000       = 60
 * ICANN (translate -> !.bit)= 1000000      = 70
 *
 * freenet: http://asksteved.com/stats/ 9,000
 * i2p|eep: stats.i2p 40,000
 * Tor: https://metrics.torproject.org/users.html 400,000
 */
module.exports = Record;

