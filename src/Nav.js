
/**
 * @license AGPLv3 2013
 * @author indolering
 */

'use strict';

/**
 * TODO: fake iframes using Ajax: https://github.com/SpeechJS/speech.js/issues/12
 * TODO: handle pathname, fragments, etc from original URL
 * TODO: support subdomains
 * TODO: native parsing
 */

/**
 * A number, or a string containing a number.
 * @typedef {Object} Record
 * @property {string} name Name of record
 * @property {string} _id PouchDB compatible alias of name param.
 * @property {Http} value Value which contains an http transport with either a FQDN or IPv4 address.
 * @property {string} _rev CouchDB/PouchDB revision string.
 * */

/**
 * A number, or a string containing a number.
 * @typedef {Object} URLParts
 * @property {string} name
 * @property {string} auth
 * @property {Array.<string>} subs Subdomains.
 * @property {string} suffix path + query + hash
 * */

/**
 * @param {Object} iframe iFrame HTML element.
 * @constructor
 */
function Nav(iframe) {

  var that = this;
  this.iframe = iframe;

  /**
   * Parses record and constructs proper URL which is passed to this.go
   * @param {Record} record from DNS server.
   * @param {URLParts} urlParts
   */
  this.load = function(record, uri){

    var dest = record.value.http;
    var url = uri.url;
    var subs = uri.subs;

    //TODO: support subdomains

    if(uri.subs.length>0 && !that.checkIsIPV4(dest)){
      console.warn("Subdomain support is super sketchy!");
      url.host = subs.join('.') + "." + dest;
    } else {
      if(that.checkIsIPV4(dest)) console.error("Subdomains are not supported at all with IP address ATM!, will send to IP directly");
      url.host = dest;
    }

    that.go(url);
  };

  /**
   * @param {URL} url  URL ready for loading in iFrame.
   * TODO: replace w/ an object that can be bound to URL and use postMessage
   * w/ destination sites that include cooperative JS lib.
   */
  this.go = function(url) {
    that.iframe.src = url.href;
  };


  this.checkIsIPV4 = function(entry) {
    var blocks = entry.split(".");
    if(blocks.length === 4) {
      return blocks.every(function(block) {
        return parseInt(block,10) >=0 && parseInt(block,10) <= 255;
      });
    }
    return false;
  };

  return this;

}

