(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("_scripts/config", function(exports, require, module) {
/**
 * @license AGPLv3 2013
 * @author indolering
 */

//TODO: Create Github ticket about th eneed for a new build config
require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
    domReady: '../bower_components/requirejs-domready/domReady',
    requirejs: '../bower_components/requirejs/require',
    URI: '../bower_components/uri.js/src/URI',
    IPv6: '../bower_components/uri.js/src/IPv6',
    SecondLevelDomains: '../bower_components/uri.js/src/SecondLevelDomains',
    punycode: '../bower_components/uri.js/src/punycode',
    URITemplate: '../bower_components/uri.js/src/URITemplate',
    'jquery.URI': '../bower_components/uri.js/src/jquery.URI'
  }
});

//pretty sure this should just be define.
define(function(require) {
  'use strict';

  var $ = require('jquery'),
    URI = require('URI'),
    domReady = require('domReady'),
    DNS = require('dns');
//  (['config', 'DNS', 'URI', '$', 'domReady'],
//  function(config, DNS, URI, $, domReady) {
//    'use strict';
    function config() {
      console.log('config created');
    }
      //redo this correctly using handlebar partials
      config.createEntries = function(records) {
        if (records === null || records === undefined || records.length < 1) {
          records = DNS.getRecords();
        }
        var accordion = $('#accordion');
        records.forEach(function(r) {
          if (r.name !== undefined && r.name !== 'undefined') {

            //TODO: redo using Jade or handlebars
            var content =
              '<div id ="' + r.name + '-panel" class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<h4 class="panel-title">' +
                '<a data-toggle="collapse" data-parent="#accordion" href="#' + r.name + '-container">' +
                r.name + '</a>' +
                '</h4>' +
                '    </div>' +
                '    <div id="' + r.name + '-container" class="panel-collapse collapse">' +
                '    <div class="panel-body"><pre id="' + r.name + '-value">' + JSON.stringify(r.value, undefined, 2) +
                '</pre></div>' +
                '<button onclick=\'config.del("' + r.name + '")\'' +
                ' class="pull-right btn btn-danger">delete</button>' +
                '<a href=#editor>' +
                '<button onclick=\'config.edit("' + r.name + '")\'' +
                ' class="pull-right btn btn-warning">edit</button>' +
                '</a>' +
                '    </div>' +
                '  </div>';
          }
          accordion.append(content);
        });

      }

      config.edit = function(name) {

        $('#editor').val(JSON.stringify(DNS.lookup(name).value,undefined,2));
        $('#name').val(name);
      };

      config.save = function() {
        var name = $('#name').val();
        var value = $('#editor').val();
        DNS.save({name: name, value: value});
        config.createEntries([DNS.lookup(name)]);
      };

      config.del = function(name) {
        $('#' + name + '-panel').remove();
        DNS.delete(name);
      };

    window.config = config;
    domReady(function () {
      config.createEntries();
    });
    return config;

  }
);
});

