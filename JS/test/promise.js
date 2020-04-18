// const fs = require("fs");
// const MyPromise = require("../src/promise");
// let p = new MyPromise((resolve, reject) => {
//   fs.readFile("./1.txt", "utf8", function (err, data) {
//     console.log("this is 1.txt");
//     err ? reject(err) : resolve(data);
//   });
// });
// let f1 = function (data) {
//   console.log(data);
//   return new MyPromise((resolve, reject) => {
//     fs.readFile("./2.txt", "utf8", function (err, data) {
//       console.log("this is 2.txt");
//       err ? reject(err) : resolve(data);
//     });
//   });
// };
// let f2 = function (data) {
//   console.log(data);
//   return new MyPromise((resolve, reject) => {
//     fs.readFile("./3.txt", "utf8", function (err, data) {
//       console.log("this is 3.txt");
//       err ? reject(err) : resolve(data);
//     });
//   });
// };
// let f3 = function (data) {
//   console.log(data);
// };
// let errorLog = function (error) {
//   console.log(error);
// };
// p.then(f1).then(f2).then(f3);

// const http = require("http");

// const server = http.createServer((req, res) => {
//   console.log("hello");
//   res.setHeader("Content-Type", "application/json");
//   const obj = { a: 1 };
//   res.end(JSON.stringify(obj));
// });

// server.listen(8000);

// async function timeoutFetch(fn, max) {
//   function timeout() {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => reject("timeout"), max);
//     });
//   }

//   return Promise.race([fn, timeout]);
// }

// function cancelFetch(fn) {
//   let abort = null;
//   const abort_promise = new Promise((resolve, reject) => {
//     abort = () => reject("cancel");
//   });
//   const promise = Promise.race([fn, abort_promise]);
//   promise.cancel = abort;
//   return promise;
// }

// function success(value) {
//   console.log(value);
// }

// function fail(err) {
//   console.error(err);
// }

// var promise = new MyPromise((resolve, reject) => {
//   console.log("success");
//   resolve(1);
// });

// promise.then(success, fail);

setTimeout(() => {
  console.log("long-timeout");
}, 0);

const promise1 = new Promise((resolve) => {
  console.log("long-pormise1");
  resolve("promise1");
});

setImmediate(() => {
  console.log("long-setImmediate");
}, 0);
console.log("a");
(async () => {
  console.log("async start");
  const str = await promise1;
  console.log(str);
})();

promise1.then(() => {
  console.log("long-promise1-then");
});

console.log("end");

/*
long-pormise1
async start
end
promise1
long-promise1-then
long-timeout
long-setImmediate
*/
