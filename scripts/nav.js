/**
 * @license AGPLv3 2013
 * @author indolering
 */

'use strict';

var $ = require('./libs/jquery/dist/jquery'),
  URI = require('./libs/uri.js/src/URI'),
  Record = require('./record');


  function Nav(iframe) {

  this.iframe = iframe;
  //  this.self = this; //WTF, WHY DID THIS STOP WORKING?!
  window.nav = this;


  // https://github.com/SpeechJS/speech.js/issues/12
  // is why this is a weird object instead of just a var:
  // it might be abstracted away.
  /**
   * @param {string | Object} url Full href (jsDNS) or URI object (internal nav)
   * TODO: replace w/ an object that can be bound to URL and use postMessage
   * w/ destination sites that include cooperative JS lib.
   */
  this.go = function(url) {
    if (typeof url === 'string') {
      url = URI(url);
    }
    //TODO: handle pathname, fragments, etc from original URL
    this.iframe.attr('src', url.href());
  };

  /**
   * Tests all potential URI's for connectivity
   * @param {Record} record with possible destinations
   * TODO: Benchmark webSockets vs HEAD request.
   */
  this.load = function(record) {

    record.$jsdns.uris.forEach(function(url) {

      url = new URI(url);
      console.group();
      console.info('connectivity test of ' + url.href());
      $.ajax({
        type: 'HEAD',
        url : url.href()
      })
        .complete(function(jqXHR, textStatus) {
          console.info(url, jqXHR, textStatus);
          if (textStatus !== 'timeout') {
            //DNS level connectivity === timeouts.
            console.info(url.href() + ' is reachable.');
            console.groupEnd();
            //TODO: do this w/out the global var!
            //self.go(url);
            window.nav.go(url);
          } else {
            console.warn(url.href() + ' is NOT reachable.');
            console.groupEnd();
//          throw new Fail({name:'timeout', message:
//            'None of these urls worked: ' + urls});
          }
        });
    });
  };

}

module.exports = Nav;
