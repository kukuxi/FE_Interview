import { createElement } from "./virtualDom";

const el = createElement("ul", { class: "list" }, [
  createElement("li", { class: "item" }, "a"),
  createElement("li", { class: "item" }, "b"),
  createElement("li", { class: "item" }, "c"),
]);

console.log(el);
