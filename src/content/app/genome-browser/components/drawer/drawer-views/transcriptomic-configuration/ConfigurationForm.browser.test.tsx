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
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ConfigurationForm } from './TranscriptomicConfiguration';
import transcriptomic, {
  restoreTranscriptomicSelections
} from 'src/content/app/genome-browser/state/transcriptomic/transcriptomicSlice';
import trackSettings from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import {
  sampleIds,
  trackLabels,
  createTranscriptomicConfiguration,
  genomeId,
  liverRunA,
  liverRunB,
  liverRunC
} from 'tests/fixtures/transcriptomic';
import type { TranscriptomicConfiguration } from 'src/content/app/genome-browser/state/types/transcriptomic';
import styles from './TranscriptomicConfiguration.module.css';

vi.mock(
  import('src/content/app/genome-browser/services/track-settings/trackSettingsStorageService'),
  async (importOriginal) => ({
    ...(await importOriginal()),
    updateTrackSettingsForGenome: vi.fn().mockResolvedValue(undefined)
  })
);

async function renderForm({
  configuration = createTranscriptomicConfiguration(),
  selectionIds = [],
  ready = true
}: {
  configuration?: TranscriptomicConfiguration;
  selectionIds?: string[];
  ready?: boolean;
} = {}) {
  const store = configureStore({
    reducer: { browser: combineReducers({ transcriptomic, trackSettings }) }
  });
  store.dispatch(restoreTranscriptomicSelections({ genomeId, selectionIds }));
  const screen = await render(
    <Provider store={store}>
      <div className={styles.panel}>
        <ConfigurationForm
          genomeId={genomeId}
          configuration={configuration}
          selectionIds={selectionIds}
          ready={ready}
        />
      </div>
    </Provider>
  );
  return { screen, store };
}
const maleFilter = () =>
  page
    .getByRole('region', { name: 'sex filter', exact: true })
    .getByRole('checkbox', { name: /^male\b/ });
const apply = () =>
  page.getByRole('button', { name: 'Apply', exact: true }).click();

beforeEach(() => localStorage.clear());

