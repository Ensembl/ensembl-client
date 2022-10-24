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

import React, { useState } from 'react';
import sortBy from 'lodash/sortBy';

import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import BlastGenomicRegionHeatmap from './BlastGenomicRegionHeatmap';
import RegionWithoutMatches from './BlastGenomicRegionWithoutMatches';
import PillButton from 'src/shared/components/pill-button/PillButton';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import type { BlastJobResult } from 'src/content/app/tools/blast/types/blastJob';

import styles from './BlastGenomicHitsDiagram.scss';

type Props = {
  genomeId: string;
  job: BlastJobResult;
  width: number;
};

const BlastGenomicHitsDiagram = (props: Props) => {
  const { genomeId, job, width } = props;
  const [isExpanded, setIsExpanded] = useState(false);
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

  const regionNamesForExpandedView = new Set(
    job.hits.map((hit) => hit.hit_acc)
  );
  const sortedRegionNamesForExpandedView = genomeKaryotype
    .map(({ name }) => name)
    .filter((name) => regionNamesForExpandedView.has(name));

  const remainderToExpandedRegionNamesList =
    sortedRegionNamesForExpandedView.length -
    sortedRegionNamesForCompactView.length;

  const regionNamesForDisplay = isExpanded
    ? sortedRegionNamesForExpandedView
    : sortedRegionNamesForCompactView;

  if (!regionNamesForDisplay.length) {
    return <RegionWithoutMatches width={width} />;
  }

  return (
    <div>
      {regionNamesForDisplay.map((name) => (
        <BlastGenomicRegionHeatmap
          key={name}
          job={job}
          width={width}
          regionName={name}
          topHits={topMatches.filter((match) => match.regionName === name)}
        />
      ))}
      <RegionsExpandToggle
        count={remainderToExpandedRegionNamesList}
        isExpanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      />
    </div>
  );
};

const RegionsExpandToggle = (props: {
  count: number;
  onClick: () => void;
  isExpanded: boolean;
}) => {
  const { count, onClick, isExpanded } = props;
  const isCollapsed = !isExpanded;

  if (!count) {
    return null;
  }

  return (
    <div className={styles.regionsExpandToggle}>
      {isCollapsed ? (
        <>
          <span>Other regions with hits</span>
          <PillButton onClick={onClick}>+{count}</PillButton>
        </>
      ) : (
        <CloseButton onClick={onClick} />
      )}
    </div>
  );
};

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
