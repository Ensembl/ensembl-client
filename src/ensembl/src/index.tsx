import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import Root from './Root';

import { registerSW } from './registerServiceWorker';

import './styles/main';

render(
  <StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </StrictMode>,
  document.getElementById('ens-app')
);

if (module.hot) {
  module.hot.accept();
} else {
  registerSW();
}