describe('<ConfigurationForm />', () => {
  it('shows all product types by default and clears hidden selections without restoring them', async () => {
    await renderForm({
      selectionIds: [liverRunA.selection_id, liverRunB.selection_id]
    });
    const show = page.getByRole('region', { name: 'Show filter', exact: true });
    const products = [
      'Coverage forward',
      'Coverage reverse',
      'Splice junction',
      'Gene model'
    ];
    for (const name of products) {
      await expect
        .element(show.getByRole('checkbox', { name, exact: true }))
        .toBeChecked();
    }
    const forward = show.getByRole('checkbox', {
      name: 'Coverage forward',
      exact: true
    });
    await forward.click();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 3 tracks selected · 1 track hidden by filters');
    await expect
      .element(page.getByRole('checkbox', { name: 'Liver', exact: true }))
      .toHaveAccessibleDescription('2');
    await maleFilter().click();
    await expect.element(forward).toHaveAccessibleDescription('0');
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 1 track selected · 3 tracks hidden by filters');
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect.element(forward).toBeChecked();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 4 tracks selected');
    for (const name of products) {
      await show.getByRole('checkbox', { name, exact: true }).click();
    }
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 0 tracks selected · 4 tracks hidden by filters');
    // Even with no matching selections, all Show options remain available.
    await forward.click();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 1 track selected · 3 tracks hidden by filters');
  });

  it('selects collapsed descendants and shows mixed group states independently of expansion', async () => {
    await renderForm();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 4 tracks selected');
    const liver = page.getByRole('checkbox', { name: 'Liver', exact: true });
    const expandLiver = page.getByRole('button', {
      name: 'Liver',
      exact: true
    });
    await expect.element(expandLiver).toHaveAttribute('aria-expanded', 'false');
    // Tissue totals count runs across samples, not the number of samples.
    await expect.element(liver).toHaveAccessibleDescription('3');
    await liver.click();
    await expect.element(expandLiver).toHaveAttribute('aria-expanded', 'false');
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('3 of 4 tracks selected');

    await expandLiver.click();
    const sample = page.getByRole('checkbox', {
      name: sampleIds.liverOne,
      exact: true
    });
    await expect.element(sample).toBeChecked();
    await expect.element(sample).toHaveAccessibleDescription('2');
    await page
      .getByRole('button', { name: sampleIds.liverOne, exact: true })
      .click();
    await page
      .getByRole('checkbox', { name: trackLabels.liverRunA, exact: true })
      .click();
    await expect.element(sample).toBePartiallyChecked();
    await expect.element(liver).toBePartiallyChecked();
  });

  it('renders direct aggregates before arbitrary child groups and filters each track independently', async () => {
    const configuration = createTranscriptomicConfiguration();
    configuration.selections = [
      {
        ...liverRunC,
        selection_level: 'tissue',
        metadata: { tissue: 'Liver' }
      },
      liverRunA,
      liverRunB
    ];
    configuration.track_count = 3;
    configuration.selection_hierarchy = [
      {
        level: 'study',
        value: 'project-1',
        display_label: 'API Project',
        selection_ids: [liverRunC.selection_id],
        children: [
          {
            level: 'condition',
            value: null,
            display_label: null,
            selection_ids: [],
            children: [
              {
                level: 'batch',
                value: 'batch-1',
                display_label: 'API Batch',
                selection_ids: [liverRunA.selection_id, liverRunB.selection_id],
                children: []
              }
            ]
          }
        ]
      }
    ];
    await renderForm({ configuration });
    const project = page.getByRole('checkbox', {
      name: 'API Project',
      exact: true
    });
    await expect.element(project).toHaveAccessibleDescription('3');
    await project.click();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('3 of 3 tracks selected');
    await page
      .getByRole('button', { name: 'API Project', exact: true })
      .click();
    await expect
      .element(
        page.getByRole('checkbox', { name: trackLabels.liverRunC, exact: true })
      )
      .toBeChecked();
    await expect
      .element(
        page.getByRole('checkbox', { name: trackLabels.liverRunA, exact: true })
      )
      .not.toBeInTheDocument();
    await page
      .getByRole('button', { name: 'Unspecified condition', exact: true })
      .click();
    const batch = page.getByRole('checkbox', {
      name: 'API Batch',
      exact: true
    });
    await batch.click();
    await expect.element(project).toBePartiallyChecked();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 3 tracks selected');
    await page.getByRole('button', { name: 'API Batch', exact: true }).click();
    await page
      .getByRole('checkbox', { name: trackLabels.liverRunA, exact: true })
      .click();
    await maleFilter().click();
    await expect.element(project).toHaveAccessibleDescription('1');
    await expect
      .element(
        page.getByRole('checkbox', { name: trackLabels.liverRunC, exact: true })
      )
      .not.toBeInTheDocument();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 1 track selected · 2 tracks hidden by filters');
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect
      .element(
        page.getByRole('checkbox', { name: trackLabels.liverRunC, exact: true })
      )
      .not.toBeChecked();
    await expect
      .element(
        page.getByRole('checkbox', { name: trackLabels.liverRunA, exact: true })
      )
      .not.toBeChecked();
  });

  it('clears hidden draft runs immediately and does not restore them when filters clear', async () => {
    const { store } = await renderForm({
      selectionIds: [liverRunA.selection_id, liverRunB.selection_id]
    });
    const heading = page.getByRole('heading', {
      level: 3,
      name: /^Selections/
    });
    const clearFilters = page.getByRole('button', { name: 'Clear filters' });
    await expect.element(clearFilters).toBeDisabled();
    await expect.element(heading).toHaveTextContent('Selections');
    await maleFilter().click();
    await expect.element(clearFilters).toBeEnabled();
    await expect.element(heading).toHaveTextContent('Selections');
    await expect
      .element(page.getByRole('checkbox', { name: 'Brain', exact: true }))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByRole('checkbox', { name: 'Liver', exact: true }))
      .toHaveAccessibleDescription('1');
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 1 track selected · 3 tracks hidden by filters');
    // Filtering edits the draft; persisted membership changes only on Apply.
    expect(store.getState().browser.transcriptomic[genomeId]).toEqual([
      liverRunA.selection_id,
      liverRunB.selection_id
    ]);
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect.element(clearFilters).toBeDisabled();
    await expect
      .element(page.getByRole('checkbox', { name: 'Liver', exact: true }))
      .toHaveAccessibleDescription('3');
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 4 tracks selected');

    await page.getByRole('button', { name: 'Liver', exact: true }).click();
    await page
      .getByRole('button', { name: sampleIds.liverOne, exact: true })
      .click();
    await expect
      .element(
        page.getByRole('checkbox', {
          name: trackLabels.liverRunA,
          exact: true
        })
      )
      .not.toBeChecked();
    await expect
      .element(
        page.getByRole('checkbox', {
          name: trackLabels.liverRunB,
          exact: true
        })
      )
      .toBeChecked();
    await apply();
    await expect
      .poll(() => store.getState().browser.transcriptomic[genomeId])
      .toEqual([liverRunB.selection_id]);
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 of 4 tracks selected');
  });

  it('clears draft selections without changing filters or applied state', async () => {
    const selectionIds = [liverRunA.selection_id, liverRunB.selection_id];
    const { store } = await renderForm({ selectionIds });
    await maleFilter().click();
    await page.getByRole('button', { name: 'Clear selections' }).click();
    await expect.element(maleFilter()).toBeChecked();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 1 track selected · 3 tracks hidden by filters');
    expect(store.getState().browser.transcriptomic[genomeId]).toEqual(
      selectionIds
    );
    await apply();
    await expect
      .poll(() => store.getState().browser.transcriptomic[genomeId])
      .toEqual([]);
  });

  it('keeps all filter groups open without expansion or search controls', async () => {
    await renderForm();
    await expect.element(maleFilter()).toBeVisible();
    await expect
      .element(page.getByRole('button', { name: 'sex', exact: true }))
      .not.toBeInTheDocument();
    const cohort = page.getByRole('region', {
      name: 'cohort filter',
      exact: true
    });
    await expect
      .element(cohort.getByRole('heading', { name: 'cohort', exact: true }))
      .toHaveTextContent('cohort');
    // Filter values show run counts; category headers have none.
    await expect.element(maleFilter()).toHaveAccessibleDescription('1');
    await expect
      .element(page.getByRole('heading', { name: 'sex', exact: true }))
      .toHaveTextContent('sex');
    await expect.element(cohort.getByRole('button')).not.toBeInTheDocument();
    expect(cohort.getByRole('checkbox').all()).toHaveLength(4);
    await expect.element(page.getByRole('searchbox')).not.toBeInTheDocument();
    await maleFilter().click();
    await maleFilter().click();
    await expect
      .element(page.getByRole('button', { name: 'Clear filters' }))
      .toBeDisabled();
  });

  it('narrows filter choices and counts, supports alternatives, and restores choices on clearing', async () => {
    await renderForm();
    const sex = page.getByRole('region', { name: 'sex filter', exact: true });
    const tissue = page.getByRole('region', {
      name: 'tissue filter',
      exact: true
    });
    const cohort = page.getByRole('region', {
      name: 'cohort filter',
      exact: true
    });
    const female = sex.getByRole('checkbox', { name: 'female', exact: true });
    const unknown = sex.getByRole('checkbox', { name: 'unknown', exact: true });
    expect(cohort.getByRole('checkbox').all()).toHaveLength(4);

    await tissue.getByRole('checkbox', { name: 'liver', exact: true }).click();
    await expect.element(unknown).not.toBeInTheDocument();
    expect(cohort.getByRole('checkbox').all()).toHaveLength(3);
    await maleFilter().click();
    // Other groups narrow, but alternatives within sex remain selectable.
    await expect.element(female).toBeVisible();
    await expect.element(female).toHaveAccessibleDescription('2');
    await expect
      .element(tissue.getByRole('checkbox', { name: 'liver', exact: true }))
      .toHaveAccessibleDescription('1');
    expect(cohort.getByRole('checkbox').all()).toHaveLength(1);
    await expect
      .element(cohort.getByRole('checkbox', { name: 'cohort-b', exact: true }))
      .toBeVisible();

    await female.click();
    expect(cohort.getByRole('checkbox').all()).toHaveLength(3);
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 3 tracks selected · 1 track hidden by filters');
    await page.getByRole('button', { name: 'Clear filters' }).click();
    expect(cohort.getByRole('checkbox').all()).toHaveLength(4);
    await expect.element(unknown).toBeVisible();
    await expect.element(unknown).toHaveAccessibleDescription('1');
    await expect.element(female).not.toBeChecked();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 4 tracks selected');
  });

  it('keeps zero-result filters removable and can apply an empty selection', async () => {
    const { store } = await renderForm({
      selectionIds: [liverRunA.selection_id]
    });
    await maleFilter().click();
    await expect
      .element(page.getByRole('button', { name: 'Clear selections' }))
      .toBeDisabled();
    const unknown = page
      .getByRole('region', { name: 'sex filter', exact: true })
      .getByRole('checkbox', { name: 'unknown', exact: true });
    await unknown.click();
    await page
      .getByRole('region', { name: 'tissue filter', exact: true })
      .getByRole('checkbox', { name: /^brain\b/ })
      .click();
    await unknown.click();
    await expect.element(maleFilter()).toBeChecked();
    await expect.element(maleFilter()).toHaveAccessibleDescription('0');
    await expect
      .element(page.getByRole('region', { name: 'cohort filter', exact: true }))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByText('No selections match these filters.'))
      .toBeVisible();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 0 tracks selected · 4 tracks hidden by filters');
    await expect
      .element(page.getByRole('heading', { level: 3, name: /^Selections/ }))
      .toHaveTextContent('Selections');
    await apply();
    await expect
      .poll(() => store.getState().browser.transcriptomic[genomeId])
      .toEqual([]);
    // A checked value with no matches can still be unchecked to recover results.
    await maleFilter().click();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 of 1 track selected · 3 tracks hidden by filters');
    await expect
      .element(page.getByRole('region', { name: 'cohort filter', exact: true }))
      .toBeVisible();
  });

  it('disables Apply until track settings are ready', async () => {
    await renderForm({ ready: false });
    await expect
      .element(page.getByRole('button', { name: 'Apply', exact: true }))
      .toBeDisabled();
  });
});