;require.register("_scripts/dns", function(exports, require, module) {
/**
 * TODO: Switch to webworkers and setup monitoring for background updates
 * TODO: When Firefox enables webworker access to IndexDB, switch to PouchDB
 * TODO: Adapters for github, twitter, fb, WebRTC DHT, etc.
 * @license AGPLv3 2013
 * @author indolering
 */

define(function(require) {
  'use strict';

  var $ = require('jquery'),
    URI = require('URI'),
    SecondLevelDomains = require('SecondLevelDomains'),
    Record = require('Record'),
    Fail = require('Fail');

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
  }

  /**
   * Equivalent to namecoind name_show d/name or whois on traditional DNS but
   * it assumes '.bit' and it does not support including ANY tld in the query.
   * @param {string} name Domain to lookup, assumes '.bit' tld.
   * @returns {Record} Full DNS record for 'name'
   */
  DNS.lookup = function(name) {
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
  DNS.fetch = function(name) {
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
  DNS.save = function(r) {
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
  DNS.delete = function(name) {
    localStorage.removeItem(name);
  };

  /**
   * Returns *all* records in client storage.
   * @returns {Array.<bit-value>} Array of DNS records.
   */
  DNS.getRecords = function() {
    var records = [];
    Object.keys(localStorage).forEach(function(key){
      if (key.substring(0,1) !== '_' &&
        key !== 'consoleHistory' &&
        key !== 'breakpoints' &&
        key !== 'undefined' &&
        key !== undefined) {
        var r = JSON.parse(localStorage.getItem(key));
        records.push({name: r.name, value: r.value});
      }
    });
    return records;
  };

  return DNS;
});


});

;require.register("_scripts/fail", function(exports, require, module) {
/**
 * @license AGPLv3 2013
 * @author indolering
 */
define('Fail', function(require) {
  'use strict';

  var $ = require('jquery'),
    URI = require('URI'),
    SecondLevelDomains = require('SecondLevelDomains'),
    punycode = require('punycode');

  /**
   * Settings object for Fail errors.
   * @typedef {Object} failParams
   * @property {bit-value} value - this.message.value,
   * @property {number} code - this.message.code,
   * @property {string} name - this.message.name,
   * @property {string} message - this.message.message
   * */

  /**
   * Factory for Fail (custom error) objects. Convenience method for packaging
     * the URL to the error page and translating error codes.
   * @param { failParams } failInfo
   * @constructor
   * @template Fail
   * @returns {Fail}
   */
  function Fail(failInfo) {

    this.name = failInfo.name || "Fail";
    this.message = failInfo;

  }

  Fail.prototype = new Error();
  Fail.prototype.constructor = Fail;

  Fail.prototype.over = function() {

    var e = {
      url    : location.href,
      urn    : new URI().subdomain().split('.').slice(-1).pop(),
      value  : this.message.value,  //r.value...
      name   : this.message.name,
      message: this.message.message
    };

    var redirect = new URI().path('error.html').subdomain('');


    switch (e.name.toLowerCase()) {
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
        e.message = 'The domain name ' + e.urn + ' could not be found';
//        redirect.path('connect.html');
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
      case 'calm':
        e.text = 'The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes.';
        e.code = 420;
        break;
      case 'rate':
      case 'flood':
        e.text = 'The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes.';
        e.code = 429;
        break;
      case 'censored':
        e.text = 'Unavailable For Legal Reasons';
        e.code = 451;
        break;
      default:
        if (!e.code)
          e.code = -1;

        if (!e.name)
          e.name = 'unknown';

        if (!e.message)
          e.message = 'There was a problem looking up your request.';
    }

    console.log(e.name, e);

    location.href = new URI().
      path('error.html').
      subdomain('').
      addQuery(e).
      href();
  };

  return Fail;

});


});

;require.register("_scripts/nav", function(exports, require, module) {
/**
 * @license AGPLv3 2013
 * @author indolering
 */
//
//require(['DNS', 'resize', 'Fail', 'URI', 'jquery'],
//  function(DNS, resize, Fail, URI, $) {
define(function(require) {
  'use strict';

  var $ = require('jquery'),
    URI = require('URI'),
    Fail = require('fail');
//
//    define(['DNS', 'resize', 'Fail', 'URI', 'jquery'],
//      function(DNS, resize, Fail, URI, $) {
//
//    'use strict';

  //TODO: move all this init shit into an init function
  //init
  // creates speech.js postMessage() watchers
  // returns [URLS] + postMessage
  //
  //main func tests urls
  //loads in url bar
//    function init() {
//      /**
//       * URL from the url bar, which is really a Universal Resource Indicator as
//       * it is the jsdns URL + URN of the destination site.
//       * @type {URI}
//       */
//      var uri = new URI();
//      console.info('uri: ' + uri);
//      /**
//       * Universal Resource Name (domain 'name')
//       * @type { string }
//       */
//      var urn = uri.subdomain().split('.').slice(-1).pop();
//      console.info('urn: ' + urn);
//      /**
//       * Hash URI for speech.is#example.bit support
//       * @type { string }
//       */
//      var hash = URI(uri.fragment());
//      console.info('fragment: ' + hash);
//      /**
//       * Main navigational frame
//       * @type {Object}
//       */
//      var iframe = $('#speech');
//      console.info('iframe: ', iframe);
//      if (urn === '') {
//        if (hash.tld())
//        //TODO: test this
//          urn = hash.domain().slice(0, -hash.tld().length)[0];
//        else
//          urn = 'www';
//      }
//      return {urn: urn, iframe: iframe};
//    }

//    var __ret = init();
//    var urn = __ret.urn;
//    var iframe = __ret.iframe;
//    var record = DNS.lookup(urn);
//    console.info('record: ', record);
//
//    var urls = record._jsdns.uris;
//
//    console.info('urls: ' + urls, urls);

//    load(urls);
  function Nav(iframe) {

    this.iframe = iframe;
    this.self = this;
    // TODO: look into weird XHTTP request pseudo-iFrame hack
    // Sites relying on nameservers instead of dedicated IPs or `translate` URLs
    // require asking the nameserver using headers w/ the .bit address but since
    // the client obviously doesn't have a DNS server which resolves the .bit
    // domain name space we have to forge the headers.  This is doable with
    // XHTTP but not with iFrames HOWEVER the destination site will require CORS
    // which would be easier than a full website port.  Anyway, that's why
    // this is a weird object instead of just a var, because it might be
    // abstracted and I have an unhealthy obsession with OO code :p
    // TODO: make a github ticket explaining the above :p

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
    }

    /**
     * Tests all potential URI's for connectivity
     * @param {(Array.<URI> | Array.<string>)} urls
     * TODO: Benchmark webSockets vs HEAD request
     */
    this.load = function(urls) {

      //TODO: modularize into
      // 404
      //  fails
      // Success = urls.some( try (test())
      //                      catch(fail){
      //                           if(fail == 404) 404s.push(fail)
      //                      finally(if (debug) log fail; return false);
      //  if(no success){ if (404) success = 404 uri
      //                  elseif (fails) throw fails
      //                  else throw new fail
      //

      var result = urls.some(function(url, go) {
        //TODO: replace localStorage w/ a better abstraction layer
        //new URI because localStorage mangles URI objects
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
              self.go(url);
              return true;
            } else {
              console.warn(url.href() + ' is NOT reachable.');
              console.groupEnd();
//                throw new Fail({name:'timeout', message:'None of these urls worked: ' + urls});
              return false;
            }
          })
      });
    }

  }

  //I'm not proud of this, but I need this thing working right fucking NOW.
//  window.go = this.go;
//  window.iframe = iframe;
//}
//

  return Nav;
});
});

