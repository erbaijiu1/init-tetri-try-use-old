import React from 'react';
import { Provider } from 'react-redux';
import './app.less';

const App = ({ children }) => {
  return (
    <Provider store={require('./store').default}>
      {children}
    </Provider>
  );
}

export default App;
