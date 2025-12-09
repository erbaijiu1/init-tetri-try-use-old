import Taro from '@tarojs/taro';
import store from '../store';
import bgmSource from '../asset/music/music.mp3';

export const music = {};

// 音频片段配置
const AUDIO_CLIPS = {
  start: { startTime: 3.722, duration: 3.633 },
  clear: { startTime: 0, duration: 0.7675 },
  fall: { startTime: 1.2558, duration: 0.3546 },
  gameover: { startTime: 8.128, duration: 1.144 },
  rotate: { startTime: 2.257, duration: 0.281 },
  move: { startTime: 2.909, duration: 0.24 },
};

// 音频池：为每个音效类型创建独立的 context
const audioPool = {};
const activeTimers = {};
let isInitialized = false;

// 预加载所有音频 context
const initAudioPool = () => {
  if (isInitialized) return;
  
  Object.keys(AUDIO_CLIPS).forEach(key => {
    const ctx = Taro.createInnerAudioContext();
    ctx.src = bgmSource;
    
    // 静默处理所有错误
    ctx.onError(() => {});
    ctx.onEnded(() => {});
    ctx.onStop(() => {});
    
    audioPool[key] = ctx;
  });
  
  isInitialized = true;
};

// 停止指定音效
const stopSound = (type) => {
  if (activeTimers[type]) {
    clearTimeout(activeTimers[type]);
    activeTimers[type] = null;
  }
  
  const ctx = audioPool[type];
  if (ctx) {
    try {
      ctx.stop();
    } catch (e) {}
  }
};

// 播放指定音效（只停止同类型的音效）
const playSound = (type) => {
  if (!store.getState().get('music')) {
    return;
  }
  
  // 确保音频池已初始化
  if (!isInitialized) {
    initAudioPool();
  }
  
  const ctx = audioPool[type];
  const config = AUDIO_CLIPS[type];
  
  if (!ctx || !config) {
    return;
  }
  
  // 只停止该音效的前一次播放（相同类型才停止）
  if (activeTimers[type]) {
    stopSound(type);
  }
  
  // 使用 Promise 链确保 seek 和 play 按顺序执行
  Promise.resolve()
    .then(() => {
      // 先 seek
      return Promise.resolve(ctx.seek(config.startTime));
    })
    .then(() => {
      // 再 play
      return Promise.resolve(ctx.play());
    })
    .catch(() => {
      // 如果失败，尝试重新创建这个 context
      try {
        const newCtx = Taro.createInnerAudioContext();
        newCtx.src = bgmSource;
        newCtx.onError(() => {});
        newCtx.onEnded(() => {});
        newCtx.onStop(() => {});
        
        audioPool[type] = newCtx;
        
        // 重试播放
        newCtx.seek(config.startTime);
        Promise.resolve(newCtx.play()).catch(() => {});
      } catch (e) {}
    });
  
  // 设置自动停止
  activeTimers[type] = setTimeout(() => {
    stopSound(type);
  }, config.duration * 1000);
};

// 停止所有音效
music.stopAll = () => {
  Object.keys(audioPool).forEach(key => {
    stopSound(key);
  });
};

// 销毁音频池（释放资源）
music.destroy = () => {
  music.stopAll();
  Object.keys(audioPool).forEach(key => {
    if (audioPool[key]) {
      try {
        audioPool[key].destroy();
      } catch (e) {}
      delete audioPool[key];
    }
  });
  isInitialized = false;
};

music.killStart = () => {
  music.start = () => {};
};

music.start = () => {
  music.killStart();
  playSound('start');
};

music.clear = () => {
  playSound('clear');
};

music.fall = () => {
  playSound('fall');
};

music.gameover = () => {
  playSound('gameover');
};

music.rotate = () => {
  playSound('rotate');
};

music.move = () => {
  playSound('move');
};

export default music;