;require.register("_scripts/record", function(exports, require, module) {
/**
 * @license AGPLv3 2013
 * @author indolering
 */
define(function(require) {
  'use strict';

  var $ = require('jquery'),
    URI = require('URI'),
    SecondLevelDomains = require('SecondLevelDomains');
//    punycode = require('punycode');

  /**
   * Valid 'value' field from .bit domain name spec.
   * @typedef {Object} bit-value
   * @property {(string | Array.<string>)} service,
   * @property {(string | Array.<string>)} ip,
   * @property {(string | Array.<string>)} ip6,
   * @property {(string | Array.<string>)} tor,
   * @property {(string | Array.<string>)} i2p,
   * @property {(string | Array.<string>)} freenet,
   * @property {(string | Array.<string>)} alias,
   * @property {(string | Array.<string>)} translate,
   * @property {(string | Array.<string>)} email,
   * @property {(string | Array.<string>)} loc,
   * @property {(string | Array.<string>)} info,
   * @property {(string | Array.<string>)} ns,
   * @property {(string | Array.<string>)} delegate,
   * @property {(string | Array.<string>)} import,
   * @property {Object} map,
   * @property {Object} tls
   * */


  /**
   * Record for DNS entries.
   * @typedef {Object} Record
   * @property {String} name - Name of domain, assumes '.bit'
   * @property {bit-value} value - 'value' field from .bit domain name spec.
   * @property {Object} _jsdns - convenience used by JSDNS, not standard.
   * */

  /**
   * Factory for DNS objects.
   * @param { string } n Name field for record.
   * @param {( string | {bit-value} )} v DNS value field for record.
   * @constructor
   * @template Record
   * @returns {Record}
   */
  function Record(n, v) {

    if (typeof v == 'string')
      v = JSON.parse(v);

    this.name = n;
    this.value = v;
    this._jsdns = {
      uris: []
    };

    var uris = this._jsdns.uris;
    Object.keys(v).forEach(function(key) {
      if ([
        'ip',
        'translate'
        //TODO: the rest of these require testing for connectivity.
        //'ip6',
        //'alias',
        //'tor',
        //'i2p',
        //'freenet',
        //'ns',
        //'email',
      ].indexOf(key) > -1) {

        //spec store single entries as String and multiple entries as an array
        var temp = v[key];
        if (!$.isArray(temp)) {
          temp = new Array(temp)
        }

        //TODO: extend uri.js to accept IP's as the hostname by default
        temp.forEach(function(uri) {
          if (key === 'ip' || key === 'ip6') {
            uri = '//' + uri;
          }
          uris.push(new URI(uri).href());
          //.href() because local storage is messing up the functions. Temp Fix.
        });

      }
    })

  }

  /*
   * TODO: extend URI.js to include 'tor' etc and store type as number
   * TODO: sort URI array by network size:
   *
   * this._jsdns.uris.sort(function(a,b){
   *   ...
   * });
   *
   * ~log(relative network size) * 10:
   * freenet/tor*100           = Log(~1) * 10 = 10
   * i2p/torr*100              = ~10          = 20
   * tor/tor*100               = 100          = 30
   * translate -> .bit (why?)  = 1000         = 40
   * ipv6/ipv4 ~.1 *100 *.bit  = 10000        = 50
   * ipv4/ipv4 * * 100 * .bit  = 100000       = 60
   * ICANN (translate -> !.bit)= 1000000      = 70
   *
   * freenet: http://asksteved.com/stats/ 9,000
   * i2p|eep: stats.i2p 40,000
   * Tor: https://metrics.torproject.org/users.html 400,000
   */
  return Record;
});


});

