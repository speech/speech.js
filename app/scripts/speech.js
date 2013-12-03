/**
 * @license AGPLv3 2013
 * @author indolering
 */

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

var $ = require('/scripts/libs/jquery'),
  URI = require('/scripts/libs/URI'),
  ready = require('/scripts/libs/ready'),
  DNS = require('scripts/dns'),
  Nav = require('/scripts/nav'),
  resize = require('/scripts/resize');

//TODO: turn all debug and console.info() shit into real unit tests
var DEBUG = true;
// Prevent console call to throw errors on old browser
// Mute console when DEBUG is set to false
// TODO: turn DEBUG to false on grunt:build
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
    ['_setting', {'name': 'subscriber name', 'url': 'jsDNS url'}],
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
    if (dummy[0] === 'www') {
      var uri = new URI();
      uri.subdomain('www');
      uri.path('connect.html');
      dummy[1].translate = uri.href();
    } else if (dummy[0] === 'localhost') {
      var uri = new URI();
      uri.path('connect.html');
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
  console.info('uri: ' + uri);
  /**
   * Universal Resource Name (domain 'name')
   * @type { string }
   */
  var urn = uri.subdomain().split('.').slice(-1).pop();
  console.info('urn: ' + urn, urn);
  /**
   * Hash URI for jsdns.tld#example.bit support
   * @type { string }
   */
  var hash = uri.fragment();
  console.info('fragment: ' + hash);

  if (urn === '') {
    if (hash && hash[0] !== '!')
      urn = hash;
    else if (uri.hostname() == 'localhost' || uri.hostname() == '127.0.0.1') {
      urn = 'localhost';
    } else {
      urn = 'www';
    }
  }

  var record = DNS.lookup(urn);
  console.info('record: ', record);


  var nav = new Nav($('#speech'));
  nav.load(record._jsdns.uris);
  console.info('iframe: ', $('#speech'), 'uris: ', record._jsdns.uris);

});

function dns() {
  return DNS;
  /* see https://github.com/SpeechJS/speech.js/issues/17
   this.iframe = $('#dns');
   this.lookup(urn){
   iframe.postMessage(lookup)
   }
   jquery deferred promises or #dns.listener{nav.load(record)}? */
}

