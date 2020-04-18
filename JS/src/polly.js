function sub_curry(args) {
  const fn = args.shift();
  return function () {
    const newArgs = args.concat([].slice.call(arguments));
    return fn.apply(newArgs);
  };
}

function curry(fn, length) {
  length = length || fn.length;

  return function () {
    if (arguments.length < length) {
      const args = [fn].concat([].slice.call(arguments));
      return curry(sub_curry(args), length - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  };
}

var curry1 = (fn) =>
  (sub = (...args) =>
    args.length === fn.length ? fn(args) : (...arg) => sub(...args, ...arg));

/*
实现：
add(1); // 1
add(1)(2); // 3
add(1)(2)(3); // 6
*/

function add(m) {
  const sum = (n) => add(m + n);

  sum.toString = () => m;

  return sum;
}
