'use strict';

var DNS = require('../../scripts/dns.js'),
  utils = require('utils'),
  nameOne = 'googleDns',
  valueOne = {ip: '8.8.8.8'},
  objOne = {name: nameOne, value: valueOne, $jsdns: { uris: ['//8.8.8.8/'] }},
  nameTwo = 'level3DNS',
  valueTwo = {ip: '4.2.2.2'},
  objTwo = {name: nameTwo, value: valueTwo, $jsdns: {uris: ['//4.2.2.2/']} };


casper.test.setUp(function() {
  DNS = DNS.init();
});

casper.test.tearDown(function() {
  DNS.delete(nameOne);
  DNS.delete(nameTwo);
});

casper.test.begin('save', 1, function(test) {
  DNS.save(
    {'name': nameOne, 'value': valueOne},
    function(doc) {
      test.assertEquals(scrubRecord(doc), objOne);
      test.done();
    }
  );
});

casper.test.begin('lookup', 1, function(test) {
  DNS.save({'name': nameOne, 'value': valueOne});
  DNS.lookup(nameOne, function(doc) {
//    utils.dump(scrubRecord(doc));
//    utils.dump(scrubRecord(objOne));
    test.assertEquals(scrubRecord(doc), scrubRecord(objOne)
    );
    test.done();
  });
});

//casper.test.begin('getRecords', 3, function(test) {
//  DNS.save(objOne);
//  DNS.save({'name': nameTwo, 'value': valueTwo});
//  DNS.getRecords(function(err, response) {
//    utils.dump(response);
//    test.assertEquals(2, records.length, 'Correct number of Records');
//    test.assertEquals(
//      {name: nameOne, value: valueOne}, scrubRecord(records[1]),'Record 1 matches');//LIFO
//    test.assertEquals(
//      {name: nameTwo, value:valueTwo}, scrubRecord(records[0]), 'Record 2 matches');
//    test.done();
//  })
//
//});

//I strongly doubt this method is doing what it thinks it's doing.
casper.test.begin('delete', 2, function(test) {

  casper.start();

  casper.then(function() {
    test.assertRaises(function() {
      DNS.save(objOne);
      DNS.delete(nameOne);
      DNS.lookup(nameOne);
    }, [false], 'Trying to find existing record does not raise an exception');
  });

  casper.then(function() {
    test.assertRaises(function() {
    DNS.save(objOne);
    DNS.delete(nameOne);
    DNS.lookup(nameOne);
  }, [true], 'Trying to find record raises exception');
    test.done();
  });
  casper.run();
});

function scrubRecord(record) {
  if (typeof record === 'object') {
    var keys = Object.keys(record);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].slice(0, 1) === ('_')
        // || keys[i].startsWith('$')
        ) {
        delete record[keys[i]];
      }
    }
  return record;
  } else {
    console.error(record);
  }
}




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



