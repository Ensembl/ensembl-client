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

import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import type {
  BlastJobResult,
  BlastHit
} from 'src/content/app/tools/blast/types/blastJob';
import type { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';

/**
 * The purpose of this hook is to be used when displaying results of a BLAST search
 * run against the genomic DNA (i.e. the hits will be top-level genomic regions).
 * The hook separates BLAST hits that matched chromosomes from the rest of the hits.
 */
const useGroupedBlastHits = (params: {
  genomeId: string;
  job: BlastJobResult;
}) => {
  const { genomeId, job } = params;
  const {
    currentData: genomeKaryotype,
    isFetching,
    isError
  } = useGenomeKaryotypeQuery(genomeId); // the karyotype data has properly sorted top-level sequences

  if (!genomeKaryotype) {
    return {
      currentData: undefined,
      isFetching,
      isError
    };
  }

  /**
   * If no chromosomeHits and no nonChromosomeHits, output 0 hits
   * If chromosomeHits and no nonChromosomeHits, output only chromosome hits
   * If no chromosomeHits, but some nonChromosomeHits, output only nonChromosomeHits
   */

  const { chromosomeHits, nonChromosomeHits } = partitionBlastHits({
    karyotype: genomeKaryotype,
    job
  });
  const topMatches = getTopMatches(chromosomeHits);

  return {
    currentData: {
      chromosomeHits,
      nonChromosomeHits,
      topMatches
    },
    isFetching,
    isError
  };
};

/**
 * Separate BLAST hits into the ones that occurred on chromosomes
 * (as defined by whatever our apis include in the "karyotype" response),
 * and the rest.
 *
 * Only the hits against chromosomes will be drawn in the diagram.
 */
const partitionBlastHits = ({
  karyotype,
  job
}: {
  karyotype: GenomeKaryotypeItem[];
  job: BlastJobResult;
}) => {
  const chromosomeNames = new Set(karyotype.map((item) => item.name));
  const chromosomeHits: BlastHit[] = [];
  const nonChromosomeHits: BlastHit[] = [];

  for (const hit of job.hits) {
    if (chromosomeNames.has(hit.hit_acc)) {
      chromosomeHits.push(hit);
    } else {
      nonChromosomeHits.push(hit);
    }
  }

  return {
    chromosomeHits,
    nonChromosomeHits
  };
};

/**
 * Compact view shows regions with top five BLAST matches, according to eValue
 * (the smaller the eValue, the better the match)
 */
const getTopMatches = (hits: BlastHit[]) => {
  const sortedHsps = hits
    .flatMap((hit) => {
      return hit.hit_hsps.map((hit_hsp) => ({
        start: Math.min(hit_hsp.hsp_hit_from, hit_hsp.hsp_hit_to),
        end: Math.max(hit_hsp.hsp_hit_from, hit_hsp.hsp_hit_to),
        eValue: hit_hsp.hsp_expect,
        regionName: hit.hit_acc
      }));
    })
    .toSorted((hitA, hitB) => hitA.eValue - hitB.eValue);

  return sortedHsps.slice(0, 5);
};

export default useGroupedBlastHits;
