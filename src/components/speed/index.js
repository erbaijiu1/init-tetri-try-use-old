
import React from 'react';
import { View } from '@tarojs/components';
import cn from 'classnames';
import propTypes from 'prop-types';
import BaseFunctionComponent from '../common/BaseFunctionComponent.js';
import './index.css';

const Speed = ({ data }) => {
  // Speed levels usually range from 1 to 6
  const levels = [1, 2, 3, 4, 5, 6];
  return (
    <View className='speed'>
      {levels.map(i => (
        <View 
          key={i} 
          className={cn('speed-item', { active: data >= i })} 
        />
      ))}
    </View>
  );
};

Speed.propTypes = {
  data: propTypes.number.isRequired,
};

export default BaseFunctionComponent(Speed);
