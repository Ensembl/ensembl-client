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
import {
  isBlastFormValid,
  BLAST_SPECIES_LIMIT,
  BLAST_SEQUENCE_LIMIT
} from '../blastFormValidator';

const createFakeSpecies = (times: number) => {
  return Array(times).fill(faker.datatype.uuid());
};

const createFakeSequences = (times: number) => {
  return Array(times).fill({
    value: 'ACTG'
  });
};

describe('isBlastFormValid', () => {
  it('fails validation if the number of species more than the limit', () => {
    const species = createFakeSpecies(BLAST_SPECIES_LIMIT + 1);
    const sequences = createFakeSequences(1);

    expect(isBlastFormValid(species, sequences)).toBe(false);
  });

  it('fails validation if the number of sequences is more than the limit', () => {
    const species = createFakeSpecies(1);
    const sequences = createFakeSequences(BLAST_SEQUENCE_LIMIT + 1);

    expect(isBlastFormValid(species, sequences)).toBe(false);
  });

  it('fails validation if there is at least one species and one sequence', () => {
    let species = createFakeSpecies(1);
    let sequences = createFakeSequences(0);

    expect(isBlastFormValid(species, sequences)).toBe(false);

    species = createFakeSpecies(0);
    sequences = createFakeSequences(1);

    expect(isBlastFormValid(species, sequences)).toBe(false);
  });

  it('passes validation if the correct number of species and sequence', () => {
    const species = createFakeSpecies(1);
    const sequences = createFakeSequences(1);

    expect(isBlastFormValid(species, sequences)).toBe(true);
  });
});