;require.register("_scripts/resize", function(exports, require, module) {
/**
 * Binds iFrame to window resize events in-sync with paint to avoid flicker
 * @license AGPLv3 2013
 * @author indolering
 * Credit: https://developer.mozilla.org/en-US/docs/Web/Reference/Events/resize
 * (re)Licensed: http://tinyurl.com/mle6an4
 */

define(function(require) {
  'use strict';

  var domReady = require('domReady'),
    resizeFired = false,
    drawing = false,
    reqFrame = window.requestAnimationFrame;

domReady(function () {
    var iframe = document.getElementById('speech');
    iframe.height = document.documentElement.clientHeight;
    iframe.width = document.documentElement.clientWidth;
    window.addEventListener('resize', throttleResize, false);
    console.info('resize.js registered');
    if(!iframe){
      console.error('iframe is '+ iframe + " in resize.js");
    }
  });

function throttleResize() {
  if (drawing === false) {
    resizeFired = true;
    drawResize();
  }
}

function drawResize() {
  // render friendly resize loop
  if (resizeFired === true) {
    resizeFired = false;
    drawing = true;

    iframe.height = document.documentElement.clientHeight;
    iframe.width = document.documentElement.clientWidth;
    //TODO: make this standards compliant
    //https://bugzilla.mozilla.org/show_bug.cgi?id=189112#c7
    //https://developer.mozilla.org/en-US/docs/Web/API/window.innerHeight?redirectlocale=en-US&redirectslug=DOM%2Fwindow.innerHeight

    reqFrame(drawResize);
  } else {
    drawing = false;
  }
}
});
});

