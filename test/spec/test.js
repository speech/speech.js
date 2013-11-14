/*global describe, it */
'use strict';
(function () {
//    describe('Checking Nav.js', function () {
//        describe('postMessage Checks', function () {
//            it('Worker Alive?', function () {
//                worker.postmessage('hello world');
//                window.entry == 'hello world';
//            });
//        });
//    });

  describe('Check Window Height', function () {
    var iframe = document.getElementById('speechjs');
    it('',function(){
      return iframe.height ==
        document.documentElement.clientHeight &&
      iframe.width ==
        document.documentElement.clientWidth;
      });
  });

})();
