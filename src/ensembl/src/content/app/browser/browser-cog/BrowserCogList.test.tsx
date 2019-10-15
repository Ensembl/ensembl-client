import React from 'react';
import { mount } from 'enzyme';

import { BrowserCogList } from './BrowserCogList';
import BrowserCog from './BrowserCog';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

describe('<BrowserCogList />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    browserActivated: true,
    browserCogList: 0,
    browserCogTrackList: { 'track:gc': 491 },
    trackConfigNames: {},
    trackConfigLabel: {},
    selectedCog: 'track:gene-other-fwd',
    updateCogList: jest.fn(),
    updateCogTrackList: jest.fn(),
    updateSelectedCog: jest.fn()
  };

  describe('rendering', () => {
    test('contains <BrowserCog /> when browser is activated', () => {
      const wrapper = mount(<BrowserCogList {...defaultProps} />);
      expect(wrapper.find(BrowserCog)).toHaveLength(1);
    });

    test('does not contain <BrowserCog /> when browser is not activated', () => {
      const wrapper = mount(
        <BrowserCogList {...defaultProps} browserActivated={false} />
      );
      expect(wrapper.find(BrowserCog)).toHaveLength(0);
    });
  });

  describe('behaviour', () => {
    test('sends navigation message when track name setting in browser cog is updated', () => {
      jest.spyOn(browserMessagingService, 'send');

      const wrapper = mount(<BrowserCogList {...defaultProps} />);
      (browserMessagingService.send as any).mockReset();

      wrapper.setProps({ trackConfigNames: { 'track:other-gene-fwd': true } });
      expect(browserMessagingService.send).toHaveBeenCalledTimes(1);
    });

    test('sends navigation message when track label setting in browser cog is updated', () => {
      jest.spyOn(browserMessagingService, 'send');

      const wrapper = mount(<BrowserCogList {...defaultProps} />);
      (browserMessagingService.send as any).mockReset();

      wrapper.setProps({ trackConfigLabel: { 'track:other-gene-fwd': true } });
      expect(browserMessagingService.send).toHaveBeenCalledTimes(1);
    });
  });
});
