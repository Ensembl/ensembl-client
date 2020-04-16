import faker from 'faker';
import times from 'lodash/times';

import { createSlice } from './slice';
import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { Exon } from 'src/content/app/entity-viewer/types/exon';
import { Slice } from 'src/content/app/entity-viewer/types/slice';
import { CDS } from 'src/content/app/entity-viewer/types/cds';
import {
  Product,
  ProteinDomainsResources,
  ProductType,
} from 'src/content/app/entity-viewer/types/product';

export const createTranscript = (
  fragment: Partial<Transcript> = {}
): Transcript => {
  const transcriptSlice = createSlice();

  return {
    type: 'Transcript',
    id: faker.random.uuid(),
    symbol: faker.lorem.word(),
    so_term: faker.lorem.word(),
    slice: transcriptSlice,
    exons: createExons(transcriptSlice),
    cds: createCDS(transcriptSlice),
    product: createProduct(),
    ...fragment,
  };
};

const createProduct = (): Product => {
  const length = faker.random.number({ min: 10, max: 100 });
  const numberOfDomains = faker.random.number({ min: 1, max: 10 });
  const maxDomainLength = Math.floor(length / numberOfDomains);

  const protein_domains_resources: ProteinDomainsResources = {};

  times(numberOfDomains, (index: number) => {
    const minCoordinate = maxDomainLength * index + 1;
    const maxCoordinate = maxDomainLength * (index + 1);
    const middleCoordinate =
      maxCoordinate - (maxCoordinate - minCoordinate) / 2;
    const start = faker.random.number({
      min: minCoordinate,
      max: middleCoordinate,
    });
    const end = faker.random.number({
      min: middleCoordinate + 1,
      max: maxCoordinate - 1,
    });
    const resource_group_name = faker.random.words();

    protein_domains_resources[resource_group_name] = {
      name: resource_group_name,
      domains: [
        {
          name: faker.random.words(),
          source_uri: '',
          source: {
            name: faker.random.words(),
            uri: '',
          },
          location: {
            start: start,
            end: end,
          },
          score: faker.random.number(),
        },
      ],
    };
  });

  return {
    protein_domains_resources: protein_domains_resources,
    type: ProductType.PROTEIN,
    length: length,
  };
};

const createExons = (transcriptSlice: Slice): Exon[] => {
  const { start: transcriptStart, end: transcriptEnd } = getFeatureCoordinates({
    slice: transcriptSlice,
  });
  const length = transcriptEnd - transcriptStart + 1;

  const numberOfExons = faker.random.number({ min: 1, max: 10 });
  const maxExonLength = Math.floor(length / numberOfExons);

  return times(numberOfExons, (index: number) => {
    const minCoordinate = transcriptStart + (maxExonLength * index + 1);
    const maxCoordinate = minCoordinate + maxExonLength;
    const middleCoordinate =
      maxCoordinate - (maxCoordinate - minCoordinate) / 2;
    const exonStart = faker.random.number({
      min: minCoordinate,
      max: middleCoordinate,
    });
    const exonEnd = faker.random.number({
      min: middleCoordinate + 1,
      max: maxCoordinate - 1,
    });
    const slice = {
      location: {
        start: index > 0 ? exonStart : transcriptStart,
        end: index < numberOfExons - 1 ? exonEnd : transcriptEnd,
      },
      region: transcriptSlice.region,
    };

    return {
      id: faker.random.uuid(),
      slice,
      relative_location: {
        // <-- we are still not sure about this relative location thing
        start: 0,
        end: 0,
      },
    };
  });
};

const createCDS = (transcriptSlice: Slice): CDS => {
  const { start, end } = getFeatureCoordinates({ slice: transcriptSlice });

  return {
    start: start,
    end: end,
    relative_location: {
      // <-- we are still not sure about this relative location thing
      start: 0,
      end: 0,
    },
  };
};
