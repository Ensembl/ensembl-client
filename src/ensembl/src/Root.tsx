import React, { FunctionComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { hot } from 'react-hot-loader';

import Header from './header/Header';
import Content from './content/Content';

const Root: FunctionComponent = () => (
  <BrowserRouter>
    <React.StrictMode>
      <Header />
      <Content />
    </React.StrictMode>
  </BrowserRouter>
);

export default hot(module)(Root);
