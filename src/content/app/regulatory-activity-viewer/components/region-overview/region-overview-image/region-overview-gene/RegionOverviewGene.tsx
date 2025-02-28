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

import { useState, type MouseEvent } from 'react';
import type { ScaleLinear } from 'd3';

import { GENE_HEIGHT } from 'src/content/app/regulatory-activity-viewer/components/region-overview/region-overview-image/regionOverviewImageConstants';

import ActivityViewerPopup from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-popup/ActivityViewerPopup';
import GenePopupContent from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-popup/GenePopupContent';

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';
import type { GeneInTrack } from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';
import type {
  ExonInRegionOverview,
  OverlappingCDSFragment
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './RegionOverviewGene.module.css';

/**
 * The transcript diagram is visually similar to a transcript diagram in EntityViewer.
 * However:
 *  - Data shape is going to be different (exons instead of spliced exons; multiple cds fragments)
 *  - Transcript might need to be cropped if it intersects a gap in the image
 *    - Consider svg clipPath
 */

type Props = {
  scale: ScaleLinear<number, number>;
  gene: GeneInTrack;
  regionData: Pick<OverviewRegion, 'region_name'>;
  offsetTop: number;
  isFocused: boolean;
  onClick: (geneId: string) => void;
};

type Intron = {
  start: number;
  end: number;
};

type PopupCoordinates = {
  x: number;
  y: number;
};

const RegionOverviewGene = (props: Props) => {
  const { gene, regionData, scale, offsetTop, isFocused } = props;
  const [popupCoordinates, setPopupCoordinates] =
    useState<PopupCoordinates | null>(null);
  const color = isFocused ? 'black' : '#0099ff'; // <-- This is our design system blue; see if it can be imported

  const onClick = (event: MouseEvent<Element>) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    setPopupCoordinates({ x, y });
  };

  const closePopup = () => {
    setPopupCoordinates(null);
  };

  const onGeneFocus = () => {
    props.onClick(gene.data.stable_id);
    closePopup();
  };

  const trackY = offsetTop;

  const { merged_exons } = gene.data;
  const introns: Intron[] = [];

  for (let i = 1; i < merged_exons.length; i++) {
    const prevExon = merged_exons[i - 1];
    const currentExon = merged_exons[i];
    const start = prevExon.end;
    const end = currentExon.start;

    introns.push({ start, end });
  }

  return (
    <g data-name="gene" data-symbol={gene.data.symbol}>
      <Exons exons={merged_exons} trackY={trackY} scale={scale} color={color} />
      <CDSBlocks
        cdsFragments={gene.data.cds_counts}
        trackY={trackY}
        scale={scale}
        color={color}
      />
      <Introns introns={introns} trackY={trackY} scale={scale} color={color} />
      <InteractiveArea
        {...props}
        onClick={onClick}
        start={gene.data.start}
        end={gene.data.end}
      />
      {popupCoordinates && (
        <ActivityViewerPopup
          x={popupCoordinates.x}
          y={popupCoordinates.y}
          onClose={closePopup}
        >
          <GenePopupContent
            gene={{
              ...gene.data,
              region_name: regionData.region_name
            }}
            onFocus={onGeneFocus}
          />
        </ActivityViewerPopup>
      )}
    </g>
  );
};

const Exons = (props: {
  exons: ExonInRegionOverview[];
  trackY: number;
  scale: ScaleLinear<number, number>;
  color: string;
}) => {
  const { exons, trackY, scale, color } = props;

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
  color: string;
}) => {
  const { cdsFragments, trackY, scale, color } = props;

  return cdsFragments.map((fragment) => {
    const left = scale(fragment.start);
    const right = scale(fragment.end);
    const width = right - left;

    if (!width) {
      return null;
    }

    const opacity = fragment.count;

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
        opacity={opacity}
      />
    );
  });
};

const Introns = (props: {
  introns: Intron[];
  trackY: number;
  scale: ScaleLinear<number, number>;
  color: string;
}) => {
  const { introns, trackY, scale, color } = props;

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

const InteractiveArea = (props: {
  gene: Props['gene'];
  offsetTop: Props['offsetTop'];
  scale: Props['scale'];
  start: number;
  end: number;
  onClick: (event: MouseEvent<Element>) => void;
}) => {
  const { gene, offsetTop, scale } = props;
  const { start, end } = gene.data;
  const x = scale(start);
  const width = scale(end) - scale(start);
  const y = offsetTop;
  const height = GENE_HEIGHT;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={'transparent'}
      onClick={props.onClick}
      className={styles.interactiveArea}
    />
  );
};

export default RegionOverviewGene;
