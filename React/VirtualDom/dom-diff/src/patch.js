import { render, setAttr } from "./virtualDom";

let allPatches;
let index = 0;

export default function patch(node, patch) {
  allPatches = patch;

  walk(node);
}

function walk(node) {
  let currentPatch = allPatches[index++];
  let childNodes = node.childNodes;

  childNodes.forEach((child) => walk(child));

  if (currentPatch) {
    doPatch(node, currentPatch);
  }
}

function doPatch(node, patches) {
  patches.forEach((patch) => {
    switch (patch.type) {
      case "Attr":
        for (let key in patch.attc) {
          const value = patch.attc[key];
          if (value) {
            setAttr(node, key, value);
          } else {
            node.removeAttribute(key);
          }
        }
        break;
      case "TEXT":
        node.textContent = patch.text;
        break;
      case "REPLACE":
        let newNode = patch.newNode;
        newNode =
          newNode instanceof Element
            ? render(node)
            : document.createContextNode(newNode);
        node.parentNode.replace(newNode, node);
        break;
      case "REMOVE":
        node.parentNode.removeChild(node);
        break;
      default:
        break;
    }
  });
}
