import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './store';
import Root from './root/Root';

import { registerSW } from './registerServiceWorker';

import './styles/main';

const store = configureStore();

render(
  <StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Root />
        </ConnectedRouter>
      </Provider>
    </CookiesProvider>
  </StrictMode>,
  document.getElementById('ens-app')
);

if (module.hot) {
  module.hot.accept();
} else {
  registerSW();
}
