function sub_curr(fn) {
  const slice = [].prototype.slice;
  const args = slice.call(arguments, 1);
  return function () {
    return fn.apply(this, args.concat(slice.call(arguments)));
  };
}

function curry(fn, length) {
  length = length || fn.length;

  return function () {
    if (arguments.length < length) {
      const slice = [].prototype.slice;
      const args = [fn].concat(slice.call(arguments));
      return curry(sub_curr.apply(this, args), length - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  };
}

const curry2 = (fn) =>
  (sub_cur2 = (...args) =>
    args.length < fn.length
      ? (args2) => sub_cur2(...args, ...args2)
      : fn(...args));
