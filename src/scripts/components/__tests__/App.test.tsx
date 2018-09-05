import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import App from '../App';
import Header from '../layout/header/Header';
import Content from '../layout/Content';

describe('<App />', () => {
  it('contains <Header />', () => {
    expect(shallow(<App />).contains(<Header />)).toBe(true);
  });

  it('contains <Content />', () => {
    expect(shallow(<App />).contains(<Content />)).toBe(true);
  });

  it('renders correctly', () => {
    const component = shallow(<App />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
