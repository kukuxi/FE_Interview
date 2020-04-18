const initialState = {
  count: 0,
};
function reducer(currentState = initialState, action) {
  switch (action.type) {
    case "puls":
      currentState = {
        ...currentState,
        count: currentState.count + 1,
      };
      break;
    case "subtract": {
      currentState = {
        ...currentState,
        count: currentState.count - 1,
      };
    }
    default:
      break;
  }
  return currentState;
}

module.exports = reducer;
