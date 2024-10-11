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
  CDSFragment
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

/**
 * The transcript diagram is visually similar to a transcript diagram in EntityViewer.
 * However:
 *  - Data shape is going to be different (exons instead of spliced exons; multiple cds fragments)
 *  - Transcript might need to be cropped if it intersects a gap in the image
 *    - Consider svg clipPath
 */

const GENE_HEIGHT = 6;

type Props = {
  scale: ScaleLinear<number, number>;
  gene: GeneInTrack;
  offsetTop: number;
  trackIndex: number;
};

type Intron = {
  start: number;
  end: number;
};

const RegionOverviewGene = (props: Props) => {
  const { gene, scale, offsetTop } = props;
  const transcript = gene.data.representative_transcript;

  const trackY = offsetTop;

  const introns: Intron[] = [];

  for (let i = 1; i < transcript.exons.length; i++) {
    const prevExon = transcript.exons[i - 1];
    const currentExon = transcript.exons[i];
    const start = prevExon.end + 1;
    const end = currentExon.start - 1;

    introns.push({ start, end });
  }

  return (
    <g data-name="gene" data-symbol={gene.data.symbol}>
      <Exons exons={transcript.exons} trackY={trackY} scale={scale} />
      <CDSBlocks cdsFragments={transcript.cds} trackY={trackY} scale={scale} />
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
        stroke="black"
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
  cdsFragments: CDSFragment[];
  trackY: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { cdsFragments, trackY, scale } = props;

  return cdsFragments.map((fragment) => {
    const left = scale(fragment.start);
    const right = scale(fragment.end);
    const width = right - left;

    if (!width) {
      return null;
    }

    return (
      <rect
        x={left}
        y={trackY}
        width={width}
        height={GENE_HEIGHT}
        fill="black"
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
        stroke="black"
        strokeWidth="1"
        key={intron.start}
      />
    );
  });
};

export default RegionOverviewGene;
