import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Button, Canvas, Input, Slider } from '@tarojs/components';
import { connect } from 'react-redux';
import store from '../../store';
import actions from '../../actions';
import bgmSource from '../../asset/music/music.mp3';
import './index.less';

// 音频片段初始配置
const INITIAL_CLIPS = {
  start: { startTime: 3.722, duration: 3.633, name: '游戏开始', color: '#4CAF50' },
  clear: { startTime: 0, duration: 0.7675, name: '消除行', color: '#2196F3' },
  fall: { startTime: 1.2558, duration: 0.3546, name: '方块落下', color: '#FF9800' },
  gameover: { startTime: 8.128, duration: 1.144, name: '游戏结束', color: '#F44336' },
  rotate: { startTime: 2.257, duration: 0.281, name: '旋转', color: '#9C27B0' },
  move: { startTime: 2.909, duration: 0.24, name: '移动', color: '#00BCD4' }
};

@connect((state) => ({
  musicEnabled: state.get('music'),
}))
export default class TestAudio extends Component {
  config = {
    navigationBarTitleText: '音效精确定位工具'
  };

  state = {
    mode: 'simple', // 'simple' 或 'editor'
    clips: JSON.parse(JSON.stringify(INITIAL_CLIPS)),
    selectedClip: 'start',
    currentTime: 0,
    duration: 0,
    playing: false,
    audioReady: false
  };

  audioContext = null;
  audioBuffer = null;
  sourceNode = null;
  startTime = 0;
  pauseTime = 0;

  componentDidMount() {
    if (!this.props.musicEnabled) {
      store.dispatch(actions.music(true));
    }
    this.initAudio();
  }

  componentWillUnmount() {
    this.stopAudio();
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  // 初始化 Web Audio API
  initAudio = async () => {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const response = await fetch(bgmSource);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.setState({
        duration: this.audioBuffer.duration,
        audioReady: true
      });

      if (this.state.mode === 'editor') {
        this.drawWaveform();
      }
    } catch (error) {
      console.error('音频加载失败:', error);
      Taro.showToast({ title: '音频加载失败', icon: 'none' });
    }
  };

