function revert(arr) {
  const result = Array.from({length: arr.length});
  get(arr, 2, result);
  return result;
}

function get(arr, factor, result) {
  if (arr.length < 2) {
    result.concat(arr);
    return;
  }
  const length = arr.length;
  const middle = Math.ceil(length / 2);
  const right = arr.slice(middle);
  const left = arr.slice(0, middle);
  for (let i = 0; i < left.length; i++) {
    const n = left[i];
    result[factor * (2 * i + 1)] = n;
  }
  get(right, factor * 2, result);
}

