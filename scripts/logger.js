/**
 * @license AGPLv3 2014
 * @author indolering
 */

'use strict';


/**
 * Error logging switch which is turned on by default.
 * @type {boolean} ERROR
 */
var ERROR = false;

/**
 * Error logging switch which one on cascades up the chain of importance, so if
 * DEBUG is on than the presumably more interesting WARN and INFO are as well
 * @type {boolean}
 */
var DEBUG = ERROR,
  WARN = DEBUG,
  INFO = WARN;

/**
 * General purpose logger which obeys log-level switch set at compile time.
 * @param {...string} message Indefinite number of message(s) to be logged.
 */
function logger(message) {

  var that = this;

  function sortMessages(args) {
    var messages = [];
    for (var i = 0; i < args.length; i++) {
      messages[i] = args[i];
    }
    return messages;
  }

  this.log = function(message) {
    var messages = sortMessages(arguments);
    that.checker(messages, DEBUG, function(m) {
      console.log(m);
    });
  };

  this.error = function(message) {
    var messages = sortMessages(arguments);
    that.checker(messages, ERROR, function(m) {
      console.error(m);
    });
  };

  this.warn = function(message) {
    var messages = sortMessages(arguments);
    that.checker(messages, WARN, function(m) {
      console.warn(m);
    });
  };

  this.info = function(message) {
    var messages = sortMessages(arguments);
    that.checker(messages, INFO, function(m) {
      console.info(m);
    });
  };

  /**
   * Handles printing logging message, handles outputting objects.
   * @param {?} m Message to be printed.
   * @param {function} logFunc console .log | .info | .warn | .error
   */
  this.printer = function(m, logFunc) {

    if (typeof m === 'Object') {
      if (window.navigator.userAgent.indexOf('PhantomJS') > -1) {
        m = JSON.stringify(m);
      } else {
        logFunc = console.dir;
      }
    }

    logFunc(m);
  };

  /**
   * Filters out undefined and null messages (such as those passed when a
   * callback may or may not have an error) as well as stringify JSON.
   * @param {Array.<?>} messages Item(s) to be logged.
   * @param {boolean} logLevel Logging level switch.
   * @param {function} logFunc console .log | .info | .warn | .error
   */
  this.checker = function(messages, logLevel, logFunc) {
    if (messages.length > 1) {
      console.group();
    }
    messages.forEach(function(m) {
      if (typeof message !== 'undefined' && message !== null && logLevel) {
        that.printer(m, logFunc);
      }
    });
    if (messages.length > 1) {
      console.groupEnd();
    }
  };

}

module.exports = new logger;