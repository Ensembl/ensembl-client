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

/**
  Design guidelines from Andrea:

  shorter arrow
  height: 12
  horizontal: 6

  arrowhead:
  base 6
  height: 6.75



  longer arrow
  height: 19


  distance between: 1?


  distance from gene: 5


(1)  where no genes, bottom of down stroke at same level as intron stroke for lane 1 of genes
(2)  where any part of arrow or down stroke sits over a gene, bottom of down stroke 3px above equivalent of top edge of exons for the the gene directly below
(3)  multiple tss site count, align bottom of brackets with bottom of arrow
below the line, invert the above


Plan:
- Make a single pass over all TSSs, and calculate their start coordinate (scaled to image coordinates)
  - Merge TSSs that are less than a minimum distance apart (say, 1px), recording the count of merged TSSs
- There will be a difference in the positioning depending on whether this is a forward or a reverse strand
  - For forward strand, start from the TSS closest to the end, and go backwards
  - For reverse strand, start from the TSS closest to the start, and go forwards
- Keep track of the x coordinate of the "end" of the previous TSS
  - On forward strand, this is closer to the end of the gene
  - On reverse strand, this is closer to the start of the gene
  - TSS end is the coordinate of the tip of the arrow, plus the width of the number (merged TSS count) if present
 */

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
  const { yStart, yEnd, x, count } = site;

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

  const countLabelX =
    strand === 'forward' ? arrowheadPointX + 1 : arrowheadPointX - 1;
  const countLabelY = yEnd;
  const countLabelTextAnchor = strand === 'forward' ? 'start' : 'end';
  const countLabelAlignmentBaseline = strand === 'forward' ? 'auto' : 'hanging';

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
      <polygon
        points={`${arrowheadBaseBottomCoords} ${arrowheadPointCoords} ${arrowheadBaseTopCoords}`}
      />
      {count > 1 && (
        <text
          x={countLabelX}
          y={countLabelY}
          textAnchor={countLabelTextAnchor}
          alignmentBaseline={countLabelAlignmentBaseline}
          fontSize={12}
          fontWeight="lighter"
          fontStyle="italic"
        >
          ({count})
        </text>
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
      } else {
        lastPreparedTss.count += 1;
      }
    } else {
      mergedTss.push({
        position: site.position,
        x,
        count: 1
      });
    }
    lastX = x;
  }

  const yStart = getYStart({
    geneTracks,
    trackIndex,
    trackOffsetsTop,
    tssList: mergedTss,
    strand,
    scale
  });

  const preparedTss: Array<{
    position: number;
    x: number;
    yStart: number;
    yEnd: number;
    count: number;
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
            : yStart + VERTICAL_ARM_LENGTH
      });

      continue;
    }

    const expectedWidth =
      site.count > 1
        ? HORIZONTAL_ARM_LENGTH + ARROWHEAD_HEIGHT + 5
        : HORIZONTAL_ARM_LENGTH + ARROWHEAD_HEIGHT;
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
          : yStart + VERTICAL_ARM_LENGTH
    };

    if (isOperlappingWithPreviousSite) {
      const yEndPrevious = previousTss.yEnd;
      // FIXME: use a named constant for added y distance
      const overshootDistance = 7;
      const yEndCurrent =
        strand === 'forward'
          ? yEndPrevious - overshootDistance
          : yEndPrevious + overshootDistance;

      newTss.yEnd = yEndCurrent;
    }

    preparedTss.push(newTss);
  }

  return preparedTss;
};

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
      ? Math.min(trackIndex - trackShiftCount, 0)
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
