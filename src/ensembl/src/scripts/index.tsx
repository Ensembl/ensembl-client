import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import Root from './components/Root';

import { registerSW } from './registerServiceWorker';

import '../styles/main';

render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('ens-app')
);

registerSW();
