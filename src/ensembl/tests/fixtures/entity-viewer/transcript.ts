import faker from 'faker';
import times from 'lodash/times';

import { createSlice } from './slice';
import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { Exon } from 'src/content/app/entity-viewer/types/exon';
import { Slice } from 'src/content/app/entity-viewer/types/slice';
import { CDS } from 'src/content/app/entity-viewer/types/cds';
import { Translation } from 'src/content/app/entity-viewer/types/translation';
import { ProteinFeature } from 'src/content/app/entity-viewer/types/protein-feature';

export const createTranscript = (): Transcript => {
  const transcriptSlice = createSlice();

  return {
    type: 'Transcript',
    id: faker.random.uuid(),
    symbol: faker.lorem.word(),
    so_term: faker.lorem.word(),
    slice: transcriptSlice,
    exons: createExons(transcriptSlice),
    cds: createCDS(transcriptSlice),
    translation: createTranslation(transcriptSlice)
  };
};

const createTranslation = (transcriptSlice: Slice): Translation => {
  const { start, end } = getFeatureCoordinates({ slice: transcriptSlice });
  const length = faker.random.number({ min: 10, max: 100 });
  const numberOfExons = faker.random.number({ min: 1, max: 10 });
  const maxExonLength = Math.floor(length / numberOfExons);

  const protein_features = times(numberOfExons, (index: number) => {
    const minCoordinate = maxExonLength * index + 1;
    const maxCoordinate = maxExonLength * index + 1;
    const middleCoordinate =
      maxCoordinate - (maxCoordinate - minCoordinate) / 2;
    const start = faker.random.number({
      min: minCoordinate,
      max: middleCoordinate
    });
    const end = faker.random.number({
      min: middleCoordinate + 1,
      max: maxCoordinate - 1
    });

    return {
      description: faker.random.words(),
      start: start,
      id: faker.random.uuid(),
      type: faker.random.words(),
      end: end
    } as ProteinFeature;
  });

  return {
    id: faker.random.uuid(),
    start: start,
    length: length,
    end: end,
    protein_features: protein_features
  };
};

const createExons = (transcriptSlice: Slice): Exon[] => {
  const numberOfExons = faker.random.number({ min: 1, max: 10 });
  const maxExonLength = Math.floor(length / numberOfExons);

  return times(numberOfExons, (index: number) => {
    const minCoordinate = maxExonLength * index + 1;
    const maxCoordinate = maxExonLength * index + 1;
    const middleCoordinate =
      maxCoordinate - (maxCoordinate - minCoordinate) / 2;
    const start = faker.random.number({
      min: minCoordinate,
      max: middleCoordinate
    });
    const end = faker.random.number({
      min: middleCoordinate + 1,
      max: maxCoordinate - 1
    });
    const slice = {
      location: {
        start,
        end
      },
      region: transcriptSlice.region
    };

    return {
      id: faker.random.uuid(),
      slice,
      relative_location: {
        // <-- we are still not sure about this relative location thing
        start: 0,
        end: 0
      }
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
      end: 0
    }
  };
};
