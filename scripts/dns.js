/**
 * TODO: Switch to PouchDB
 * TODO: Switch to webworkers when Fx enables indexdb from webworkers
 * TODO: Add WebRTC DHT.
 */
'use strict';

var $ = require('./libs/jquery/dist/jquery'),
  URI = require('./libs/uri.js/src/URI'),//TODO: test without
//  PouchDB = require('./libs/pouchdb/dist/pouchdb-nightly.js'), //for casperjs
  PouchDB = require('./libs/pouchdb/lib/index.js'),
  Record = require('./record'),
  Fail = require('./fail'),
  log = require('./logger');


function DNS() {
  var that = this;
  this.pubs = {};
  //TODO: Round robin multiple providers

  //http://127.0.0.1:5984/
  this.db = new PouchDB('speech', { 'auto_compaction': true});
  this.db.replicate.from(
    'https://indolering.cloudant.com/bit/', 'speech', {continuous: true});
  this.pubs.speech = new PouchDB('https://indolering.cloudant.com/bit/');


  /**
   * Equivalent to namecoind name_show d/name or whois on traditional DNS but
   * it assumes '.bit' and it does not support including ANY tld in the query.
   * @param {string} name Domain to lookup, assumes '.bit' tld.
   * @param {function} load nav.load method for loading websites.
   */
  this.lookup = function(name, load) {
    /**
     * Check localStorage for cached result
     * @type {Record}
     */
    that.db.get(name, function(err, doc) {
      if (err) {
        this.fetch(name, load);
      } else {
        load(new Record(name, doc));
      }
    });
  };

  /**
   * Fetches data from remote host
   * TODO: Add multiple hosts, ballistic queries
   * @param {string} name
   * @param {function} load
   */
  this.fetch = function(name, load) {
    that.pubs.speech.get(name, function(err, doc) {
      if (err) {
        throw new Fail({name: 'name'}).over();
      } else {
        that.save(doc);
        load(doc);
      }
    });
  };

  /**
   * Saves record to appropriate container and inits $jsdns if needed.
   * @param {Record} r DNS record to be saved.
   * @param {function} callback Function to send response to.
  5647 */
  this.save = function(r, callback) {
    callback = callback || function(m) {log.log(m)};
    if (r.$jsdns === null || r.$jsdns === undefined) {
      r = new Record(r.name, r.value);
    }
    that.db.get(r.name, function(err, doc) {
      if (!err) {
        r['_rev'] = doc._rev;
      }
      that.db.put(r, function(err, response) {
        if (err) {
          log.warn(err);
        } else {
          log.info(response);
          that.db.get(r.name, function(err, doc) {
            callback(doc);
          });
        }
      });
    });
  };

  /**
   * Removes record client storage.
   * @param {string} name Name of DNS record to be removed.
   * @param {function} callback Returns errors or confirmation
   */
  this.delete = function(name, callback) {
    that.db.get(name, function(err, doc) {
      if (err) {
        log.info('error while fetching rev of ' + name + ' for deltion.', err);
      } else {
        that.db.remove(doc, function(err, response) {
          if (err) {
            log.warn('Unable to delete ' + name + ' ', err);
          }
          if (response) {
            log.log(response);
          }
        });
      }
    });
  };

  /**
   * Returns *all* records in client storage.
   * TODO: I doubt this is working ATM.
   * @param {Array.<string>} names Array of names to be retrieved.
   * @param {function} callback what to do with names once retrieved.
   */
  this.getRecords = function(names, callback) {
    callback = callback || names;

    if (Array.isArray(names)) {
      that.db.allDocs({keys: names, include_docs: true}, callback);
    } else {
      that.db.allDocs({include_docs: true}, callback);
    }
  };

  /**
   * Utility function for creating new DBS object with independent connections
   * @return {function} New DNS object.
   */
  this.init = function() {
    return new DNS();
  };

}

module.exports = new DNS();