;require.register("app", function(exports, require, module) {

var hello = require('/scripts/helloWorld').hello;

console.log(hello());

window.onload = function() {
  document.getElementById('hello').innerText = hello();
}

///**
// * @license AGPLv3 2013
// * @author indolering
// */
//
///* Routing setup
//
//DNS
// 1) www.jsdns.tld -> IP
// 2) *.jsdns.tld -> IP
//
//Virtual Host
// 1) TODO: https://api.www.jsdns.tld -> /var/www/api/
// 2) https://www.jsdns.tld -> /var/www/jsdns.tld/
// 3) http(s)//*.jsdns.tld -> /var/www/jsdns.tld/index.html
//
//    Note that WHATEVER the URL, the vhost for *.jsdns.tld ALWAYS returns the
//    index.html file.  Also note the *.www.jsdns.tld hack, we can still have
//    cnames we just have to throw 'www' in the front of them.
//
//JavaScript
// 1) https://destination.jsdns.tld -> dns.lookup(destination) -> nav.check(destination)
//      TODO: if (destination !https) downgrade to http
//      finally nav.go(destination)
// 2) https//jsdns.tld -> https//www.jsdns.tld
// 3) https//www.jsdns.tld -> https//www.jsdns.tld (login/find DNS publisher)
//
// */
//
//
//require.config({
//  paths: {
//    jquery: '../bower_components/jquery/jquery',
//    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
//    domReady: '../bower_components/requirejs-domready/domReady',
//    requirejs: '../../bower_components/domready/ready.js',
//    URI: '../bower_components/uri.js/src/URI',
//    IPv6: '../bower_components/uri.js/src/IPv6',
//    SecondLevelDomains: '../bower_components/uri.js/src/SecondLevelDomains',
//    punycode: '../bower_components/uri.js/src/punycode',
//    URITemplate: '../bower_components/uri.js/src/URITemplate',
//    'jquery.URI': '../bower_components/uri.js/src/jquery.URI'
//  }
//});
//
////TODO: change everything to sugary require declarations
//require(['scripts/dns', 'resize', 'nav', 'jquery', 'domReady', 'URI'],
//  function(DNS, resize, Nav, $, domReady, URI) {
//    'use strict';
//    /**
//     * @define {boolean} enables debug mode switch for compiler arg
//     */
//
//    //TODO: turn all debug and console.info() shit into real unit tests
//    var DEBUG = true;
//    // Prevent console call to throw errors on old browser
//    // Mute console when DEBUG is set to false
//    // TODO: turn DEBUG to false on grunt:build
//    if (DEBUG) {
//
//      //TODO: make internal to jsDNS server.
//      //TODO: add some major sites external to jsDNS server.
//      var dummies = [
//        ['www', {'translate': 'http://www.speech.is/connect.html'}],
//        ['ipv4', {'ip': '208.113.212.187'}],
//        ['ipv6', {'ip6': '2607:f298:5:102b::ddb:b09e'}],
//        ['ipv4-2', {'ip': ['208.113.212.187', '208.113.212.1s87']}],
//        ['ipv6-2', {'ip6': ['2607:f298:5:102b::ddb:b09e',
//          '2607:f298:5:102b::af3:5aa3']}],
//        ['bits', {'ip': ['208.113.212.187'], 'cors': ['speech.is']}],
//        ['indolering', {'ip': ['208.113.212.21'], 'cors': ['speech.is']}],
//        ['eff', {'translate': 'https://www.eff.org'}],
//        ['sunlightfoundation', {'translate': 'http://www.sunlightfoundation.com'}],
//        ['internetdefenseleague', {'translate': 'http://www.internetdefenseleague.org'}],
//        ['wikipedia', {'translate': 'https://www.wikipedia.org'}],
//        ['accessnow', {'translate': 'https://www.accessnow.org'}],
//        ['reddit', {'translate': 'https://www.reddit.com'}],
//        ['freepress', {'translate': 'http://www.freepress.net/'}],
//        ['aaronsw', {'translate': 'http://www.aaronsw.com/'}],
//        ['fightforthefuture', {'translate': 'http://www.fightforthefuture.org/'}],
//        ['_setting', {'name': 'subscriber name', 'url': 'jsDNS url'}]
//      ];
//      dummies.forEach(function(dummy) {
//        DNS.save({'name': dummy[0], 'value': dummy[1]});
//      });
//    }
//
//    domReady(function () {
//
//
//      /**
//       * URL from the url bar, which is really a Universal Resource Indicator as
//       * it is the jsdns URL + URN of the destination site.
//       * @type {URI}
//       */
//      var uri = new URI();
//      console.info('uri: ' + uri);
//      /**
//       * Universal Resource Name (domain 'name')
//       * @type { string }
//       */
//      var urn = uri.subdomain().split('.').slice(-1).pop();
//      console.info('urn: ' + urn, urn);
//      /**
//       * Hash URI for jsdns.tld#example.bit support
//       * @type { string }
//       */
//      var hash = uri.fragment();
//      console.info('fragment: ' + hash);
//
//      if (urn === '') {
//        if (hash && hash[0] !== '!')
//          urn = hash;
//        else
//          urn = 'www';
//      }
//
////      var dns = new dns();
//      var record = DNS.lookup(urn);
//      console.info('record: ', record);
//
//
//      var nav = new Nav($('#speech'));
//      nav.load(record._jsdns.uris);
//      console.info('iframe: ', $('#speech'), 'uris: ', record._jsdns.uris);
//
//    });
//
//
//
//
//    //TODO: abstract into httpS://api.www.jsdns.tld iFrame.postMessage()
//    // isolates localStorage from malicious MTM attacks when destination site
//    // http://example.jsdns.tld is not wrapped in SSL (Firefox will block comms
//    // from HTTPS sites to non HTTPS websites).
//    function dns(){
//      return DNS;
//        //this.iframe = $('#dns');
////      this.lookup(urn){
////        //iframe.postMessage(lookup)
////      }
//      //jquery deferred promises or #dns.listener{nav.load(record)}?
//    }
//
////  dns.js √ 100%
////  bits.name REST API √ 100%
////  speech.js    √ 99%
////  Config page √ 90%
////  Demo page 0%
////  DNS config √ 100%
////  Server config √90%
////  About page 25%
////  Error page √ 100%
////Public ALPHA
////  Fake (temp) login page
////  Cut down on build time
////  JS for cooperative website URL passing
////  Arbitrary Publisher webhooks
////  Arbitrary name webhooks
////  Source from GitHub repo
////  GitHub auto-discovery
////  Github login page
////  Gmail login page?
////
////Developer BETA
////  Get load and processing times down to 100ms (cached)?
////  Official channels publish material OR return error 451 OR check bloomfilter
////    for censored sites at which point the client fetches diff from
////    decentralized sources.
////  Additional general publishing servers for backup.
////    RSS of changes?
////    SubPubHub?
////    CouchDB mirror <-> PouchDB client store?
////    BloomFilter for TTL > 1 hour?
////    Push to namecoin clients?
////  Get from Twitter post
////  Twitter auto-discovery from friends and messages
////  Spam detection and baysian filtering
////  Facebook auto-discovery
////  CloudFlare app integration?
////  WebRTC?
////  Weird Ajax iFrame for nameservers??
////  'Authenticated' feeds (http://username:password@url)??
////  PGP message passing??
////Public Beta
////  Twitter/facebook/Diaspora publishing backend?
////  Non HTTP redirects?
////  Reverse proxy for webspiders mapping
////  Crowdsourced DMCA frontend
//  }
//);
//

});

;require.register("scripts/helloWorld", function(exports, require, module) {
exports.hello = function(){
  return 'Hello World!';
}
});

;
//# sourceMappingURL=app.js.map