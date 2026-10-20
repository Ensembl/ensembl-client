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

import type {
  TranscriptomicConfiguration,
  TranscriptomicSelection
} from 'src/content/app/genome-browser/state/types/transcriptomic';

// Small, synthetic API catalogue: two tissues, three samples, four runs.
// A/B share a sample; A/C share a filter value. IDs intentionally differ from UUIDs.
export const genomeId = 'test-genome';
export const otherGenomeId = 'other-genome';

export const liverRunA = {
  selection_id: 'run-a',
  parent_sample_id: 'liver-sample-1',
  display_label: 'Liver run A',
  selection_level: 'run',
  data_type: 'rnaseq',
  metadata: { tissue: 'Liver', sex: 'female', cohort: 'cohort-a' },
  track_products: [
    {
      track_type: 'rnaseq_coverage',
      track_id: '00000000-0000-4000-8000-000000000001'
    }
  ]
} satisfies TranscriptomicSelection;

export const liverRunB = {
  selection_id: 'run-b',
  parent_sample_id: 'liver-sample-1',
  display_label: 'Liver run B',
  selection_level: 'run',
  data_type: 'rnaseq',
  metadata: { tissue: 'Liver', sex: 'male', cohort: 'cohort-b' },
  track_products: [
    {
      track_type: 'rnaseq_coverage',
      track_id: '00000000-0000-4000-8000-000000000002'
    }
  ]
} satisfies TranscriptomicSelection;

export const liverRunC = {
  selection_id: 'run-c',
  parent_sample_id: 'liver-sample-2',
  display_label: 'Liver run C',
  selection_level: 'run',
  data_type: 'rnaseq',
  metadata: { tissue: 'Liver', sex: 'female', cohort: 'cohort-c' },
  track_products: [
    {
      track_type: 'rnaseq_coverage',
      track_id: '00000000-0000-4000-8000-000000000003'
    }
  ]
} satisfies TranscriptomicSelection;

export const brainRun = {
  selection_id: 'run-d',
  parent_sample_id: 'brain-sample',
  display_label: 'Brain run',
  selection_level: 'run',
  data_type: 'rnaseq',
  metadata: { tissue: 'Brain', sex: 'unknown', cohort: 'cohort-d' },
  track_products: [
    {
      track_type: 'rnaseq_coverage',
      track_id: '00000000-0000-4000-8000-000000000004'
    }
  ]
} satisfies TranscriptomicSelection;

export const createTranscriptomicConfiguration =
  (): TranscriptomicConfiguration => ({
    track_count: 4,
    selections: structuredClone([liverRunA, liverRunB, liverRunC, brainRun]),
    // API order deliberately differs from flat selection order.
    selection_hierarchy: [
      {
        tissue: 'brain',
        display_label: 'Brain',
        samples: [
          {
            sample_id: brainRun.parent_sample_id,
            selection_ids: [brainRun.selection_id]
          }
        ]
      },
      {
        tissue: 'liver',
        display_label: 'Liver',
        samples: [
          {
            sample_id: liverRunA.parent_sample_id,
            selection_ids: [liverRunA.selection_id, liverRunB.selection_id]
          },
          {
            sample_id: liverRunC.parent_sample_id,
            selection_ids: [liverRunC.selection_id]
          }
        ]
      }
    ],
    filters: {
      sex: [
        { value: 'female', count: 2 },
        { value: 'male', count: 1 },
        { value: 'unknown', count: 1 }
      ],
      cohort: ['cohort-a', 'cohort-b', 'cohort-c', 'cohort-d'].map((value) => ({
        value,
        count: 1
      })),
      tissue: [
        { value: 'liver', count: 3 },
        { value: 'brain', count: 1 }
      ]
    }
  });
