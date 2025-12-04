
import { getNextType } from '../../unit/index.js';
import * as reducerType from '../../constants/index.js';

const initState = getNextType();
const parse = (state = initState, action) => {
  switch (action.type) {
    case reducerType.NEXT_BLOCK:
      return action.data;
    default:
      return state;
  }
};

export default parse;
