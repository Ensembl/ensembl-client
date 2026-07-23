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

import { checkNeedToUpdateGenomes } from './genomeValidators';

import {
  human1,
  human2,
  human3
} from 'tests/fixtures/genome-validation/storedGenomes';
import {
  fetchedHuman1,
  fetchedHuman1WithLatestGenome,
  fetchedHuman2,
  fetchedHuman3
} from 'tests/fixtures/genome-validation/fetchedGenomes';

import { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

describe('checkNeedToUpdateGenomes', () => {
  test('nothing needs updating', () => {
    const localGenomes = [human1, human2, human3];
    const fetchedGenomes = [fetchedHuman1, fetchedHuman2, fetchedHuman3];

    const checkResult = checkNeedToUpdateGenomes({
      localGenomes,
      referenceGenomes: fetchedGenomes
    });

    expect(checkResult.shouldUpdateGenomes).toBe(false);
  });

  test('a stored genome is deprecated', () => {
    // testing migration from human1 to the latest_genome on fetchedHuman1
    const localGenomes = [human1, human2];
    const fetchedGenomes = [fetchedHuman1WithLatestGenome, fetchedHuman2];

    const checkResult = checkNeedToUpdateGenomes({
      localGenomes,
      referenceGenomes: fetchedGenomes
    });

    expect(checkResult.shouldUpdateGenomes).toBe(true);
    expect(checkResult.genomeIdsToDelete.size).toBe(1);
    expect(checkResult.genomeIdsToDelete.has(human1.genome_id)).toBe(true);

    expect(checkResult.genomes.map(({ genome_id }) => genome_id)).toEqual([
      fetchedHuman1WithLatestGenome.latest_genome.genome_id,
      human2.genome_id
    ]);
  });

  test('a partial genome became integrated', () => {
    const integratedRelease = {
      name: '2026-09',
      type: 'integrated'
    } as const;
    const localGenomes = [human2, human3];
    const fetchedGenomes = [
      fetchedHuman2,
      {
        ...fetchedHuman3,
        genome_tag: human1.genome_tag,
        is_reference: true,
        release: integratedRelease
      }
    ] satisfies BriefGenomeSummary[];

    const checkResult = checkNeedToUpdateGenomes({
      localGenomes,
      referenceGenomes: fetchedGenomes
    });

    expect(checkResult.shouldUpdateGenomes).toBe(true);
    expect(checkResult.genomeIdsToDelete.size).toBe(0);
    expect(checkResult.genomes.length).toBe(2);

    expect(checkResult.genomes[0]).toEqual(human2);

    const updatedHuman = checkResult.genomes[1];
    expect(updatedHuman.release).toEqual(integratedRelease);
    expect(updatedHuman.genome_tag).toBe(human1.genome_tag);
    expect(updatedHuman.is_reference).toBe(true);
  });
});
