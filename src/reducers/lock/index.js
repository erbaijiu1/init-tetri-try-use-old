
import * as reducerType from '../../constants/index.js';

const initState = false;

const lock = (state = initState, action) => {
  switch (action.type) {
    case reducerType.LOCK:
      return action.data;
    default:
      return state;
  }
};

export default lock;
