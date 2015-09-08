'use strong';

const {PassThrough, Writable} = require('stream');

const tryStreamPush = require('./');
const test = require('tape');

test('tryStreamPush()', t => {
  t.plan(12);

  t.equal(tryStreamPush.name, 'tryStreamPush', 'should have a function name.');

  let returnValue = tryStreamPush(new PassThrough().on('data', buf => {
    t.deepEqual(
      buf,
      new Buffer('0'),
      'should insert return value of the function into the stream.'
    );
  }), () => new Buffer('0'));

  t.strictEqual(returnValue, true, 'should return the return value of stream.push.');

  tryStreamPush(new PassThrough({objectMode: true}).on('data', data => {
    t.deepEqual(
      data,
      {a: 'b'},
      'should insert return value of the function into the object stream.'
    );
  }), () => ({a: 'b'}));

  returnValue = tryStreamPush(new PassThrough().on('error', err => {
    t.deepEqual(
      err,
      new Error('a'),
      'should let the stream emit the function\'s error.'
    );
  }), function() {
    throw new Error('a');
  });

  returnValue = tryStreamPush(new PassThrough().on('error', err => {
    t.deepEqual(
      err,
      new TypeError('a'),
      'should modify the error using error handler function.'
    );
  }), function() {
    throw new Error('a');
  }, err => new TypeError(err.message));

  t.strictEqual(returnValue, true, 'should return the return value of emitter.emit.');

  t.throws(
    () => tryStreamPush({}, t.fail),
    /TypeError.*must be a stream/,
    'should throw a type error when the first argument is not a stream.'
  );

  t.throws(
    () => tryStreamPush(new Writable(), t.fail),
    /TypeError.*not readable/,
    'should throw a type error when the stream is not readable.'
  );

  t.throws(
    () => tryStreamPush(new PassThrough(), true),
    /TypeError.*must be a function/,
    'should throw a type error when the second argument is not a function.'
  );

  t.throws(
    () => tryStreamPush(new PassThrough(), t.fail, 1),
    /TypeError.*must be a function/,
    'should throw a type error when the third argument is not a function.'
  );

  t.throws(
    () => tryStreamPush(),
    /TypeError.*must be a stream/,
    'should throw a type error when it takes no arguments.'
  );
});
