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

import { faker } from '@faker-js/faker';

import type {
  GeneInRegionOverview,
  RegulatoryFeature,
  OverviewRegion
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

export const createGenePayload = (
  fragment: Partial<GeneInRegionOverview> = {}
): GeneInRegionOverview => {
  const unversionedStableId = faker.string.uuid();
  const stableId = `${unversionedStableId}.1`;

  const start = faker.helpers.rangeToNumber({
    min: 10_000,
    max: 100_000
  });

  const length = 1000;

  return {
    stable_id: stableId,
    unversioned_stable_id: unversionedStableId,
    biotype: 'protein_coding',
    start,
    end: start + length,
    strand: 'forward',
    representative_transcript: {
      exons: [],
      cds: []
    },
    tss: [],
    merged_exons: [],
    cds_counts: [],
    ...fragment
  };
};

export const createRegulatoryFeaturePayload = (
  fragment: Partial<RegulatoryFeature> = {}
): RegulatoryFeature => {
  const start = faker.helpers.rangeToNumber({
    min: 10_000,
    max: 100_000
  });

  const length = 100;

  return {
    id: faker.string.uuid(),
    feature_type: 'enhancer',
    start,
    end: start + length,
    strand: 'forward',
    associated_genes: [],
    ...fragment
  };
};

export const createOverviewRegionPayload = (
  fragment: Partial<OverviewRegion> = {}
): OverviewRegion => {
  const start = faker.helpers.rangeToNumber({
    min: 10_000,
    max: 100_000
  });
  const length = 100_000;
  const end = start + length;

  return {
    region: {
      name: '1',
      coordinate_system: 'chromosome',
      length: 1_000_000
    },
    locations: [{ start, end }],
    genes: [
      createGenePayload({
        start: start + 1000,
        end: start + 2000
      })
    ],
    regulatory_features: {
      feature_types: {},
      data: []
    },
    ...fragment
  };
};
