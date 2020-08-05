/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import { BrowserCogList } from './BrowserCogList';
import BrowserCog from './BrowserCog';

import browserMessagingService from 'src/content/app/browser/services/browser-messaging-service/browser-messaging-service';

describe('<BrowserCogList />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    browserActivated: true,
    browserCogList: 0,
    browserCogTrackList: { 'track:gc': faker.random.number() },
    trackConfigNames: {},
    trackConfigLabel: {},
    selectedCog: faker.lorem.words(),
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
