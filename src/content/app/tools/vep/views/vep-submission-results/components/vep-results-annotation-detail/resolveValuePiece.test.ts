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

import { describe, expect, it } from 'vitest';
import type { ReactElement } from 'react';

import { resolveValuePiece } from './displaySpecRenderer';
import { displaySpecFixture } from './displaySpec.fixture';
import type { DisplaySpec } from 'src/content/app/tools/vep/types/vepDisplaySpec';

const spec = displaySpecFixture as DisplaySpec;

const rating = (stars: unknown): number | null =>
  stars ? ((stars as ReactElement).props as { rating: number }).rating : null;

describe('resolveValuePiece', () => {
  it('reads a named field of the element', () => {
    const got = resolveValuePiece({ from: 'name' }, { name: 'BRCA1' }, spec);
    expect(got?.text).toBe('BRCA1');
  });

  it('takes the element itself when there is no field to name', () => {
    expect(resolveValuePiece({}, 'Long QT syndrome', spec)?.text).toBe(
      'Long QT syndrome'
    );
  });

  it('shows nothing at all for an absent value', () => {
    expect(
      resolveValuePiece({ from: 'name' }, { name: null }, spec)
    ).toBeNull();
    expect(resolveValuePiece({ from: 'gone' }, { name: 'x' }, spec)).toBeNull();
  });

  it('shows nothing when the format has nothing to say', () => {
    const got = resolveValuePiece(
      { from: 'terms', format: 'humanize_terms' },
      { terms: '+' },
      spec
    );
    expect(got).toBeNull();
  });

  it('keeps the count out of the value it links', () => {
    const got = resolveValuePiece(
      { from: 'classification', count_from: 'count' },
      { classification: 'Pathogenic', count: 3 },
      spec
    );
    expect(got?.text).toBe('Pathogenic (3)');
    expect(got?.value).toBe('Pathogenic');
  });

  it('leaves the value alone when there is no count beside it', () => {
    const got = resolveValuePiece(
      { from: 'classification', count_from: 'count' },
      { classification: 'Pathogenic', count: null },
      spec
    );
    expect(got?.text).toBe('Pathogenic');
    expect(got?.value).toBe('Pathogenic');
  });

  it('maps a value whose wording belongs to the source', () => {
    const got = resolveValuePiece(
      {
        from: 'type',
        labels: { SomaticClinicalImpact: 'Somatic clinical impact' }
      },
      { type: 'SomaticClinicalImpact' },
      spec
    );
    expect(got?.text).toBe('Somatic clinical impact');
  });

  it('keeps the data wording for a value the map does not name', () => {
    const got = resolveValuePiece(
      { from: 'type', labels: { Germline: 'Germline' } },
      { type: 'Oncogenicity' },
      spec
    );
    expect(got?.text).toBe('Oncogenicity');
  });

  it('renders a template as prose, with nothing to rate', () => {
    const got = resolveValuePiece(
      {
        from: 'supporting',
        template: '{supporting} of {submissions} submission(s) contribute',
        stars: 'clinvar_aggregate'
      },
      { supporting: 1, submissions: 44 },
      spec
    );
    expect(got?.text).toBe('1 of 44 submission(s) contribute');
    expect(got?.stars).toBeNull();
  });

  it('rates on a scale stated outright', () => {
    const got = resolveValuePiece(
      { from: 'review_status', stars: 'clinvar_submission' },
      { review_status: 'practice_guideline' },
      spec
    );
    expect(rating(got?.stars)).toBe(4);
  });

  it('rates on the scale a field names, so siblings can differ', () => {
    const piece = {
      from: 'classification',
      stars_from: 'rating_scale',
      stars_of: 'review_status'
    };
    const germline = resolveValuePiece(
      piece,
      {
        classification: 'Pathogenic',
        rating_scale: 'clinvar_aggregate',
        review_status: 'criteria_provided,_multiple_submitters,_no_conflicts'
      },
      spec
    );
    const somatic = resolveValuePiece(
      piece,
      {
        classification: 'Tier I',
        rating_scale: 'clinvar_somatic',
        review_status: 'criteria_provided,_multiple_submitters'
      },
      spec
    );
    expect(rating(germline?.stars)).toBe(2);
    expect(rating(somatic?.stars)).toBe(2);
    expect(germline?.text).toBe('Pathogenic');
  });

  it('shows no rating for a term the scale does not know', () => {
    const got = resolveValuePiece(
      { from: 'review_status', stars: 'clinvar_submission' },
      { review_status: 'something_new_clinvar_started_writing' },
      spec
    );
    expect(got?.stars).toBeNull();
  });
});
