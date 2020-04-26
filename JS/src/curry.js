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

/**
 * 实现
 * add(1); // 1
 * add(1)(2); // 3
 * add(1)(2)(3); // 5
 */

function add(n) {
  const fn = (m) => add(n + m);
  fn.valueOf = () => n;
  return fn;
}

function sum() {
  const args = [...arguments];
  const fn = function () {
    args.push(...arguments);
    return fn;
  };

  fn.toString = function () {
    return args.reduce((acc, cur) => acc + cur, 0);
  };
  return fn;
}

var value = 1;
Object.defineProperty(window, "a", {
  get() {
    return this.value++;
  },
});

function inherit(Parent, Child) {
  function F() {}
  F.prototype = Parent;
  const prototype = Object.create(Parent);
  prototype.constuctor = Child;
  Child.prototype = prototype;
}
