
import * as reducerType from '../../constants/index.js';
import { blankMatrix } from '../../unit/const.js';

const INITIAL_STATE = blankMatrix;

export default function matrix(state = INITIAL_STATE, action) {
  switch (action.type) {
    case reducerType.MATRIX:
      return action.data
    default:
      return state;
  }
};
