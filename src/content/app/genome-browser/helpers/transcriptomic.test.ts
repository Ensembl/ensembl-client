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

import {
  filterTranscriptomicSelections,
  groupTranscriptomicSelections,
  groupTranscriptomicSelectionHierarchy,
  resolveTranscriptomicTracks,
  toggleSelectionIds
} from './transcriptomic';
import {
  createTranscriptomicConfiguration,
  liverRunA,
  liverRunB,
  liverRunC,
  brainRun
} from 'tests/fixtures/transcriptomic';
import type {
  TranscriptomicFilters,
  TranscriptomicSelection
} from 'src/content/app/genome-browser/state/types/transcriptomic';

const selectionIds = (
  selections: ReturnType<typeof filterTranscriptomicSelections>
) => selections.map((s) => s.selection_id);

describe('resolveTranscriptomicTracks', () => {
  it('uses catalogue order and labels, rather than checkbox order', () => {
    const { selections } = createTranscriptomicConfiguration();
    const tracks = resolveTranscriptomicTracks(selections, [
      liverRunB.selection_id,
      liverRunA.selection_id
    ]);
    expect(
      tracks.map(({ track_id, label, has_details }) => ({
        track_id,
        label,
        has_details
      }))
    ).toEqual([
      {
        track_id: liverRunA.track_products[0].track_id,
        label: liverRunA.display_label,
        has_details: false
      },
      {
        track_id: liverRunB.track_products[0].track_id,
        label: liverRunB.display_label,
        has_details: false
      }
    ]);
  });

  it('deduplicates UUIDs across selections and includes every selected product', () => {
    const selections = [
      liverRunA,
      {
        ...liverRunB,
        track_products: [
          ...liverRunA.track_products,
          ...liverRunB.track_products
        ]
      }
    ];
    expect(
      resolveTranscriptomicTracks(selections, [
        liverRunA.selection_id,
        liverRunB.selection_id
      ]).map((t) => t.track_id)
    ).toEqual([
      liverRunA.track_products[0].track_id,
      liverRunB.track_products[0].track_id
    ]);
    expect(resolveTranscriptomicTracks(selections, [])).toEqual([]);
  });
});

describe('filterTranscriptomicSelections', () => {
  it.each<{
    label: string;
    filters: TranscriptomicFilters;
    expected: TranscriptomicSelection[];
  }>([
    {
      label: 'no active values',
      filters: { sex: [] },
      expected: [liverRunA, liverRunB, liverRunC, brainRun]
    },
    {
      label: 'case-insensitive values',
      filters: { sex: ['FEMALE'] },
      expected: [liverRunA, liverRunC]
    },
    {
      label: 'OR within a filter',
      filters: { sex: ['male', 'unknown'] },
      expected: [liverRunB, brainRun]
    },
    {
      label: 'AND across filters',
      filters: { sex: ['male', 'unknown'], tissue: ['liver'] },
      expected: [liverRunB]
    }
  ])('matches $label', ({ filters, expected }) => {
    expect(
      selectionIds(
        filterTranscriptomicSelections(
          createTranscriptomicConfiguration().selections,
          filters
        )
      )
    ).toEqual(selectionIds(expected));
  });

  it('excludes runs with missing metadata when the corresponding filter is active', () => {
    const missing = { ...brainRun, metadata: {} };
    expect(
      filterTranscriptomicSelections([missing], { sex: ['unknown'] })
    ).toEqual([]);
    expect(filterTranscriptomicSelections([missing], {})).toEqual([missing]);
  });
});

describe('groupTranscriptomicSelectionHierarchy', () => {
  it('preserves API group labels/order and removes empty filtered branches', () => {
    const configuration = createTranscriptomicConfiguration();
    const hierarchy = configuration.selection_hierarchy!;
    hierarchy[1].display_label = 'API liver label';
    expect(
      groupTranscriptomicSelectionHierarchy(
        configuration.selections,
        hierarchy
      ).map((tissue) => tissue.label)
    ).toEqual(['Brain', 'API liver label']);
    const matching = filterTranscriptomicSelections(configuration.selections, {
      sex: ['male']
    });
    const groups = groupTranscriptomicSelectionHierarchy(matching, hierarchy);
    expect(groups.map((tissue) => tissue.label)).toEqual(['API liver label']);
    expect(groups[0].samples).toHaveLength(1);
    expect(selectionIds(groups[0].samples[0][1].selections)).toEqual([
      liverRunB.selection_id
    ]);
  });

  it('scopes sample IDs to their tissue', () => {
    const configuration = createTranscriptomicConfiguration();
    const hierarchy = configuration.selection_hierarchy!;
    hierarchy[0].samples[0].sample_id = liverRunA.parent_sample_id;
    configuration.selections.find(
      (run) => run.selection_id === brainRun.selection_id
    )!.parent_sample_id = liverRunA.parent_sample_id;
    const groups = groupTranscriptomicSelectionHierarchy(
      configuration.selections,
      hierarchy
    );
    expect(selectionIds(groups[0].samples[0][1].selections)).toEqual([
      brainRun.selection_id
    ]);
    expect(selectionIds(groups[1].samples[0][1].selections)).toEqual([
      liverRunA.selection_id,
      liverRunB.selection_id
    ]);
  });

  it('falls back to sample grouping only when hierarchy is absent', () => {
    const selections = [
      liverRunA,
      liverRunB,
      { ...brainRun, parent_sample_id: null }
    ];
    const fallback = groupTranscriptomicSelectionHierarchy(selections);
    expect(fallback[0].samples).toEqual(
      groupTranscriptomicSelections(selections)
    );
    expect(fallback[0].samples.map(([, group]) => group.sampleId)).toEqual([
      liverRunA.parent_sample_id,
      undefined
    ]);
    expect(groupTranscriptomicSelectionHierarchy(selections, [])).toEqual([]);
  });
});

it('group toggles affect matching runs without clearing hidden selections', () => {
  const matching = selectionIds(
    filterTranscriptomicSelections(
      createTranscriptomicConfiguration().selections,
      { sex: ['female'] }
    )
  );
  expect(
    toggleSelectionIds(
      [liverRunA.selection_id, liverRunB.selection_id],
      matching,
      false
    )
  ).toEqual([liverRunB.selection_id]);
  expect(
    new Set(toggleSelectionIds([liverRunB.selection_id], matching, true))
  ).toEqual(
    new Set([
      liverRunA.selection_id,
      liverRunB.selection_id,
      liverRunC.selection_id
    ])
  );
});
