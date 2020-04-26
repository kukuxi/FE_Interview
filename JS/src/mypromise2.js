const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function Promise(executor) {
  const self = this;
  self.status = PENDING;
  self.data = undefined;
  self.error = undefined;
  self.onResolvedCallbacks = [];
  self.onRejectedCallbacks = [];

  function resolve(value) {
    if (self.status === PENDING) {
      self.status = RESOLVED;
      self.data = value;
      this.onResolvedCallbacks.forEach((cb) => cb(value));
    }
  }

  function rejected(err) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.error = err;
      this.onRejectedCallbacks.forEach((cb) => cb(err));
    }
  }

  try {
    executor(resolve, rejected);
  } catch (e) {
    rejected(e);
  }
}

Promise.prototype.then = function (onResolved, onRejected) {
  const self = this;
  let bridgePromise;
  onResolved = typeof onResolved === "function" ? onResolved : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (err) => {
          throw err;
        };

  if (self.status === "resolved") {
    return (promise2 = new Promise(function (resolve, reject) {
      try {
        const x = onResolved(self.data);
        if (x instanceof Promise) {
          x.then(resolve, reject);
        } else {
          resolve(x);
        }
      } catch (e) {
        reject(e);
      }
    }));
  }

  if (self.status === "rejected") {
    return (promise2 = new Promise(function (resolve, reject) {
      try {
        var x = onRejected(self.data);
        if (x instanceof Promise) {
          x.then(resolve, reject);
        }
      } catch (e) {
        reject(e);
      }
    }));
  }

  if (self.status === "pending") {
    return (promise2 = new Promise(function (resolve, reject) {}));
  }
}