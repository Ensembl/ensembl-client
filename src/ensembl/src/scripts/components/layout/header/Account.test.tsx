import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Account } from './Account';

describe('<Account />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Account accountExpanded={true} />);
  });

  describe('when account is', () => {
    test('expanded renders children', () => {
      expect(wrapper.find('.account')).toHaveLength(1);
    });

    test('collapsed does not render children', () => {
      wrapper.setProps({ accountExpanded: false });
      expect(wrapper.find('.account')).toHaveLength(0);
    });
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
