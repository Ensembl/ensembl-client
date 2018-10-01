import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import App from './App';
import Header from './layout/header/Header';
import Content from './layout/Content';

describe('<App />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  describe('contains', () => {
    test('<Header />', () => {
      expect(wrapper.contains(<Header />)).toBe(true);
    });

    test('<Content />', () => {
      expect(wrapper.contains(<Content />)).toBe(true);
    });
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
