const random = (arr) => arr.sort(() => Math.random() - 0.5);

const flat = (arr) => {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
};
