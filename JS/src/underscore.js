(function () {
  /*严格模式下，this为undefined
    var root = this;
  */

  /*
    webworker中无法访问到 window对象
    (typeof window == "object" && window.window == window && window)
    利用window.self == window
  */
  /**
   * 小程序中window 和 global都是undefined，所以用{}
   */
  var root =
    (typeof self == "object" && self.self == self && self) ||
    (typeof global == "object" && global.global == global && global) ||
    this ||
    {};
  var ArrayProto = Array.prototype;
  var push = ArrayProto.push;
  /**
   * 函数也是对象
   *  var _ = function() {};
   */
  var _ = function (obj) {
    if (!(this instanceof _)) return new _(obj); // 保证this指向实例对象
    this._wrapped = obj;
  };

  if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      /**
       * module.exports.num = '1'
        console.log(exports.num) // 1

        exports.num = '2'
        console.log(module.exports.num) // 2
        保持exports和module.exports统一
       */
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  _.isFunction = function (fn) {
    return typeof fn === "function";
  };
  _.functions = function (obj) {
    var names = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (_.isFunction(obj[key])) namas.push(key);
      }
    }
    return names;
  };

  _.mixin = function (obj) {
    _.functions(obj).map((name) => {
      const fn = (_[name] = obj[name]);
      _.prototype[name] = function () {
        const args = [this._wrapped];
        push.apply(args, arguments);
        return fn.apply(_, args);
      };
    });
  };

  _.mixin(_);

  root._ = _;
})();
