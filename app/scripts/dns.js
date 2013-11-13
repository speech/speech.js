/**
 * TODO: switch to webworkers and setup background update monitoring
 * TODO: When Firefox enables webworker access to IndexDB, switch to PouchDB
 * TODO: modularize this into adapters for different sources
 *       github, tweets, fb posts, WebRTC etc.
 * @license AGPLv3 2013
 * @author indolering
 */

//require.config({
//  paths: {
//    jquery: '../bower_components/jquery/jquery',
//    uri: '../bower_components/uri'
//  }
//});
require([
  'jquery',
  'uri'
//  dns
], function(jquery, uri) {
  'use strict';
  var DEBUG = true;
  // Prevent console call to throw errors on old browser
  // Mute console when DEBUG is set to false
  // TODO: turn DEBUG to false on grunt:build
  if (DEBUG === false || !window.console) {
    window.console = {
      assert                   : function() {},
      clear                    : function() {},
      count                    : function() {},
      debug                    : function() {},
      dir                      : function() {},
      dirxml                   : function() {},
      error                    : function() {},
      exception                : function() {},
      group                    : function() {},
      groupCollapsed           : function() {},
      groupEnd                 : function() {},
      info                     : function() {},
      log                      : function() {},
      markTimeLine             : function() {},
      msIsIndependentlyComposed: function() {},
      profile                  : function() {},
      profileEnd               : function() {},
      table                    : function() {},
      time                     : function() {},
      timeEnd                  : function() {},
      timeStamp                : function() {},
      trace                    : function() {},
      warn                     : function() {}
    };
  }
  window.addEventListener('DOMContentLoaded', function() {

    console.info('dns loaded');


  });

  //TODO: rename to lookup
  function lookup(name) {
    /**
     * Check localStorage for cached result
     * @type {string | Object}
     */
    var entry = localStorage.getItem(name);
    if (entry === null) {

      $.ajax({
        url     : 'http://api.bits.name',
        type    : 'get',
        data    : {name: name},
        dataType: 'json',
        async   : false,
        done    : function(data) {
          localStorage.setItem(name, JSON.stringify(data));
          entry = data;
        },
        fail    : function(jqXHR, status, error) {
          console.error(
            'Call failed :' + status,
            "Error: " + error,
            jqXHR);
        }
      });

    } else entry = JSON.parse(entry);

    var record = new dnsRecord(name, entry);
    return record;
  }

  //extend URI.js with netSize(){
  /**
   * ~log(relative network size) * 10:
   * freenet/tor*100           = Log(~1) * 10 = 10
   * i2p/torr*100              = ~10          = 20
   * tor/tor*100               = 100          = 30
   * .bit translate (meh)      = 1000         = 40
   * ipv6/ipv4 ~.1 *100 *.bit  = 10000        = 50
   * ipv4/ipv4 * * 100 * .bit  = 100000       = 60
   * ICANN (!.bit translate)   = 1000000      = 70
   *
   * freenet: http://asksteved.com/stats/ 9,000
   * i2p|eep: stats.i2p 40,000
   * Tor: https://metrics.torproject.org/users.html 400,000
   */

// do not use Infinity because Infinity - Infinity = NaN!
//    if(this.is('domain') && !this.is('.bit')) return Number.MAX_VALUE;
//    if(this.is('ip4')) return 60; //10000
//    if(this.is('ip6')) return 50; //1000
//
//    else throw('no valid domain');

  /**
   *  DNS record constructor
   * @type {{
   *   service: (string | Array),
   *   ip: (string | Array),
   *   ip6: (string | Array),
   *   tor: (string | Array),
   *   i2p: (string | Array),
   *   freenet: (string | Array),
   *   alias: (string | Array),
   *   translate: (string | Array),
   *   email: (string | Array),
   *   loc: (string | Array),
   *   info: (string | Array),
   *   ns: (string | Array),
   *   delegate: (string | Array),
   *   import: (string | Array),
   *   map: {Object},
   *   tls: {Object}
   * }}
   * Prevent renaming these inner vars?
   */
  function dnsRecord(name, value) {
    this.name = name;

    this.value = {};
    var values = Object.keys(value);
    values.forEach(function(v) {
      if ([
        'ip',
        'translate'
//Everything else requires testing for connectivity, implement later!
//        'ip6',
//        'alias',
//        'tor',
//        'i2p',
//        'freenet',
//        'ns',
//        'email',

      ].indexOf(v) > -1) {

        this.value[v] = new uri.URI(value[v]);
      } else {
        this.value[v] = value[v];
      }

    });
  }
});

