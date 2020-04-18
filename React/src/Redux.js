const reducer = require("./reducer");

const createStore = (reducer) => {
  let currentState = {};
  function getState() {
    return currentState;
  } // getter
  function dispatch(action) {
    currentState = reducer(currentState, action);
  } // setter
  function subscribe() {} // 发布订阅
  return { getState, dispatch, subscribe };
};
console.log("a");
const store = createStore(reducer);
store.dispatch({ type: "plus" });
console.log(store.getState());
