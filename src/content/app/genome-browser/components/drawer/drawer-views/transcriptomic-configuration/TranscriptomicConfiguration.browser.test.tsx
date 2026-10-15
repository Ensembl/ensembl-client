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

import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';
import createRootReducer from 'src/root/rootReducer';
import restApiSlice from 'src/shared/state/api-slices/restSlice';
import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';
import useGenomeBrowserTracks from '../../../../hooks/useGenomeBrowserTracks';
import TrackPanelList from '../../../track-panel/components/track-panel-list/TrackPanelList';
import Drawer from '../../Drawer';
import { closeDrawer } from '../../../../state/drawer/drawerSlice';
import { setActiveGenomeId } from '../../../../state/browser-general/browserGeneralSlice';
import IndexedDB from 'src/services/indexeddb-service';
import { GB_TRACK_SETTINGS_STORE_NAME } from '../../../../services/track-settings/trackSettingsStorageConstants';
import browserStorageService from '../../../../services/browserStorageService';
import { useAppDispatch } from 'src/store';
import fixture from './configuration.fixture.json';

const mocks = vi.hoisted(() => ({
  toggleTrack: vi.fn(),
  toggleTrackSetting: vi.fn(),
  browser: { switch: vi.fn() },
  analytics: {
    reportTrackPanelSectionToggled: vi.fn(),
    trackDrawerOpened: vi.fn(),
    reportTrackVisibilityToggled: vi.fn()
  }
}));
vi.mock('config', () => ({
  default: { tracksApiBaseUrl: 'http://track-api' }
}));
vi.mock('src/content/app/genome-browser/hooks/useGenomeBrowser', () => ({
  default: () => ({
    genomeBrowser: mocks.browser,
    toggleTrack: mocks.toggleTrack,
    toggleTrackSetting: mocks.toggleTrackSetting
  })
}));
vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserIds',
  async () => {
    const { useAppSelector } = await import('src/store');
    return {
      default: function useTestGenomeIds() {
        return {
          activeGenomeId: useAppSelector(
            (state) => state.browser.browserGeneral.activeGenomeId
          )
        };
      }
    };
  }
);
vi.mock('src/content/app/genome-browser/hooks/useFocusTrack', () => ({
  default: () => {}
}));
vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => ({ default: () => mocks.analytics })
);
vi.mock(
  'src/content/app/genome-browser/components/track-panel/components/track-panel-list/track-panel-items/TrackPanelLocationNavigation',
  () => ({ default: () => null })
);
vi.mock('src/shared/components/search-button/SearchButton', () => ({
  default: () => null
}));
vi.mock('src/shared/components/chevron/Chevron', () => ({
  default: () => <span />
}));
vi.mock('static/icons/icon_close.svg', () => ({ default: () => <svg /> }));
vi.mock('static/icons/icon_eye.svg', () => ({ default: () => <svg /> }));
vi.mock('static/icons/icon_eye_slashed.svg', () => ({
  default: () => <svg />
}));

const configuration = {
  ...fixture,
  track_count: 3,
  selections: [
    ...fixture.selections,
    {
      ...fixture.selections[0],
      selection_id: 'third-run',
      display_label: 'Third run',
      metadata: { tissue: 'Liver', sex: 'male' },
      track_products: [
        { track_type: 'rnaseq_coverage', track_id: 'third-track' }
      ]
    }
  ]
};
let configurationRequests = 0;
let trackRequests = 0;
const worker = setupWorker(
  http.get('http://track-api/track_categories/:genomeId', () =>
    HttpResponse.json({
      track_categories: [
        {
          label: 'Transcriptomic data',
          track_category_id: 'transcriptomic',
          type: 'Genomic',
          track_list: []
        }
      ]
    })
  ),
  http.get('http://track-api/transcriptomic/:genomeId/configuration', () => {
    configurationRequests++;
    return HttpResponse.json(configuration);
  }),
  http.get('http://track-api/track/:trackId', () => {
    trackRequests++;
    return new HttpResponse(null, { status: 500 });
  })
);

