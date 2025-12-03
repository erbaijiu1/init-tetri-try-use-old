import Taro, { useState, useEffect, useRef } from '@tarojs/taro';
import propTypes from 'prop-types';
import { View } from '@tarojs/components';
import BaseFunctionComponent from '../common/BaseFunctionComponent';
import Number from '../number';
import { i18n, lan } from '../../unit/const';
import './index.less';

const DF = i18n.point[lan];
const ZDF = i18n.highestScore[lan];
const SLDF = i18n.lastRound[lan];

const Point = ({ cur, point, max }) => {
  const [label, setLabel] = useState('');
  const [number, setNumber] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const onChange = () => {
      clearInterval(timeoutRef.current);
      if (cur) { // 在游戏进行中
        setLabel(point >= max ? ZDF : DF);
        setNumber(point);
      } else { // 游戏未开始
        const toggle = () => { // 最高分与上轮得分交替出现
          setLabel(SLDF);
          setNumber(point);
          timeoutRef.current = setTimeout(() => {
            setLabel(ZDF);
            setNumber(max);
            timeoutRef.current = setTimeout(toggle, 3000);
          }, 3000);
        };

        if (point !== 0) { // 如果为上轮没玩, 也不用提示了
          toggle();
        } else {
          setLabel(ZDF);
          setNumber(max);
        }
      }
    };
    
    onChange();

    return () => {
      clearTimeout(timeoutRef.current);
    }
  }, [cur, point, max]);

  return (
    <View>
      <View className='p'>{ label }</View>
      <Number number={number} />
    </View>
  )
}

Point.propTypes = {
  cur: propTypes.bool,
  max: propTypes.number,
  point: propTypes.number,
};

export default BaseFunctionComponent(Point);