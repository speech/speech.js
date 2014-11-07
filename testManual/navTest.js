'use strict';



var fileName = location.href.split("/").slice(-1)[0],
  thisURL = window.location.href.slice(0,-fileName.length),
  fooURL = thisURL + "foo.html",
  barURL = thisURL + "bar.html",
  expect = chai.expect,
  should = chai.should();


describe("Is Mocha Working?", function () {
  it("Is true truthy?", function () {
    (true).should.be.ok;
  });
});

describe("Nav should navigate!", function () {

  it("Does the iframe exist?", function () {
    expect(Object.getPrototypeOf(window.nav.iframe) === HTMLIFrameElement.prototype).to.be.ok;
  });

  it("Did Nav register as window.nav?", function () {
    expect(typeof window.nav).to.equal("object");
  });

  it("Will nav load a string?", function (done) {
    var dest = getDestination();
    window.nav.go(dest.href);
    var stringTest = function () {
      expect(window.nonces).to.include(dest.search);
      done();
    }
    window.setTimeout(stringTest, 500);
  });

  it("Will nav load a URL?", function (done) {
    var dest = getDestination();
    window.nav.go(dest);
    var urlTest = function () {
      expect(window.nonces).to.include(dest.search);
      done();
    }
    window.setTimeout(urlTest, 1000);
  });

});


function lastTest(){

}

function getDestination(){

  var u = new URL(fooURL + "?" + nonce());

  return u;

  function nonce(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}