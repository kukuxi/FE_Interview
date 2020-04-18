// class Subject {
//   registerObserver(observer) {}
//   removeObserver(observer) {}
//   notifyObserver(message) {}
// }

// class Observer {
//   update(message) {}
// }

var publish = {
  list: {},
  addLister: function (name, cb) {
    if (this.list[name]) {
      this.list[name].push(cb);
    } else {
      this.list[name] = [cb];
    }
  },
  dispatch: function (name) {},
};

publish.listen = function (key, fn) {
  if (this.list[key]) {
    this.list[key].push(fn);
  } else {
    this.list[key] = [fn];
  }
};

publish.trigger = function () {
  const key = [].shift.call(arguments);
  const fnList = this.list[key];
  for (let i = 0; i < fnList.length; i++) {
    const fn = fnList[i];
    fn.apply(this, arguments);
  }
};

publish.listen("hello", function (name, age) {
  console.log(name, age);
});

publish.listen("bye", function () {
  console.log("bye");
});
publish.trigger("hello", "Miller", 24);
publish.trigger("bye");

var EventBus = {
  list: {},

  listen: function (key, fn) {
    if (this.list[key]) {
      this.list[key].push(fn);
    } else {
      this.list[key] = [fn];
    }
  },

  trigger: function () {
    const key = [].shift.call(arguments);
    const fns = this.list[key];
    if (!fns || fns.length === 0) return;
    for (let i = 0; i < fns.length; i++) {
      fns[i].apply(this, arguments);
    }
  },
  remove: function (key, fn) {
    const fns = this.list[key];
    if (fns) {
      if (!fn) {
        fns.length = 0;
      } else {
        const fnIndex = fns.findIndex((item) => item === fn);
        fns = fns.slice(0, fnIndex).concat(fns.slice(fnIndex + 1));
      }
    }
  },
};
