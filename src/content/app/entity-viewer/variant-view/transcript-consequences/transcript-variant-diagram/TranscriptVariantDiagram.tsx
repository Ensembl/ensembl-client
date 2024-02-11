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

import React, { useState, useLayoutEffect, useRef } from 'react';
import { scaleLinear, interpolateRound } from 'd3';

import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';

import type { TranscriptConsequencesData } from '../useTranscriptConsequencesData';

import styles from './TranscriptVariantDiagram.module.css';

type Props = {
  gene: TranscriptConsequencesData['geneData'];
  transcript: TranscriptConsequencesData['transcriptData'];
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
    .range([1, width])
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

  // const verticalOffsetToTranscript = 20;

  const mockDistanceToStart = 5;

  return (
    <svg
      width={width}
      viewBox={`0 0 ${width} ${ELEMENT_HEIGHT}`}
      overflow="visible"
    >
      <GeneSegment width={mockDistanceToStart} side="left" />

      {distanceFromGeneStart >= 3 && (
        <GeneSegment width={distanceFromGeneStart} side="left" />
      )}

      {/* diagram of the transcript */}
      <g
        transform={`translate(${
          distanceFromGeneStart * mockDistanceToStart
        } 19.5)`}
      >
        <UnsplicedTranscript
          width={transcriptWidth}
          transcript={transcript}
          classNames={{
            transcript: styles.transcript
          }}
        />
      </g>

      {distanceToGeneEnd >= 3 && (
        <GeneSegment width={distanceToGeneEnd} side="right" />
      )}

      <VariantMark x={variantX} />
      <StrandEndLabels width={width} />
    </svg>
  );
};

// Pass the initial x-coordinate
const GeneSegment = (props: { width: number; side: 'left' | 'right' }) => {
  const { side, width } = props;

  if (props.width < 3) {
    // avoid colliding the start/end tick into an exon
    return null;
  }

  // const tickHeight = 7; // same as BLOCK_HEIGHT in UnsplicedTranscript

  const tickX = side === 'left' ? 0 : width;
  const tick = (
    <line className={styles.geneTick} x1={tickX} y1="16" x2={tickX} y2="24" />
  );

  return (
    <g>
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
        textAnchor="right"
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
