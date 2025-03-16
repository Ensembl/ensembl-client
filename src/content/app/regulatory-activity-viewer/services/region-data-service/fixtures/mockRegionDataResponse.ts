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
  }
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
    region_name: '1',
    coordinate_system: 'chromosome',
    locations: [{ start, end }],
    genes: [createGenePayload({
      start: start + 1000,
      end: start + 2000
    })],
    selected_gene_index: 0,
    regulatory_features: {
      feature_types: {},
      data: []
    },
    ...fragment
  };
};
