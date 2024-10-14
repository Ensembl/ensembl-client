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

import type { ScaleLinear } from 'd3';

import type { GeneInTrack } from 'src/content/app/regulatory-activity-viewer/components/region-overview/prepareRegionOverviewGeneTracks';
import type {
  ExonInRegionOverview,
  OverlappingCDSFragment
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

/**
 * This gene diagram combines all exons from all transcripts of a gene
 * (the regulation api calls them "merged_exons" and "cds_counts")
 */

// TODO: move to a constants file?
const GENE_HEIGHT = 8;

type Props = {
  scale: ScaleLinear<number, number>;
  gene: GeneInTrack;
  offsetTop: number;
};

type Intron = {
  start: number;
  end: number;
};

const ActivitySectionGene = (props: Props) => {
  const { gene, scale, offsetTop } = props;

  const trackY = offsetTop;

  const introns: Intron[] = [];
  const { merged_exons } = gene.data;

  for (let i = 1; i < merged_exons.length; i++) {
    const prevExon = merged_exons[i - 1];
    const currentExon = merged_exons[i];
    const start = prevExon.end + 1;
    const end = currentExon.start - 1;

    introns.push({ start, end });
  }

  return (
    <g data-name="gene" data-symbol={gene.data.symbol}>
      <Exons exons={gene.data.merged_exons} trackY={trackY} scale={scale} />
      <CDSBlocks
        cdsFragments={gene.data.cds_counts}
        trackY={trackY}
        scale={scale}
      />
      <Introns introns={introns} trackY={trackY} scale={scale} />
    </g>
  );
};

const Exons = (props: {
  exons: ExonInRegionOverview[];
  trackY: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { exons, trackY, scale } = props;

  const color = '#d3d5d9';

  return exons.map((exon) => {
    const left = scale(exon.start);
    const right = scale(exon.end);
    const width = Math.max(right - left, 0.2);

    return (
      <rect
        x={left}
        y={trackY}
        width={width}
        height={GENE_HEIGHT}
        fill="none"
        stroke={color}
        data-start={exon.start}
        data-end={exon.end}
        data-start-scaled={scale(exon.start)}
        data-end-scaled={scale(exon.end)}
        key={exon.start}
      />
    );
  });
};

const CDSBlocks = (props: {
  cdsFragments: OverlappingCDSFragment[];
  trackY: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { cdsFragments, trackY, scale } = props;

  // const color = '#d3d5d9';

  return cdsFragments.map((fragment) => {
    const left = scale(fragment.start);
    const right = scale(fragment.end);
    const width = right - left;

    if (!width) {
      return null;
    }

    const alpha = Math.max(0.2, Math.min(fragment.count / 10), 1);

    const color = `rgba(85, 85, 85, ${alpha})`;

    return (
      <rect
        x={left}
        y={trackY}
        width={width}
        height={GENE_HEIGHT}
        fill={color}
        data-start={fragment.start}
        data-end={fragment.end}
        data-start-scaled={scale(fragment.start)}
        data-end-scaled={scale(fragment.end)}
        key={fragment.start}
      />
    );
  });
};

const Introns = (props: {
  introns: Intron[];
  trackY: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { introns, trackY, scale } = props;

  const color = '#d3d5d9';

  return introns.map((intron) => {
    const y = trackY + GENE_HEIGHT / 2;

    const x1 = scale(intron.start);
    const x2 = scale(intron.end);

    return (
      <line
        x1={x1}
        x2={x2}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth="1"
        key={intron.start}
      />
    );
  });
};

export default ActivitySectionGene;
