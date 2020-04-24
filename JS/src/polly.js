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

const ClassType = ["Array", "Regexp", "Error", "Date"].reduce((acc, cur) => {
  acc[`[Object ${cur}]`] = cur.toLowerCase();
  return acc;
}, {});

function type(obj) {
  if (typeof obj == null) return String(obj);
  return typeof obj === "object"
    ? ClassType[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}

function debounce(fn, delay, immediate) {
  let timer;

  return function () {
    const args = arguments,
      context = this;
    if (immediate && !timer) {
      fn.apply(context, args);
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(context, args), delay);
  };
}

function throttle(fn, wait, immediate) {
  let timer,
    callNow = immediate;

  return function () {
    const args = arguments,
      context = this,
    if (!callNow) {
      fn.apply(context, args);
      callNow = true;
    }

    if (!timer) {
      setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
  };
}

function throttle2(fn, wait) {
  let timer,
    pre = 0;

  return function () {
    const args = arguments,
      context = this,
      now = +new Date();

    if (now - pre > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(context, arg);
      pre = now;
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, arg);
      }, wait);
    }
  };
}

Function.prototype.call2 = function (context) {
  context = context || window;
  context.fn = this;

  let args = [];
  for (let i = 1; i < arguments.length; i++) {
    args.push(`arguments[${i}]`);
  }

  const result = eval(`context.fn(${args})`)
  delete context.fn;
  return result;
}

Function.prototype.apply2 = function (context, arr) {
  context = context || window;
  context.fn = this;

  let result;
  if (!arr) {
    result = context.fn()
  } else {
    let arr = [];
    for (let i = 1; i < arr.length; i++) {
      arr.push(`arr[${i}]`);
    }
    result = eval(`context.fn(${args})`)
  }
  delete context.fn;
  return result;
}


Function.prototype.bind = function (context) {
  const args = Array.prototype.slice.call(arguments, 1);
  const self = this;
  const fn = function () {
    const bindArgs = Array.prototype.slice.call(arguments)
    return self.apply(this instanceof self ? this : context, args.concat(bindArgs))
  }

  function F() {  }
  F.prototype = this.prototype;
  fn.prototype = new F();
  return fn;
}

function throttle(fn, wait, immediate) {
  let callNow = immediate;
  let timer = null;
  const context = this;
  return function () {
    const args = arguments;
    if (!callNow) {
      fn.apply(context, args);
      callNow = true;
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null;
      }, wait)
    }
  }
}