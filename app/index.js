import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducers/index'
import App from './components/app'
import './css/main.less'

let store = createStore(reducers, {
  drawer: {
    open: true
  }
});

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('capri-root')
);
