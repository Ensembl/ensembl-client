import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import BrowserImage from './BrowserImage';

describe('<BrowserImage />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<BrowserImage />);
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
