
import { want } from '../../unit/index.js';
import event from '../../unit/event.js';
import actions from '../../actions/index.js';
import states from '../states.js';
import { speeds, delays } from '../../unit/const.js';
import { music } from '../../unit/music.js';

const down = (store) => {
  store.dispatch(actions.keyboard.left(true));
  event.down({
    key: 'left',
    begin: 200,
    interval: 100,
    callback: () => {
      const state = store.getState();
      if (state.get('lock')) {
        return;
      }
      if (music.move) {
        music.move();
      }
      const cur = state.get('cur');
      if (cur !== null) {
        if (state.get('pause')) {
          states.pause(false);
          return;
        }
        const next = cur.left();
        const delay = delays[state.get('speedRun') - 1];
        let timeStamp;
        if (want(next, state.get('matrix'))) {
          next.timeStamp += parseInt(delay, 10);
          store.dispatch(actions.moveBlock(next));
          timeStamp = next.timeStamp;
        } else {
          cur.timeStamp += parseInt(parseInt(delay, 10) / 1.5, 10); // 真实移动delay多一点，碰壁delay少一点
          store.dispatch(actions.moveBlock(cur));
          timeStamp = cur.timeStamp;
        }
        const remain = speeds[state.get('speedRun') - 1] - (Date.now() - timeStamp);
        states.auto(remain);
      } else {
        let speed = state.get('speedStart');
        speed = speed - 1 < 1 ? 6 : speed - 1;
        store.dispatch(actions.speedStart(speed));
      }
    },
  });
};

const up = (store) => {
  store.dispatch(actions.keyboard.left(false));
  event.up({
    key: 'left',
  });
};

export default {
  down,
  up,
};
