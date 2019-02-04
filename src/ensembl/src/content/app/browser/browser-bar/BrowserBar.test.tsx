import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import BrowserBar from './BrowserBar';

describe('<BrowserBar />', () => {
  let toggleBrowserNavFn: () => void;
  let wrapper: any;

  beforeEach(() => {
    toggleBrowserNavFn = jest.fn();
    wrapper = shallow(
      <BrowserBar
        browserNavOpened={true}
        expanded={true}
        toggleBrowserNav={toggleBrowserNavFn}
      />
    );
  });

  test('has a left bar', () => {
    expect(wrapper.find('.browserInfoLeft')).toHaveLength(1);
  });

  test('has a right bar', () => {
    expect(wrapper.find('.browserInfoRight')).toHaveLength(1);
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
