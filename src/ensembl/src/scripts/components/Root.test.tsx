import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Root from './Root';
import Header from './layout/header/Header';
import Content from './layout/Content';

describe('<Root />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Root />);
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
