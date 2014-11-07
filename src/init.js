
/**
 * @license AGPLv3 2013
 * @author indolering
 */

'use strict';

/** @define {boolean} */
var DEBUG = true;

/* Routing Logic

 DNS
 ===
 cname:   www.jsdns.tld -> webhost for static site
 A/AAAA:  jsdns.tld     -> dedicated IP
 cname:   *.jsdns.tld   -> dedicated IP
 cname:   api.www.jsdns.tld -> CouchDB Instance

 JavaScript
 ==========
 1) https://destination.jsdns.tld | https://jsdns.tld#destination -> dns.lookup(destination) -> nav.load(destination)
 2) https//jsdns.tld -> https//www.jsdns.tld
 3) https//jsdns.tld/?asdjfa;sdj -> https//www.jsdns.tld/error.html?message

 //TODO: fix HTTPS<->HTTP https://github.com/SpeechJS/speech.js/issues/17
 //TODO: support auth using name.jsdns.tld syntax: https://github.com/speech/speech.js/issues/29

 */


/**
 * Parses the current address to figure out the destination URN and URL component parts.
 * @param {URL} uri Object which implements the URL interface (such as window.location)
 * @returns {{urn: string, subs: (*|Array)}}
 */

function transformURI(uri,callback) {
  var err = null;
  var url = null;

  

  var subs = uri.host.split('.'), //subdomains
    name = "", //Universal Resource Name (the 'name' in 'domain name').
    url = "";

  if (subs.length > 2) { //if subs.name.jsdns.tld
    name = subs[subs.length-3];  //[0, 1, 2, 3][4-3] == [0, 1, 2, 3][1]
    subs =  subs.slice(0,subs.length-3); //["sub", "name", "jsdns", "tld"].slice(0,4-3) = ["subs"]
    url = new URL(uri);
    url.host = name + ".bit";

    if(subs.length>0){
      url.host = subs.join(".") + "." + url.host;
    }

  } else if (uri.hash !== ""){ //if jsdns.tld#subs.name.bit/path?query#hash
    var url = new URL(uri.protocol + "//" + uri.hash.slice(1)); //http: + "//" + subs.name.bit/path?query#hash

    var temp = url.host.split('.'); //'subs.name.bit'.split(.) = [subs, name, bit]

    if(temp[temp.length-1] === "us" && temp[temp.length-2] === "bit"){ //if subs.name.bit.us
      temp = temp.slice(0,temp.length-1); // subs.name.bit
      url.host = temp.join('.');
    }

    subs = temp.slice(0,temp.length-2); //[0,1,2].slice(0, 3-2)
    name = temp[temp.length-2]; // [0,1,2].length  3 - 2 = 1;



  } else if (uri.pathname === "/" && uri.search === "") {  //if 'http://jsdns.tld' (.pathname === "/" when blank)
    err = {
      "name":"redirect",
      "redirect":"https://www." +  uri.host
    };
  } else {
    err= {
      "name":"format",
      "message":"No valid domain name found at " + uri.href
    };
  }

  if(window.location.hostname === "localhost"){
    name = "wikileaks";
  }

  callback(err,{
    "name" : name,
    "subs" : subs,
    "url" : url
  });

}


/**
 * Settings object for Fail errors.
 * @typedef {Object} failParams
 * @property {URL} [url=window.location.href] Current URL
 * @property {(string | boolean)} [urn=false] Desired URN or false if not known.
 * @property {Object | boolean} [value=false] URN DNS record.
 * @property {string} [name='unknown'] Name of error.
 * @property {string} [message='There was a problem looking up your request.'] Message from code detailing error.
 * @property {number} [code=-1] HTTP status codes.
 * @property {string} [text="Unkown error!"] HTTP status code description.
 *
 * */

/**
 * Convenience method for packaging URL and error codes into URL params and forwarding the user to an error page.
 * @param { failParams } e
 * @constructor
 * @template Fail
 */
function Fail(e) {

  if(DEBUG){
    console.error(e);
  } else {


    e.url = e.url || window.location.href;
    e.urn = e.urn || false;
    e.value = e.value || false;  //r.value...
    e.name = e.name || 'unknown';
    e.message = e.message || 'There was a problem looking up your request.';
    e.code = e.code || -1;
    e.text = e.text || "Unkown error!";

//  var tempHost = window.location.host.split(".").slice(-2);
//  tempHost = tempHost.slice(-2);
//
//  var redirect = new URL("http://meta.www." + tempHost.join(".") + "/error.html");


    switch(e.name.toLowerCase()){
      case 'format':
        e.text = 'The name server was unable to interpret the query.';
        e.code = 1;
        break;
      case 'server':
        e.text = 'The name server was unable to process this query due to a problem with the name server.';
        e.code = 2;
        break;
      case 'name':
        e.text = 'Domain name referenced in the query does not exist.';
        e.code = 3;
        break;
      case 'unimplemented':
        e.text = 'The name server does not support the requested kind of query.';
        e.code = 4;
        redirect.path('connect.html');
        break;
      case 'unauthorized':
        e.text = 'Authentication is required and has failed or has not yet been provided.';
        e.code = 401;
        break;
      case 'forbidden':
        e.text = 'Successful authentication but credentials do not grant the client permission to access the resource.';
        e.code = 403;
        break;
      case 'timeout':
        e.text = 'The server timed out waiting for the request.';
        e.code = 408;
        redirect.path('connect.html');
        break;
      case 'length':
        e.text = 'URI too long.';
        e.code = 414;
        break;
      case 'rate':
      case 'flood':
        e.text = 'The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes.';
        e.code = 429;
        break;
      case 'censored':
        e.text = 'Unavailable For Legal and/or Political Reasons';
        e.code = 451;
        break;
    }

    console.error(e.name, e);

    var jsdnsURL = window.location.host.split('.');
    var errorPage = "https://meta.www." + jsdnsURL[jsdnsURL.length - 2] + "." + jsdnsURL[jsdnsURL.length - 1] + "/error.html";

    window.location.href = errorPage + "?" + parameterize(e);
  }
  function parameterize(obj) {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

}
