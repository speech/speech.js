
/**
 * @license AGPLv3 2013
 * @author indolering
 */

function updater(frame) {
  var that = this;

  //TODO: setup handshake
  window.addEventListener('message', function(message) {
    if(message.data.type && message.data.value){
      update(message.data);
    }
  });

  /**
   * Title, URL, and favicon changes as passed from the framed page via babel.js
   * @type {{type: string, value:string}}
   */
  function update(update) {
    var type = update.type;


    if (type === 'location') {
      var url = new URL(update.value);
      var uri = url.port + url.pathname + url.search + url.hash;
      if(window.location.hostname.split('.').length === 2){ //if using jsdns.tld#name.bit
        uri = '#' + window['uri']['name'] + '.bit' + uri;
      }
      history.replaceState(null, null, uri);
    } else if (type === 'title') {
      document.title = update.value;
    } else if (type === 'favicons') {

      var favicons = document.getElementById("favicons");
      while (favicons.firstChild) {
        favicons.removeChild(favicons.firstChild);
      }

      for(var i = 0, len = update.value.length; i < len; i++){
        var favicon = update.value[i];
        var dummy = document.createElement('div');
        dummy.innerHTML = favicon.html;
        dummy.firstChild.href=favicon.href;
        favicons.appendChild(dummy.firstChild);
      }

    }
  }

    //note: this will only prevent pranksters in other tabs/windows from sending in faulty titles, etc.
  //if you want to control who is framing your site, set the x-frames-options header!
  function createNonce(){
    var crypt = window.crypto || window.msCrypto;
    return crypt.getRandomValues(new Uint32Array(1))[0];
  }
}

/**
 * Binds iFrame to window resize events in-sync with paint to avoid flicker
 * Credit: https://developer.mozilla.org/en-US/docs/Web/Reference/Events/resize
 * (re)Licensed: http://tinyurl.com/mle6an4
 * @param {HTMLIFrameElement} frame iFrame to be resized to match window size.
 */
function resizer(frame){

  var that = this;
  this.iframe = frame;
  that.iframe.height = document.documentElement.clientHeight;
  that.iframe.width = document.documentElement.clientWidth;

  this.resizeFired = false;
  this.drawing = false;
  this.reqFrame = window.requestAnimationFrame;

  this.throttleResize = function() {
    if (drawing === false) {
      that.resizeFired = true;
      that.drawResize();
    }
  };

  this.drawResize = function() {
    // render friendly resize loop
    if (that.resizeFired === true) {
      that.resizeFired = false;
      that.drawing = true;

      that.iframe.height = document.documentElement.clientHeight;
      that.iframe.width = document.documentElement.clientWidth;
      //TODO: make this standards compliant
      //https://bugzilla.mozilla.org/show_bug.cgi?id=189112#c7
      //https://developer.mozilla.org/en-US/docs/Web/API/window.innerHeight?redirectlocale=en-US&redirectslug=DOM%2Fwindow.innerHeight

      that.reqFrame(drawResize);
    } else {
      that.drawing = false;
    }
  };

  window.addEventListener('resize', that.throttleResize, false);
}

