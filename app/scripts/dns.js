/**
 * TODO: Switch to webworkers and setup monitoring for background updates
 * TODO: When Firefox enables webworker access to IndexDB, switch to PouchDB
 * TODO: Adapters for github, twitter, fb, WebRTC DHT, etc.
 */

  var $ = require('/scripts/libs/jquery'),
    URI = require('/scripts/libs/URI'),
//    SecondLevelDomains = require('/scripts/libs/SecondLevelDomains'),
    Record = require('/scripts/record'),
    Fail = require('/scripts/fail');

  function DNS() {
    this.pubs = {};
    //TODO: Load providers from localStorage
    this.pubs.speechis = function(name) {
      $.ajax({
        url     : 'http://api.bits.name',
        type    : 'get',
        data    : name,
        dataType: 'json',
        async   : false,
        fail    : function(jqXHR, status, error) {
          console.error(
            'Call failed :' + status,
            "Error: " + error,
            jqXHR);
          return false;
        },
        done    : function(data) {
          return data;
        }
      });
    }


  /**
   * Equivalent to namecoind name_show d/name or whois on traditional DNS but
   * it assumes '.bit' and it does not support including ANY tld in the query.
   * @param {string} name Domain to lookup, assumes '.bit' tld.
   * @returns {Record} Full DNS record for 'name'
   */
  this.lookup = function(name) {
    /**
     * Check localStorage for cached result
     * @type {Record}
     */
    var r = localStorage.getItem(name);

    if (r === null) {
      $.ajax({
        url     : 'http://api.bits.name',
        type    : 'get',
        data    : { name: name },
        dataType: 'json',
        async   : false,
        done    : function(data) {
          r = data;
        },
        fail    : function(jqXHR, status, error) {
          console.error(
            'Call failed :' + status,
            "Error: " + error,
            jqXHR);
        }
      });
    }

    if(typeof r === "string")
      r = JSON.parse(r);

    if (r === null || r.value === null)
      throw new Fail({name: 'name'}).over();

    return this.save(r);
  }

  /**
   * NOT WORKING Fetches data from remote hosts.
   * @param {string} name
   */
  this.fetch = function(name) {
    var r = {name: name};
    var pubs = DNS.pubs;
    var publishers =  Object.keys(DNS.pubs);
    publishers.forEach(function(pub) {
      var value = pub(name);
      if (value) {
        r.value = value;
      }
    });
    if (r.value){
      return this.save(r);
    } else {
      return false;
    }
  };

  /**
   * Saves record to appropriate container and inits _jsdns if needed.
   * @param {Record} r DNS record to be saved.
   */
  this.save = function(r) {
    if (r.__jsdns === null || r.__jsdns === undefined) {
      r = new Record(r.name, r.value);
    }

    localStorage.setItem(r.name, JSON.stringify(r));
    return r;
  };

  /**
   * Removes record client storage.
   * @param {String} name Name of DNS record to be removed.
   */
  this.delete = function(name) {
    localStorage.removeItem(name);
  };

  /**
   * Returns *all* records in client storage.
   * @returns {Array.<bit-value>} Array of DNS records.
   */
  this.getRecords = function() {
    var records = [];
    Object.keys(localStorage).forEach(function(key){
      if (key.substring(0,1) !== '_' &&
        key !== 'consoleHistory' && //chrome dumps debugger settings in localStorage
        key !== 'breakpoints' &&
        key !== 'undefined' &&
        key !== undefined) {
        var r = JSON.parse(localStorage.getItem(key));
        records.push({name: r.name, value: r.value});
      }
    });
    return records;
  };

  };
module.exports = new DNS();
//exports.save = DNS.save;
//exports.getRecords = DNS.getRecords;

