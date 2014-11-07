'use strict';

var sync = {change: console.log, complete: console.log, error: console.error},
  nameOne = 'gDNS',
  valueOne = {http: '8.8.8.8'},
  gDNS = {name: nameOne, value: valueOne},
  dns = new DNS(),
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

  //Not working due to bug in PouchDB!
  after(function (done) {
    dns.db.destroy(function (err, info) {
      if (err) throw err;
      done();
    });
  });

});

