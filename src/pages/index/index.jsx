
import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import propTypes from 'prop-types';
import classnames from 'classnames';
import Decorate from '../../components/decorate/index.js';
import Matrix from '../../components/matrix/index.js';
import Logo from '../../components/logo/index.js';
import Number from '../../components/number/index.js';
import Next from '../../components/next/index.js';
import Music from '../../components/music/index.js';
import Pause from '../../components/pause/index.js';
import Point from '../../components/point/index.js';
import Keyboard from '../../components/keyboard/index.js';
import Speed from '../../components/speed/index.js';
import { i18n, lan } from '../../unit/const.js';
import './index.css';

class Index extends Component {

  render () {
    return (
      <View className='app'>
        <View className={classnames({ 'rect': true, 'drop': this.props.drop })}>
          <Decorate />
          <View className='screen'>
            <View className='panel'>
              <Matrix
                matrix={this.props.matrix}
                cur={this.props.cur}
                reset={this.props.reset}
              />
              <Logo cur={!!this.props.cur} reset={this.props.reset} />
              <View className='state'>
                <Point cur={!!this.props.cur} point={this.props.points} max={this.props.max} />
                <View className='p'>{this.props.cur ? i18n.cleans[lan] : i18n.startLine[lan]}</View>
                <Number number={this.props.cur ? this.props.clearLines : this.props.startLines} />
                <View className='p'>{i18n.level[lan]}</View>
                <Number
                  number={this.props.cur ? this.props.speedRun : this.props.speedStart}
                  length={1}
                />
                <Speed data={this.props.cur ? this.props.speedRun : this.props.speedStart} />
                <View className='p'>{i18n.next[lan]}</View>
                <Next data={this.props.next} />
                <View className='bottom'>
                  <Music data={this.props.music} />
                  <Pause data={this.props.pause} />
                  <Number time />
                </View>
              </View>
            </View>
          </View>
        </View>
        <Keyboard keyboard={this.props.keyboard} />
      </View>
    )
  }
}

Index.propTypes = {
  music: propTypes.bool.isRequired,
  pause: propTypes.bool.isRequired,
  matrix: propTypes.object.isRequired,
  next: propTypes.string.isRequired,
  cur: propTypes.object,
  dispatch: propTypes.func.isRequired,
  speedStart: propTypes.number.isRequired,
  speedRun: propTypes.number.isRequired,
  startLines: propTypes.number.isRequired,
  clearLines: propTypes.number.isRequired,
  points: propTypes.number.isRequired,
  max: propTypes.number.isRequired,
  reset: propTypes.bool.isRequired,
  drop: propTypes.bool.isRequired,
  keyboard: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  pause: state.get('pause'),
  music: state.get('music'),
  matrix: state.get('matrix'),
  next: state.get('next'),
  cur: state.get('cur'),
  speedStart: state.get('speedStart'),
  speedRun: state.get('speedRun'),
  startLines: state.get('startLines'),
  clearLines: state.get('clearLines'),
  points: state.get('points'),
  max: state.get('max'),
  reset: state.get('reset'),
  drop: state.get('drop'),
  keyboard: state.get('keyboard'),
});

export default connect(mapStateToProps)(Index);
