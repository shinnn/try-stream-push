/*!
 * try-stream-push | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/try-stream-push
*/
'use strict';

function validateArgs(stream, fn, errorHandler) {
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

  if (errorHandler && typeof errorHandler !== 'function') {
    throw new TypeError(
      errorHandler +
      ' is not a function. Third argument must be a function.'
    );
  }
}

module.exports = function tryStreamPush(stream, fn, errorHandler) {
  validateArgs(stream, fn, errorHandler);

  var result;
  try {
    result = fn();
  } catch (e) {
    if (errorHandler) {
      return stream.emit('error', errorHandler(e));
    }
    return stream.emit('error', e);
  }
  return stream.push(result);
};
