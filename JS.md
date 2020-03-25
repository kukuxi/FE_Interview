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
const child = new Child();
```

缺点：

1. 引用类型的属性被所有实例共享

2. 在创建 Child 的实例时，不能向Parent传参

- 构造函数
  
```js
const Parent = function() {
  this.name = 'Jack';
}

const Child = function() {
  Parent.call(this); // 利用call、bind执行构造函数
};
```

缺点：

1. 需要每次创建一个新的实例

2. 用类型的实例属性，但是不能共享方法

- 组合继承
  
```js
const Parent = function(name, age) {
  this.name = name;
  this.age = age;
}

const Child = function(name, age) {
  Parent.call(this, name); // 利用call、bind执行构造函数
  this.age = age;
};

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child = new Child('Mark');
```

- 原型链继承

```js
function createObj(o) {
  const  F= function() {};
  F.prototype = o;
  return new F();
}
```

- 寄生继承

```js
function createObj(o) {
  const obj = Object.create(o);
  obj.getName = function() {
    return this.name;
  }
  return obj;
}
```

- 寄生组合式继承

```js
const Parent = function(name, age) {
  this.name = name;
  this.age = age;
}

const Child = function(name, age) {
  Parent.call(this, name); // 利用call、bind执行构造函数
  this.age = age;
};

// F 作为桥梁，使得Child间接连接到 Parent.prototype
function F() {};
F.prototype = Parent.prototype;
Child.prototype = new F();
Child.prototype.constructor = Child;
```

封装一下：

```js
function createObj(o) {
  function F() {};
  F.prototype = o.prototype;
  return new F();
}

function prototype(super, sub) {
  const obj = create(super);
  sub.prototype = obj;
  sub.prototype.constructor = sub;
}
```

### ES6

使用extends继承父类，_proto__存在于实例与构造函数的原型对象之间
extend核心代码

```js
function _inherits(subType, superType) {
  // 创建对象，创建父类原型的一个副本
  // 增强对象，弥补因重写原型而失去的默认的constructor 属性
  // 指定对象，将新创建的对象赋值给子类的原型
  subType.prototype = Object.create(superType && superType.prototype, {
      constructor: {
          value: subType,
          enumerable: false,
          writable: true,
          configurable: true
      }
  });

  if (superType) {
      Object.setPrototypeOf
          ? Object.setPrototypeOf(subType, superType)
          : subType.__proto__ = superType;
  }
}
```

### 区别

1. ES5的继承实质上是先创建子类的实例对象，然后再将父类的方法添加到this上
2. ES6的继承有所不同，实质上是先创建父类的实例对象this，然后再用子类的构造函数修改this。因为子类没有自己的this对象，所以必须先调用父类的super()方法，否则新建实例报错。
3. 在ES5中类的原型对象的方法是可枚举的，但是ES6中不可枚举
4. ES6中的类是不会声明提升的, ES5可以
5. ES6 在继承的语法上不仅继承了类的原型对象，还继承了类的静态属性和静态方法
