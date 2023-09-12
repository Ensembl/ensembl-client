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
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, act } from '@testing-library/react';

import MockGenomeBrowserService from 'tests/mocks/mockGenomeBrowserService';

import { BrowserCogList } from './BrowserCogList';

import * as browserGeneralSlice from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import * as displayedTracksSlice from 'src/content/app/genome-browser/state/displayed-tracks/displayedTracksSlice';

import createRootReducer from 'src/root/rootReducer';

const mockGenomeBrowserService = new MockGenomeBrowserService();

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowserService: mockGenomeBrowserService
  })
);

jest.mock('./BrowserCog', () => () => <div className="browserCog" />);

const displayedTracks = [
  {
    id: 'gene-focus',
    height: 192,
    offsetTop: 0
  },
  {
    id: 'contig',
    height: 100,
    offsetTop: 192
  },
  {
    id: 'gc',
    height: 100,
    offsetTop: 292
  }
];

const renderComponent = () => {
  const initialState = {
    browser: {
      browserGeneral: {
        ...browserGeneralSlice.defaultBrowserGeneralState,
        activeGenomeId: 'human'
      },
      displayedTracks,
      trackSettings: {
        human: {
          settingsForIndividualTracks: {
            'gene-focus': {
              trackType: 'gene'
            },
            contig: {
              trackType: 'regular'
            },
            gc: {
              trackType: 'regular'
            }
          }
        }
      }
    }
  };

  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: initialState as any
  });

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
    it('renders correct number of cogs when genome browser is activated', () => {
      const { container } = renderComponent();
      const renderedCogs = container.querySelectorAll('.browserCog');
      expect(renderedCogs.length).toBe(displayedTracks.length);
    });

    it('updates displayed tracks in redux after receiving genome browser message', () => {
      jest.spyOn(displayedTracksSlice, 'setDisplayedTracks');

      renderComponent();

      const newTrackSummary = {
        summary: [
          {
            'switch-id': 'focus',
            height: 200,
            offset: 0
          },
          {
            'switch-id': 'contig',
            height: 192,
            offset: 200
          }
        ]
      };

      act(() => {
        mockGenomeBrowserService.simulateBrowserMessage({
          type: 'track_summary',
          payload: newTrackSummary
        });
      });

      const expectedPayload = newTrackSummary.summary.map((track) => ({
        id: track['switch-id'],
        height: track.height,
        offsetTop: track.offset
      }));

      expect(
        (displayedTracksSlice.setDisplayedTracks as any).mock.calls[0][0]
      ).toEqual(expectedPayload);
    });
  });
});
