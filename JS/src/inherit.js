function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = new Fn();

function inherit(Parent, Child) {
  const prototype = Object.create(Parent.prototype);
  Child.prototype = prototype;
  prototype.constructor = Child;
}
