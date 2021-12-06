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

import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';
import { Pick2, Pick3 } from 'ts-multipick';

import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { SplicedExon } from 'src/shared/types/thoas/exon';
import { FullCDS } from 'src/shared/types/thoas/cds';

import styles from './UnsplicedTranscript.scss';

const BLOCK_HEIGHT = 7;

type ProductGeneratingContext = {
  cds: Pick<FullCDS, 'relative_start' | 'relative_end'> | null;
};
type Transcript = {
  spliced_exons: Array<
    Pick2<SplicedExon, 'relative_location', 'start' | 'end'>
  >;
  product_generating_contexts: ProductGeneratingContext[];
} & Pick3<FullTranscript, 'slice', 'location', 'length'>;

export type UnsplicedTranscriptProps = {
  transcript: Transcript;
  width: number; // available width for drawing, in pixels
  classNames?: {
    transcript?: string;
    backbone?: string;
    exon?: string;
  };
  standalone: boolean;
};

/*
NOTE:
The diagram currently uses the CDS property of the transcript
for drawing filled/empty boxes representing the exons.
It's possible that later we will switch to using UTRs for this purpose
*/

const UnsplicedTranscript = (props: UnsplicedTranscriptProps) => {
  const { spliced_exons, product_generating_contexts, slice } =
    props.transcript;
  const cds = product_generating_contexts[0]?.cds;
  const {
    location: { length: transcriptLength }
  } = slice;
  const scale = scaleLinear()
    .domain([1, transcriptLength])
    .range([1, props.width])
    .interpolate(interpolateFloor)
    .clamp(true);

  const transcriptClasses = props.classNames?.transcript;

  const exonRectangles = calculateExonRectangles({ spliced_exons, cds, scale });

  const renderedExons = exonRectangles.map((tuple, index) => (
    <ExonBlock
      key={index}
      exonRectangles={tuple}
      className={props.classNames?.exon}
    />
  ));

  const renderedTranscript = (
    <g className={transcriptClasses}>
      <Backbone
        exonRectangles={exonRectangles}
        className={props.classNames?.backbone}
      />
      {renderedExons}
    </g>
  );

  return props.standalone ? (
    <svg
      className={styles.containerSvg}
      width={scale(transcriptLength)}
      height={BLOCK_HEIGHT}
      viewBox={`0 0 ${scale(transcriptLength)} ${BLOCK_HEIGHT}`}
    >
      {renderedTranscript}
    </svg>
  ) : (
    renderedTranscript
  );
};

UnsplicedTranscript.defaultProps = {
  standalone: false
};

type BackboneProps = {
  exonRectangles: ReturnType<typeof calculateExonRectangles>;
  className?: string;
};

const Backbone = (props: BackboneProps) => {
  const { exonRectangles, className } = props;
  if (exonRectangles.length < 2) {
    return null;
  }

  const segments: ReactNode[] = [];

  for (let i = 0; i < exonRectangles.length - 1; i++) {
    /*
      exonRectangles is an array of tuples, in which each tuple contains one or two elements:
      is can be either a fully coding (or fully non-coding) rectangle,
      or a coding and a non-coding rectangle next to each other
    */

    const currentRectangle = exonRectangles[i]
      .slice(-1)
      .pop() as BackboneProps['exonRectangles'][number][number];
    const nextRectangle = exonRectangles[i + 1]
      .slice(0, 1)
      .pop() as BackboneProps['exonRectangles'][number][number];

    const currentRectangleEnd = currentRectangle.x + currentRectangle.width;
    const nextRectangleStart = nextRectangle.x;
    const segmentWidth = nextRectangleStart - currentRectangleEnd - 1;

    if (segmentWidth < 1) {
      continue;
    }

    const segment = (
      <rect
        key={currentRectangleEnd}
        className={className}
        y={0}
        height={1}
        x={currentRectangleEnd + 1}
        width={segmentWidth}
      />
    );

    segments.push(segment);
  }

  return <g>{segments}</g>;
};

type ExonBlockProps = {
  exonRectangles: ReturnType<typeof calculateExonRectangles>[number];
  className?: string;
};

const ExonBlock = (props: ExonBlockProps) => {
  const y = -3;
  const height = BLOCK_HEIGHT;

  const rectElements = props.exonRectangles.map((exonRect, index) => {
    const { filled, x, width } = exonRect;
    const rectClasses =
      classNames(props.className, {
        [styles.emptyBlock]: !filled
      }) || undefined;

    return (
      <rect
        key={index}
        data-test-id={props.exonRectangles.length === 1 ? 'exon' : undefined}
        className={rectClasses}
        x={x}
        y={y}
        width={width}
        height={height}
      />
    );
  });

  if (props.exonRectangles.length > 1) {
    return <g data-test-id="exon">{rectElements}</g>;
  } else {
    return <>{rectElements}</>;
  }
};

const getLength = (start: number, end: number) => end - start + 1;

type CalculateExonRectanglesParams = {
  spliced_exons: Pick2<SplicedExon, 'relative_location', 'start' | 'end'>[];
  cds?: {
    relative_start: number;
    relative_end: number;
  } | null;
  scale: ScaleLinear<number, number>;
};

const calculateExonRectangles = (params: CalculateExonRectanglesParams) => {
  const { spliced_exons, cds, scale } = params;

  return spliced_exons.map((exon) => {
    const { start: exonStart, end: exonEnd } = exon.relative_location;
    const isCompletelyNonCoding =
      !cds || exonEnd < cds.relative_start || exonStart > cds.relative_end;
    const isNonCodingLeft =
      cds && exonStart < cds.relative_start && exonEnd > cds.relative_start;
    const isNonCodingRight =
      cds && exonStart < cds.relative_end && exonEnd > cds.relative_end;

    if (cds && isNonCodingLeft) {
      const nonCodingRect = {
        filled: false,
        x: scale(exonStart),
        width: scale(getLength(exonStart, cds.relative_start))
      };
      const codingRect = {
        filled: true,
        x: scale(cds.relative_start),
        width: scale(getLength(cds.relative_start, exonEnd))
      };
      return [nonCodingRect, codingRect];
    } else if (cds && isNonCodingRight) {
      const codingRect = {
        filled: true,
        x: scale(exonStart),
        width: scale(getLength(exonStart, cds.relative_end))
      };
      const nonCodingRect = {
        filled: false,
        x: scale(cds.relative_end),
        width: scale(getLength(cds.relative_end, exonEnd))
      };
      return [codingRect, nonCodingRect];
    } else {
      const rect = {
        filled: !isCompletelyNonCoding,
        x: scale(exonStart),
        width: scale(getLength(exonStart, exonEnd))
      };
      return [rect];
    }
  });
};

// d3 has an interpolator for rounding numbers to the neares integer (https://github.com/d3/d3-interpolate/blob/main/src/round.js)
// but does not seem to have an interpolator for always using the smallest integer
// so here's the custom one
const interpolateFloor = (a: number, b: number) => (t: number) =>
  Math.floor(a * (1 - t) + b * t);

export default UnsplicedTranscript;
