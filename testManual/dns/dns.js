/**
 * TODO: Switch to webworkers when Fx enables indexdb from webworkers
 * TODO: Add per-entry overrides?
 * TODO: Add WebRTC DHT for URL lookup.
 * TODO: Detect https?
 */

'use strict';

  var DEBUG = true;

/**
 * Creates DNS object for looking up URN records.
 * @param {string} [name='speechis'] Name of the local DB
 * @param {string} [url='http://api.www.speech.is/speech/'] URL of the remote CouchDB instance.
 * @param {function} [callback] Callback
 * @returns {DNS}
 * @constructor
 */
function DNS(name, url, callback) {
  var that = this;

  name = name || 'speechis';
  url = url || 'http://api.www.speech.is/speech/';
  callback = callback || function (err, dns) {
    return dns;
  };

  this.db = new PouchDB(name, { 'auto_compaction': true});
  this.db.replicate.from(url, {continuous: true}
  ).on('change', function (info) {
      if (DEBUG) console.info("change" ,info);
    }).on('complete', function (info) {
      if (DEBUG) console.log("complete", info);
    }).on('error', function (err) {
      if (DEBUG) console.error(err);
    });

  this.client = new PouchDB(url);

  /**
   * Equivalent to namecoind name_show d/name or whois on traditional DNS but
   * it assumes '.bit' and it does not support including ANY tld in the query.
   * @param {string} name Domain to lookup, assumes '.bit' tld.
   * @param {function} callback nav.load method for loading websites.
   */
  this.lookup = function(name, callback) {
    /**
     * Check localStorage for cached result
     * @type {Record}
     */
    that.db.get(name, function(err, doc) {
      if (err) {
        that.fetch(name, callback);
      } else {
        callback(null, doc);
      }
    });
  };

  /**
   * Fetches data from remote host
   * @param {string} name
   * @param {function} callback
   */
  this.fetch = function(name, callback) {
    that.client.get(name, function(err, doc) {
      if (!err) that.save(doc);
      callback(err, doc);
    });
  };

  /**
   * Saves record to appropriate container.
   * @param {Record} r DNS record to be saved.
   * @param {function} callback Function to send response to.
   */
  this.save = function(r, callback) {
    callback = callback || function(m) {console.log(m)};
    r._id = r._id || r.name;

    that.db.get(r.name, function(err, doc) {

      if (!err) {
        r._rev = doc._rev;
        that.db.put(r, callback);
      } else {
        that.db.put(r, callback);
      }
    });

  };

  callback(null,this);

  /**
   * CouchDB
   * @typedef {Object} Record
   * @property {string} name Name of record
   * @property {string} _id PouchDB compatible alias of name param.
   * @property {Value} value The Namecoin DNS record containing an http transport with either a FQDN or IPv4 address.
   * @property {string} _rev CouchDB/PouchDB revision string.
   * */


  /**
   * @typedef {Object} Value The Namecoin DNS record.
   * @property {string} http FQDN or IPv4 address. *
   * */

}