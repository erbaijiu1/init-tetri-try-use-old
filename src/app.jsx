import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import './app.less';

// H5 环境下引入额外的样式
if (process.env.TARO_ENV === 'h5') {
  require('./app.h5.less');
}

const App = ({ children }) => {
  useEffect(() => {
    // 捕获全局未处理的 Promise rejection（主要是音频相关）
    const handleUnhandledRejection = (event) => {
      // 如果是音频相关的错误，静默处理
      if (event.reason && (
        event.reason.message?.includes('audio') ||
        event.reason.message?.includes('play') ||
        event.reason.message?.includes('media')
      )) {
        event.preventDefault();
        console.warn('音频播放被阻止（可能是浏览器自动播放策略）');
      }
    };

    if (process.env.TARO_ENV === 'h5') {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      
      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  return (
    <Provider store={require('./store').default}>
      {children}
    </Provider>
  );
}

export default App;
