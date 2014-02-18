'use strict';

var Nav = require('../scripts/dns.js'),
  utils = require('utils');



casper.test.setUp(function() {

});

casper.test.tearDown(function() {

});

casper.test.begin('save', 1, function(test) {
  var r = DNS.save({'name': nameOne, 'value': valueOne});
  test.assertEquals(objOne, r);
  test.done();
});

casper.test.begin('lookup', 1, function(test) {
  DNS.save({'name': nameOne, 'value': valueOne});
  var r = DNS.lookup(nameOne);
  test.assertEquals(objOne, r);
  test.done();
});

casper.test.begin('getRecords', 3, function(test) {
  DNS.save(objOne);
  DNS.save({'name': nameTwo, 'value': valueTwo});
  var records = DNS.getRecords();
  test.assertEquals(2, records.length, 'Correct number of Records');
  test.assertEquals(
    {name: nameOne, value: valueOne},  records[1],'Record 1 matches');//LIFO
  test.assertEquals(
    {name: nameTwo, value:valueTwo}, records[0], 'Record 2 matches');
  test.done();
});


casper.test.begin('delete', 3, function(test) {
  test.assertRaises(function() {
    DNS.save({'name': nameOne, 'value': valueOne});
    var r = DNS.lookup(nameOne);
    test.assertEquals(objOne, r, 'Record was saved');

    DNS.delete(nameOne);
    var records = DNS.getRecords();
    test.assertEquals(0, records.length, 'No records in DB');


    DNS.lookup(nameOne);


  }, [true], 'Trying to find record raises exception');
  test.done();
});





//casper.test.begin('assertEquals() tests', 2, function(test) {
//  test.assertEquals(n, testRecord.n);
//  test.done();
//});




//var dummies = [
//  ['ipv4', {'ip': '208.113.212.187'}]
//  ['ipv6-2', {'ip6': ['2607:f298:5:102b::ddb:b09e',
//    '2607:f298:5:102b::af3:5aa3']}],
//  ['ipv6', {'ip6': '2607:f298:5:102b::ddb:b09e'}],
//  ['ipv4-2', {'ip': ['208.113.212.187', '208.113.212.1s87']}],
//  ['bits', {'ip': ['208.113.212.187'], 'cors': ['speech.is']}],
//  ['_setting', {'n': 'subscriber n', 'url': 'jsDNS url'}],
//  ['reddit', {'translate': 'http://www.reddit.com'}],
//  ['aaronsw', {'translate': 'http://www.aaronsw.com/'}],
//  ['wikipedia', {'translate': 'http://www.wikipedia.org'}],
//  ['accessnow', {'translate': 'http://www.accessnow.org'}],
//  ['indolering', {'ip': ['208.113.212.21'], 'cors': ['speech.is']}],
//  ['fightforthefuture', {'translate': 'http://www.fightforthefuture.org/'}],
//  ['internetdefenseleague', {'translate': 'http://internetdefenseleague.org'}]
//];
//dummies.forEach(function(dummy) {
//  //hardcoded hack to get this working on non-speech.is sites
//  if (dummy[0] === 'www') {
//    var uri = new URI();
//    uri.subdomain('www');
//    uri.path('connect.html');
//    dummy[1].translate = uri.href();
//  } else if (dummy[0] === 'localhost') {
//    var uri = new URI();
//    uri.path('connect.html');
//    dummy[1].translate = uri.href();
//  }
//  DNS.save({'n': dummy[0], 'v': dummy[1]});
//});



