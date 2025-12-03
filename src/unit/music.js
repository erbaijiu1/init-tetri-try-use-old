import Taro from '@tarojs/taro';
import store from '../store';
import bgmSource from '../asset/music/music.mp3';
import sfxSource from '../asset/music/music.wav';

const music = {};

let bgmAudio = null;
let sfxAudio = null;

// Initialize audio contexts
const initAudio = () => {
  if (process.env.TARO_ENV === 'weapp') {
    Taro.setInnerAudioOption({
      obeyMuteSwitch: false,
      mixWithOther: true,
    });
  }

  if (!bgmAudio) {
    bgmAudio = Taro.createInnerAudioContext();
    bgmAudio.src = bgmSource;
    bgmAudio.loop = true;
  }

  if (!sfxAudio) {
    sfxAudio = Taro.createInnerAudioContext();
    sfxAudio.src = sfxSource;
  }
};

// Play Background Music
music.start = () => {
  initAudio();
  const state = store.getState();
  if (state.get('music')) {
    bgmAudio.play();
  }
};

// Kill Start (Stop BGM)
music.killStart = () => {
  if (bgmAudio) {
    bgmAudio.stop();
  }
};

// Play Sound Effects
const playSfx = () => {
  initAudio();
  const state = store.getState();
  if (state.get('music')) {
    // Stop previous sound to allow rapid replay
    sfxAudio.stop();
    sfxAudio.play();
  }
};

music.clear = playSfx;
music.fall = playSfx;
music.gameover = playSfx;
music.rotate = playSfx;
music.move = playSfx;

// Subscribe to store changes to handle Music Toggle (On/Off)
let currentMusicState = store.getState().get('music');
store.subscribe(() => {
  const state = store.getState();
  const nextMusicState = state.get('music');
  const isPause = state.get('pause');
  // Simple check: if not paused, we try to control BGM based on music state
  
  if (nextMusicState !== currentMusicState) {
    initAudio();
    if (nextMusicState) {
      if (bgmAudio && !isPause) { 
         bgmAudio.play();
      }
    } else {
      if (bgmAudio) {
        bgmAudio.pause();
      }
    }
    currentMusicState = nextMusicState;
  }
});

export { music };