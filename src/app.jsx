import React from 'react';
import { Provider } from 'react-redux';
import './app.less';

// H5 环境下引入额外的样式
if (process.env.TARO_ENV === 'h5') {
  require('./app.h5.less');
}

const App = ({ children }) => {
  return (
    <Provider store={require('./store').default}>
      {children}
    </Provider>
  );
}

export default App;