  // 绘制波形
  drawWaveform = () => {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas || !this.audioBuffer) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const data = this.audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      
      ctx.moveTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }
    
    ctx.stroke();
    this.drawClipMarkers();
  };

  // 绘制片段标记
  drawClipMarkers = () => {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const { duration, clips, selectedClip } = this.state;

    Object.entries(clips).forEach(([key, clip]) => {
      const startX = (clip.startTime / duration) * width;
      const endX = ((clip.startTime + clip.duration) / duration) * width;
      const isSelected = key === selectedClip;

      ctx.fillStyle = isSelected ? clip.color + '66' : clip.color + '33';
      ctx.fillRect(startX, 0, endX - startX, height);

      ctx.strokeStyle = isSelected ? clip.color : clip.color + '88';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, height);
      ctx.moveTo(endX, 0);
      ctx.lineTo(endX, height);
      ctx.stroke();

      // 绘制标签
      if (isSelected) {
        ctx.fillStyle = clip.color;
        ctx.font = '12px Arial';
        ctx.fillText(clip.name, startX + 5, 20);
      }
    });

    // 绘制当前播放位置
    if (this.state.playing) {
      const currentX = (this.state.currentTime / duration) * width;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, height);
      ctx.stroke();
    }
  };

  // 播放音频
  playAudio = (startTime = null, duration = null) => {
    this.stopAudio();

    const { selectedClip, clips } = this.state;
    const clip = clips[selectedClip];
    
    const start = startTime !== null ? startTime : clip.startTime;
    const dur = duration !== null ? duration : clip.duration;

    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.connect(this.audioContext.destination);
    
    this.sourceNode.start(0, start, dur);
    this.startTime = this.audioContext.currentTime - start;
    
    this.setState({ playing: true, currentTime: start });
    this.updateTime();

    this.sourceNode.onended = () => {
      this.setState({ playing: false });
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    };
  };

  // 停止播放
  stopAudio = () => {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch (e) {}
      this.sourceNode = null;
    }
    this.setState({ playing: false });
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  };

  // 更新时间显示
  updateTime = () => {
    if (!this.state.playing) return;
    
    const currentTime = this.audioContext.currentTime - this.startTime;
    this.setState({ currentTime });
    
    if (this.state.mode === 'editor') {
      this.drawClipMarkers();
    }
    
    this.animationFrame = requestAnimationFrame(this.updateTime);
  };

  // 切换模式
  switchMode = (mode) => {
    this.stopAudio();
    this.setState({ mode }, () => {
      if (mode === 'editor' && this.audioBuffer) {
        setTimeout(() => this.drawWaveform(), 100);
      }
    });
  };

  // 更新片段配置
  updateClip = (field, value) => {
    const { selectedClip, clips } = this.state;
    const newClips = {
      ...clips,
      [selectedClip]: {
        ...clips[selectedClip],
        [field]: parseFloat(value)
      }
    };
    this.setState({ clips: newClips }, () => {
      if (this.state.mode === 'editor') {
        this.drawClipMarkers();
      }
    });
  };

  // 导出配置
  exportConfig = () => {
    const { clips } = this.state;
    const config = Object.entries(clips).reduce((acc, [key, clip]) => {
      acc[key] = {
        startTime: parseFloat(clip.startTime.toFixed(4)),
        duration: parseFloat(clip.duration.toFixed(4))
      };
      return acc;
    }, {});

    const configStr = JSON.stringify(config, null, 2);
    console.log('新的音频配置：\n', configStr);
    
    Taro.setClipboardData({
      data: configStr,
      success: () => {
        Taro.showToast({ title: '配置已复制到剪贴板', icon: 'success' });
      }
    });
  };

  // 渲染简单模式
  renderSimpleMode = () => {
    const { clips } = this.state;

    return (
      <View className='simple-mode'>
        <View className='audio-list'>
          {Object.entries(clips).map(([key, clip]) => (
            <View key={key} className='audio-item'>
              <View className='audio-info'>
                <View className='audio-name'>{clip.name}</View>
                <View className='audio-time'>
                  {clip.startTime.toFixed(3)}s - {(clip.startTime + clip.duration).toFixed(3)}s
                </View>
              </View>
              <Button
                className='play-btn'
                style={{ backgroundColor: clip.color }}
                onClick={() => {
                  this.setState({ selectedClip: key }, () => this.playAudio());
                }}
              >
                播放
              </Button>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // 渲染编辑器模式
  renderEditorMode = () => {
    const { clips, selectedClip, currentTime, duration, playing, audioReady } = this.state;
    const clip = clips[selectedClip];

    if (!audioReady) {
      return <View className='loading'>加载音频中...</View>;
    }

    return (
      <View className='editor-mode'>
        <View className='waveform-container'>
          <canvas
            id='waveform-canvas'
            width={800}
            height={200}
            className='waveform-canvas'
          />
          <View className='time-info'>
            当前时间: {currentTime.toFixed(3)}s / 总时长: {duration.toFixed(3)}s
          </View>
        </View>

        <View className='clip-selector'>
          {Object.entries(clips).map(([key, c]) => (
            <Button
              key={key}
              className={`clip-btn ${selectedClip === key ? 'active' : ''}`}
              style={{ 
                backgroundColor: selectedClip === key ? c.color : '#666',
                borderColor: c.color
              }}
              onClick={() => this.setState({ selectedClip: key }, () => this.drawClipMarkers())}
            >
              {c.name}
            </Button>
          ))}
        </View>

        <View className='clip-editor'>
          <View className='editor-header'>
            <View className='clip-name'>{clip.name}</View>
            <View className='clip-color' style={{ backgroundColor: clip.color }} />
          </View>

          <View className='time-control'>
            <View className='control-item'>
              <View className='label'>起始时间 (秒)</View>
              <Input
                type='digit'
                value={clip.startTime.toFixed(3)}
                onInput={(e) => this.updateClip('startTime', e.detail.value)}
                className='time-input'
              />
              <Slider
                min={0}
                max={duration}
                step={0.001}
                value={clip.startTime}
                onChange={(e) => this.updateClip('startTime', e.detail.value)}
                activeColor={clip.color}
                className='time-slider'
              />
            </View>

            <View className='control-item'>
              <View className='label'>持续时间 (秒)</View>
              <Input
                type='digit'
                value={clip.duration.toFixed(3)}
                onInput={(e) => this.updateClip('duration', e.detail.value)}
                className='time-input'
              />
              <Slider
                min={0.1}
                max={5}
                step={0.001}
                value={clip.duration}
                onChange={(e) => this.updateClip('duration', e.detail.value)}
                activeColor={clip.color}
                className='time-slider'
              />
            </View>
          </View>

          <View className='preview-buttons'>
            <Button 
              className='preview-btn'
              style={{ backgroundColor: clip.color }}
              onClick={() => this.playAudio()}
              disabled={playing}
            >
              {playing ? '播放中...' : '预览片段'}
            </Button>
            <Button 
              className='stop-btn'
              onClick={this.stopAudio}
              disabled={!playing}
            >
              停止
            </Button>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { mode } = this.state;

    return (
      <View className='test-audio-page'>
        <View className='header'>
          <View className='title'>🎵 音频精确定位工具</View>
          <View className='mode-switch'>
            <Button
              className={`mode-btn ${mode === 'simple' ? 'active' : ''}`}
              onClick={() => this.switchMode('simple')}
            >
              快速测试
            </Button>
            <Button
              className={`mode-btn ${mode === 'editor' ? 'active' : ''}`}
              onClick={() => this.switchMode('editor')}
            >
              精确编辑
            </Button>
          </View>
        </View>

        {mode === 'simple' ? this.renderSimpleMode() : this.renderEditorMode()}

        <View className='bottom-actions'>
          <Button className='export-btn' onClick={this.exportConfig}>
            📋 导出配置代码
          </Button>
          <Button className='back-btn' onClick={() => Taro.navigateBack()}>
            返回游戏
          </Button>
        </View>

        <View className='tips'>
          <View className='tips-title'>💡 使用说明</View>
          {mode === 'simple' ? (
            <>
              <View className='tips-item'>• 快速测试每个音效是否准确</View>
              <View className='tips-item'>• 切换到"精确编辑"模式进行调整</View>
            </>
          ) : (
            <>
              <View className='tips-item'>• 波形图显示完整音频，彩色区域为各音效片段</View>
              <View className='tips-item'>• 拖动滑块或输入精确数值调整起始时间和时长</View>
              <View className='tips-item'>• 点击"预览片段"实时试听效果</View>
              <View className='tips-item'>• 调整满意后点击"导出配置代码"复制到剪贴板</View>
            </>
          )}
        </View>
      </View>
    );
  }
}
