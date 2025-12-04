
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './store/index.js'
import './app.css'

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
