import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Browser } from './Browser';
import { BrowserOpenState } from './browserState';

describe('<Browser />', () => {
  let closeDrawerFn: () => void;
  let toggleBrowserNavFn: () => void;
  let wrapper: any;

  beforeEach(() => {
    closeDrawerFn = jest.fn();
    toggleBrowserNavFn = jest.fn();
    wrapper = shallow(
      <Browser
        browserNavOpened={true}
        browserOpenState={BrowserOpenState.SEMI_EXPANDED}
        closeDrawer={closeDrawerFn}
        drawerOpened={false}
        toggleBrowserNav={toggleBrowserNavFn}
      />
    );
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
