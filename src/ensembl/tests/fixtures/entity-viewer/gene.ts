import faker from 'faker';
import times from 'lodash/times';
import { scaleLinear } from 'd3';

import { createSlice } from './slice';
import { createTranscript } from './transcript';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';

export const createGene = (fragment: Partial<Gene> = {}): Gene => {
  const geneSlice = createSlice();
  const transcript = createTranscript();

  return {
    type: 'Gene',
    id: faker.random.uuid(),
    symbol: faker.lorem.word(),
    so_term: faker.lorem.word(),
    slice: geneSlice,
    transcripts: [transcript],
    ...fragment
  };
};

const getScale = () => {
  const domain = [1000, faker.random.number({ min: 2000, max: 100000 })];
  const range = [100, faker.random.number({ min: 200, max: 600 })];
  const scale = scaleLinear()
    .domain(domain)
    .range(range);

  return scale;
};

export const createRulerTicks = (): TicksAndScale => ({
  labelledTicks: times(faker.random.number({ min: 1, max: 10 }), Number),
  ticks: times(faker.random.number({ min: 1, max: 5 }), Number),
  scale: getScale()
});
