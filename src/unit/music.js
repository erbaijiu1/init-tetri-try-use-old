import Taro from '@tarojs/taro';
import store from '../store';
import bgmSource from '../asset/music/music.mp3';

export const music = {};

let timer_fall = null;
let timer_over = null;
let context = null;

const initAudio = () => {
  if (!context) {
    context = Taro.createInnerAudioContext();
    context.obeyMuteSwitch = false;
    context.src = bgmSource;
    
    context.onPlay(() => {
      console.log('音频开始播放');
    });
    
    context.onError((res) => {
      console.error(`音频错误: ${res.errMsg}`, res.errCode);
    });
    
    context.onStop(() => {
      console.log('音频停止');
    });
    
    context.onEnded(() => {
      console.log('音频播放结束');
    });
  }
  return context;
};

music.killStart = () => {
  music.start = () => {};
};

music.start = () => {
  music.killStart();
  if (!store.getState().get('music')) {
    return;
  }
  const ctx = initAudio();
  const startTime = 3.722;
  const duration = 3.633;
  ctx.seek(startTime);
  ctx.play();
  let timer_start = setTimeout(() => {
    ctx.stop();
    if (timer_start) timer_start = null;
  }, duration * 1000);
};

music.clear = () => {
  if (!store.getState().get('music')) {
    return;
  }
  const ctx = initAudio();
  const startTime = 0;
  const duration = 0.7675;
  ctx.seek(startTime);
  ctx.play();
  let timer_clear = setTimeout(() => {
    ctx.stop();
    if (timer_clear) timer_clear = null;
  }, duration * 1000);
};

music.fall = () => {
  if (!store.getState().get('music')) {
    return;
  }
  if (timer_fall) {
    clearTimeout(timer_fall);
    timer_fall = null;
  }
  const ctx = initAudio();
  const startTime = 1.2558;
  const duration = 0.3546;
  ctx.seek(startTime);
  ctx.play();
  timer_fall = setTimeout(() => {
    ctx.stop();
    if (timer_fall) timer_fall = null;
  }, duration * 1000);
};

music.gameover = () => {
  if (!store.getState().get('music')) {
    return;
  }
  if (timer_over) {
    clearTimeout(timer_over);
    timer_over = null;
  }
  const ctx = initAudio();
  const startTime = 8.128;
  const duration = 1.144;
  ctx.seek(startTime);
  ctx.play();
  timer_over = setTimeout(() => {
    ctx.stop();
    if (timer_over) timer_over = null;
  }, duration * 1000);
};

music.rotate = () => {
  if (!store.getState().get('music')) {
    return;
  }
  const ctx = initAudio();
  const startTime = 2.257;
  const duration = 0.281;
  ctx.seek(startTime);
  ctx.play();
  let timer_rotate = setTimeout(() => {
    ctx.stop();
    if (timer_rotate) timer_rotate = null;
  }, duration * 1000);
};

music.move = () => {
  if (!store.getState().get('music')) {
    return;
  }
  const ctx = initAudio();
  const startTime = 2.909;
  const duration = 0.24;
  ctx.seek(startTime);
  ctx.play();
  let timer_move = setTimeout(() => {
    ctx.stop();
    if (timer_move) timer_move = null;
  }, duration * 1000);
};

export default music;