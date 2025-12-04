import Taro from '@tarojs/taro'

const music = {};

const sounds = [
  'start',
  'clear',
  'fall',
  'gameover',
  'rotate',
  'move'
];

// Placeholder for audio instance management
// In a real app, you would import mp3 files or use remote URLs
const audioContexts = {};

// Initialize audio contexts (lazy load or predefined)
sounds.forEach(key => {
  music[key] = () => {
    try {
      if (!audioContexts[key]) {
        const innerAudioContext = Taro.createInnerAudioContext();
        innerAudioContext.autoplay = false;
        // Point to remote or local assets
        // For demo purposes, we will not set a real src to avoid 404s in preview without assets
        // innerAudioContext.src = `path/to/${key}.mp3`; 
        audioContexts[key] = innerAudioContext;
      }
      
      // Play sound if src is valid
      if (audioContexts[key].src) {
        audioContexts[key].stop();
        audioContexts[key].play();
      }
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };
});

export { music };