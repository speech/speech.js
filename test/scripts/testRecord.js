'use strict';

var Record = require('../scripts/record.js');

var n = 'googleDns';
var v = {'ip': '8.8.8.8'};

var testRecord = new Record(n, v);

casper.test.begin('assertEquals() tests', 2, function(test) {
  test.assertEquals(n, testRecord.name);
  test.assertEquals(v, testRecord.value);
  test.done();
});




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



