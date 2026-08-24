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
  num,
  humanizeClass,
  normalizePhenotype,
  withScore,
  joinList,
  humanizeJoin,
  count
} from './annotationFormatters';

describe('num', () => {
  it('leaves integers alone', () => {
    expect(num(13)).toBe('13');
    expect(num(0)).toBe('0');
    expect(num(-4)).toBe('-4');
  });

  it('rounds to four significant figures', () => {
    expect(num(0.123456)).toBe('0.1235');
    expect(num(1234.567)).toBe('1235');
  });

  it('drops trailing zeros from the rounded value', () => {
    // prettier-ignore
    expect(num(0.50000)).toBe('0.5');
    // prettier-ignore
    expect(num(23.40000)).toBe('23.4');
  });
});

describe('humanizeClass', () => {
  it('replaces every underscore with a space', () => {
    expect(humanizeClass('likely_benign')).toBe('likely benign');
    expect(humanizeClass('a_b_c')).toBe('a b c');
    expect(humanizeClass('pathogenic')).toBe('pathogenic');
  });
});

describe('normalizePhenotype', () => {
  it('collapses underscore runs and trims', () => {
    expect(normalizePhenotype('Li-Fraumeni__syndrome ')).toBe(
      'Li-Fraumeni syndrome'
    );
  });

  it('drops all-caps terms to sentence case', () => {
    expect(normalizePhenotype('BREAST_CANCER')).toBe('Breast cancer');
  });

  it('leaves mixed-case terms (with gene symbols) untouched', () => {
    expect(normalizePhenotype('ClinVar: WARS2_deficiency')).toBe(
      'ClinVar: WARS2 deficiency'
    );
  });
});

describe('withScore', () => {
  it('shows the score first with the humanised class in brackets', () => {
    expect(withScore('likely_benign', 0.0854)).toBe('0.0854 (likely benign)');
  });

  it('falls back to the class alone when there is no score', () => {
    expect(withScore('likely_pathogenic', null)).toBe('likely pathogenic');
  });

  it('keeps a zero score', () => {
    expect(withScore('benign', 0)).toBe('0 (benign)');
  });
});

describe('joinList', () => {
  it('joins with a comma and space', () => {
    expect(joinList(['a', 'b'])).toBe('a, b');
  });

  it('returns null for an empty or missing list', () => {
    expect(joinList([])).toBeNull();
    expect(joinList(null)).toBeNull();
    expect(joinList(undefined)).toBeNull();
  });
});

describe('humanizeJoin', () => {
  it('humanises each term and joins with a comma and space', () => {
    expect(humanizeJoin(['Likely_benign', 'Pathogenic'])).toBe(
      'Likely benign, Pathogenic'
    );
  });

  it('returns null for an empty or missing list', () => {
    expect(humanizeJoin([])).toBeNull();
    expect(humanizeJoin(null)).toBeNull();
    expect(humanizeJoin(undefined)).toBeNull();
  });
});

describe('count', () => {
  it('counts a list', () => {
    expect(count([1, 2, 3])).toBe('3');
  });

  it('counts the items in an &-delimited string', () => {
    expect(count('a&b&c')).toBe('3');
    expect(count('a')).toBe('1');
  });

  it('is null (not "0") for an empty list, string, or missing value', () => {
    expect(count([])).toBeNull();
    expect(count('')).toBeNull();
    expect(count(null)).toBeNull();
    expect(count(undefined)).toBeNull();
  });
});
