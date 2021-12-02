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
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { createMockBrowserState } from 'tests/fixtures/browser';

import * as browserActions from 'src/content/app/genome-browser/state/browserActions';

import { BrowserTrackConfig } from './BrowserTrackConfig';

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = () => {
  store = mockStore(mockState);
  return render(
    <Provider store={store}>
      <BrowserTrackConfig />
    </Provider>
  );
};

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

const mockGenomeBrowser = new MockGenomeBrowser();

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowser
  })
);

describe('<BrowserTrackConfig />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('behaviour', () => {
    it('can update all tracks', () => {
      const { container } = renderComponent();
      const allTracksLabel = [...container.querySelectorAll('label')].find(
        (el) => el.textContent === 'All tracks'
      );
      const allTracksInputElement = allTracksLabel?.querySelector(
        'input'
      ) as HTMLElement;
      jest.spyOn(browserActions, 'updateApplyToAll');
      userEvent.click(allTracksInputElement);

      expect(browserActions.updateApplyToAll).toHaveBeenCalledTimes(1);
    });

    it('toggles track name', () => {
      const { container } = renderComponent();
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Track name')
        ?.parentElement?.querySelector('svg') as SVGElement;

      jest.spyOn(browserActions, 'updateTrackConfigNames');

      userEvent.click(toggle);

      expect(browserActions.updateTrackConfigNames).toHaveBeenCalledTimes(1);
      expect(browserActions.updateTrackConfigNames).toHaveBeenCalledWith(
        mockState.browser.trackConfig.selectedCog,
        false
      );
    });

    it('toggles feature labels on the track', () => {
      const { container } = renderComponent();
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Feature labels')
        ?.parentElement?.querySelector('svg') as SVGElement;

      jest.spyOn(browserActions, 'updateTrackConfigLabel');
      userEvent.click(toggle);

      expect(browserActions.updateTrackConfigLabel).toHaveBeenCalledTimes(1);
      expect(browserActions.updateTrackConfigLabel).toHaveBeenCalledWith(
        mockState.browser.trackConfig.selectedCog,
        false
      );
    });
  });
});
