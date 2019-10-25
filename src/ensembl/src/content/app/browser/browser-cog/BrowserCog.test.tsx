import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import BrowserCog, { BrowserCogProps } from './BrowserCog';
import BrowserTrackConfig from '../browser-track-config/BrowserTrackConfig';

jest.mock('../browser-track-config/BrowserTrackConfig', () => () => (
  <div>BrowserTrackConfig</div>
));

describe('<BrowserCog />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserCogProps = {
    cogActivated: true,
    trackId: faker.lorem.words(),
    updateSelectedCog: jest.fn()
  };

  describe('rendering', () => {
    test('renders browser track config', () => {
      const wrapper = mount(<BrowserCog {...defaultProps} />);
      expect(wrapper.find(BrowserTrackConfig).length).toBeGreaterThan(0);
    });
  });

  describe('behaviour', () => {
    test('toggles cog on click', () => {
      const wrapper = mount(<BrowserCog {...defaultProps} />);
      wrapper
        .find('button')
        .first()
        .simulate('click');
      expect(wrapper.props().updateSelectedCog).toHaveBeenCalledTimes(1);
    });
  });
});
