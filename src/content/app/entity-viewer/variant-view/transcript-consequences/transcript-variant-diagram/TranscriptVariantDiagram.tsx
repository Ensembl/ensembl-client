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

import { useState, useLayoutEffect, useRef } from 'react';
import { scaleLinear, interpolateRound } from 'd3';

import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';

import type { TranscriptConsequencesData } from '../useTranscriptConsequencesData';
import type { TranscriptDetailsData } from '../useTranscriptDetails';

import styles from './TranscriptVariantDiagram.module.css';

type Props = {
  gene: TranscriptConsequencesData['geneData'][number];
  transcript: TranscriptDetailsData['transcriptData'];
  variant: TranscriptConsequencesData['variant'];
};

const TranscriptVariantDiagram = (props: Props) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const measuredContainerWidth =
      containerRef.current?.getBoundingClientRect().width ?? 0;
    setContainerWidth(measuredContainerWidth);
  }, []);

  return (
    <div ref={containerRef}>
      {!!containerWidth && <Diagram {...props} width={containerWidth} />}
    </div>
  );
};

const Diagram = (
  props: Props & {
    width: number;
  }
) => {
  const { width, gene, transcript, variant } = props;
  const {
    slice: {
      location: { start: geneStart, end: geneEnd, length: geneLength },
      strand: { code: strand }
    }
  } = gene;
  const {
    slice: {
      location: { start: variantStart, end: variantEnd }
    }
  } = variant;
  const ELEMENT_HEIGHT = 50;

  const scale = scaleLinear()
    .domain([1, geneLength])
    .range([0, width])
    .interpolate(interpolateRound)
    .clamp(true);

  const distanceFromGeneStart = scale(transcript.relative_location.start);
  const distanceToGeneEnd = scale(
    geneLength - transcript.relative_location.end
  );
  const variantRelativeStart =
    strand === 'forward' ? variantStart - geneStart : geneEnd - variantEnd;

  const transcriptWidth = width - distanceFromGeneStart - distanceToGeneEnd;
  const variantX = scale(variantRelativeStart);

  const shouldRenderLeftGeneSegment = transcript.relative_location.start !== 1;
  const shouldRenderRightGeneSegment =
    transcript.relative_location.start !== geneLength;

  return (
    <svg
      width={width}
      viewBox={`0 0 ${width} ${ELEMENT_HEIGHT}`}
      overflow="visible"
    >
      {shouldRenderLeftGeneSegment && (
        <GeneSegment width={distanceFromGeneStart} side="left" />
      )}

      {/* diagram of the transcript */}
      <g transform={`translate(${distanceFromGeneStart} 19.5)`}>
        <UnsplicedTranscript
          width={transcriptWidth}
          transcript={transcript}
          classNames={{
            transcript: styles.transcript
          }}
        />
      </g>

      {shouldRenderRightGeneSegment && (
        <GeneSegment
          width={distanceToGeneEnd}
          side="right"
          leftOffset={distanceFromGeneStart + transcriptWidth}
        />
      )}

      <VariantMark x={variantX} />
      <StrandEndLabels width={width} />
    </svg>
  );
};

const GeneSegment = (props: {
  width: number;
  side: 'left' | 'right';
  leftOffset?: number; // to know where to start drawing the right gene segment
}) => {
  const { side, width, leftOffset } = props;

  const tickX = side === 'left' ? 0 : width;
  const tick = (
    <line className={styles.geneTick} x1={tickX} y1="16" x2={tickX} y2="24" />
  );

  return (
    <g transform={leftOffset ? `translate(${leftOffset} 0)` : undefined}>
      {props.side === 'left' && tick}
      <line
        className={styles.geneLine}
        x1="0"
        y1="20"
        x2={`${width}`}
        y2="20"
      />
      {props.side === 'right' && tick}
    </g>
  );
};

const VariantMark = ({ x }: { x: number }) => {
  return (
    <>
      <line className={styles.variant} x1={x} y1="12" x2={x} y2="28" />
      <text className={styles.label} textAnchor="middle" x={x} y="45">
        Location in transcript
      </text>
    </>
  );
};

const StrandEndLabels = ({ width }: { width: number }) => {
  const startLabelX = 3;
  const endLabelX = width - 10;
  const labelY = 0;

  return (
    <>
      <text
        className={styles.label}
        x={startLabelX}
        y={labelY}
        dominantBaseline="hanging"
      >
        5'
      </text>
      <text
        className={styles.label}
        x={endLabelX}
        y={labelY}
        dominantBaseline="hanging"
      >
        3'
      </text>
    </>
  );
};

export default TranscriptVariantDiagram;
