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

import { describe, it, expect } from 'vitest';

import {
  FILTER_FIELDS,
  SCORE_FIELD_OPTIONS,
  SCORE_FIELD_OPTION_GROUPS,
  availableScoresForRow,
  createCondition,
  definitionForField,
  flattenScoreOptions,
  isScoreField,
  scoreFieldOption
} from './resultsFilterFields';

import { SCORE_FILTER_FIELDS } from 'src/content/app/tools/vep/types/vepResultsFilters';

import type {
  ResultsFilterCondition,
  ResultsFilterField
} from 'src/content/app/tools/vep/types/vepResultsFilters';

const condition = (field: ResultsFilterField): ResultsFilterCondition =>
  createCondition(field);

const groupTitles = (groups: { title: string }[]) =>
  groups.map((group) => group.title);

describe('the score menu', () => {
  it('offers the categories in the order the form uses', () => {
    expect(groupTitles(SCORE_FIELD_OPTION_GROUPS)).toEqual([
      'Genome wide',
      'Missense',
      'Splicing'
    ]);
  });

  it('agrees with the score fields the filter type knows about', () => {
    // The two lists are declared separately (one is the wire vocabulary, the
    // other the menu), so a score added to one and not the other would either
    // be unfilterable or unofferable.
    expect(SCORE_FIELD_OPTIONS.map((option) => option.value).sort()).toEqual(
      [...SCORE_FILTER_FIELDS].sort()
    );
    for (const field of SCORE_FILTER_FIELDS) {
      expect(isScoreField(field)).toBe(true);
    }
  });

  it('gives every score its own range hint', () => {
    // The placeholder is a real hint at the expected range, not decoration:
    // most scores are 0-1, CADD PHRED is ~0-99, and popEVE is negative.
    expect(scoreFieldOption('cadd_phred')?.placeholder).toBe('e.g. 20');
    expect(scoreFieldOption('cadd_raw')?.placeholder).toBe('e.g. 3');
    expect(scoreFieldOption('revel')?.placeholder).toBe('e.g. 0.5');
    expect(scoreFieldOption('popeve')?.placeholder).toBe('e.g. -3');
    for (const option of SCORE_FIELD_OPTIONS) {
      expect(option.placeholder).not.toBe('');
    }
  });

  it('is reached from the one "Variant impact predictions" field entry', () => {
    // Whichever score a row is on, the field dropdown shows the single grouped
    // entry, named as the submission form's own panel is.
    for (const field of SCORE_FILTER_FIELDS) {
      expect(definitionForField(field)?.label).toBe(
        'Variant impact predictions'
      );
    }
    expect(
      FILTER_FIELDS.filter((definition) => definition.editor === 'score')
    ).toHaveLength(1);
  });
});

describe('availableScoresForRow', () => {
  it('offers only the scores the job carries, keeping them grouped', () => {
    const groups = availableScoresForRow([], 0, ['cadd_phred', 'revel']);
    expect(groupTitles(groups)).toEqual(['Genome wide', 'Missense']);
    expect(flattenScoreOptions(groups).map((option) => option.value)).toEqual([
      'cadd_phred',
      'revel'
    ]);
  });

  it('drops a category with no available scores rather than leaving it empty', () => {
    // An empty <optgroup> still renders its heading, so a category with nothing
    // under it would advertise scores this job does not have.
    const groups = availableScoresForRow([], 0, ['spliceai_dl']);
    expect(groupTitles(groups)).toEqual(['Splicing']);
  });

  it('returns nothing at all when the job carries no scores', () => {
    // This is what gates the whole entry out of the field dropdown.
    expect(availableScoresForRow([], 0, [])).toEqual([]);
  });

  it('does not offer a score another row has already taken', () => {
    const conditions = [condition('cadd_phred'), condition('revel')];
    const groups = availableScoresForRow(conditions, 1, [
      'cadd_phred',
      'cadd_raw',
      'revel'
    ]);
    expect(flattenScoreOptions(groups).map((option) => option.value)).toEqual([
      'cadd_raw',
      'revel'
    ]);
    // And with the other row's score being the only genome-wide one, that
    // category disappears entirely.
    expect(
      groupTitles(availableScoresForRow(conditions, 1, ['cadd_phred', 'revel']))
    ).toEqual(['Missense']);
  });

  it('keeps the score the row is itself on', () => {
    // Otherwise a row would be pointing at an option that is not in its menu.
    const conditions = [condition('revel')];
    const groups = availableScoresForRow(conditions, 0, ['revel']);
    expect(flattenScoreOptions(groups).map((option) => option.value)).toEqual([
      'revel'
    ]);
  });
});

describe('createCondition', () => {
  it('starts every score at >=, since the damaging end is what is asked for', () => {
    for (const field of SCORE_FILTER_FIELDS) {
      expect(createCondition(field).operator).toBe('ge');
    }
  });

  it('starts every score excluding the unscored variants', () => {
    // Unlike allele frequency, where absence implies the variant is very rare
    // and so is kept. A variant with no impact score was never judged, so
    // including it by default would dilute a hunt for damaging variants.
    for (const field of SCORE_FILTER_FIELDS) {
      expect(createCondition(field).includeMissing).toBe(false);
    }
    expect(createCondition('allele_frequency').includeMissing).toBeUndefined();
  });
});
