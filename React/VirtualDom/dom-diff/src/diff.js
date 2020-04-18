/*
diff的策略：
  1. tree diff:
    - 因为DOM节点跨层级的移动操作很少，所以只对同层的DOM进行比较
    - 当发现阶段不存在时，该节点及其子节点会被完全删除，不会进一步的比较
  2. component diff
    - 如果是同一类型的组件，按照原策略继续比较virtual DOM tree
    - 如果不是，则讲该组件判断为dirty component，从而替换掉整个组件下的子组件
    - 对于同一类型的组件，利用shouldComponentUpdate可以节省大量的diff运算时间
  3. element diff
    - INSERT_MARKUP
    - MOVE_EXISTING
    - REMOVE_NODE
 */

export default function diff(oldTree, newTree) {
  const patches = {};

  let index = 0;
  walk(oldTree, newTree, index, patches);

  return patches;
}

function walk(oldNode, newNode, index, patches) {
  let current = [];
  console.log("test");
  if (!newNode) {
    // 没有newNode
    current.push({ type: "REMOVE", index });
  } else if (isString(oldNode) && isString(newNode)) {
    // node是文本
    if (oldNode !== newNode) {
      current.push({ type: "TEXT", text: newNode });
    }
  } else if (oldNode.type === newNode.type) {
    const attr = diffAttr(oldNode, newNode);
    if (Object.keys(attr).length > 0) {
      current.push({ type: "ATTR", attr });

      diffChildren(oldNode.children, newNode.children, patches);
    }
  } else {
    current.push({ type: "REPLACE", newNode });
  }
  if (current.length > 0) {
    patches[index] = current;
  }
}

function isString(obj) {
  return typeof obj === "string";
}

function diffAttr(oldNode, newNode) {
  const patch = {};

  for (let key in oldNode) {
    if (oldNode[key] !== newNode[key]) {
      patch[key] = newNode[key];
    }
  }

  for (let key in newNode) {
    if (!oldNode.hasOwnProperty(key)) {
      patch[key] = newNode[key];
    }
  }

  return patch;
}

let num = 0;

function diffChildren(oldChildren, newChildren, patches) {
  oldChildren.forEach((child, index) => {
    walk(child, newChildren[index], ++num, patches);
  });
}
