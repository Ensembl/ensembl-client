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
  resolveTranscriptomicTracks,
  toggleSelectionIds
} from './transcriptomic';
import type { TranscriptomicSelection } from '../state/types/transcriptomic';

const selections: TranscriptomicSelection[] = [
  {
    selection_id: 'a',
    display_label: 'Run A',
    parent_sample_id: 'sample',
    selection_level: 'run',
    data_type: 'rnaseq',
    metadata: { tissue: 'Liver', sex: 'Female' },
    track_products: [
      { track_id: 't1', track_type: 'coverage' },
      { track_id: 't2', track_type: 'junctions' }
    ]
  },
  {
    selection_id: 'b',
    display_label: 'Run B',
    parent_sample_id: 'sample',
    selection_level: 'run',
    data_type: 'rnaseq',
    metadata: { tissue: 'MGC', sex: 'Male' },
    track_products: [{ track_id: 't2', track_type: 'junctions' }]
  },
  {
    selection_id: 'c',
    display_label: 'Run C',
    selection_level: 'run',
    data_type: 'rnaseq',
    metadata: {},
    track_products: [{ track_id: 't3', track_type: 'coverage' }]
  }
];

describe('transcriptomic configuration', () => {
  it('uses configuration order and labels, deduplicating all products', () => {
    expect(
      resolveTranscriptomicTracks(selections, ['b', 'a']).map(
        ({ track_id, label }) => [track_id, label]
      )
    ).toEqual([
      ['t1', 'Run A'],
      ['t2', 'Run A']
    ]);
    expect(resolveTranscriptomicTracks(selections, [])).toEqual([]);
  });
  it('groups runs under samples and leaves parentless selections independent', () => {
    expect(
      groupTranscriptomicSelections(selections).map(([, group]) => [
        group.sampleId,
        group.selections.length
      ])
    ).toEqual([
      ['sample', 2],
      [undefined, 1]
    ]);
  });
  it('uses case-insensitive OR within facets, AND across facets, and excludes missing values', () => {
    expect(
      filterTranscriptomicSelections(selections, {
        tissue: ['liver', 'mgc'],
        sex: ['female']
      }).map((s) => s.selection_id)
    ).toEqual(['a']);
    expect(filterTranscriptomicSelections(selections, { tissue: [] })).toEqual(
      selections
    );
    expect(
      filterTranscriptomicSelections(selections, { tissue: ['other'] })
    ).toEqual([]);
  });
  it('sample toggles affect only matching runs and preserve hidden selections', () => {
    const matching = filterTranscriptomicSelections(selections, {
      tissue: ['liver']
    }).map((s) => s.selection_id);
    expect(toggleSelectionIds(['a', 'b'], matching, false)).toEqual(['b']);
    expect(toggleSelectionIds(['b'], matching, true)).toEqual(['b', 'a']);
  });
});
