# Javascript

## 面向对象

> 继承以及 ES5 和 ES6 继承的区别？

### ES5中的继承

- 原型链

``` js
const Parent = function() {
  this.name = 'Jack';
}

Parent.prototype.getName = function() {
  return this.name;
}

const Child = function() {};
Child.prototype = new Parent();
```
