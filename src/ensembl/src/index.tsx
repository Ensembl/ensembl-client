import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';

import store from './store';
import Root from './Root';

import { registerSW } from './registerServiceWorker';

import './styles/main';

import ReactGA from 'react-ga';

ReactGA.initialize('UA-58710484-17');
// Track the landing page
ReactGA.pageview(window.location.pathname + window.location.search);

render(
  <StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <Root />
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
