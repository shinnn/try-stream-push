# try-stream-push

[![NPM version](https://img.shields.io/npm/v/try-stream-push.svg)](https://www.npmjs.com/package/try-stream-push)
[![Bower version](https://img.shields.io/bower/v/try-stream-push.svg)](https://github.com/shinnn/try-stream-push/releases)
[![Build Status](https://travis-ci.org/shinnn/try-stream-push.svg?branch=master)](https://travis-ci.org/shinnn/try-stream-push)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/try-stream-push.svg)](https://coveralls.io/r/shinnn/try-stream-push)
[![devDependency Status](https://david-dm.org/shinnn/try-stream-push/dev-status.svg)](https://david-dm.org/shinnn/try-stream-push#info=devDependencies)

[Push][push] the return value of the function to the [stream](https://nodejs.org/api/stream.html#stream_stream), or make the stream emit the thrown error

```javascript
const Transform = require('readable-stream/transform');
const tryStreamPush = require('try-stream-push');

function createJSONParseStream() {
  return new Transform(
    objectMode: true,
    transform: function(data, enc, cb) {
      tryStreamPush(this, () => JSON.parse(String(data.contents)));
      cb();
    }
  });
};
```

It is useful to implement [`_transform`](https://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback) method of a [transform stream](https://nodejs.org/api/stream.html#stream_class_stream_transform_1).

## Installation

### [npm](https://www.npmjs.com/)

```
npm install try-stream-push
```

### [bower](http://bower.io/)

```
bower install try-stream-push
```

## API

```javascript
const tryStreamPush = require('try-stream-push');
```

### tryStreamPush(*stream*, *fn* [, *errorHandler*])

*stream*: `Object` (stream)  
*fn*: `Function`  
*errorHandler*: `Function`  
Return: `Boolean` (the same as the return value of [`readable.push()`][push] when the function doesn't throw, otherwise the same as [`emitter.emit()`][emit]'s)

It calls the function passed to the second argument.

If the function doesn't throw, it [pushes][push] the return value of the function to the stream passed to the first argument.

If the function throws an error, it makes the stream [emit] the error.

```javascript
const PassThrough = require('stream').PassThrough;
const tryStreamPush = require('try-stream-push');

const all = {
  data: [],
  error: []
};

let stream = new PassThrough({objectMode: true})
  .on('data', data => all.data.push(data))
  .on('error', err => all.error.push(err));

tryStreamPush(stream, () => 'foo');
tryStreamPush(stream, () => {bar: 'baz'});
tryStreamPush(stream, () => throw new Error('error!'));

stream.on('end', () => {
  all.data; //=> ['foo', {bar: 'baz'}]
  all.error; //=> [[Error: error!]]
});

stram.end();
```

#### errorHandler(*error*)

*error*: `Error`

Takes the thrown error object and modifies it before emitting.

```javascript
const gutil = require('gulp-util');
const Transform = require('readable-stream/transform');
const tryStreamPush = require('try-stream-push');

let stream = new Transform({
  objectMode: true,
  transform: function(data, enc, cb) {
    tryStreamPush(this, function() {
      // something
    }, function errorHandler(err) {
      // convert the default error into a gulp plugin error
      return gutil.PluginError('plugin-name', err);
    });

    cb();
  }
});
```

## License

Copyright (c) 2014 - 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[push]: https://nodejs.org/api/stream.html#stream_readable_push_chunk_encoding
[emit]: https://nodejs.org/api/events.html#events_emitter_emit_event_arg1_arg2
