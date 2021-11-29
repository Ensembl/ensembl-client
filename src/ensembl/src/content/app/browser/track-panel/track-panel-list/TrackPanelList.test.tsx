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

import { createMockBrowserState } from 'tests/fixtures/browser';
import { createEnsObject } from 'tests/fixtures/ens-object';

import { TrackPanelList } from './TrackPanelList';

jest.mock('./track-panel-items/TrackPanelGene', () => () => (
  <div className="trackPanelGene" />
));

jest.mock('./track-panel-items/TrackPanelRegularItem', () => () => (
  <div className="trackPanelRegularItem" />
));

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <TrackPanelList />
    </Provider>
  );
};

describe('<TrackPanelList />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders gene tracks', () => {
      const { container } = renderComponent();

      expect(container.querySelectorAll('.trackPanelGene').length).toBe(1);
    });

    it('does not render main track if the focus feature is a region', () => {
      const activeGenomeId = mockState.browser.browserEntity.activeGenomeId;
      const activeEnsObjectId = (
        mockState.browser.browserEntity.activeEnsObjectIds as any
      )[activeGenomeId];
      const { container } = renderComponent(
        set(
          `ensObjects.${activeEnsObjectId}.data`,
          createEnsObject('region'),
          mockState
        )
      );
      expect(container.querySelector('.mainTrackItem')).toBeFalsy();
    });
  });
});
