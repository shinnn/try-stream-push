/*!
 * try-stream-push | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/try-stream-push
*/
'use strict';

function validateArgs(stream, fn) {
  if (!stream || typeof stream.emit !== 'function') {
    throw new TypeError(stream + ' is not a stream. First argument must be a stream.');
  }

  if (typeof stream.push !== 'function') {
    throw new TypeError(stream + ' is not readable.');
  }

  if (typeof fn !== 'function') {
    throw new TypeError(
      fn +
      ' is not a function. Second argument must be a function.'
    );
  }
}

module.exports = function tryStreamPush(stream, fn) {
  validateArgs(stream, fn);

  var result;
  try {
    result = fn();
  } catch (e) {
    return stream.emit('error', e);
  }
  return stream.push(result);
};
