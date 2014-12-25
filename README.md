# try-stream-push 

[![NPM version](https://img.shields.io/npm/v/try-stream-push.svg?style=flat)](https://www.npmjs.com/package/try-stream-push)
[![Build Status](https://img.shields.io/travis/shinnn/try-stream-push.svg?style=flat)](https://travis-ci.org/shinnn/try-stream-push)
[![Build status](https://ci.appveyor.com/api/projects/status/to4aewekumw29ael?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/try-stream-push)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/try-stream-push.svg?style=flat)](https://coveralls.io/r/shinnn/try-stream-push)
[![devDependency Status](https://david-dm.org/shinnn/try-stream-push/dev-status.svg?style=flat)](https://david-dm.org/shinnn/try-stream-push#info=devDependencies)

[Push][push] the return value of the function to the [stream](http://nodejs.org/api/stream.html#stream_stream), or make the stream emit the thrown error

```javascript
var assert = require('assert');
var through = require('through2');
var tryStreamPush = require('try-stream-push');

function createJSONParseStream() {
  return through.obj(function(data, enc, cb) {
    tryStreamPush(this, function() {
      return JSON.parse(String(data.contents));
    });

    cb();
  });
};
```

It is useful to implement [`_transform`](http://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback) method of a [transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform_1).

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```sh
npm install try-stream-push
```

## API

```javascript
var tryStreamPush = require('try-stream-push');
```

### tryStreamPush(*stream*, *fn*)

*stream*: `Object` (stream)  
*fn*: `Function`  
Return: `Boolean` (the same as the return value of [`readable.push()`][push] when the function doesn't throw, otherwise the same as [`emitter.emit()`][emit]'s)

It calls the function passed to the second argument.

If the function doesn't throw, it [pushes][push] the return value of the function to the stream passed to the first argument.

If the function throws an error, it makes the stream [emit] the error.

```javascript
var through = require('');
var tryStreamPush = require('try-stream-push');

var all = {
  data: [],
  error: []
};

var stream = through.obj()
  .on('data', function(data) {
    all.data.push(data);
  })
  .on('error', function(err) {
    all.error.push(err);
  });

tryStreamPush(stream, function() {
  return 'foo';
});

tryStreamPush(stream, function() {
  return {bar: 'baz'};
});

tryStreamPush(stream, function() {
  throw new Error('error!');
});

stream.on('end', function() {
  all.data; //=> ['foo', {bar: 'baz'}]
  all.error; //=> [[Error: error!]]
});

stram.end();
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[push]: http://nodejs.org/api/stream.html#stream_readable_push_chunk_encoding
[emit]: http://nodejs.org/api/events.html#events_emitter_emit_event_arg1_arg2