import faker from 'faker';
import times from 'lodash/times';
import { scaleLinear } from 'd3';

import { createSlice } from './slice';
import { createTranscript } from './transcript';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';

export const createGene = (): Gene => {
  const geneSlice = createSlice();
  const transcript = createTranscript();

  return {
    type: 'Gene',
    id: faker.random.uuid(),
    symbol: faker.lorem.word(),
    so_term: faker.lorem.word(),
    slice: geneSlice,
    transcripts: [transcript]
  };
};

const getScale = () => {
  const domain = [1, faker.random.number()];
  const range = [0, faker.random.number()];
  const scale = scaleLinear()
    .domain(domain)
    .range(range);

  return scale;
};

export const createRulerTicks = (): TicksAndScale => ({
  labelledTicks: times(faker.random.number(), Number),
  ticks: times(faker.random.number(), Number),
  scale: getScale()
});
