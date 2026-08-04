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

import { resolveAnnotationPool } from './annotationPool';

import type { VepResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';

const annotation = (plugin: string, value: unknown) => ({
  plugin,
  scope: 'transcript',
  data: { value }
});

const buildResponse = (variant: Record<string, unknown>) =>
  ({
    metadata: {},
    variants: [variant]
  }) as unknown as VepResultsResponse;

describe('resolveAnnotationPool', () => {
  it('rebuilds annotations from the variant pool', () => {
    const response = buildResponse({
      annotation_pool: [annotation('clinvar', 1), annotation('revel', 2)],
      alternative_alleles: [
        {
          annotation_refs: [1],
          predicted_molecular_consequences: [
            { annotation_refs: [0, 1] },
            { annotation_refs: [0] }
          ]
        }
      ]
    });

    const [variant] = resolveAnnotationPool(response).variants;
    const allele = variant.alternative_alleles[0];

    expect(allele.annotations?.map((a) => a.plugin)).toEqual(['revel']);
    expect(
      allele.predicted_molecular_consequences.map((c) =>
        'annotations' in c ? c.annotations?.map((a) => a.plugin) : null
      )
    ).toEqual([['clinvar', 'revel'], ['clinvar']]);
  });

  it('shares one object between every consequence that references it', () => {
    // The point of pooling: the duplicates that were 72% of the payload stay a
    // single object in memory rather than being copied back out.
    const response = buildResponse({
      annotation_pool: [annotation('clinvar', 1)],
      alternative_alleles: [
        {
          annotation_refs: [],
          predicted_molecular_consequences: [
            { annotation_refs: [0] },
            { annotation_refs: [0] }
          ]
        }
      ]
    });

    const [variant] = resolveAnnotationPool(response).variants;
    const [first, second] = variant.alternative_alleles[0]
      .predicted_molecular_consequences as { annotations: unknown[] }[];

    expect(first.annotations[0]).toBe(second.annotations[0]);
  });

  it('leaves a response from before pooling untouched', () => {
    // No pool on the variant means the payload already carries `annotations`.
    const existing = [annotation('clinvar', 1)];
    const response = buildResponse({
      alternative_alleles: [
        {
          annotations: existing,
          predicted_molecular_consequences: [{ annotations: existing }]
        }
      ]
    });

    const [variant] = resolveAnnotationPool(response).variants;
    expect(variant.alternative_alleles[0].annotations).toBe(existing);
  });

  it('gives an entity with no refs an empty list', () => {
    const response = buildResponse({
      annotation_pool: [annotation('clinvar', 1)],
      alternative_alleles: [
        { annotation_refs: [], predicted_molecular_consequences: [] }
      ]
    });

    const [variant] = resolveAnnotationPool(response).variants;
    expect(variant.alternative_alleles[0].annotations).toEqual([]);
  });

  it('skips a ref that is not in the pool', () => {
    // Only reachable via a malformed response, but the alternative is putting
    // `undefined` where a component expects an annotation.
    const response = buildResponse({
      annotation_pool: [annotation('clinvar', 1)],
      alternative_alleles: [
        { annotation_refs: [0, 7], predicted_molecular_consequences: [] }
      ]
    });

    const [variant] = resolveAnnotationPool(response).variants;
    expect(
      variant.alternative_alleles[0].annotations?.map((a) => a.plugin)
    ).toEqual(['clinvar']);
  });

  it('leaves an intergenic consequence alone', () => {
    // A different shape that never carries annotations.
    const response = buildResponse({
      annotation_pool: [annotation('clinvar', 1)],
      alternative_alleles: [
        {
          annotation_refs: [0],
          predicted_molecular_consequences: [{ feature_type: null }]
        }
      ]
    });

    const [variant] = resolveAnnotationPool(response).variants;
    const [consequence] =
      variant.alternative_alleles[0].predicted_molecular_consequences;
    expect('annotations' in consequence).toBe(false);
  });
});
