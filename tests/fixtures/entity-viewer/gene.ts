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
import times from 'lodash/times';
import { scaleLinear } from 'd3';

import { createSlice } from './slice';
import {
  createProteinCodingTranscript,
  ProteinCodingTranscript
} from './transcript';

import type { FullGene } from 'src/shared/types/core-api/gene';
import type { TicksAndScale } from 'src/shared/components/feature-length-ruler/FeatureLengthRuler';

type GeneFixture = Omit<FullGene, 'transcripts'> & {
  transcripts: ProteinCodingTranscript[];
};

export const createGene = (
  fragment: Partial<GeneFixture> = {}
): GeneFixture => {
  const geneSlice = createSlice();
  const transcripts = fragment.transcripts || [createProteinCodingTranscript()];

  const unversionedStableId = faker.string.uuid();
  const version = 1;
  const stableId = `${unversionedStableId}.${version}`;

  return {
    type: 'Gene',
    stable_id: stableId,
    unversioned_stable_id: unversionedStableId,
    version,
    symbol: faker.lorem.word(),
    name: faker.lorem.words(),
    slice: geneSlice,
    transcripts,
    alternative_symbols: [],
    external_references: [],
    metadata: {
      biotype: {
        label: faker.lorem.words(),
        value: faker.lorem.word(),
        definition: faker.lorem.sentence()
      },
      name: {
        accession_id: faker.lorem.word(),
        url: faker.internet.url()
      }
    },
    ...fragment
  };
};

const getScale = () => {
  const domain = [1000, faker.number.int({ min: 2000, max: 100000 })];
  const range = [100, faker.number.int({ min: 200, max: 600 })];
  const scale = scaleLinear().domain(domain).rangeRound(range);

  return scale;
};

export const createRulerTicks = (): TicksAndScale => ({
  labelledTicks: times(faker.number.int({ min: 1, max: 10 }), Number),
  ticks: times(faker.number.int({ min: 1, max: 5 }), Number),
  scale: getScale()
});
