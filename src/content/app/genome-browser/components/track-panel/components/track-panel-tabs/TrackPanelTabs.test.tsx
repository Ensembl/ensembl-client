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
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import * as trackPanelActions from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import * as drawerActions from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import createRootReducer from 'src/root/rootReducer';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import { TrackPanelTabs } from './TrackPanelTabs';

import { TrackSet } from '../../trackPanelConfig';

const mockTrackApi = 'http://track-api';

jest.mock('config', () => ({
  tracksApiBaseUrl: 'http://track-api'
}));

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => () => ({
    reportTrackPanelTabChange: jest.fn()
  })
);

const mockTrackCategories = {
  track_categories: [
    {
      label: 'Genes & transcripts',
      track_category_id: 'genes-transcripts',
      type: 'Genomic',
      track_list: [
        {
          track_id: 'gene-pc-fwd',
          trigger: ['track', 'gene-pc-fwd']
        }
      ]
    }
  ]
};

const server = setupServer(
  http.get(`${mockTrackApi}/track_categories/:genomeId`, () => {
    return HttpResponse.json(mockTrackCategories);
  })
);

const initialReduxState = {
  browser: {
    browserGeneral: {
      activeGenomeId: 'human',
      activeFocusObjectIds: {
        human: `human:gene:fake_gene_stable_id`
      }
    },
    focusObjects: {
      'human:gene:fake_gene_stable_id': {
        data: {
          type: 'gene',
          object_id: `human:gene:fake_gene_stable_id_1`,
          genome_id: 'human'
        }
      }
    },
    trackPanel: {
      human: {
        selectedTrackPanelTab: TrackSet.GENOMIC,
        isTrackPanelOpened: true
      }
    },
    drawer: {
      general: {
        human: {
          drawerView: null as string | null
        }
      }
    }
  }
};

const renderComponent = (state = initialReduxState) => {
  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([restApiSlice.middleware]),
    preloadedState: state as any
  });

  return render(
    <Provider store={store}>
      <TrackPanelTabs />
    </Provider>
  );
};

beforeAll(() =>
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    }
  })
);
afterAll(() => server.close());

describe('<TrackPanelTabs />', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('contains all track panel tabs', () => {
      const { container } = renderComponent();
      const tabValues = Object.values(TrackSet);
      const tabs = [...container.querySelectorAll('.trackPanelTab')];

      tabValues.forEach((text) => {
        expect(tabs.some((tab) => tab.innerHTML === text)).toBeTruthy();
      });
    });
  });

  describe('behaviour', () => {
    describe('on track panel tab click', () => {
      it('selects track panel tab', async () => {
        const { container } = renderComponent();

        // Wait for track categories data from the api, which will enable the tab
        await waitFor(() => {
          const tab = container.querySelector(
            '.trackPanelTab:not(.trackPanelTabDisabled)'
          );
          expect(tab).not.toBe(null);
        });

        const tab = container.querySelector('.trackPanelTab') as HTMLElement;

        jest.spyOn(trackPanelActions, 'selectTrackPanelTab');

        await userEvent.click(tab);
        expect(trackPanelActions.selectTrackPanelTab).toHaveBeenCalledWith(
          Object.values(TrackSet)[0]
        );
      });

      it('opens track panel if it is closed', async () => {
        let { container } = renderComponent();

        // Wait for track categories data from the api, which will enable the tab
        await waitFor(() => {
          const tab = container.querySelector(
            '.trackPanelTab:not(.trackPanelTabDisabled)'
          );
          expect(tab).not.toBe(null);
        });

        let tab = container.querySelector('.trackPanelTab') as HTMLElement;

        jest.spyOn(trackPanelActions, 'toggleTrackPanel');

        await userEvent.click(tab);
        expect(trackPanelActions.toggleTrackPanel).not.toHaveBeenCalled();

        const newState = structuredClone(initialReduxState);
        newState.browser.trackPanel.human.isTrackPanelOpened = false;
        container = renderComponent(newState).container;

        // Wait for track categories data from the api, which will enable the tab
        await waitFor(() => {
          const tab = container.querySelector(
            '.trackPanelTab:not(.trackPanelTabDisabled)'
          );
          expect(tab).not.toBe(null);
        });
        tab = container.querySelector('.trackPanelTab') as HTMLElement;

        await userEvent.click(tab);
        expect(trackPanelActions.toggleTrackPanel).toHaveBeenCalledWith(true);
      });

      it('closes drawer if it is opened', async () => {
        let { container } = renderComponent();

        // Wait for track categories data from the api, which will enable the tab
        await waitFor(() => {
          const tab = container.querySelector(
            '.trackPanelTab.trackPanelTabActive'
          );
          expect(tab).not.toBe(null);
        });

        let tab = container.querySelector('.trackPanelTab') as HTMLElement;

        jest.spyOn(drawerActions, 'closeDrawer');

        await userEvent.click(tab);
        expect(drawerActions.closeDrawer).not.toHaveBeenCalled();

        const newState = structuredClone(initialReduxState);
        newState.browser.drawer.general.human.drawerView = 'some view';
        container = renderComponent(newState).container;

        // Wait for track categories data from the api, which will enable the tab
        await waitFor(() => {
          const tab = container.querySelector(
            '.trackPanelTab:not(.trackPanelTabDisabled)'
          );
          expect(tab).not.toBe(null);
        });
        tab = container.querySelector('.trackPanelTab') as HTMLElement;

        await userEvent.click(tab);
        expect(drawerActions.closeDrawer).toHaveBeenCalledTimes(1);
      });
    });
  });
});
