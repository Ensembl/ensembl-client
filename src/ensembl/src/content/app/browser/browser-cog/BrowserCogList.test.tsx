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
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import set from 'lodash/fp/set';

import { BrowserCogList } from './BrowserCogList';
import { createMockBrowserState } from 'tests/fixtures/browser';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

jest.mock('./BrowserCog', () => () => <div id="browserCog" />);

let mockState = createMockBrowserState();
mockState = set('browser.trackConfig.trackConfigNames', {}, mockState);
mockState = set('browser.trackConfig.trackConfigLabel', {}, mockState);
mockState = set(
  'browser.trackConfig.browserCogTrackList',
  {
    'track:gc': 100
  },
  mockState
);

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const wrapInRedux = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <BrowserCogList />
    </Provider>
  );
};

describe('<BrowserCogList />', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('contains <BrowserCog /> when browser is activated', () => {
      const { container } = wrapInRedux(
        set('browser.browserInfo.browserActivated', true, mockState)
      );
      expect(container.querySelector('#browserCog')).toBeTruthy();
    });

    it('does not contain <BrowserCog /> when browser is not activated', () => {
      const { container } = wrapInRedux();
      expect(container.querySelector('#browserCog')).toBeFalsy();
    });
  });

  describe('behaviour', () => {
    it('sends navigation message when track name setting in browser cog is updated', () => {
      jest.spyOn(browserMessagingService, 'send');
      (browserMessagingService.send as any).mockReset();
      wrapInRedux(
        set(
          'browser.trackConfig.trackConfigNames',
          { 'track:gc': true },
          mockState
        )
      );

      expect(browserMessagingService.send).toHaveBeenLastCalledWith('bpane', {
        off: [],
        on: ['track:gc:label', 'track:gc:names']
      });

      // Notice that the ":names" and ":label" suffixes, counterintuitively, mean the opposite
      // See a comment in BrowserCogList for explanation
      // We expect this to be fixed later on.

      wrapInRedux(
        set(
          'browser.trackConfig.trackConfigNames',
          { 'track:gc': false },
          mockState
        )
      );

      expect(browserMessagingService.send).toHaveBeenLastCalledWith('bpane', {
        off: ['track:gc:label'],
        on: ['track:gc:names']
      });
    });

    it('sends navigation message when track label setting in browser cog is updated', () => {
      jest.spyOn(browserMessagingService, 'send');
      (browserMessagingService.send as any).mockReset();

      wrapInRedux(
        set(
          'browser.trackConfig.trackConfigLabel',
          { 'track:gc': true },
          mockState
        )
      );

      expect(browserMessagingService.send).toHaveBeenLastCalledWith('bpane', {
        off: ['track:gc:label'],
        on: ['track:gc:names']
      });

      // Notice that the ":names" and ":label" suffixes, counterintuitively, mean the opposite
      // See a comment in BrowserCogList for explanation
      // We expect this to be fixed later on.
      wrapInRedux(
        set(
          'browser.trackConfig.trackConfigNames',
          { 'track:gc': false },
          mockState
        )
      );
      expect(browserMessagingService.send).toHaveBeenLastCalledWith('bpane', {
        off: ['track:gc:label'],
        on: ['track:gc:names']
      });
    });
  });
});
