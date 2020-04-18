console.log("start");
setTimeout(() => {
  console.log("timer1");
  Promise.resolve().then(function () {
    console.log("promise1");
  });
}, 0);
setTimeout(() => {
  console.log("timer2");
  Promise.resolve().then(function () {
    console.log("promise2");
  });
}, 0);
Promise.resolve().then(function () {
  console.log("promise3");
});
console.log("end");

//对于以上代码来说，setTimeout 可能执行在前，也可能执行在后。
// 首先 setTimeout(fn, 0) === setTimeout(fn, 1)，这是由源码决定的
//进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调
//如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了
// setTimeout(function timeout() {
//   console.log("timeout1");
// }, 0);
// setImmediate(function immediate() {
//   console.log("immediate1");
// });
// setTimeout(function timeout() {
//   console.log("timeout2");
// }, 0);
// setImmediate(function immediate() {
//   console.log("immediate2");
// });

// i/o callback 内部调用时，先执行setImmediate，再执行setTimeout
// const fs = require("fs");
// fs.readFile("./test.js", () => {
//   setTimeout(() => {
//     console.log("timeout");
//   }, 0);
//   setImmediate(() => {
//     console.log("immediate");
//   });
// });

// 这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，
// 当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数
// 并且优先于其他 microtask 执行。
// setTimeout(() => {
//   console.log("timer1");
//   Promise.resolve().then(function () {
//     console.log("promise1");
//   });
// }, 0);
// process.nextTick(() => {
//   console.log("nextTick");
//   process.nextTick(() => {
//     console.log("nextTick");
//     process.nextTick(() => {
//       console.log("nextTick");
//       process.nextTick(() => {
//         console.log("nextTick");
//       });
//     });
//   });
// });

// console.log(1);
// Promise.resolve().then(() => {
//   console.log("promise one");
// });
// process.nextTick(() => {
//   console.log("nextTick one");
// });

// setTimeout(() => {
//   process.nextTick(() => {
//     console.log("nextTick two");
//   });
//   console.log(3);
//   Promise.resolve().then(() => {
//     console.log("promise two");
//   });
//   console.log(4);
// }, 3);

const fs = require("fs");
console.log("start");

fs.writeFile("./test/text.txt", "我写的数据", (err) => {
  if (err) throw err;
  console.log("text1");
});

setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve().then(() => {
    console.log("promise 3");
  });
});

setTimeout(() => {
  console.log("setTimeout 2");
  Promise.resolve()
    .then(() => {
      console.log("promise 4");
      Promise.resolve().then(() => {
        console.log("promise 5");
      });
    })
    .then(() => {
      console.log("promise 6");
    })
    .then(() => {
      fs.writeFile("./test/text1.txt", "我写的数据", (err) => {
        if (err) throw err;
        console.log("text2");
      });
      setTimeout(() => {
        console.log("setTimeout 3");
        Promise.resolve()
          .then(() => {
            console.log("promise 7");
          })
          .then(() => {
            console.log("promise 8");
          });
      }, 1000);
    });
}, 0);

Promise.resolve()
  .then(() => {
    console.log("promise 1");
  })
  .then(() => {
    console.log("promise 2");
  });
console.log("end");
