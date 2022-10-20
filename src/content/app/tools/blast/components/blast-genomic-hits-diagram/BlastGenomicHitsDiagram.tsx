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

import React from 'react';
import sortBy from 'lodash/sortBy';

import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import BlastGenomicRegionHeatmap from './BlastGenomicRegionHeatmap';

import type { BlastJobResult } from 'src/content/app/tools/blast/types/blastJob';

type Props = {
  genomeId: string;
  job: BlastJobResult;
  width: number;
  // isExpanded: boolean;
};

// sort all matches by evalue
// take the top five matches after sorting
// if collapsed, only showing the regions that include the top five matches
// if expanded, show all regions sorted by length (not necessarily having the top matches)
// hack? exclude patches from human genomic hits?

// NOTE: there may or may not be regions beyond the ones with the top five hits

const BlastGenomicHitsDiagram = (props: Props) => {
  const { genomeId, job, width } = props;
  const { currentData: genomeKaryotype } = useGenomeKaryotypeQuery(genomeId); // the karyotype data has properly sorted top-level sequences

  if (!genomeKaryotype) {
    return null;
  }

  const topMatches = getTopMatchesWithRegionNames(job);

  // For the compact view, select regions with top five matches, and deduplicate them
  const regionNamesForCompactView = new Set(
    topMatches.map(({ regionName }) => regionName)
  );
  const sortedRegionNamesForCompactView = genomeKaryotype
    .map(({ name }) => name)
    .filter((name) => regionNamesForCompactView.has(name));

  return (
    <div>
      {sortedRegionNamesForCompactView.map((name) => (
        <BlastGenomicRegionHeatmap
          key={name}
          job={job}
          width={width}
          regionName={name}
          topHits={topMatches.filter((match) => match.regionName === name)}
        />
      ))}
      <p></p>
    </div>
  );
};

// FIXME: will there be a problem with circular chromosomes?
const getTopMatchesWithRegionNames = (job: BlastJobResult) => {
  // order all hit_hsps by their e-value, and return regions containing the top five

  const hitHspsWithRegionName = job.hits.flatMap((hit) => {
    return hit.hit_hsps.map((hit_hsp) => ({
      start: Math.min(hit_hsp.hsp_hit_from, hit_hsp.hsp_hit_to),
      end: Math.max(hit_hsp.hsp_hit_from, hit_hsp.hsp_hit_to),
      eValue: hit_hsp.hsp_expect,
      regionName: hit.hit_acc
    }));
  });

  const sortedHsps = sortBy(hitHspsWithRegionName, 'eValue');

  return sortedHsps.slice(0, 5);
};

export default BlastGenomicHitsDiagram;
