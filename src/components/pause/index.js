import React, { useState, useEffect, useRef } from 'react'
import { View } from '@tarojs/components'
import cn from 'classnames';
import propTypes from 'prop-types';
import BaseFunctionComponent from '../common/BaseFunctionComponent';
import './index.less';

const style = {
  pause: 'pause',
  c: 'c'
}

const Pause = ({ data = false }) => {
  const [showPause, setShowPause] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const setShake = (bool) => {
      if (bool && !timeoutRef.current) { // 闪烁
        timeoutRef.current = setInterval(() => {
          setShowPause(prev => !prev);
        }, 250);
      }
      if (!bool && timeoutRef.current) { // 停止闪烁
        clearInterval(timeoutRef.current);
        setShowPause(false);
        timeoutRef.current = null;
      }
    };
    
    setShake(data);
    
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [data])

  return (
    <View className='pause-container'>
      <View className={cn( { bg: true, [style.pause]: true, [style.c]: showPause } )} />
    </View>
  );
}

Pause.propTypes = {
  data: propTypes.bool.isRequired,
};

export default BaseFunctionComponent(Pause);