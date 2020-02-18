import faker from 'faker';
import times from 'lodash/times';

import { createSlice } from './slice';
import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { Exon } from 'src/content/app/entity-viewer/types/exon';
import { Slice } from 'src/content/app/entity-viewer/types/slice';
import { CDS } from 'src/content/app/entity-viewer/types/cds';

export const createTranscript = (): Transcript => {
  const transcriptSlice = createSlice();

  return {
    type: 'Transcript',
    id: faker.random.uuid(),
    symbol: faker.lorem.word(),
    so_term: faker.lorem.word(),
    slice: transcriptSlice,
    exons: createExons(transcriptSlice),
    cds: createCDS(transcriptSlice)
  };
};

const createExons = (transcriptSlice: Slice): Exon[] => {
  const { start, end } = getFeatureCoordinates({ slice: transcriptSlice });
  const length = end - start;
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
