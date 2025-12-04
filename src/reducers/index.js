
import { combineReducers } from 'redux-immutable';
import pause from './pause/index.js';
import music from './music/index.js';
import matrix from './matrix/index.js';
import next from './next/index.js';
import cur from './cur/index.js';
import startLines from './startLines/index.js';
import max from './max/index.js';
import points from './points/index.js';
import speedStart from './speedStart/index.js';
import speedRun from './speedRun/index.js';
import lock from './lock/index.js';
import clearLines from './clearLines/index.js';
import reset from './reset/index.js';
import drop from './drop/index.js';
import keyboard from './keyboard/index.js';

const rootReducer = combineReducers({
  pause,
  music,
  matrix,
  next,
  cur,
  startLines,
  max,
  points,
  speedStart,
  speedRun,
  lock,
  clearLines,
  reset,
  drop,
  keyboard,
});

export default rootReducer;
