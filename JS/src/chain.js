/**
 * taskSum(1000,()=>{ console.log(1) })
 * .task(1200,()=>{console.log(2)})
 * .task(1300,()=>{console.log(3)})
 * 这里等待 1s，打印 1，
 * 之后等待 1.2s，打印 2，
 * 之后打印 1.3s，打印 3
 */

class TaskSum {
  constructor(time, fn) {
    const self = this;
    this.taskList = [];
    setTimeout(() => {
      fn();
      self.next();
    }, time);
  }

  task(time, fn) {
    const self = this;
    const newFn = function () {
      setTimeout(() => {
        fn();
        self.next();
      }, time);
    };
    self.taskList.push(newFn);
    return self;
  }

  next() {
    const fn = this.taskList.shift();
    fn && fn();
  }
}

function taskSum(time, fn) {
  return new TaskSum(time, fn);
}

const now = +new Date();
taskSum(1000, () => {
  console.log(1, +new Date() - now);
})
  .task(1200, () => {
    console.log(2, +new Date() - now);
  })
  .task(1300, () => {
    console.log(3, +new Date() - now);
  });

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
  const self = this;
  self.value = null;
  self.error = null;
  self.status = PENDING;
  self.onFulfilledCallbacks = [];
  self.onRejectedCallbacks = [];

  function resolve(value) {
    if (self.status === PENDING) {
      setTimeout(() => {
        self.status = FULFILLED;
        self.value = value;
        self.onFulfilledCallbacks.forEach((callback) => callback(self.value));
      }, 0);
    }
  }

  function reject(error) {
    if (self.status === PENDING) {
      setTimeout(() => {
        self.status = REJECTED;
        self.error = error;
        self.onRejectedCallbacks.forEach((callback) => callback(self.error));
      }, 0);
    }
  }

  fn(resolve, reject);
}

function resolvePromise(bridgePromise, x, resolve, reject) {
  if (bridgePromise === x) {
    return reject(new TypeError("Circular reference"));
  }
  if (x instanceof MyPromise) {
    if (x.status === PENDING) {
      x.then(
        (y) => {
          resolvePromise(bridgePromise, y, resolve, reject);
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      x.then(resolve, reject);
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
          let x = onFulfilled(self.value);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }
  if (self.status === REJECTED) {
    return (bridgePromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onRejected(err);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          onRejected(e);
        }
      });
    }));
  }
  if (self.status === PENDING) {
    return (bridgePromise = new MyPromise((resolve, reject) => {
      self.onFulfilledCallbacks.push((value) => {
        try {
          let x = onFulfilled(value);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      self.onRejectedCallbacks.push((err) => {
        try {
          let x = onRejected(err);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }
};
MyPromise.prototype.catch = function (onReject) {
  return this.then(null, onReject);
};

function Promise2(fn) {
  const self = this;
  self.value = value;
  self.onFulfilledCallbacks = [];

  function resolve(value) {
    setTimeout(() => {
      self.value = value;
      self.onFulfilledCallbacks.forEach((cb) => cb(self.value));
    }, 0);
  }

  fn(resolve);
}

Promise2.prototype.then = function (onFulfilled) {
  const self = this;
  return new Promise2((resolve) => {
    self.onFulfilledCallbacks.push(() => {
      const x = onFulfilled(self.value);
      if (x instanceof Promise2) {
        x.then(resolve);
      } else {
        resolve(x);
      }
    });
  });
};

var excutor = (resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
};

var promise1 = new Promise(excutor);

promise1.then((res) => {
  console.log(res);
  // user promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, 500);
  });
});
