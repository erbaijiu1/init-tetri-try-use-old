
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import Immutable from 'immutable';
import propTypes from 'prop-types';
import BaseFunctionComponent from '../common/BaseFunctionComponent';
import Sbutton from './button';
import store from '../../store';
import todo from '../../control/todo';
import { i18n, lan } from '../../unit/const';
import './index.less';

const touchEventCatch = {}; // 对于手机操作, 触发了touchstart, 将作出记录

const handleTouchStart = (key) => {
  touchEventCatch[key] = true;
  todo[key].down(store);
}

const handleTouchEnd = (key) => {
  todo[key].up(store);
}

// 判断是否为 H5 环境
const isH5 = process.env.TARO_ENV === 'h5';

// 按钮位置配置：小程序用 rpx，H5 用 px
const buttonPositions = {
  drop: {
    top: isH5 ? '140px' : '280rpx',
    left: isH5 ? '50px' : '100rpx',
  },
  left: {
    top: isH5 ? '70px' : '140rpx',
    left: isH5 ? '8px' : '16rpx',
  },
  right: {
    top: isH5 ? '70px' : '140rpx',
    left: isH5 ? '100px' : '200rpx',
  },
  rotate: {
    top: isH5 ? '80px' : '160rpx',
    left: isH5 ? '200px' : '400rpx',
  },
  reset: {
    top: isH5 ? '0px' : '0rpx',
    left: isH5 ? '98px' : '196rpx',
  },
  sound: {
    top: isH5 ? '0px' : '0rpx',
    left: isH5 ? '53px' : '106rpx',
  },
  pause: {
    top: isH5 ? '0px' : '0rpx',
    left: isH5 ? '8px' : '16rpx',
  },
};

const Keyboard = ({ keyboard = Immutable.Map({}) }) => {
  return (
    <View className='keyboard'>
      <Sbutton
        color='blue'
        size='s1'
        top={buttonPositions.drop.top}
        left={buttonPositions.drop.left}
        label={i18n.drop[lan]}
        arrow='translate(0,-70rpx) rotate(180deg)'
        active={keyboard.get('drop')}
        onTouchstart={() => handleTouchStart('space')}
        onTouchend={() => handleTouchEnd('space')}
      />
      <Sbutton
        color='blue'
        size='s1'
        top={buttonPositions.left.top}
        left={buttonPositions.left.left}
        label={i18n.left[lan]}
        arrow='translate(60rpx, -12rpx) rotate(270deg)'
        active={keyboard.get('left')}
        onTouchstart={() => handleTouchStart('left')}
        onTouchend={() => handleTouchEnd('left')}
      />
      <Sbutton
        color='blue'
        size='s1'
        top={buttonPositions.right.top}
        left={buttonPositions.right.left}
        label={i18n.right[lan]}
        arrow='translate(-60rpx, -12rpx) rotate(90deg)'
        active={keyboard.get('right')}
        onTouchstart={() => handleTouchStart('right')}
        onTouchend={() => handleTouchEnd('right')}
      />
      <Sbutton
        color='blue'
        size='s0'
        top={buttonPositions.rotate.top}
        left={buttonPositions.rotate.left}
        label={i18n.rotation[lan]}
        active={keyboard.get('rotate')}
        onTouchstart={() => handleTouchStart('rotate')}
        onTouchend={() => handleTouchEnd('rotate')}
      />
      <Sbutton
        color='red'
        size='s2'
        top={buttonPositions.reset.top}
        left={buttonPositions.reset.left}
        label={`${i18n.reset[lan]}(R)`}
        active={keyboard.get('reset')}
        onTouchstart={() => handleTouchStart('r')}
        onTouchend={() => handleTouchEnd('r')}
      />
      <Sbutton
        color='green'
        size='s2'
        top={buttonPositions.sound.top}
        left={buttonPositions.sound.left}
        label={`${i18n.sound[lan]}(S)`}
        active={keyboard.get('music')}
        onTouchstart={() => handleTouchStart('s')}
        onTouchend={() => handleTouchEnd('s')}
      />
      <Sbutton
        color='green'
        size='s2'
        top={buttonPositions.pause.top}
        left={buttonPositions.pause.left}
        label={`${i18n.pause[lan]}(P)`}
        active={keyboard.get('pause')}
        onTouchstart={() => handleTouchStart('p')}
        onTouchend={() => handleTouchEnd('p')}
      />
    </View>
  );
}

Keyboard.propTypes = {
  keyboard: propTypes.object.isRequired,
};

export default BaseFunctionComponent(Keyboard);