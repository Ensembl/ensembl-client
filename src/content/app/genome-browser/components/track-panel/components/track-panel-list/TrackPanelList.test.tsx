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
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import set from 'lodash/fp/set';

import createRootReducer from 'src/root/rootReducer';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import { getBrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSelectors';

import { createFocusObject } from 'tests/fixtures/focus-object';
import { createMockBrowserState } from 'tests/fixtures/browser';
import { createGenomeCategories } from 'tests/fixtures/genomes';

import { TrackPanelList } from './TrackPanelList';

import { BrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

jest.mock('config', () => ({
  tracksApiBaseUrl: 'http://track-api'
}));

jest.mock('./track-panel-items/TrackPanelGene', () => () => (
  <div className="trackPanelGene" />
));

jest.mock('./track-panel-items/TrackPanelRegularItem', () => () => (
  <div className="trackPanelRegularItem" />
));

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => () => jest.fn()
);

const mockState = createMockBrowserState();
const activeGenomeId = mockState.browser.browserGeneral.activeGenomeId;

const server = setupServer(
  rest.get('http://track-api/track_categories/:genomeId', (req, res, ctx) => {
    const genomeId = req.params.genomeId as string;
    if (genomeId === activeGenomeId) {
      const mockData = { track_categories: createGenomeCategories() };

      return res(ctx.json(mockData));
    }
  })
);

const renderComponent = (state: typeof mockState = mockState) => {
  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([restApiSlice.middleware]),
    preloadedState: state as any
  });

  const renderResult = render(
    <Provider store={store}>
      <TrackPanelList />
    </Provider>
  );
  return {
    ...renderResult,
    store
  };
};

beforeAll(() =>
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url.href}`;
      throw new Error(errorMessage);
    }
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<TrackPanelList />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders gene focus track', () => {
      const { container } = renderComponent();

      expect(container.querySelectorAll('.trackPanelGene').length).toBe(1);
    });

    it('does not render main track if the focus feature is a region', () => {
      const activeGenomeId = mockState.browser.browserGeneral.activeGenomeId;
      const activeFocusObjectId = (
        mockState.browser.browserGeneral.activeFocusObjectIds as any
      )[activeGenomeId];
      const { container } = renderComponent(
        set(
          `browser.focusObjects.${activeFocusObjectId}.data`,
          createFocusObject('location'),
          mockState
        )
      );
      expect(container.querySelector('.mainTrackItem')).toBeFalsy();
    });

    it('renders regular tracks', async () => {
      const { container } = renderComponent();

      await waitFor(() => {
        expect(
          container.querySelectorAll('.trackPanelRegularItem').length
        ).toBeGreaterThan(0);
      });
    });

    it('opens the relevant modal when modal link is clicked', async () => {
      const { container, store } = renderComponent();

      const geneSearchLink = container.querySelector(
        '.modalLink:nth-child(1)'
      ) as HTMLElement;

      await userEvent.click(geneSearchLink);

      let state = store.getState();
      expect(getBrowserSidebarModalView(state)).toBe(
        BrowserSidebarModalView.SEARCH
      );

      const navigateLocationLink = container.querySelector(
        '.modalLink:nth-child(2)'
      ) as HTMLElement;

      await userEvent.click(navigateLocationLink);

      state = store.getState();
      expect(getBrowserSidebarModalView(state)).toBe(
        BrowserSidebarModalView.NAVIGATE
      );
    });
  });
});
