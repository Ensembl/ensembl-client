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
import { IncomingActionType } from '@ensembl/ensembl-genome-browser';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import { BrowserCogList } from './BrowserCogList';

import { createMockBrowserState } from 'tests/fixtures/browser';

import { updateCogList } from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';

const mockGenomeBrowser = jest.fn(() => new MockGenomeBrowser() as any);

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowser()
  })
);

jest.mock('./BrowserCog', () => () => <div id="browserCog" />);

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <BrowserCogList />
    </Provider>
  );
};

describe('<BrowserCogList />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('contains <BrowserCog /> when browser is activated', () => {
      const { container } = renderComponent();
      expect(container.querySelector('#browserCog')).toBeTruthy();
    });

    it('does not contain <BrowserCog /> when browser is not activated', () => {
      mockGenomeBrowser.mockReturnValue(undefined);

      const { container } = renderComponent();
      expect(container.querySelector('#browserCog')).toBeFalsy();
    });

    it('calls updateCogList when genome browser sends track summary updates', () => {
      mockGenomeBrowser.mockReturnValue(new MockGenomeBrowser());

      renderComponent();

      mockGenomeBrowser().simulateBrowserMessage({
        type: IncomingActionType.TRACK_SUMMARY,
        payload: [
          {
            'switch-id': 'focus',
            offset: 100
          },
          {
            'switch-id': 'contig',
            offset: 200
          }
        ]
      });

      const dispatchedActions = store.getActions();

      const updateCogListAction = dispatchedActions.find(
        (action) => action.type === updateCogList.type
      );

      expect(updateCogListAction.payload).toEqual({
        focus: 100,
        contig: 200
      });
    });
  });
});
