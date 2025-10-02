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

import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import createRootReducer from 'src/root/rootReducer';
import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import * as trackSettingsSlice from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import * as browserGeneralSlice from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { TrackType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

import TrackSettingsPanel from './TrackSettingsPanel';

const genomeId = 'fake_genome_id_1';
const selectedTrackId = 'focus';

const mockGenomeBrowser = new MockGenomeBrowser();

vi.mock('src/content/app/genome-browser/hooks/useGenomeBrowser', () => () => ({
  genomeBrowser: mockGenomeBrowser,
  toggleTrackSetting: vi.fn()
}));

vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => () => ({
    trackToggledTrackSetting: vi.fn()
  })
);

const renderComponent = () => {
  const fragment = {
    [selectedTrackId]: {
      id: selectedTrackId,
      trackType: TrackType.GENE,
      status: 'selected',
      settings: {
        name: false,
        label: false
      }
    }
  } as const;

  const initialState = {
    browser: {
      browserGeneral: {
        ...browserGeneralSlice.defaultBrowserGeneralState,
        activeGenomeId: genomeId
      },
      displayedTracks: [
        {
          id: selectedTrackId,
          height: 100,
          offsetTop: 0
        }
      ],
      trackSettings: {
        [genomeId]: {
          ...trackSettingsSlice.defaultTrackSettingsForGenome,
          settingsForIndividualTracks: fragment
        }
      }
    }
  };

  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: initialState as any
  });

  const renderResult = render(
    <Provider store={store}>
      <TrackSettingsPanel
        trackId={selectedTrackId}
        trackType={TrackType.GENE}
        onOutsideClick={vi.fn()}
      />
    </Provider>
  );
  return {
    ...renderResult,
    store
  };
};

describe('<TrackSettingsPanel />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('behaviour', () => {
    it('toggles track name', async () => {
      const { container, store } = renderComponent();
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Track name')
        ?.parentElement?.querySelector('svg') as SVGElement;

      vi.spyOn(trackSettingsSlice, 'updateTrackSettingsAndSave');

      await userEvent.click(toggle);
      const updatedState = store.getState();
      expect(
        trackSettingsSlice.updateTrackSettingsAndSave
      ).toHaveBeenCalledWith({
        genomeId,
        setting: 'name',
        isEnabled: true
      });

      const updatedTrackSettings = updatedState.browser.trackSettings[genomeId]
        .settingsForIndividualTracks[selectedTrackId].settings as {
        name: boolean;
      };
      expect(updatedTrackSettings.name).toBe(true);
    });

    it('toggles feature labels on the track', async () => {
      const { container, store } = renderComponent();
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Feature labels')
        ?.parentElement?.querySelector('svg') as SVGElement;

      vi.spyOn(trackSettingsSlice, 'updateTrackSettingsAndSave');
      await userEvent.click(toggle);
      const updatedState = store.getState();
      expect(
        trackSettingsSlice.updateTrackSettingsAndSave
      ).toHaveBeenCalledWith({
        genomeId,
        setting: 'label',
        isEnabled: true
      });
      const trackInfo =
        updatedState.browser.trackSettings[genomeId]
          .settingsForIndividualTracks[selectedTrackId];
      if (trackInfo.trackType === TrackType.GENE) {
        expect(trackInfo.settings.label).toBeTruthy();
      }
    });
  });
});
