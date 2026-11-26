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
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { setActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';
import IndexedDB from 'src/services/indexeddb-service';
import { GB_TRACK_SETTINGS_STORE_NAME } from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageConstants';
import {
  getTrackSettingsForGenome,
  saveTrackSettingsForGenome
} from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageService';
import { buildDefaultRegularTrack } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';
import {
  sampleIds,
  trackLabels,
  createTranscriptomicConfiguration,
  genomeId,
  otherGenomeId,
  brainRun,
  liverRunA,
  liverRunB
} from 'tests/fixtures/transcriptomic';

import TrackPanelList from 'src/content/app/genome-browser/components/track-panel/components/track-panel-list/TrackPanelList';
import Drawer from 'src/content/app/genome-browser/components/drawer/Drawer';

const { tracksApiUrl, browser, toggleTrack, toggleTrackSetting } = vi.hoisted(
  () => ({
    tracksApiUrl: 'http://track-api',
    browser: { switch: vi.fn() },
    toggleTrack: vi.fn(),
    toggleTrackSetting: vi.fn()
  })
);
vi.mock('config', () => ({ default: { tracksApiBaseUrl: tracksApiUrl } }));
vi.mock('src/content/app/genome-browser/hooks/useGenomeBrowser', () => ({
  default: () => ({ genomeBrowser: browser, toggleTrack, toggleTrackSetting })
}));
vi.mock(
  'src/content/app/genome-browser/components/track-panel/components/track-panel-list/track-panel-items/TrackPanelLocationNavigation',
  () => ({ default: () => null })
);

const otherGenomeTrackId = '10000000-0000-4000-8000-000000000001';
const otherGenomeRun = {
  ...brainRun,
  display_label: 'Other genome run',
  track_products: [
    { ...brainRun.track_products[0], track_id: otherGenomeTrackId }
  ]
};
const configurations = new Map([
  [genomeId, createTranscriptomicConfiguration()],
  [
    otherGenomeId,
    {
      ...createTranscriptomicConfiguration(),
      genome_id: otherGenomeId,
      track_count: 1,
      selections: [otherGenomeRun],
      selection_hierarchy: [
        {
          level: 'study',
          value: 'other-study',
          display_label: 'Other study',
          selection_ids: [otherGenomeRun.selection_id],
          children: []
        }
      ],
      filters: {}
    }
  ]
]);
const configurationRequest = vi.fn((requestedGenomeId: string) => {
  const configuration = configurations.get(requestedGenomeId);
  return configuration
    ? HttpResponse.json(configuration)
    : new HttpResponse(null, { status: 404 });
});
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
    ({ params }) => configurationRequest(String(params.genomeId))
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
async function renderBrowser({
  selectionIds
}: { selectionIds?: string[] } = {}) {
  if (selectionIds) {
    browserStorageService.updateTranscriptomicSelections({
      [genomeId]: selectionIds
    });
  }
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
const apply = async () => {
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect
    .element(page.getByRole('heading', { name: 'Transcriptomic tracks' }))
    .not.toBeInTheDocument();
};
const expectTrackSwitch = async (trackId: string, isEnabled: boolean) => {
  await expect
    .poll(() => toggleTrack.mock.calls)
    .toContainEqual([{ trackId, isEnabled }]);
};
const trackA = liverRunA.track_products[0].track_id;
const trackB = liverRunB.track_products[0].track_id;

beforeAll(() => worker.start({ onUnhandledRequest: 'error', quiet: true }));
afterAll(() => worker.stop());
beforeEach(async () => {
  await page.viewport(1280, 900);
  localStorage.clear();
  await IndexedDB.clear(GB_TRACK_SETTINGS_STORE_NAME);
  vi.clearAllMocks();
});
afterEach(() => {
  worker.resetHandlers();
  vi.restoreAllMocks();
});

describe('transcriptomic browser integration', () => {
  it('configures UUIDs from one cached catalogue and closes the drawer on Apply', async () => {
    await renderBrowser();
    await configure();
    await page.getByRole('checkbox', { name: 'Liver', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Brain', exact: true }).click();
    await apply();

    const rows = page.getByRole('complementary');
    for (const selection of createTranscriptomicConfiguration().selections) {
      await expectTrackSwitch(selection.track_products[0].track_id, true);
    }
    for (const label of Object.values(trackLabels)) {
      await expect
        .element(rows.getByText(label, { exact: true }))
        .toBeVisible();
    }
    await configure();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('4 of 4 tracks selected');
    expect(configurationRequest).toHaveBeenCalledExactlyOnceWith(genomeId);
    expect(trackRequest).not.toHaveBeenCalled();
  });

  it('collapses applied root groups independently and keeps Configure available', async () => {
    await renderBrowser({
      selectionIds: [liverRunA.selection_id, brainRun.selection_id]
    });
    const rows = page.getByRole('complementary');
    const liver = rows.getByRole('region', {
      name: 'Liver tracks',
      exact: true
    });
    await liver.getByRole('button', { name: 'Liver', exact: true }).click();
    await expect
      .element(liver.getByText(trackLabels.liverRunA, { exact: true }))
      .not.toBeInTheDocument();
    await expect
      .element(rows.getByText(trackLabels.brainRun, { exact: true }))
      .toBeVisible();
    await expect
      .element(
        rows.getByRole('button', { name: 'Configure transcriptomic tracks' })
      )
      .toBeVisible();
    await liver.getByRole('button', { name: 'Liver', exact: true }).click();
    await expect
      .element(liver.getByText(trackLabels.liverRunA, { exact: true }))
      .toBeVisible();
    await expect
      .element(
        liver.getByRole('button', { name: sampleIds.liverOne, exact: true })
      )
      .not.toBeInTheDocument();
  });

  it.each([liverRunA, liverRunB])(
    'shows description and source for $display_label',
    async (selection) => {
      await renderBrowser({ selectionIds: [selection.selection_id] });
      await page
        .getByRole('complementary')
        .getByRole('button', { name: 'More information' })
        .click();
      const details = page.getByRole('main');
      const product = selection.track_products[0];
      await expect
        .element(details.getByText(product.description, { exact: true }))
        .toBeVisible();
      await expect
        .element(details.getByRole('link', { name: product.sources[0].name }))
        .toHaveAttribute('href', product.sources[0].url);
      await expect
        .element(details.getByText(product.sources[0].details, { exact: true }))
        .toBeVisible();
      expect(trackRequest).not.toHaveBeenCalled();
    }
  );

  it('changes individual visibility without removing membership, and re-enables on Apply', async () => {
    await renderBrowser({
      selectionIds: [liverRunA.selection_id, brainRun.selection_id]
    });
    await expectTrackSwitch(trackA, true);
    await expectTrackSwitch(brainRun.track_products[0].track_id, true);
    toggleTrack.mockClear();
    const rows = page.getByRole('complementary');
    await rows
      .getByRole('region', { name: 'Liver tracks', exact: true })
      .getByRole('button', { name: 'Hide this track' })
      .click();
    await expectTrackSwitch(trackA, false);
    expect(toggleTrack).not.toHaveBeenCalledWith({
      trackId: brainRun.track_products[0].track_id,
      isEnabled: false
    });
    await expect
      .element(rows.getByText(trackLabels.liverRunA, { exact: true }))
      .toBeVisible();
    await configure();
    toggleTrack.mockClear();
    await apply();
    await expectTrackSwitch(trackA, true);
  });

  it.each([
    { filter: 'Track type', value: 'Coverage reverse' },
    { filter: 'Sex', value: 'male' }
  ])(
    'switches off tracks removed by the $filter filter on Apply',
    async ({ filter, value }) => {
      const selections = createTranscriptomicConfiguration().selections;
      await renderBrowser({
        selectionIds: selections.map(({ selection_id }) => selection_id)
      });
      for (const selection of selections) {
        await expectTrackSwitch(selection.track_products[0].track_id, true);
      }
      await configure();
      toggleTrack.mockClear();
      await page
        .getByRole('region', { name: `${filter} filter`, exact: true })
        .getByRole('checkbox', { name: value, exact: true })
        .click();
      expect(toggleTrack).not.toHaveBeenCalled();
      await page.getByRole('button', { name: 'Clear filters' }).click();
      await apply();
      for (const selection of selections.filter(
        ({ selection_id }) => selection_id !== liverRunB.selection_id
      )) {
        await expectTrackSwitch(selection.track_products[0].track_id, false);
      }
      const rows = page.getByRole('complementary');
      await expect
        .element(rows.getByText(trackLabels.liverRunB, { exact: true }))
        .toBeVisible();
      await expect
        .element(rows.getByText(trackLabels.liverRunA, { exact: true }))
        .not.toBeInTheDocument();
      expect(toggleTrack).not.toHaveBeenCalledWith({
        trackId: trackB,
        isEnabled: false
      });
    }
  );

  it('discards draft selections, filters and expansion when the drawer closes', async () => {
    await renderBrowser({ selectionIds: [liverRunB.selection_id] });
    await configure();
    await page
      .getByRole('main')
      .getByRole('button', { name: 'Liver', exact: true })
      .click();
    await page
      .getByRole('region', { name: 'Sex filter', exact: true })
      .getByRole('checkbox', { name: 'female', exact: true })
      .click();
    await page.getByRole('checkbox', { name: 'Liver', exact: true }).click();
    await page.getByRole('button', { name: 'Close configuration' }).click();
    await configure();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 4 tracks selected');
    await expect
      .element(page.getByRole('button', { name: 'Clear filters' }))
      .toBeDisabled();
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
  });

  it('restores independently saved visibility after reload', async () => {
    const hidden = buildDefaultRegularTrack(trackA);
    hidden.settings.isVisible = false;
    await saveTrackSettingsForGenome(genomeId, [
      hidden,
      buildDefaultRegularTrack(trackB)
    ]);
    const { screen } = await renderBrowser({
      selectionIds: [liverRunA.selection_id, liverRunB.selection_id]
    });
    await expectTrackSwitch(trackB, true);
    await screen.unmount();
    toggleTrack.mockClear();
    await renderBrowser();
    await expectTrackSwitch(trackB, true);
    expect(toggleTrack).not.toHaveBeenCalledWith({
      trackId: trackA,
      isEnabled: true
    });
    await expect
      .element(
        page
          .getByRole('complementary')
          .getByText(trackLabels.liverRunA, { exact: true })
      )
      .toBeVisible();
  });

  it('switches between two configured genomes without mixing catalogues or membership', async () => {
    browserStorageService.updateTranscriptomicSelections({
      [genomeId]: [liverRunA.selection_id],
      [otherGenomeId]: [otherGenomeRun.selection_id]
    });
    const { store } = await renderBrowser();
    await expectTrackSwitch(trackA, true);
    toggleTrack.mockClear();
    store.dispatch(setActiveGenomeId(otherGenomeId));
    await expectTrackSwitch(trackA, false);
    await expectTrackSwitch(otherGenomeTrackId, true);
    const rows = page.getByRole('complementary');
    await expect
      .element(rows.getByText('Other genome run · Gene model', { exact: true }))
      .toBeVisible();
    await expect
      .element(rows.getByText(trackLabels.liverRunA, { exact: true }))
      .not.toBeInTheDocument();
    await configure();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 1 track selected');
    toggleTrack.mockClear();
    store.dispatch(setActiveGenomeId(genomeId));
    await expectTrackSwitch(otherGenomeTrackId, false);
    await expectTrackSwitch(trackA, true);
    await expect
      .element(rows.getByText(trackLabels.liverRunA, { exact: true }))
      .toBeVisible();
    expect(browserStorageService.getTranscriptomicSelections()).toEqual({
      [genomeId]: [liverRunA.selection_id],
      [otherGenomeId]: [otherGenomeRun.selection_id]
    });
    expect(configurationRequest.mock.calls).toEqual([
      [genomeId],
      [otherGenomeId]
    ]);
  });

  it('switches off all configured tracks on empty Apply and restores an empty list', async () => {
    const { screen } = await renderBrowser({
      selectionIds: [liverRunA.selection_id, liverRunB.selection_id]
    });
    await expectTrackSwitch(trackA, true);
    await expectTrackSwitch(trackB, true);
    await configure();
    toggleTrack.mockClear();
    await page.getByRole('button', { name: 'Clear selections' }).click();
    await apply();
    await expectTrackSwitch(trackA, false);
    await expectTrackSwitch(trackB, false);
    await screen.unmount();
    toggleTrack.mockClear();
    await renderBrowser();
    await configure();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 4 tracks selected');
    expect(toggleTrack).not.toHaveBeenCalledWith({
      trackId: trackA,
      isEnabled: true
    });
    expect(
      browserStorageService.getTranscriptomicSelections()[genomeId]
    ).toEqual([]);
  });

  it('keeps the draft after a rejected Apply and restores previous membership and visibility on reload', async () => {
    await saveTrackSettingsForGenome(genomeId, [
      buildDefaultRegularTrack(trackA)
    ]);
    const { screen } = await renderBrowser({
      selectionIds: [liverRunA.selection_id]
    });
    await expectTrackSwitch(trackA, true);
    const savedSettings = await getTrackSettingsForGenome(genomeId);
    await configure();
    await page
      .getByRole('region', { name: 'Track type filter', exact: true })
      .getByRole('checkbox', { name: 'Coverage reverse', exact: true })
      .click();
    await page.getByRole('checkbox', { name: 'Liver', exact: true }).click();
    vi.spyOn(
      browserStorageService,
      'updateTranscriptomicSelections'
    ).mockImplementationOnce(() => {
      throw new Error('Storage unavailable');
    });
    toggleTrack.mockClear();
    await page.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect
      .element(page.getByRole('alert'))
      .toHaveTextContent('Could not apply selections. Please try again.');
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 1 track selected · 3 tracks hidden by filters');
    expect(toggleTrack).not.toHaveBeenCalled();
    expect(await getTrackSettingsForGenome(genomeId)).toEqual(savedSettings);
    await screen.unmount();
    toggleTrack.mockClear();
    await renderBrowser();
    await expectTrackSwitch(trackA, true);
    expect(toggleTrack).not.toHaveBeenCalledWith({
      trackId: trackB,
      isEnabled: true
    });
    await configure();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 4 tracks selected');
    expect(
      browserStorageService.getTranscriptomicSelections()[genomeId]
    ).toEqual([liverRunA.selection_id]);
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
