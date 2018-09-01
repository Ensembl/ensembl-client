import React from 'react';
import { shallow } from 'enzyme';

import App from './App';
import Header from './layout/header/Header';
import Content from './layout/Content';

describe('<App />', () => {
  it('renders <Header />', () => {
    expect(shallow(<App/>).contains(<Header/>)).toBe(true);
  });

  it('renders <Content />', () => {
    expect(shallow(<App/>).contains(<Content/>)).toBe(true);
  });
});
