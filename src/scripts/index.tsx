import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import App from './components/App';

import { registerSW } from './registerServiceWorker';

import '../styles/main';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('ens-app')
);

registerSW();
