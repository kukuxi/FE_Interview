# 排序

- 冒泡排序（Bubble Sort）

```js
```

- 插入排序（Insertion Sort）
- 选择排序（Selection Sort）
- 归并排序（Merge Sort）

  思想：将复杂问题利用分而治之的思想去求解，先比较两个数的大小，再把两组两个数比较大小之后合并。再去比较两组 4 个数的大小....

  ```js
  function mergeSort(nums) {
    const length = nums.length;
    if (length === 1) return nums;
    const middle = Math.floor(length / 2);
    const left = mergeSort(nums.slice(0, middle));
    const right = mergeSort(nums.slice(middle));
    return sort(left, right);
  }

  function sort(left, right) {
    let i = 0,
      j = 0,
      leftLen = left.length,
      rightLen = right.length;
    const result = [];
    while (i < leftLen && j < rightLen) {
      const min = left[i] < right[j] ? left[i++] : right[j++];
      result.push(min);
    }

    const rest = i === leftLen ? right.slice(j) : left.slice(i);

    return result.concat(rest);
  }
  ```

- 快速排序算法（Quicksort）

  思想：类似于二分法，选取一个数字，以该数字为标准，大于该数字的放在右边，小于的放在左边

  ```js
  function quickSort(nums) {
    const length = nums.length;
    if (length < 2) return nums;
    const last = nums[length - 1];
    return sort(nums.slice(0, length - 1), last);
  }

  function sort(nums, p) {
    const left = [],
      rigth = [],
      length = nums.length;
    for (let i = 0; i < length; i++) {
      const value = nums[i];
      value < p ? left.push(value) : rigth.push(value);
    }

    return quickSort(left).concat(p, quickSort(rigth));
  }
  ```

-
