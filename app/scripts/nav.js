/**
 * @license AGPLv3 2013
 * @author indolering
 */

require.config({
  paths: {
    dns: 'dns',
    resize: 'resize',
    jquery: '../bower_components/jquery/jquery',
    uri: '../bower_components/uri.js/src/URI',
    punycode: '../bower_components/uri.js/src/punycode',
    IPv6: '../bower_components/uri.js/src/IPv6',
    SecondLevelDomains: '../bower_components/uri.js/src/SecondLevelDomains',
    fragmentURI: '../bower_components/uri.js/src/URI.fragmentURI'


  }
});

require([
  'nav',
  'dns',
  'resize'
], function (nav, dns, resize) {
    'use strict';
    var DEBUG = true;
    // Prevent console call to throw errors on old browser
    // Mute console when DEBUG is set to false
    // TODO: turn DEBUG to false on grunt:build
    if (DEBUG === false || !window.console) {
      window.console = {
        assert                    : function() {},
        clear                     : function() {},
        count                     : function() {},
        debug                     : function() {},
        dir                       : function() {},
        dirxml                    : function() {},
        error                     : function() {},
        exception                 : function() {},
        group                     : function() {},
        groupCollapsed            : function() {},
        groupEnd                  : function() {},
        info                      : function() {},
        log                       : function() {},
        markTimeLine              : function() {},
        msIsIndependentlyComposed : function() {},
        profile                   : function() {},
        profileEnd                : function() {},
        table                     : function() {},
        time                      : function() {},
        timeEnd                   : function() {},
        timeStamp                 : function() {},
        trace                     : function() {},
        warn                      : function() {}
      };
    }

//nav.js
//  isolate URN
//  dns.lookup(URN)
//dns.js page   √ *.5
//  lookup DNS record
//  cached + hardcoded
//  bits.name REST API √
//  create + return DNS record object
//nav.js  page   √ *.5
//  $addresses from record.addresses() (prefer https, url, ip4, ip6, ns)
//  var $address
//    while $addresses
//      $test = $addresses.pop()
//      $.getHeaders($test, header, sync)
//        on header status 200
//          assign $address
//          break loop
//  if($address)
//    go forth
//  else
//  Error
    console.info(dns);
    console.info(resize);
    console.info(nav);
    var record;
    window.addEventListener('DOMContentLoaded', function() {

    record = dns.lookup(window.location.host.slice(-3));
    console.info("DNS record returned: ", record);
    });
//    var urls = record.
//      sort(function(a, b) {
//      return a.netSize - b.netSize;
//    });
//
//    var url;
//    while (urls) {
//      url = urls.pop()
//
//      if (reachable(url))
//        break;
//      else
//        url = null;
//    }
//
//    if (url === null)
//      throw('no urls');
//    else
//      iFrame.src = url;
//  }



//  Config page √ *.5
//  About page √ .25
//  Error page √ .75
//  Fake login page √ * .5
//Public ALPHA
//  JS for cooperative website URL passing
//  Arbitrary Publisher URL
//  Arbitrary name URL
//  Get from GitHub repo
//  GitHub auto-discovery
//Developer BETA
//  Backup general publisher server
//    RSS of changes?
//    SubPubHub?
//    CouchDB mirror <-> PouchDB client store?
//    BloomFilter for TTL > 1 hour?
//  Get from Twitter post
//  Twitter auto-discovery
//  Facebook auto-discovery
//  CloudFlare app integration?
//  WebRTC?
//  Weird Ajax iFrame for nameservers??
//  "Authenticated" feeds (http://username:password@url)??
//  PGP message passing??
//Public Beta
//  Twitter/facebook/Diaspora publishing services?



/*
    window.entry;

    var dns = new Worker("/scripts/dns.js");
    dns.addEventListener("message", function (oEvent) {
      //TODO: Implement support for url forwarding only (no masking)
      //TODO: Check IPv6 access?
      //TODO: Check result access?
      //TODO: Test cors?
//    if (answer.cors) {
//      iframe.setAttribute('src', answer.url);
//    } else {
//      window.location.replace(answer.url);
//    }

      //TODO: Sanitize data to stop malicious entries
      console.log('Worker said : ' + oEvent.data);
    }, false);


    dns.postMessage("ali"); // start the worker.
    */
  }
);

