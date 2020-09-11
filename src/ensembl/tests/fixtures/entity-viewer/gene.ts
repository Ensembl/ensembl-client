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
    version: 1,
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
  const scale = scaleLinear().domain(domain).range(range);

  return scale;
};

export const createRulerTicks = (): TicksAndScale => ({
  labelledTicks: times(faker.random.number({ min: 1, max: 10 }), Number),
  ticks: times(faker.random.number({ min: 1, max: 5 }), Number),
  scale: getScale()
});
