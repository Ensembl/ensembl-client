import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import BrowserNavIcon from './BrowserNavIcon';

import { browserNavConfig } from '../browserConfig';

describe('<BrowserNavIcon />', () => {
  const browserNavItem = browserNavConfig[0];
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<BrowserNavIcon browserNavItem={browserNavItem} />);
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
