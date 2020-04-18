const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
  const self = this;
  self.value = null; // 缓存value
  self.error = null; // 缓存error
  self.status = PENDING;
  self.onFulfilledCallbacks = [];
  self.onRejectedCallbacks = [];

  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }
    if (self.status === PENDING) {
      setTimeout(() => {
        self.status = FULFILLED;
        self.value = value;
        self.onFulfilledCallbacks.forEach((cb) => cb(self.value));
      }, 0);
    }
  }

  function reject(error) {
    if (self.status === PENDING) {
      setTimeout(() => {
        self.status = REJECTED;
        self.error = error;
        self.onRejectedCallbacks.forEach((cb) => cb(self.error));
      }, 0);
    }
  }

  try {
    fn(resolve, reject); // 立即执行fn
  } catch (e) {
    reject(e);
  }
}

function resolvePromise(bridgePromise, x, resolve, reject) {
  // 2.3.1避免循环使用
  if (bridgePromise === x) {
    return reject(new TypeError("Circular reference"));
  }

  let call = false;

  if (x instanceof MyPromise) {
    if (x.status === PENDING) {
      x.then(
        (y) => resolvePromise(bridgePromise, y, resolve, onRejectedCallbacks),
        (error) => reject(error)
      );
    } else {
      x.then(resolve, reject);
    }
    // 2.3.3规范， 如果x为对象或者是函数
  } else if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (call) return;
            call = true;
            resolvePromise(bridgePromise, y, resolve, reject);
          },
          (err) => {
            if (call) return;
            call = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (call) return;
      call = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const self = this;
  let bridgePromise;
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (error) => {
          throw error;
        };

  if (self.status === FULFILLED) {
    return (bridgePromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onFulfilled(self.value);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    }));
  }
  if (self.status === REJECTED) {
    return (bridgePromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onRejected(self.error);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    }));
  }

  if (self.status === PENDING) {
    return (bridgePromise = new MyPromise((resolve, reject) => {
      self.onFulfilledCallbacks.push((value) => {
        try {
          const x = onFulfilled(value);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      self.onRejectedCallbacks.push((error) => {
        try {
          const x = onRejected(error);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }
};

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    const result = [];
    let count = 0;

    for (let i = 0; i < promises.length; i++) {
      promise[i].then(
        (value) => {
          result[i] = value;
          if (count++ === promise.length) {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
};

MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (data) => {
          resolve(data);
        },
        (err) => reject(err)
      );
    }
  });
};

MyPromise.resolve = function (value) {
  return new MyPromise((resolve) => resolve(value));
};

MyPromise.reject = function (error) {
  return new MyPromise((resolve, reject) => reject(error));
};

MyPromise.promisify = function (fn) {
  return () => {
    const args = Array.from(arguments);
    return new MyPromise((resolve, reject) => {
      fn.apply(null, args.concat((data, err) => {
        if (err) {
         reject(err)
        } else {
          resolve(data)
       }
     }))
  });
};
MyPromise.deferred = function () {
  let defer = {};
  defer.promise = new MyPromise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};
try {
  module.exports = MyPromise;
} catch (e) {}
