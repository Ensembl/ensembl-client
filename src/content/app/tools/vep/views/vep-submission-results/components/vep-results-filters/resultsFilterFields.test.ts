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
  availableFieldsForRow,
  availableScoresForRow,
  createCondition,
  flattenScoreOptions,
  nextAvailableField
} from './resultsFilterFields';

import {
  type FilterField,
  type ResultsFilterCondition,
  type ScoreOptionGroup
} from 'src/content/app/tools/vep/types/vepResultsFilters';

/**
 * What a row may offer, given what other rows have taken. The catalogue itself
 * — which fields exist, their labels, which scores sit under which heading —
 * comes from the API and is asserted there (tests/test_filter_spec.py); a
 * fixture stands in for it here, so these tests describe the row logic and not
 * the day's spec.
 */
const CATALOGUE: FilterField[] = [
  {
    field: 'consequence',
    label: 'Predicted molecular consequence',
    editor: 'consequence',
    initial_condition: { operator: 'in', values: [] },
    single_instance: true
  },
  {
    field: 'transcript',
    label: 'Transcript',
    editor: 'text',
    initial_condition: { operator: 'in', values: [] }
  },
  {
    field: 'allele_frequency',
    label: 'Allele frequency',
    editor: 'af',
    initial_condition: {
      operator: 'le',
      values: [],
      threshold: 0.05,
      match: 'any'
    },
    operator_options: [
      { value: 'le', label: '≤' },
      { value: 'ge', label: '≥' }
    ]
  },
  {
    field: 'cadd_phred',
    label: 'Variant impact predictions',
    editor: 'score',
    initial_condition: {
      operator: 'ge',
      values: [],
      include_missing: false
    },
    operator_options: [
      { value: 'le', label: '≤' },
      { value: 'ge', label: '≥' }
    ],
    missing_label: 'Include variants with no score',
    score_groups: [
      {
        title: 'Genome wide',
        options: [
          {
            value: 'cadd_phred',
            label: 'CADD (PHRED)',
            placeholder: 'e.g. 20'
          },
          { value: 'cadd_raw', label: 'CADD (RAW)', placeholder: 'e.g. 3' }
        ]
      },
      {
        title: 'Missense',
        options: [{ value: 'revel', label: 'REVEL', placeholder: 'e.g. 0.5' }]
      },
      {
        title: 'Splicing',
        options: [
          {
            value: 'spliceai_dl',
            label: 'SpliceAI ΔS (donor loss)',
            placeholder: 'e.g. 0.5'
          }
        ]
      }
    ]
  }
];

const condition = (field: string): ResultsFilterCondition =>
  createCondition(field, CATALOGUE);

// The scores the catalogue offers, which is what "a score field" now means.
const CATALOGUE_SCORES = (
  CATALOGUE.find((f) => f.editor === 'score')?.score_groups ?? []
).flatMap((group) => group.options.map((option) => option.value));

const groupTitles = (groups: ScoreOptionGroup[]) =>
  groups.map((group) => group.title);

const scoresIn = (groups: ScoreOptionGroup[]) =>
  flattenScoreOptions(groups).map((option) => option.value);

describe('availableScoresForRow', () => {
  it('offers only the scores the job carries, keeping them grouped', () => {
    const groups = availableScoresForRow(
      [],
      0,
      ['cadd_phred', 'revel'],
      CATALOGUE
    );
    expect(groupTitles(groups)).toEqual(['Genome wide', 'Missense']);
    expect(scoresIn(groups)).toEqual(['cadd_phred', 'revel']);
  });

  it('drops a category with no available scores rather than leaving it empty', () => {
    // An empty <optgroup> still renders its heading, so a category with nothing
    // under it would advertise scores this job does not have.
    const groups = availableScoresForRow([], 0, ['spliceai_dl'], CATALOGUE);
    expect(groupTitles(groups)).toEqual(['Splicing']);
  });

  it('returns nothing at all when the job carries no scores', () => {
    // This is what gates the whole entry out of the field dropdown.
    expect(availableScoresForRow([], 0, [], CATALOGUE)).toEqual([]);
  });

  it('does not offer a score another row has already taken', () => {
    const conditions = [condition('cadd_phred'), condition('revel')];
    const groups = availableScoresForRow(
      conditions,
      1,
      ['cadd_phred', 'cadd_raw', 'revel'],
      CATALOGUE
    );
    expect(scoresIn(groups)).toEqual(['cadd_raw', 'revel']);
    // And with the other row's score being the only genome-wide one, that
    // category disappears entirely.
    expect(
      groupTitles(
        availableScoresForRow(conditions, 1, ['cadd_phred', 'revel'], CATALOGUE)
      )
    ).toEqual(['Missense']);
  });

  it('keeps the score the row is itself on', () => {
    // Otherwise a row would be pointing at an option that is not in its menu.
    const conditions = [condition('revel')];
    const groups = availableScoresForRow(conditions, 0, ['revel'], CATALOGUE);
    expect(scoresIn(groups)).toEqual(['revel']);
  });
});

describe('createCondition', () => {
  it('uses the score initial condition from the catalogue', () => {
    for (const field of CATALOGUE_SCORES) {
      expect(createCondition(field, CATALOGUE)).toMatchObject({
        field,
        operator: 'ge',
        values: [],
        include_missing: false
      });
    }
  });

  it('uses the allele-frequency initial condition from the catalogue', () => {
    expect(createCondition('allele_frequency', CATALOGUE)).toMatchObject({
      field: 'allele_frequency',
      operator: 'le',
      values: [],
      threshold: 0.05,
      match: 'any'
    });
  });

  it('does not share the catalogue values array between rows', () => {
    const first = createCondition('transcript', CATALOGUE);
    const second = createCondition('transcript', CATALOGUE);
    first.values.push('ENST1');
    expect(second.values).toEqual([]);
  });
});

describe('single-instance fields', () => {
  it('withdraws a used one from the other rows', () => {
    const conditions = [condition('consequence'), condition('transcript')];
    const offered = availableFieldsForRow(conditions, 1, CATALOGUE).map(
      (f) => f.field
    );
    expect(offered).not.toContain('consequence');
  });

  it('keeps it on the row that is using it', () => {
    const conditions = [condition('consequence')];
    const offered = availableFieldsForRow(conditions, 0, CATALOGUE).map(
      (f) => f.field
    );
    expect(offered).toContain('consequence');
  });

  it('is skipped when choosing the field for a new row', () => {
    expect(nextAvailableField([condition('consequence')], CATALOGUE)).toBe(
      'transcript'
    );
  });
});
