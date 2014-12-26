'use strict';

var Writable = require('stream').Writable;

var through = require('through2');
var tryStreamPush = require('./');
var test = require('tape');

test('tryStreamPush()', function(t) {
  t.plan(12);

  t.equal(tryStreamPush.name, 'tryStreamPush', 'should have a function name.');

  var returnValue = tryStreamPush(through().on('data', function(buf) {
    t.deepEqual(
      buf,
      new Buffer('0'),
      'should insert return value of the function into the stream.'
    );
  }), function() {
    return new Buffer('0');
  });

  t.strictEqual(returnValue, true, 'should return the return value of stream.push.');

  tryStreamPush(through.obj().on('data', function(data) {
    t.deepEqual(
      data,
      {a: 'b'},
      'should insert return value of the function into the stream.'
    );
  }), function() {
    return {a: 'b'};
  });

  returnValue = tryStreamPush(through().on('error', function(err) {
    t.deepEqual(
      err,
      new Error('a'),
      'should let the stream emit the function\'s error.'
    );
  }), function() {
    throw new Error('a');
  });

  returnValue = tryStreamPush(through().on('error', function(err) {
    t.deepEqual(
      err,
      new TypeError('a'),
      'should modify the error using error handler function.'
    );
  }), function() {
    throw new Error('a');
  }, function(err) {
    return new TypeError(err.message);
  });

  t.strictEqual(returnValue, true, 'should return the return value of emitter.emit.');

  t.throws(
    tryStreamPush.bind(null, {}, t.fail),
    /TypeError.*must be a stream/,
    'should throw a type error when the first argument is not a stream.'
  );

  t.throws(
    tryStreamPush.bind(null, new Writable(), t.fail),
    /TypeError.*not readable/,
    'should throw a type error when the stream is not readable.'
  );

  t.throws(
    tryStreamPush.bind(null, through(), true),
    /TypeError.*must be a function/,
    'should throw a type error when the second argument is not a function.'
  );

  t.throws(
    tryStreamPush.bind(null, through(), t.fail, 1),
    /TypeError.*must be a function/,
    'should throw a type error when the third argument is not a function.'
  );

  t.throws(
    tryStreamPush.bind(null),
    /TypeError.*must be a stream/,
    'should throw a type error when it takes no arguments.'
  );
});