function Harness() {
  useGenomeBrowserTracks();
  const dispatch = useAppDispatch();
  return (
    <div style={{ display: 'flex', width: 1100 }}>
      <aside style={{ width: 300 }}>
        <TrackPanelList />
      </aside>
      <main style={{ width: 750 }}>
        <button onClick={() => dispatch(closeDrawer())}>
          Close configuration
        </button>
        <Drawer />
      </main>
    </div>
  );
}

const setup = async () => {
  const reducer = createRootReducer();
  const initial = reducer(undefined, { type: '@@init' });
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        restApiSlice.middleware,
        graphqlApiSlice.middleware
      ),
    preloadedState: {
      ...initial,
      browser: {
        ...initial.browser,
        browserGeneral: {
          ...initial.browser.browserGeneral,
          activeGenomeId: 'pig'
        }
      }
    }
  });
  const view = await render(
    <Provider store={store}>
      <Harness />
    </Provider>
  );
  return { store, view };
};

beforeAll(() => worker.start({ onUnhandledRequest: 'error', quiet: true }));
afterAll(() => worker.stop());
beforeEach(async () => {
  localStorage.clear();
  await IndexedDB.clear(GB_TRACK_SETTINGS_STORE_NAME);
  vi.clearAllMocks();
  configurationRequests = 0;
  trackRequests = 0;
});
afterEach(() => worker.resetHandlers());

it('configures real run UUIDs from one cached payload, toggles independently, and applies removal', async () => {
  const { store } = await setup();
  await page.getByRole('button', { name: 'Configure', exact: true }).click();
  const run1 = page.getByRole('checkbox', { name: 'DRR169425', exact: true });
  const run2 = page.getByRole('checkbox', { name: 'DRR169426', exact: true });
  await run1.click();
  await run2.click();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  const firstId = fixture.selections[0].track_products[0].track_id;
  const secondId = fixture.selections[1].track_products[0].track_id;
  await expect
    .poll(() => mocks.toggleTrack.mock.calls)
    .toContainEqual([{ trackId: firstId, isEnabled: true }]);
  await expect
    .poll(() => mocks.toggleTrack.mock.calls)
    .toContainEqual([{ trackId: secondId, isEnabled: true }]);
  await expect
    .element(page.getByRole('complementary').getByText('DRR169425'))
    .toBeVisible();
  await expect
    .element(page.getByRole('button', { name: 'More information' }))
    .not.toBeInTheDocument();
  await page.getByRole('button', { name: 'Hide this track' }).first().click();
  await expect
    .poll(
      () =>
        store.getState().browser.trackSettings.pig.settingsForIndividualTracks[
          firstId
        ].settings
    )
    .toMatchObject({ isVisible: false });
  await expect
    .element(page.getByRole('complementary').getByText('DRR169425'))
    .toBeVisible();
  await run2.click();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect
    .poll(
      () =>
        store.getState().browser.trackSettings.pig.settingsForIndividualTracks[
          firstId
        ].settings
    )
    .toMatchObject({ isVisible: true });
  await expect
    .poll(() => mocks.toggleTrack.mock.calls)
    .toContainEqual([{ trackId: secondId, isEnabled: false }]);
  await expect
    .element(page.getByRole('complementary').getByText('DRR169426'))
    .not.toBeInTheDocument();
  expect(configurationRequests).toBe(1);
  expect(trackRequests).toBe(0);
});

