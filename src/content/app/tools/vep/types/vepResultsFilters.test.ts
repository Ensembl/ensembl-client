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
  isResultsFilterActive,
  serializeResultsFilters
} from './vepResultsFilters';

import type { ResultsFilterCondition } from './vepResultsFilters';

const condition = (
  overrides: Partial<ResultsFilterCondition>
): ResultsFilterCondition => ({
  id: 'x',
  field: 'cadd_phred',
  operator: 'ge',
  values: [],
  ...overrides
});

const parse = (conditions: ResultsFilterCondition[]) =>
  JSON.parse(serializeResultsFilters(conditions) ?? '[]');

describe('score filters', () => {
  it('sends the threshold and the no-score choice', () => {
    expect(
      parse([condition({ threshold: 20, include_missing: false })])
    ).toEqual([
      {
        field: 'cadd_phred',
        operator: 'ge',
        values: [],
        threshold: 20,
        include_missing: false
      }
    ]);
  });

  it('accepts a negative threshold', () => {
    // The reason a score filter is not bounded like allele frequency: CADD RAW
    // is unbounded and routinely negative, and popEVE is negative throughout.
    expect(
      isResultsFilterActive(condition({ field: 'cadd_raw', threshold: -2.5 }))
    ).toBe(true);
    expect(
      parse([condition({ field: 'cadd_raw', threshold: -2.5 })])[0].threshold
    ).toBe(-2.5);
    expect(
      parse([condition({ field: 'popeve', threshold: -3.4 })])[0].threshold
    ).toBe(-3.4);
  });

  it('is inactive without a threshold, so it is not sent', () => {
    expect(isResultsFilterActive(condition({}))).toBe(false);
    expect(serializeResultsFilters([condition({})])).toBeUndefined();
  });

  it('treats zero as a real threshold', () => {
    // A falsy number that must not be mistaken for "unset".
    expect(isResultsFilterActive(condition({ threshold: 0 }))).toBe(true);
  });
});

describe('allele frequency', () => {
  it('still carries its any/all match mode, which a score filter has no use for', () => {
    const [af] = parse([
      condition({
        field: 'allele_frequency',
        operator: 'le',
        threshold: 0.01,
        match: 'all'
      })
    ]);
    expect(af.match).toBe('all');
    expect(af).not.toHaveProperty('include_missing');
  });
});
