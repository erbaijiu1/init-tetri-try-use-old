import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from '@tarojs/components';
import cn from 'classnames';
import propTypes from 'prop-types';
import BaseFunctionComponent from '../common/BaseFunctionComponent';
import './index.less';

const formate = (num) => (
  num < 10 ? `0${num}`.split('') : `${num}`.split('')
);

const Number = ({ time, number }) => {
  const [times, setTimes] = useState(new Date());
  const timeIntervalRef = useRef(null);

  useEffect(() => {
    if (!time) return;
    const clock = () => {
      timeIntervalRef.current = setTimeout(() => {
        setTimes(new Date());
        clock();
      }, 1000);
    }
    clock();
    return () => {
      clearTimeout(timeIntervalRef.current);
    }
  }, [time]);

  if (time) { // 右下角时钟
    const now = times;
    const hour = formate(now.getHours());
    const min = formate(now.getMinutes());
    const sec = now.getSeconds() % 2;
    const t = hour.concat(sec ? 'd' : 'd_c', min);
    return (
      <View className='number'>
      {
        t.map((e, k) => (
          <View key={`${k}-${e}`}><Text className={cn(['bg', `s_${e}`])}> </Text></View>        ))
      }
    </View>
    );
  }

  const num = String(number || 0).split('');
  for (let i = 0, len = 6 - num.length; i < len; i++) {
    num.unshift('n');
  }
  return (
      <View className='number'>
      {
        num.map((e, k) => (
          <View key={`${k}-${e}`}><Text className={cn(['bg', `s_${e}`])}> </Text></View>
        ))
      }
    </View>
  );
}

Number.propTypes = {
  number: propTypes.number,
  time: propTypes.bool,
};

export default BaseFunctionComponent(Number);