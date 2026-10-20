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
  createTranscriptomicConfiguration,
  genomeId,
  liverRunA,
  liverRunB
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
  it('selects collapsed descendants and shows mixed group states independently of expansion', async () => {
    await renderForm();
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
      .toHaveTextContent('3 tracks selected');

    await expandLiver.click();
    const sample = page.getByRole('checkbox', {
      name: liverRunA.parent_sample_id,
      exact: true
    });
    await expect.element(sample).toBeChecked();
    await expect.element(sample).toHaveAccessibleDescription('2');
    await page
      .getByRole('button', { name: liverRunA.parent_sample_id, exact: true })
      .click();
    await page
      .getByRole('checkbox', { name: liverRunA.display_label, exact: true })
      .click();
    await expect.element(sample).toBePartiallyChecked();
    await expect.element(liver).toBePartiallyChecked();
  });

  it('updates filtered groups but keeps hidden draft runs until Apply', async () => {
    const { store } = await renderForm({
      selectionIds: [liverRunA.selection_id, liverRunB.selection_id]
    });
    const heading = page.getByRole('heading', { level: 3, name: /^Tissues/ });
    const clearFilters = page.getByRole('button', { name: 'Clear filters' });
    await expect.element(clearFilters).toBeDisabled();
    await expect.element(heading).toHaveTextContent('Tissues');
    await maleFilter().click();
    await expect.element(clearFilters).toBeEnabled();
    await expect.element(heading).toHaveTextContent('Tissues');
    await expect
      .element(page.getByRole('checkbox', { name: 'Brain', exact: true }))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByRole('checkbox', { name: 'Liver', exact: true }))
      .toHaveAccessibleDescription('1');
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent(
        '1 track selected · 1 selected track hidden by filters will be cleared on Apply'
      );
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect.element(clearFilters).toBeDisabled();
    await expect
      .element(page.getByRole('checkbox', { name: 'Liver', exact: true }))
      .toHaveAccessibleDescription('3');
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('2 tracks selected');

    await maleFilter().click();
    await apply();
    await expect
      .poll(() => store.getState().browser.transcriptomic[genomeId])
      .toEqual([liverRunB.selection_id]);
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('1 track selected');
  });

  it('clears visible and hidden draft selections without changing filters or applied state', async () => {
    const selectionIds = [liverRunA.selection_id, liverRunB.selection_id];
    const { store } = await renderForm({ selectionIds });
    await maleFilter().click();
    await page.getByRole('button', { name: 'Clear selections' }).click();
    await expect.element(maleFilter()).toBeChecked();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('0 tracks selected');
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
    // Filter values keep API-provided run counts; category headers have none.
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

  it('shows an empty result and can apply an empty selection', async () => {
    const { store } = await renderForm({
      selectionIds: [liverRunA.selection_id]
    });
    await maleFilter().click();
    await page
      .getByRole('region', { name: 'tissue filter', exact: true })
      .getByRole('checkbox', { name: /^brain\b/ })
      .click();
    await expect
      .element(page.getByText('No selections match these filters.'))
      .toBeVisible();
    await expect
      .element(page.getByRole('heading', { level: 3, name: /^Tissues/ }))
      .toHaveTextContent('Tissues');
    await apply();
    await expect
      .poll(() => store.getState().browser.transcriptomic[genomeId])
      .toEqual([]);
  });

  it('disables Apply until track settings are ready', async () => {
    await renderForm({ ready: false });
    await expect
      .element(page.getByRole('button', { name: 'Apply', exact: true }))
      .toBeDisabled();
  });
});
