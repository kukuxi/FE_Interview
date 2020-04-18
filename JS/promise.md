# 实现一个符合 Promise A+的 Promise

1. then 中的 setTimeout 执行顺序

## 第一版

实现生成一个 promise 实例，该实例能在成功时执行注册的成功回调函数，失败时执行注册的失败回调函数

```js
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log("into");
    resolve(1);
  }, 500);
});

promise.then(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.error(error);
  }
);
```

```js
function MyPromise(fn) {
  const self = this; // 先缓存当前promise实例
  this.value = null; // 缓存value
  this.error = null; // 缓存error
  this.onFulfilled = null; // 处理成功时的响应
  this.onRejected = null; // 处理失败时的响应

  function resolve(value) {
    self.value = value;
    self.onFulfilled(value);
  }

  function reject(error) {
    self.error = error;
    self.onRejected(error);
  }

  fn(resolve, reject); // 立即执行fn
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  this.onFulfilled = onFulfilled;
  this.onRejected = onRejected;
};
```

## 第二版支持同步任务

目标

```js
let promise = new MyPromise((resolve, reject) => {
  resolve("同步任务执行");
});
```

```js
function resolve(value) {
  setTimeout(function () {
    // 利用setTimeout属于宏任务，then属于微任务，then的执行优先于setTimeout，这一特点
    self.value = value;
    self.onFulfilled(value);
  });
}

function reject(error) {
  setTimeout(function () {
    self.error = error;
    self.onRejected(error);
  });
}
```

## 第三版增加状态(pedding, fulfilled, rejected)

```js
const PEDDING = "pedding";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
  const self = this;
  this.value = null; // 缓存value
  this.error = null; // 缓存error
  this.onFulfilled = null; // 处理成功时的响应
  this.onRejected = null; // 处理失败时的响应
  this.status = PEDDING;

  function resolve(value) {
    if (self.status === PEDDING) {
      // 只有pedding 状态下才能改变 promise的状态。换句话说，一旦promise的状态改变就不该再次更改
      setTimeout(function () {
        self.value = value;
        self.status = FULFILLED;
        self.onFulfilled(value);
      });
    }
  }

  function reject(error) {
    if (self.status === PEDDING) {
      setTimeout(function () {
        self.error = error;
        self.status = REJECTED;
        self.onRejected(error);
      });
    }
  }

  fn(resolve, reject); // 立即执行fn
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  if (this.status === PEDDING) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  }
  if (this.status === FULFILLED) {
    onFulfilled(this.value);
  } else if (this.status === REJECTED) {
    onRejected(this.error);
  }

  return this;
};
```
