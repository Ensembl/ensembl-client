import React from 'react';
import { mount } from 'enzyme';

import { BrowserNavIcon } from './BrowserNavIcon';
import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import { browserNavConfig } from '../browserConfig';

describe('<BrowserNavIcon />', () => {
  const browserNavItem = browserNavConfig[0];

  test('sends navigation message when clicked', () => {
    jest.spyOn(browserMessagingService, 'send');

    const renderedNavIcon = mount(
      <BrowserNavIcon browserNavItem={browserNavItem} enabled={false} />
    );

    renderedNavIcon.find('button').simulate('click');
    expect(browserMessagingService.send).toHaveBeenCalledTimes(1);

    (browserMessagingService.send as any).mockRestore();
  });
});
