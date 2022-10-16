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

import * as trackSettingsSlice from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import * as browserGeneralSlice from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { TrackType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

import TrackSettingsPanel from './TrackSettingsPanel';

const genomeId = 'fake_genome_id_1';
const selectedTrackId = 'focus';

const renderComponent = () => {
  const rootReducer = combineReducers({
    browser: combineReducers({
      browserGeneral: browserGeneralSlice.default,
      trackSettings: trackSettingsSlice.default
    })
  });

  const fragment = {
    [selectedTrackId]: {
      id: selectedTrackId,
      trackType: TrackType.GENE,
      status: 'selected',
      settings: {
        showSeveralTranscripts: false,
        showTranscriptIds: false,
        showTrackName: false,
        showFeatureLabels: false
      }
    }
  } as const;

  const initialState = {
    browser: {
      browserGeneral: {
        ...browserGeneralSlice.defaultBrowserGeneralState,
        activeGenomeId: genomeId
      },
      trackSettings: {
        [genomeId]: {
          ...trackSettingsSlice.defaultTrackSettingsForGenome,
          settingsForIndividualTracks: fragment
        }
      }
    }
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState as any
  });

  const renderResult = render(
    <Provider store={store}>
      <TrackSettingsPanel trackId={selectedTrackId} />
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
    toggleFeatureLabels: jest.fn(),
    toggleTranscriptIds: jest.fn(),
    toggleSeveralTranscripts: jest.fn()
  })
);

jest.mock(
  'src/content/app/genome-browser/components/browser-cog/useBrowserCogList',
  () => () => ({
    cogList: {
      [selectedTrackId]: 0
    }
  })
);

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => () => ({
    trackFeatureLabelToggle: jest.fn(),
    trackTrackNameToggle: jest.fn(),
    trackShowSeveralTranscriptsToggle: jest.fn(),
    trackShowTranscriptsIdToggle: jest.fn(),
    trackApplyToAllInTrackSettings: jest.fn()
  })
);

describe('<TrackSettingsPanel />', () => {
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
      jest.spyOn(trackSettingsSlice, 'updateApplyToAll');

      await userEvent.click(allTracksInputElement);
      const updatedState = store.getState();
      expect(trackSettingsSlice.updateApplyToAll).toHaveBeenCalledWith({
        genomeId,
        isSelected: true
      });
      expect(
        updatedState.browser.trackSettings[genomeId].settingsForAllTracks
          .shouldApplyToAll
      ).toBeTruthy();
    });

    it('toggles track name', async () => {
      const { container, store } = renderComponent();
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Track name')
        ?.parentElement?.querySelector('svg') as SVGElement;

      jest.spyOn(trackSettingsSlice, 'updateTrackName');

      await userEvent.click(toggle);
      const updatedState = store.getState();
      expect(trackSettingsSlice.updateTrackName).toHaveBeenCalledWith({
        genomeId,
        isTrackNameShown: true,
        trackId: updatedState.browser.trackSettings.selectedCog
      });
      expect(
        updatedState.browser.trackSettings[genomeId]
          .settingsForIndividualTracks[selectedTrackId].settings.showTrackName
      ).toBeTruthy();
    });

    it('toggles feature labels on the track', async () => {
      const { container, store } = renderComponent();
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Feature labels')
        ?.parentElement?.querySelector('svg') as SVGElement;

      jest.spyOn(trackSettingsSlice, 'updateFeatureLabelsVisibility');
      await userEvent.click(toggle);
      const updatedState = store.getState();
      expect(
        trackSettingsSlice.updateFeatureLabelsVisibility
      ).toHaveBeenCalledWith({
        genomeId,
        areFeatureLabelsShown: true,
        trackId: updatedState.browser.trackSettings.selectedCog
      });
      const trackInfo =
        updatedState.browser.trackSettings[genomeId]
          .settingsForIndividualTracks[selectedTrackId];
      if (trackInfo.trackType === TrackType.GENE) {
        expect(trackInfo.settings.showFeatureLabels).toBeTruthy();
      }
    });
  });
});
