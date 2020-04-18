# Promise、async

## fetch 请求取消的操作

```js
function _fetch(url, options) {
  let abort = null;
  const abort_promise = new Promise((resolve, reject) => {
    abort = () => {
      reject("abort");
      console.log("test abort");
    };
  });
  const promise = Promise.race([fetch(url, options), abort_promise]);
  promise.abort = abort;
  return promise;
}
```

## 实现 timeout

```js
async function timeoutFetch(fn, max) {
  function timeout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject("timeout"), max);
    });
  }

  return Promise.race([fn, timeout()]);
}
```

## 实现失败后再次请求，至多 n 次

## 用 async 实现 Promise.all

## 实现 Promise A+
