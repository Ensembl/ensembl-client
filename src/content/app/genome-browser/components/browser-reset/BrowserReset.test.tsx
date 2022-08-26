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
import set from 'lodash/fp/set';

import { BrowserReset } from './BrowserReset';

import { createMockBrowserState } from 'tests/fixtures/browser';

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <BrowserReset />
    </Provider>
  );
};

const mockChangeFocusObject = jest.fn();
jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    changeFocusObject: mockChangeFocusObject
  })
);

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => () => ({
    trackFocusObjectReset: jest.fn()
  })
);

describe('<BrowserReset />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders image button when focus feature exists', () => {
      const { container } = renderComponent();
      expect(container.querySelector('button')).toBeTruthy();
    });

    it('renders nothing when focus feature does not exist', () => {
      const { container } = renderComponent(
        set('browser.browserGeneral.activeFocusObjectIds', {}, mockState)
      );

      expect(container.firstChild).toBeFalsy();
    });
  });

  describe('behaviour', () => {
    it('changes focus object when clicked', async () => {
      const { container } = renderComponent();
      const button = container.querySelector('button') as HTMLButtonElement;
      await userEvent.click(button);

      expect(mockChangeFocusObject).toHaveBeenCalledWith(
        (mockState.browser.browserGeneral.activeFocusObjectIds as any)[
          mockState.browser.browserGeneral.activeGenomeId
        ]
      );
    });
  });
});
