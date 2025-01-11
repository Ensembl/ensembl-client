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

import { type ScaleLinear } from 'd3';

import { GENE_TRACK_HEIGHT } from '../regionOverviewImageConstants';

import type { GeneInRegionOverview } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';
import type { GeneTrack } from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';

/**
 * A transcription start site is represented by an L-shaped arrow,
 * whose stem starts in the same track as the gene it is related to,
 * and ascends (in the forward strand) or descends (in the reverse strand)
 * into a separate track.
 *
 * The data from the api will contain several genomic positions for the TSS.
 * It isn't yet clear how best to visually represent this; and whether it is
 * even worth representing, or it is sufficient to pick just one position from the array.
 *
 */

const VERTICAL_ARM_LENGTH = 12;
const HORIZONTAL_ARM_LENGTH = 6;
const ARROWHEAD_BASE_LENGTH = 6; // the base of the triangle that represents the arrowhead
const ARROWHEAD_HEIGHT = 6.75; // the height of the triangle that represents the arrowhead
const VERTICAL_OFFSET_FROM_GENE = 2;
const COLOR = 'black';

type Props = {
  tss: GeneInRegionOverview['tss']; // an array of genomic coordinates related to this transcription start site
  strand: 'forward' | 'reverse';
  scale: ScaleLinear<number, number>;
  geneTracks: GeneTrack[];
  trackIndex: number;
  trackOffsetsTop: number[];
};

const TranscriptionStartSites = (props: Props) => {
  const preparedTss = prepareTssData(props);

  return preparedTss.map((site) => (
    <TranscriptionStartSite {...props} site={site} key={site.position} />
  ));
};

const TranscriptionStartSite = (
  props: Props & { site: ReturnType<typeof prepareTssData>[number] }
) => {
  const { strand, site } = props;
  const { yStart, yEnd, x, isOverlapping } = site;

  const stemX = x;
  const armEndX =
    strand === 'forward'
      ? stemX + HORIZONTAL_ARM_LENGTH
      : stemX - HORIZONTAL_ARM_LENGTH;
  const arrowheadPointX =
    strand === 'forward'
      ? armEndX + ARROWHEAD_HEIGHT
      : armEndX - ARROWHEAD_HEIGHT;

  const arrowheadBaseBottomCoords = `${armEndX}, ${yEnd - ARROWHEAD_BASE_LENGTH / 2}`;
  const arrowheadBaseTopCoords = `${armEndX}, ${yEnd + ARROWHEAD_BASE_LENGTH / 2}`;
  const arrowheadPointCoords = `${arrowheadPointX}, ${yEnd}`;

  return (
    <g data-name="transcription start site">
      <line
        x1={stemX}
        x2={stemX}
        y1={yStart}
        y2={yEnd}
        stroke={COLOR}
        strokeWidth="1"
      />
      <line
        x1={stemX}
        x2={armEndX}
        y1={yEnd}
        y2={yEnd}
        stroke={COLOR}
        strokeWidth="1"
      />
      {isOverlapping ? (
        <line
          x1={armEndX}
          x2={arrowheadPointX}
          y1={yEnd}
          y2={yEnd}
          stroke={COLOR}
          strokeWidth="1"
        />
      ) : (
        <polygon
          points={`${arrowheadBaseBottomCoords} ${arrowheadPointCoords} ${arrowheadBaseTopCoords}`}
        />
      )}
    </g>
  );
};

