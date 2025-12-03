import React from 'react';

// This file acts as an abstraction layer.
// For Web, it renders standard HTML elements.
// For Taro/WeChat, you would change these imports to: import { View, Text, Button } from '@tarojs/components';

interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  id?: string;
  onClick?: () => void;
}

export const View: React.FC<BaseProps> = (props) => {
  return <div {...props} />;
};

export const Text: React.FC<BaseProps> = (props) => {
  return <span {...props} />;
};

interface ButtonProps extends BaseProps {
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      className={props.className}
      style={props.style}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
