function cancelFetch(fn) {
  let abort = null;
  const abortPromise = new Promise((_res, reject) => {
    abort = () => reject("cancel");
  });

  const promise = Promise.race([fn, abortPromise]);
  promise.cancel = abort;
  return promise;
}

function cancelFetch2(url, options) {
  const abort = new AbortController();
  const signal = abort.signal;
  return fetch(url, { ...options, signal });
}

function timeoutFetch(fn, max) {
  const promiseTimeout = new Promise((_res, reject) => {
    setTimeout(() => reject("timeout"), max);
  });

  return Promise.race([fn, promiseTimeout]);
}

const pause = (duration) =>
  new Promise((resolve, _reject) => {
    setTimeout(resolve, duration);
  });

async function retryFetch(fn, times = 0) {
  fn().catch((err) =>
    times > 0
      ? pause(1000).then(() => retryFetch(fn, times - 1))
      : Promise.reject(err)
  );
}

var now = +new Date();

async function retry(fn, times) {
  let error;
  for (let i = 0; i < times; i++) {
    try {
      const result = await fn(i);
      return result;
    } catch (e) {
      error = e;
      await pause1();
    }
  }
  return error;
}
const pause1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};
function test(i) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(+new Date() - now);
      if (i === 3) {
        resolve(1);
      }
      reject("a");
    }, 1000);
  });
}
