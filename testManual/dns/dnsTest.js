'use strict';

var sync = {change: console.log, complete: console.log, error: console.error},
  nameOne = 'gDNS',
  valueOne = {http: '8.8.8.8'},
  gDNS = {name: nameOne, value: valueOne},
  dns = new window.DNS(),
  expect = chai.expect,
  should = chai.should();

describe("Is Mocha Working?", function () {
  it("Is true truthy?", function () {
    (true).should.be.ok;
  });
});

describe("Testing DNS!", function () {

  it("Client should be fetch Wikileaks from remote server", function (done) {
    dns.client.get("wikileaks", function (err, doc) {
        expect(err).to.not.be.ok;
        expect(doc.name).to.equal("wikileaks");
        expect(doc.value.http).to.be.ok;
        done();
      }
    );
  });


  it("DB should be able to save a document", function (done) {
    dns.save(gDNS, function (err, doc) {
        expect(err).to.not.be.ok;
        expect(doc.id).equal(gDNS.name);
        dns.db.get(gDNS.name, function (err, doc) {
          expect(doc.value.http).to.equal(gDNS.value.http);
        });
        done();
      }
    );
  });


  it("DNS should be able to lookup nf", function (done) {
    dns.lookup("nf", function (err, doc) {
        expect(err).to.not.be.ok;
        expect(doc.name).to.equal("nf");
        expect(doc.value.http).to.be.ok;
        done();
      }
    );
  });



  it("DNS should be able to lookup clipperz", function (done) {
    dns.lookup("clipperz", function (err, doc) {
        expect(err).to.not.be.ok;
        expect(doc.name).to.equal("clipperz");
        expect(doc.value.http).to.be.ok;
        done();
      }
    );
  });


  after(function (done) {
    dns.db.destroy(function (err, info) {
      if (err) throw err;
      done();
    });
  });

});


//
//'use strict';
//
//var chai = require('chai'),
//  expect = chai.expect,
//  should = chai.should(),
//  Promise = require('bluebird'),
//  chaiAsPromised = require("chai-as-promised");
//
//chai.use(chaiAsPromised);
//var sync = {change: console.log, complete: console.log, error: console.error};
//var DNS = require('../scripts/dns').init(null,null,sync),
//  nameOne = 'gDNS',
//  valueOne = {http: '8.8.8.8'},
//  googleDns = {name: nameOne, value: valueOne};
//
//describe("Is Mocha Working?", function () {
//  it("Is true true?", function () {
//    (true).should.be.ok;
//  });
//});
//
//describe("Testing DNS!", function () {
//
//  it("Client should be able to lookup Wikileaks", function (done) {
//    DNS.client.get("wikileaks", function (err, doc) {
//        err.should.not.be.ok;
//        doc.name.should.equal(googleDns.name);
//        doc.value.should.equal(googleDns.value);
//        done();
//      }
//    );
//  });
//
//
////  it("Should be able to save a document", function (done) {
////    DNS.save(gDNS, function (err, doc) {
////        err.should.not.be.ok;
////        doc.name.should.equal(gDNS.name);
////        doc.value.should.equal(gDNS.value);
////        done();
////      }
////    );
////  });
//
//  after(function (done) {
//    Promise.all([DNS.client.destroy(), DNS.db.destroy()]).then(function (results) {
//      done();
//    }).catch(function (err) {
//      throw err;
//    });
//
//  });
//
//});
//
//
//
//

