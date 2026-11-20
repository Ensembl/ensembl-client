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

// Small synthetic catalogue with different hierarchy depths and all four products.
// A/B share a sample; A/C share a filter value. Selection IDs differ from UUIDs.
export const genomeId = 'test-genome';
export const otherGenomeId = 'other-genome';
export const sampleIds = {
  liverOne: 'liver-sample-1',
  liverTwo: 'liver-sample-2',
  brain: 'brain-sample'
};
export const trackLabels = {
  liverRunA: 'Liver run A · Coverage forward',
  liverRunB: 'Liver run B · Coverage reverse',
  liverRunC: 'Liver run C · Splice junction',
  brainRun: 'Brain run · Gene model'
};

export const liverRunA = {
  selection_id: 'run-a',
  display_label: 'Liver run A',
  selection_level: 'run',
  data_type: 'rnaseq',
  metadata: { tissue: 'Liver', sex: 'female', cohort: 'cohort-a' },
  track_products: [
    {
      track_type: 'bigwig',
      track_id: '00000000-0000-4000-8000-000000000001',
      display_label: 'Coverage forward'
    }
  ]
} satisfies TranscriptomicSelection;

export const liverRunB = {
  selection_id: 'run-b',
  display_label: 'Liver run B',
  selection_level: 'run',
  data_type: 'rnaseq',
  metadata: { tissue: 'Liver', sex: 'male', cohort: 'cohort-b' },
  track_products: [
    {
      track_type: 'bigwig',
      track_id: '00000000-0000-4000-8000-000000000002',
      display_label: 'Coverage reverse'
    }
  ]
} satisfies TranscriptomicSelection;

export const liverRunC = {
  selection_id: 'run-c',
  display_label: 'Liver run C',
  selection_level: 'run',
  data_type: 'rnaseq',
  metadata: { tissue: 'Liver', sex: 'female', cohort: 'cohort-c' },
  track_products: [
    {
      track_type: 'bigbed',
      track_id: '00000000-0000-4000-8000-000000000003',
      display_label: 'Splice junction'
    }
  ]
} satisfies TranscriptomicSelection;

export const brainRun = {
  selection_id: 'run-d',
  display_label: 'Brain run',
  selection_level: 'run',
  data_type: 'rnaseq',
  metadata: { tissue: 'Brain', sex: 'unknown', cohort: 'cohort-d' },
  track_products: [
    {
      track_type: 'bigbed',
      track_id: '00000000-0000-4000-8000-000000000004',
      display_label: 'Gene model'
    }
  ]
} satisfies TranscriptomicSelection;

export const createTranscriptomicConfiguration =
  (): TranscriptomicConfiguration => ({
    genome_id: genomeId,
    track_count: 4,
    selections: structuredClone([liverRunA, liverRunB, liverRunC, brainRun]),
    // API order deliberately differs from flat selection order.
    selection_hierarchy: [
      {
        level: 'tissue',
        value: 'brain',
        display_label: 'Brain',
        selection_ids: [],
        children: [
          {
            level: 'biosample',
            value: sampleIds.brain,
            display_label: sampleIds.brain,
            selection_ids: [],
            children: [
              {
                level: 'run',
                value: 'brain-run',
                display_label: 'Brain run',
                selection_ids: [brainRun.selection_id],
                children: []
              }
            ]
          }
        ]
      },
      {
        level: 'tissue',
        value: 'liver',
        display_label: 'Liver',
        selection_ids: [],
        children: [
          {
            level: 'biosample',
            value: sampleIds.liverOne,
            display_label: sampleIds.liverOne,
            selection_ids: [liverRunA.selection_id, liverRunB.selection_id],
            children: []
          },
          {
            level: 'biosample',
            value: sampleIds.liverTwo,
            display_label: sampleIds.liverTwo,
            selection_ids: [liverRunC.selection_id],
            children: []
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
