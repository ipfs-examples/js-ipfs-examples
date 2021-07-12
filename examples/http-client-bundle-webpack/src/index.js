import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

// Check if HMR interface is enabled
if (module.hot) {
  // Accept hot update
  module.hot.accept()
}
