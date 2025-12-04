
import React, { useState, useEffect, useRef } from 'react'
import { View } from '@tarojs/components';
import cn from 'classnames';
import propTypes from 'prop-types';
import BaseFunctionComponent from '../common/BaseFunctionComponent.js';
import './index.css';

const format = (num) => (
  num < 10 ? `0${num}`.split('') : `${num}`.split('')
);

const NumberComponent = ({ time, number, length = 6 }) => {
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

  let list = [];
  if (time) { // 右下角时钟
    const now = times;
    const hour = format(now.getHours());
    const min = format(now.getMinutes());
    const sec = now.getSeconds() % 2;
    list = hour.concat(sec ? 'd' : 'd_c', min);
  } else {
    const num = String(number || 0).split('');
    for (let i = 0, len = length - num.length; i < len; i++) {
      num.unshift('n');
    }
    list = num;
  }

  return (
    <View className='number'>
      {
        list.map((e, k) => (
          <View className='number-item' key={k}>
            <View className={cn(['bg', `s_${e}`])} />
          </View>
        ))
      }
    </View>
  );
}

NumberComponent.propTypes = {
  number: propTypes.number,
  time: propTypes.bool,
  length: propTypes.number,
};

export default BaseFunctionComponent(NumberComponent);
