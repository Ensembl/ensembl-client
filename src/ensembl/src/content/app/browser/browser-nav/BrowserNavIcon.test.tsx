import React from 'react';
import { mount } from 'enzyme';

import { BrowserNavIcon } from './BrowserNavIcon';

import { browserNavConfig } from '../browserConfig';

describe('<BrowserNavIcon />', () => {
  const browserNavItem = browserNavConfig[0];
  const browserImageElement = <div />;

  test('fires navigation event when clicked', () => {
    const renderedDiv = mount(browserImageElement).getDOMNode();
    const mockCallback = jest.fn();
    renderedDiv.addEventListener('bpane', mockCallback);

    const renderedNavIcon = mount(
      <BrowserNavIcon
        browserNavItem={browserNavItem}
        browserImageEl={renderedDiv as HTMLDivElement}
        maxState={false}
      />
    );

    renderedNavIcon.find('button').simulate('click');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
