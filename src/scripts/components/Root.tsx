import React, { SFC } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { hot } from 'react-hot-loader';

import Header from './layout/header/Header';
import Content from './layout/Content';

const Root: SFC = () => (
  <BrowserRouter>
    <React.StrictMode>
      <Header />
      <Content />
    </React.StrictMode>
  </BrowserRouter>
);

export default hot(module)(Root);
