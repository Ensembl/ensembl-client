import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import BrowserNavBar from './BrowserNavBar';

describe('<BrowserNavBar />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<BrowserNavBar />);
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
