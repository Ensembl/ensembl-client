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

import { useContext } from 'react';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

import createRootReducer from 'src/root/rootReducer';
import { useAppDispatch, useAppSelector } from 'src/store';
import restApiSlice from 'src/shared/state/api-slices/restSlice';
import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';
import { GenomeBrowserIdsContext } from 'src/content/app/genome-browser/contexts/genome-browser-ids-context/GenomeBrowserIdsContext';
import useGenomeBrowserTracks from 'src/content/app/genome-browser/hooks/useGenomeBrowserTracks';
import TrackPanelList from 'src/content/app/genome-browser/components/track-panel/components/track-panel-list/TrackPanelList';
import Drawer from 'src/content/app/genome-browser/components/drawer/Drawer';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { setActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';
import IndexedDB from 'src/services/indexeddb-service';
import { GB_TRACK_SETTINGS_STORE_NAME } from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageConstants';
import { saveTrackSettingsForGenome } from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageService';
import { buildDefaultRegularTrack } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';
import {
  createTranscriptomicConfiguration,
  genomeId,
  otherGenomeId,
  brainRun,
  liverRunA,
  liverRunB
} from 'tests/fixtures/transcriptomic';

const { tracksApiUrl, browser, toggleTrack, toggleTrackSetting } = vi.hoisted(
  () => ({
    tracksApiUrl: 'http://track-api',
    browser: { switch: vi.fn() },
    toggleTrack: vi.fn(),
    toggleTrackSetting: vi.fn()
  })
);
vi.mock('config', () => ({ default: { tracksApiBaseUrl: tracksApiUrl } }));
// Only replace the external WASM boundary and unrelated location navigation.
vi.mock('src/content/app/genome-browser/hooks/useGenomeBrowser', () => ({
  default: () => ({ genomeBrowser: browser, toggleTrack, toggleTrackSetting })
}));
vi.mock(
  'src/content/app/genome-browser/components/track-panel/components/track-panel-list/track-panel-items/TrackPanelLocationNavigation',
  () => ({ default: () => null })
);

const configurationRequest = vi.fn(() =>
  HttpResponse.json(createTranscriptomicConfiguration())
);
const trackRequest = vi.fn(() => new HttpResponse(null, { status: 404 }));
const worker = setupWorker(
  http.get(`${tracksApiUrl}/track_categories/:genomeId`, () =>
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
  http.get(
    `${tracksApiUrl}/configuration/:genomeId/transcriptomic`,
    configurationRequest
  ),
  http.get(`${tracksApiUrl}/track/:trackId`, trackRequest)
);

function TracksAndDrawer() {
  useGenomeBrowserTracks();
  const dispatch = useAppDispatch();
  return (
    <>
      <aside>
        <TrackPanelList />
      </aside>
      <main>
        <button onClick={() => dispatch(closeDrawer())}>
          Close configuration
        </button>
        <Drawer />
      </main>
    </>
  );
}
function BrowserHarness() {
  const context = useContext(GenomeBrowserIdsContext);
  const activeGenomeId = useAppSelector(
    (state) => state.browser.browserGeneral.activeGenomeId
  );
  return (
    <GenomeBrowserIdsContext.Provider value={{ ...context, activeGenomeId }}>
      <TracksAndDrawer />
    </GenomeBrowserIdsContext.Provider>
  );
}
async function renderBrowser() {
  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        restApiSlice.middleware,
        graphqlApiSlice.middleware
      )
  });
  store.dispatch(setActiveGenomeId(genomeId));
  const screen = await render(
    <Provider store={store}>
      <BrowserHarness />
    </Provider>
  );
  return { store, screen };
}
const configure = () =>
  page
    .getByRole('button', {
      name: 'Configure transcriptomic tracks',
      exact: true
    })
    .click();
const apply = () =>
  page.getByRole('button', { name: 'Apply', exact: true }).click();