it('preserves hidden selections, supports mixed sample checkboxes, and discards unapplied edits', async () => {
  const { store } = await setup();
  await page.getByRole('button', { name: 'Configure', exact: true }).click();
  await page.getByRole('checkbox', { name: 'DRR169425', exact: true }).click();
  await expect
    .element(
      page.getByRole('checkbox', {
        name: fixture.selections[0].parent_sample_id,
        exact: true
      })
    )
    .toBePartiallyChecked();
  await page
    .getByRole('textbox', { name: 'Search tissue values' })
    .fill('liver');
  await page.getByRole('checkbox', { name: 'liver (15)', exact: true }).click();
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('1 selections hidden by filters');
  await page
    .getByRole('checkbox', {
      name: fixture.selections[0].parent_sample_id,
      exact: true
    })
    .click();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect
    .poll(() => store.getState().browser.transcriptomic.pig)
    .toEqual(['DRR169425', 'third-run']);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByRole('checkbox', { name: 'DRR169426', exact: true }).click();
  await page.getByRole('button', { name: 'Close configuration' }).click();
  await page.getByRole('button', { name: 'Configure', exact: true }).click();
  await expect
    .element(page.getByRole('checkbox', { name: 'DRR169426', exact: true }))
    .not.toBeChecked();
  expect(browserStorageService.getTranscriptomicSelections().pig).toEqual([
    'DRR169425',
    'third-run'
  ]);
});

it('shows retry and disables Apply when configuration fails', async () => {
  worker.use(
    http.get(
      'http://track-api/transcriptomic/:genomeId/configuration',
      () => new HttpResponse(null, { status: 404 })
    )
  );
  await setup();
  await page.getByRole('button', { name: 'Configure', exact: true }).click();
  await expect
    .element(page.getByRole('alert'))
    .toHaveTextContent('Could not load');
  await expect
    .element(page.getByRole('button', { name: 'Apply', exact: true }))
    .toBeDisabled();
  worker.resetHandlers();
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect
    .element(page.getByRole('checkbox', { name: 'DRR169425', exact: true }))
    .toBeVisible();
});

it('restores disabled rows on reload, switches genomes safely, and applies an empty set', async () => {
  const first = await setup();
  await page.getByRole('button', { name: 'Configure', exact: true }).click();
  await page.getByRole('checkbox', { name: 'DRR169425', exact: true }).click();
  await page.getByRole('checkbox', { name: 'DRR169426', exact: true }).click();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await page.getByRole('button', { name: 'Hide this track' }).first().click();
  const firstId = fixture.selections[0].track_products[0].track_id;
  const secondId = fixture.selections[1].track_products[0].track_id;
  await expect
    .poll(
      () =>
        first.store.getState().browser.trackSettings.pig
          .settingsForIndividualTracks[firstId].settings
    )
    .toMatchObject({ isVisible: false });
  await first.view.unmount();
  mocks.toggleTrack.mockClear();
  const restored = await setup();
  await expect
    .element(page.getByRole('complementary').getByText('DRR169425'))
    .toBeVisible();
  await expect
    .poll(
      () =>
        restored.store.getState().browser.trackSettings.pig
          ?.settingsForIndividualTracks[firstId]?.settings
    )
    .toMatchObject({ isVisible: false });
  await expect
    .poll(() => mocks.toggleTrack.mock.calls)
    .toContainEqual([{ trackId: secondId, isEnabled: true }]);
  expect(mocks.toggleTrack.mock.calls).not.toContainEqual([
    { trackId: firstId, isEnabled: true }
  ]);
  restored.store.dispatch(setActiveGenomeId('other'));
  await expect
    .poll(() => mocks.toggleTrack.mock.calls)
    .toContainEqual([{ trackId: secondId, isEnabled: false }]);
  await expect
    .element(page.getByRole('complementary').getByText('DRR169425'))
    .not.toBeInTheDocument();
  restored.store.dispatch(setActiveGenomeId('pig'));
  await expect
    .element(page.getByRole('complementary').getByText('DRR169425'))
    .toBeVisible();
  await page.getByRole('button', { name: 'Configure', exact: true }).click();
  await page.getByRole('checkbox', { name: 'DRR169425', exact: true }).click();
  await page.getByRole('checkbox', { name: 'DRR169426', exact: true }).click();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect
    .poll(() => restored.store.getState().browser.transcriptomic.pig)
    .toEqual([]);
  await expect
    .element(page.getByRole('complementary').getByText('DRR169425'))
    .not.toBeInTheDocument();
  await expect
    .element(page.getByRole('complementary').getByText('DRR169426'))
    .not.toBeInTheDocument();
  expect(trackRequests).toBe(0);
});
