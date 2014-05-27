/**
 * @license AGPLv3 2013
 * @author indolering
 */
'use strict';

/* Routing Info

 DNS
 1) www.jsdns.tld -> IP
 2) *.jsdns.tld -> IP

 Virtual Host
 1) TODO: https://api.www.jsdns.tld -> /var/www/api/
 2) https://www.jsdns.tld -> /var/www/jsdns.tld/
 3) http(s)//*.jsdns.tld -> /var/www/jsdns.tld/index.html

 Note that WHATEVER the URL, the vhost for *.jsdns.tld ALWAYS returns the
 index.html file.  Also note the *.www.jsdns.tld hack, we can still have
 cnames we just have to throw 'www' in the front of them.

 JavaScript
 1) https://destination.jsdns.tld -> dns.lookup(destination) -> nav.check(destination)
 TODO: if (destination !https) downgrade to http
 finally nav.go(destination)
 2) https//jsdns.tld -> https//www.jsdns.tld
 3) https//www.jsdns.tld -> https//www.jsdns.tld (login/find DNS publisher)

 */

//var $ = require('/scripts/libs/jquery'),
//  URI = require('/scripts/libs/URI'),
//  ready = require('/scripts/libs/ready'),
//  DNS = require('scripts/dns'),
//  Nav = require('/scripts/nav'),
//  resize = require('/scripts/resize');



var $ = require('./libs/jquery'),
  URI = require('./libs/uri.js/src/URI'),
  ready = require('./libs/ready'),
  resize = require('./resize'),
  DNS = require('./dns'),
  Nav = require('./nav'),
  log = require('./logger');

//var $ = require('./libs/jquery/dist/jquery'),
//  URI = require('./libs/uri.js/src/URI'),
//  ready = require('./libs/domready/ready.min'),
//  resize = require('./resize'),
//  DNS = require('./dns'),
//  Nav = require('./nav'),
//  log = require('./logger');


//TODO: turn all debug and console.info() shit into real unit tests
var DEBUG = true;
// Prevent console call to throw errors on old browser
// Mute console when DEBUG is set to false
// TODO: turn DEBUG to false on gulp:production
if (DEBUG) {

  //TODO: make internal to jsDNS server.
  //TODO: add some major sites external to jsDNS server.
  var dummies = [
    ['www', {'translate': ''}],
    ['localhost', {'translate': ''}],
    ['ipv4', {'ip': '208.113.212.187'}],
    ['ipv6-2', {'ip6': ['2607:f298:5:102b::ddb:b09e',
      '2607:f298:5:102b::af3:5aa3']}],
    ['ipv6', {'ip6': '2607:f298:5:102b::ddb:b09e'}],
    ['ipv4-2', {'ip': ['208.113.212.187', '208.113.212.1s87']}],
    ['bits', {'ip': ['208.113.212.187'], 'cors': ['speech.is']}],
    ['$setting', {'name': 'subscriber name', 'url': 'jsDNS url'}],
    ['reddit', {'translate': 'http://www.reddit.com'}],
    ['aaronsw', {'translate': 'http://www.aaronsw.com/'}],
    ['wikipedia', {'translate': 'http://www.wikipedia.org'}],
    ['accessnow', {'translate': 'http://www.accessnow.org'}],
    ['indolering', {'ip': ['208.113.212.21'], 'cors': ['speech.is']}],
    ['fightforthefuture', {'translate': 'http://www.fightforthefuture.org/'}],
    ['internetdefenseleague', {'translate': 'http://internetdefenseleague.org'}]
  ];
  dummies.forEach(function(dummy) {
    //hardcoded hack to get this working on non-speech.is sites
    var uri = new URI();
    if (dummy[0] === 'www') {
      uri.subdomain('www');
      uri.path('/Speech.js/site/connect.html');
      dummy[1].translate = uri.href();
    } else if (dummy[0] === 'localhost') {
      uri.path('/Speech.js/site/connect.html');
      dummy[1].translate = uri.href();
    }
    DNS.save({'name': dummy[0], 'value': dummy[1]});
  });
}

ready(function() {


  /**
   * URL from the url bar, which is really a Universal Resource Indicator as
   * it is the jsdns URL + URN of the destination site.
   * @type {URI}
   */
  var uri = new URI();
  log.info('uri: ' + uri);
  /**
   * Universal Resource Name (domain 'name')
   * @type { string }
   */
  var urn = uri.subdomain().split('.').slice(-1).pop();
  log.info('urn: ' + urn, urn);
  /**
   * Hash URI for jsdns.tld#example.bit support
   * @type { string }
   */
  var hash = uri.fragment();
  log.info('fragment: ' + hash);

  if (urn === '') {
    if (hash && hash[0] !== '!') {
      urn = hash;
    } else if (uri.hostname() === 'localhost' || uri.hostname() === '127.0.0.1') {
      urn = 'localhost';
    } else {
      urn = 'www';
    }
  }

//  var nav = new Nav($('#speech'));
  var speech = document.getElementById('speech');
  var nav = new Nav(speech);
  DNS.lookup(urn, nav.load);
  speech.contentWindow.addEventListener('message', function(m) {
    //no message.origin check because only specific iframe can trigger message
    updater(m.data);
  });


});

/**
 * Title, URL, and favicon changes as passed from the framed page via babel.js
 * @type {{type: string, type:string}}
 */
function updater(update) {
  var type = update.type;

  console.dir(update);
  if (type === 'location') {
    var url = new URL(update.value);
    var postfix = url.pathname;
    if (url.search) {
      postfix = '?' + url.search;
    }
    if (url.hash) {
      postfix = '#' + url.hash;
    }
    history.replaceState(postfix);
  } else if (type === 'title') {
    document.title = update.value;
  } else if (type === 'favicon') {

    if (document.getElementById('favicon')) {
      document.head.removeChild(document.getElementById('favicon'));
    }


    var favicon = document.createElement('link');
    favicon.id = 'favicon';
    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';
    favicon.href = update.value;
//    document.getElementsByTagName('head')[0].appendChild(favicon);
    document.head.appendChild(favicon);
  }
}

function dns() {
  return DNS;
  /* see https://github.com/SpeechJS/speech.js/issues/17
   this.iframe = $('#dns');
   this.lookup(urn){
   iframe.postMessage(lookup)
   }
   jquery deferred promises or #dns.listener{nav.load(record)}? */
}

