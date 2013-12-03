var URI = require('/scripts/libs/URI');
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
   * @property {Object} _jsdns - convenience used by JSDNS, not standard.
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

    if (typeof v == 'string')
      v = JSON.parse(v);

    this.name = n;
    this.value = v;
    this._jsdns = {
      uris: []
    };

    var uris = this._jsdns.uris;
    Object.keys(v).forEach(function(key) {
      if ([
        'ip',
        'translate'
        //TODO: the rest of these require testing for connectivity.
        //'ip6',
        //'alias',
        //'tor',
        //'i2p',
        //'freenet',
        //'ns',
        //'email',
      ].indexOf(key) > -1) {

        //spec store single entries as String and multiple entries as an array
        var temp = v[key];
        if (!(temp instanceof Array)) {
          temp = new Array(temp)
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
    })

  }

  /*
   * TODO: extend URI.js to include 'tor' etc and store type as number
   * TODO: sort URI array by network size:
   *
   * this._jsdns.uris.sort(function(a,b){
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

