/**
 * Binds iframe to window resize events in-sync with paint to avoid flicker
 * @license AGPLv3 2013
 * @author indolering
 * Credit: https://developer.mozilla.org/en-US/docs/Web/Reference/Events/resize
 * (re)Licensed: http://tinyurl.com/mle6an4
 */
var iframe;

window.addEventListener('DOMContentLoaded', function() {
  iframe = document.getElementById('speechjs');
  iframe.height = document.documentElement.clientHeight;
  iframe.width = document.documentElement.clientWidth;
  window.addEventListener('resize', throttleResize, false);
  console.info('resize onload registered');
  if(!iframe){
    console.error('iframe is '+ iframe + " in resize.js");
  }
});

var resizeFired = false,
  drawing = false,
  reqFrame = window.requestAnimationFrame;

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