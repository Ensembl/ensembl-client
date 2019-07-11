import React from 'react';
import { mount } from 'enzyme';

import { BrowserNavIcon } from './BrowserNavIcon';

import { browserNavConfig } from '../browserConfig';

describe('<BrowserNavIcon />', () => {
  const browserNavItem = browserNavConfig[0];

  test('fires navigation event when clicked', () => {
    const mockCallback = jest.fn();

    const renderedNavIcon = mount(
      <BrowserNavIcon browserNavItem={browserNavItem} maxState={false} />
    );

    renderedNavIcon.find('button').simulate('click');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
