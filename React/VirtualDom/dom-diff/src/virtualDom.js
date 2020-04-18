class Element {
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}

function createElement(type, props, children) {
  return new Element(type, props, children);
}

function render(vnode) {
  let el = document.createElement(vnode.type);

  for (let key in vnode.props) {
    setAttr(el, key, vnode.props[key]);
  }
  vnode.children.forEach((child) => {
    child =
      child instanceof Element ? render(child) : document.createTextNode(child);
    el.appendChild(child);
  });

  return el;
}

function setAttr(el, key, value) {
  switch (key) {
    case "value":
      if (["input", "textarea"].includes(el.type.toLowCase())) {
        el.value = value;
      } else {
        el.setAttribute(key, value);
      }
      break;
    case "style":
      el.style.cssText = value;
      break;
    default:
      el.setAttribute(key, value);
      break;
  }
}

function renderDom(el, target) {
  target.appendChild(el);
}
export { Element, createElement, render, setAttr, renderDom };
