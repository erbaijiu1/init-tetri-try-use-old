
import * as reducerType from '../../constants/index.js';

const initState = false;
const pause = (state = initState, action) => {
  switch (action.type) {
    case reducerType.PAUSE:
      return action.data;
    default:
      return state;
  }
};

export default pause;
