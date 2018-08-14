import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

import { registerSW } from './registerServiceWorker';

import '../styles/main';

render(<App/>, document.getElementById('ens-app'));

registerSW();