const trackA = liverRunA.track_products[0].track_id;
const trackB = liverRunB.track_products[0].track_id;

beforeAll(() => worker.start({ onUnhandledRequest: 'error', quiet: true }));
afterAll(() => worker.stop());
beforeEach(async () => {
  // The integrated browser UI uses the site's desktop layout (980px minimum).
  await page.viewport(1280, 900);
  localStorage.clear();
  await IndexedDB.clear(GB_TRACK_SETTINGS_STORE_NAME);
  vi.clearAllMocks();
});
afterEach(() => {
  worker.resetHandlers();
});

describe('transcriptomic browser integration', () => {
  it('shares the cached catalogue between Configure and rows, and switches track UUIDs on/off', async () => {
    await renderBrowser();
    const configureButton = page.getByRole('button', {
      name: 'Configure transcriptomic tracks',
      exact: true
    });
    await expect.element(configureButton).toHaveTextContent('Configure');
    expect(configureButton.all()).toHaveLength(1);
    await expect
      .element(page.getByText(/to add transcriptomic tracks\./))
      .not.toBeInTheDocument();
    await configure();
    await page
      .getByRole('main')
      .getByRole('button', { name: 'Liver', exact: true })
      .click();
    await page
      .getByRole('checkbox', { name: liverRunA.parent_sample_id, exact: true })
      .click();
    await page.getByRole('checkbox', { name: 'Brain', exact: true }).click();
    await apply();
    const rows = page.getByRole('complementary');
    const liverGroup = rows.getByRole('region', {
      name: 'Liver tracks',
      exact: true
    });
    const brainGroup = rows.getByRole('region', {
      name: 'Brain tracks',
      exact: true
    });
    await expect
      .element(brainGroup.getByText(brainRun.display_label, { exact: true }))
      .toBeVisible();
    const collapseLiver = liverGroup.getByRole('button', {
      name: 'Liver',
      exact: true
    });
    await collapseLiver.click();
    await expect
      .element(collapseLiver)
      .toHaveAttribute('aria-expanded', 'false');
    await expect
      .element(liverGroup.getByText(liverRunA.display_label, { exact: true }))
      .not.toBeInTheDocument();
    await expect
      .element(brainGroup.getByText(brainRun.display_label, { exact: true }))
      .toBeVisible();
    await expect
      .element(
        rows.getByRole('button', {
          name: 'Configure transcriptomic tracks',
          exact: true
        })
      )
      .toBeVisible();
    await collapseLiver.click();
    await expect
      .element(rows.getByText(liverRunA.display_label, { exact: true }))
      .toBeVisible();
    await expect
      .element(rows.getByText(liverRunB.display_label, { exact: true }))
      .toBeVisible();
    await expect
      .element(rows.getByRole('button', { name: 'More information' }))
      .not.toBeInTheDocument();
    for (const trackId of [
      trackA,
      trackB,
      brainRun.track_products[0].track_id
    ]) {
      await expect
        .poll(() => toggleTrack.mock.calls)
        .toContainEqual([{ trackId, isEnabled: true }]);
    }

    // Rows within a tissue follow configuration order; hiding one keeps membership.
    await liverGroup
      .getByRole('button', { name: 'Hide this track' })
      .first()
      .click();
    await expect
      .poll(() => toggleTrack.mock.calls)
      .toContainEqual([{ trackId: trackA, isEnabled: false }]);
    await expect
      .element(rows.getByText(liverRunA.display_label, { exact: true }))
      .toBeVisible();
    toggleTrack.mockClear();
    await apply();
    await expect
      .poll(() => toggleTrack.mock.calls)
      .toContainEqual([{ trackId: trackA, isEnabled: true }]);

    await page
      .getByRole('region', { name: 'sex filter', exact: true })
      .getByRole('checkbox', { name: /^male\b/ })
      .click();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 1 track selected · 3 tracks hidden by filters');
    // Clearing filters must not restore the discarded selection before Apply.
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 4 tracks selected');
    await apply();
    await expect
      .poll(() => toggleTrack.mock.calls)
      .toContainEqual([{ trackId: trackA, isEnabled: false }]);
    await expect
      .element(rows.getByText(liverRunA.display_label, { exact: true }))
      .not.toBeInTheDocument();
    await expect
      .element(rows.getByText(liverRunB.display_label, { exact: true }))
      .toBeVisible();

    // Closing discards draft deselection, filters and expansion, while retaining the applied run.
    await page.getByRole('checkbox', { name: 'Liver', exact: true }).click();
    await page.getByRole('button', { name: 'Close configuration' }).click();
    await configure();
    await expect
      .element(
        page
          .getByRole('main')
          .getByRole('button', { name: 'Liver', exact: true })
      )
      .toHaveAttribute('aria-expanded', 'false');
    await expect
      .element(page.getByRole('checkbox', { name: 'Liver', exact: true }))
      .toBePartiallyChecked();
    expect(configurationRequest).toHaveBeenCalledTimes(1);
    expect(trackRequest).not.toHaveBeenCalled();
  });

  it('restores independent visibility after reload, isolates genomes, and persists empty Apply', async () => {
    browserStorageService.updateTranscriptomicSelections({
      [genomeId]: [liverRunA.selection_id, liverRunB.selection_id]
    });
    const hidden = buildDefaultRegularTrack(trackA);
    hidden.settings.isVisible = false;
    await saveTrackSettingsForGenome(genomeId, [
      hidden,
      buildDefaultRegularTrack(trackB)
    ]);
    const { store, screen } = await renderBrowser();
    const rows = page.getByRole('complementary');
    await expect
      .element(rows.getByText(liverRunA.display_label, { exact: true }))
      .toBeVisible();
    await expect
      .poll(() => toggleTrack.mock.calls)
      .toContainEqual([{ trackId: trackB, isEnabled: true }]);
    expect(toggleTrack.mock.calls).not.toContainEqual([
      { trackId: trackA, isEnabled: true }
    ]);

    store.dispatch(setActiveGenomeId(otherGenomeId));
    await expect
      .element(rows.getByText(liverRunB.display_label, { exact: true }))
      .not.toBeInTheDocument();
    await expect
      .poll(() => toggleTrack.mock.calls)
      .toContainEqual([{ trackId: trackB, isEnabled: false }]);
    store.dispatch(setActiveGenomeId(genomeId));
    await expect
      .element(rows.getByText(liverRunB.display_label, { exact: true }))
      .toBeVisible();
    await configure();
    await page.getByRole('button', { name: 'Clear selections' }).click();
    await apply();
    await expect
      .element(rows.getByText(liverRunB.display_label, { exact: true }))
      .not.toBeInTheDocument();
    await screen.unmount();
    await renderBrowser();
    await expect
      .element(
        page.getByRole('button', {
          name: 'Configure transcriptomic tracks',
          exact: true
        })
      )
      .toBeVisible();
    expect(
      browserStorageService.getTranscriptomicSelections()[genomeId]
    ).toEqual([]);
    expect(trackRequest).not.toHaveBeenCalled();
  });

  it('disables Apply on configuration failure and offers retry', async () => {
    worker.use(
      http.get(
        `${tracksApiUrl}/configuration/:genomeId/transcriptomic`,
        () => new HttpResponse(null, { status: 404 })
      )
    );
    await renderBrowser();
    await configure();
    await expect
      .element(page.getByRole('alert'))
      .toMatchTextContent(/Could not load transcriptomic configuration/);
    await expect
      .element(page.getByRole('button', { name: 'Apply', exact: true }))
      .toBeDisabled();
    worker.resetHandlers();
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await expect
      .element(page.getByRole('checkbox', { name: 'Liver', exact: true }))
      .toBeVisible();
  });
});
