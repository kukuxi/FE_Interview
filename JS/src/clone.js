function shallowClone(obj) {
  if (typeof obj !== "object") return obj;
  const newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

function deepClone(obj) {
  if (typeof obj !== "object") return obj;
  const newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key];
    }
  }
  return newObj;
}

function clone(obj) {
  const root = {};

  const visitedNodes = [];

  const queue = [
    {
      parent: root,
      key: undefined,
      data: obj,
    },
  ];

  while (queue.length) {
    const node = queue.pop();
    const { parent, key, data } = node;

    const res = typeof key === "undefined" ? parent : (parent[key] = {});

    const isUniqData = visitedNodes.find((item) => item.source === data);

    if (isUniqData) {
      parent[key] = isUniqData.target;
      continue;
    }

    visitedNodes.push({
      target: res,
      source: data,
    });

    Object.keys(data).forEach((k) => {
      if (typeof data[k] === "object") {
        queue.push({
          parent: res,
          key: k,
          data: data[k],
        });
      } else {
        res[k] = data[k];
      }
    });
  }

  return root;
}
