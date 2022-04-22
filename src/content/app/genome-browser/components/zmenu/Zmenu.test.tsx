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
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';

import Zmenu, { ZmenuProps } from './Zmenu';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import { createZmenuPayload } from 'tests/fixtures/browser';

const mockGenomeBrowser = new MockGenomeBrowser();
jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowser
  })
);

jest.mock(
  'src/content/app/genome-browser/state/track-panel/trackPanelSlice.ts',
  () => ({
    changeHighlightedTrackId: jest.fn(() => ({
      type: 'change-track-highlight'
    }))
  })
);

jest.mock('./ZmenuContent', () => () => (
  <div data-test-id="zmenuContent">ZmenuContent</div>
));
jest.mock('./ZmenuInstantDownload', () => () => (
  <div>ZmenuInstantDownload</div>
));

const defaultProps: ZmenuProps = {
  browserRef: {
    current: document.createElement('div')
  },
  zmenuId: '1',
  payload: createZmenuPayload()
};

const mockStore = configureMockStore([thunk]);
let store: ReturnType<typeof mockStore>;
const renderComponent = () => {
  store = mockStore();
  return render(
    <Provider store={store}>
      <Zmenu {...defaultProps} />
    </Provider>
  );
};
describe('<Zmenu />', () => {
  describe('rendering', () => {
    test('renders zmenu content', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('zmenuContent')).toBeTruthy();
    });
  });
});
