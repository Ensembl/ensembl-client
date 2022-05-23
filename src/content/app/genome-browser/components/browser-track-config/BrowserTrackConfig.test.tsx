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
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import * as trackConfigActions from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';
import * as browserGeneralActions from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import BrowserTrackConfig from './BrowserTrackConfig';

const genomeId = 'fake_genome_id_1';
const selectedTrackId = 'gene-focus';
const renderComponent = () => {
  const rootReducer = combineReducers({
    browser: combineReducers({
      browserGeneral: browserGeneralActions.default,
      trackConfig: trackConfigActions.default
    })
  });

  const fragment = {
    selectedCog: selectedTrackId,
    tracks: {
      [selectedTrackId]: {
        showSeveralTranscripts: false,
        showTranscriptIds: false,
        showTrackName: false,
        showFeatureLabel: false,
        trackType: trackConfigActions.TrackType.GENE
      }
    }
  };

  const initialState = {
    browser: {
      browserGeneral: Object.assign(
        {},
        browserGeneralActions.defaultBrowserGeneralState,
        { activeGenomeId: genomeId }
      ),
      trackConfig: {
        [genomeId]: Object.assign(
          {},
          trackConfigActions.defaultTrackConfigsPerGenome,
          fragment
        )
      }
    }
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState
  });

  const renderResult = render(
    <Provider store={store}>
      <BrowserTrackConfig />
    </Provider>
  );
  return {
    ...renderResult,
    store
  };
};

const mockGenomeBrowser = new MockGenomeBrowser();

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowser,
    toggleTrackName: jest.fn(),
    toggleTrackLabel: jest.fn()
  })
);

describe('<BrowserTrackConfig />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('behaviour', () => {
    it('updates state when clicking All Tracks option', async () => {
      const { container, store } = renderComponent();
      const allTracksLabel = [...container.querySelectorAll('label')].find(
        (el) => el.textContent === 'All tracks'
      );
      const allTracksInputElement = allTracksLabel?.querySelector(
        'input'
      ) as HTMLElement;
      jest.spyOn(trackConfigActions, 'updateApplyToAll');

      await userEvent.click(allTracksInputElement);
      const updatedState = store.getState();
      expect(trackConfigActions.updateApplyToAll).toHaveBeenCalledWith({
        genomeId,
        isSelected: true
      });
      expect(
        updatedState.browser.trackConfig[genomeId].applyToAllConfig.isSelected
      ).toBeTruthy();
    });

    it('toggles track name', async () => {
      const { container, store } = renderComponent();
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Track name')
        ?.parentElement?.querySelector('svg') as SVGElement;

      jest.spyOn(trackConfigActions, 'updateTrackName');

      await userEvent.click(toggle);
      const updatedState = store.getState();
      expect(trackConfigActions.updateTrackName).toHaveBeenCalledTimes(1);
      expect(trackConfigActions.updateTrackName).toHaveBeenCalledWith({
        genomeId,
        isTrackNameShown: true,
        selectedCog: updatedState.browser.trackConfig[genomeId].selectedCog
      });
      expect(
        updatedState.browser.trackConfig[genomeId].tracks[selectedTrackId]
          .showTrackName
      ).toBeTruthy();
    });

    it('toggles feature labels on the track', async () => {
      const { container, store } = renderComponent();
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Feature labels')
        ?.parentElement?.querySelector('svg') as SVGElement;

      jest.spyOn(trackConfigActions, 'updateFeatureLabel');
      await userEvent.click(toggle);
      const updatedState = store.getState();
      expect(trackConfigActions.updateFeatureLabel).toHaveBeenCalledTimes(1);
      expect(trackConfigActions.updateFeatureLabel).toHaveBeenCalledWith({
        genomeId,
        isTrackLabelShown: true,
        selectedCog: updatedState.browser.trackConfig[genomeId].selectedCog
      });
      const trackInfo =
        updatedState.browser.trackConfig[genomeId].tracks[selectedTrackId];
      if (trackInfo.trackType === trackConfigActions.TrackType.GENE) {
        expect(trackInfo.showFeatureLabel).toBeTruthy();
      }
    });
  });
});
