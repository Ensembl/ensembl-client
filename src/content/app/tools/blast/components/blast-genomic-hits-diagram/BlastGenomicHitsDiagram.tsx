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

import { useState } from 'react';

import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import BlastGenomicRegionHeatmap from './BlastGenomicRegionHeatmap';
import RegionWithoutMatches from './BlastGenomicRegionWithoutMatches';
import PillButton from 'src/shared/components/pill-button/PillButton';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import type { BlastHit } from 'src/content/app/tools/blast/types/blastJob';

import styles from './BlastGenomicHitsDiagram.module.css';

type Props = {
  genomeId: string;
  hits: BlastHit[];
  topMatches: {
    start: number;
    end: number;
    regionName: string;
  }[];
  width: number;
};

const BlastGenomicHitsDiagram = (props: Props) => {
  const { genomeId, hits, topMatches, width } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentData: genomeKaryotype } = useGenomeKaryotypeQuery(genomeId); // the karyotype data has properly sorted top-level sequences

  if (!genomeKaryotype) {
    return null;
  }

  // For the compact view, select regions with top five matches, and deduplicate them
  const regionNamesForCompactView = new Set(
    topMatches.map(({ regionName }) => regionName)
  );
  const sortedRegionNamesForCompactView = genomeKaryotype
    .map(({ name }) => name)
    .filter((name) => regionNamesForCompactView.has(name));

  const regionNamesForExpandedView = new Set(hits.map((hit) => hit.hit_acc));
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
          hits={hits}
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

export default BlastGenomicHitsDiagram;