const prepareTssData = ({
  tss,
  geneTracks,
  trackIndex,
  trackOffsetsTop,
  strand,
  scale
}: Props) => {
  const minDistanceBetweenTss = 2;

  // Iterate over transcript start sites, and merge together the ones whose genomic coordinates
  //  are too close together to be resolved at the given scale
  let mergedTss: Array<{ position: number; x: number; count: number }> = [];
  let lastX = -Infinity;

  for (const site of tss) {
    const x = scale(site.position);
    if (x - lastX < minDistanceBetweenTss) {
      const lastPreparedTss = mergedTss.at(-1);
      if (!lastPreparedTss) {
        mergedTss.push({
          position: site.position,
          x,
          count: 1
        });
        lastX = x;
      } else {
        lastPreparedTss.count += 1;
      }
    } else {
      mergedTss.push({
        position: site.position,
        x,
        count: 1
      });
      lastX = x;
    }
  }

  const yStart = getYStart({
    geneTracks,
    trackIndex,
    trackOffsetsTop,
    tssList: mergedTss,
    strand,
    scale
  });

  // Take another pass over the TSSs, and check whether the drawing of one TSS
  // will overlap with the neighbour TSS.
  // If they overlap, then do not draw the arrowhead on the earlier TSS
  // (the one on the left if on the forward strand, and the one on the right if on the reverse strand)
  const preparedTss: Array<{
    position: number;
    x: number;
    yStart: number;
    yEnd: number;
    count: number;
    isOverlapping: boolean;
  }> = [];
  if (strand === 'forward') {
    mergedTss = mergedTss.reverse();
  }

  for (const site of mergedTss) {
    const previousTss = preparedTss.at(-1);

    if (!previousTss) {
      preparedTss.push({
        ...site,
        yStart,
        yEnd:
          strand === 'forward'
            ? yStart - VERTICAL_ARM_LENGTH
            : yStart + VERTICAL_ARM_LENGTH,
        isOverlapping: false
      });

      continue;
    }

    const expectedWidth = HORIZONTAL_ARM_LENGTH + ARROWHEAD_HEIGHT + 1;
    const expectedXEnd =
      strand === 'forward' ? site.x + expectedWidth : site.x - expectedWidth;
    const isOperlappingWithPreviousSite =
      strand === 'forward'
        ? previousTss.x <= expectedXEnd
        : previousTss.x >= expectedXEnd;

    const newTss = {
      ...site,
      yStart: previousTss.yStart,
      yEnd:
        strand === 'forward'
          ? yStart - VERTICAL_ARM_LENGTH
          : yStart + VERTICAL_ARM_LENGTH,
      isOverlapping: isOperlappingWithPreviousSite
    };

    preparedTss.push(newTss);
  }

  return preparedTss;
};

// A TSS is to be drawn slightly above the gene (if on the forward stand)
// or slightly below the gene (if on the reverse strand).
// If several genes are competing for the same space (and drawn on top of one another, in separate tracks)
// then TSS should be drawn slightly above the last gene track on the forward strand
// or slightly below the last gene track on the reverse strand.
const getYStart = ({
  geneTracks,
  trackIndex,
  trackOffsetsTop,
  tssList,
  strand,
  scale
}: {
  tssList: Array<{ x: number }>;
  geneTracks: Props['geneTracks'];
  trackIndex: Props['trackIndex'];
  trackOffsetsTop: Props['trackOffsetsTop'];
  strand: Props['strand'];
  scale: Props['scale'];
}) => {
  const tracksWithPossiblyOverlappingGenes = geneTracks.slice(trackIndex + 1);

  if (tracksWithPossiblyOverlappingGenes.length === 0) {
    return strand === 'forward'
      ? trackOffsetsTop[trackIndex] - VERTICAL_OFFSET_FROM_GENE
      : trackOffsetsTop[trackIndex] +
          GENE_TRACK_HEIGHT +
          VERTICAL_OFFSET_FROM_GENE;
  }

  let trackShiftCount = 0;

  for (const track of tracksWithPossiblyOverlappingGenes) {
    for (const gene of track) {
      const geneStartX = scale(gene.data.start);
      const geneEndX = scale(gene.data.end);

      let hasOverlap = false;

      for (const tss of tssList) {
        if (tss.x >= geneStartX && tss.x <= geneEndX) {
          hasOverlap = true;
          break;
        }
      }

      if (hasOverlap) {
        trackShiftCount++;
        break;
      }
    }
  }

  const adjustedTrackIndex =
    strand === 'forward'
      ? Math.max(trackIndex - trackShiftCount, 0)
      : Math.min(trackIndex + trackShiftCount, trackOffsetsTop.length - 1);
  const yStart =
    strand === 'forward'
      ? trackOffsetsTop[adjustedTrackIndex] - VERTICAL_OFFSET_FROM_GENE
      : trackOffsetsTop[adjustedTrackIndex] +
        GENE_TRACK_HEIGHT +
        VERTICAL_OFFSET_FROM_GENE;

  return yStart;
};

export default TranscriptionStartSites;
