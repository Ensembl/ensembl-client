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

import React from 'react';
import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';
import { Pick3 } from 'ts-multipick';

import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { SplicedExon } from 'src/shared/types/thoas/exon';
import { FullCDS } from 'src/shared/types/thoas/cds';

import styles from './UnsplicedTranscript.scss';

const BLOCK_HEIGHT = 7;

type ProductGeneratingContext = {
  cds: Pick<FullCDS, 'relative_start' | 'relative_end'>;
};
type Transcript = {
  spliced_exons: Array<Pick<SplicedExon, 'relative_location'>>;
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
    .rangeRound([1, props.width])
    .clamp(true);

  const transcriptClasses = props.classNames?.transcript;

  const renderedTranscript = (
    <g className={transcriptClasses}>
      <Backbone {...props} scale={scale} />
      {spliced_exons.map((spliced_exon, index) => (
        <ExonBlock
          key={index}
          spliced_exon={spliced_exon}
          cds={cds}
          className={props.classNames?.exon}
          scale={scale}
        />
      ))}
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

const Backbone = (
  props: UnsplicedTranscriptProps & { scale: ScaleLinear<number, number> }
) => {
  let intervals: [number, number][] = [];
  const {
    transcript: { spliced_exons },
    scale
  } = props;
  const backboneClasses = props.classNames?.backbone || undefined;

  if (!spliced_exons.length) {
    return (
      <rect
        className={backboneClasses}
        y={0}
        height={1}
        x={0}
        width={props.width}
      />
    );
  }

  for (let i = 0; i < spliced_exons.length; i++) {
    const {
      relative_location: { end: exonEnd }
    } = spliced_exons[i];

    if (i < spliced_exons.length - 1) {
      const {
        relative_location: { start: nextExonStart }
      } = spliced_exons[i + 1];
      intervals.push([exonEnd, nextExonStart]);
    }
  }

  intervals = intervals.filter((interval) => interval[0] !== interval[1]);

  // NOTE: the intervals, from which backbone segments are rendered below, have been calculated from the start and the end coordinates of exons.
  // This means that the right and left borders of exon boxes will have the same coordinates as the right and left edges of each backbone segment.
  // In order to prevent backbone segments from invading exon boxes (which produces tiny bumps on both sides of empty boxes),
  // we are adjusting the x-coordinate and the width of every backbone segment by moving it 1 point to the right and subtracting 2 points from its width.
  return (
    <g>
      {intervals.map(([start, end]) => (
        <rect
          key={start}
          className={backboneClasses}
          y={0}
          height={1}
          x={scale(start) + 1}
          width={Math.max(0, scale(end - start) - 2)}
        />
      ))}
    </g>
  );
};

type ExonBlockProps = {
  spliced_exon: Pick<SplicedExon, 'relative_location'>;
  cds?: {
    relative_start: number;
    relative_end: number;
  } | null;
  className?: string;
  scale: ScaleLinear<number, number>;
};

const ExonBlock = (props: ExonBlockProps) => {
  const { spliced_exon, cds } = props;
  const { start: exonStart, end: exonEnd } = spliced_exon.relative_location;

  const isCompletelyNonCoding =
    cds && (exonEnd < cds.relative_start || exonStart > cds.relative_end);
  const isNonCodingLeft =
    cds && exonStart < cds.relative_start && exonEnd > cds.relative_start;
  const isNonCodingRight =
    cds && exonStart < cds.relative_end && exonEnd > cds.relative_end;
  const y = -3;
  const height = BLOCK_HEIGHT;

  const exonClasses = props.className;

  if (cds && isNonCodingLeft) {
    const nonCodingPart = (
      <rect
        className={classNames(exonClasses, styles.emptyBlock) || undefined}
        y={y}
        height={height}
        x={props.scale(exonStart)}
        width={props.scale(getLength(exonStart, cds.relative_start))}
      />
    );
    const codingPart = (
      <rect
        className={exonClasses}
        y={y}
        height={height}
        x={props.scale(cds.relative_start)}
        width={props.scale(getLength(cds.relative_start, exonEnd))}
      />
    );
    return (
      <g key={exonStart} data-test-id="exon">
        {nonCodingPart}
        {codingPart}
      </g>
    );
  } else if (cds && isNonCodingRight) {
    const codingPart = (
      <rect
        className={exonClasses}
        y={y}
        height={height}
        x={props.scale(exonStart)}
        width={props.scale(getLength(exonStart, cds.relative_end))}
      />
    );
    const nonCodingPart = (
      <rect
        className={classNames(exonClasses, styles.emptyBlock) || undefined}
        y={y}
        height={height}
        x={props.scale(cds.relative_end)}
        width={props.scale(getLength(cds.relative_end, exonEnd))}
      />
    );

    return (
      <g key={exonStart} data-test-id="exon">
        {codingPart}
        {nonCodingPart}
      </g>
    );
  } else {
    const classes =
      classNames(exonClasses, {
        [styles.emptyBlock]: isCompletelyNonCoding
      }) || undefined;
    return (
      <rect
        key={exonStart}
        data-test-id="exon"
        className={classes}
        y={y}
        height={height}
        x={props.scale(exonStart)}
        width={props.scale(getLength(exonStart, exonEnd))}
      />
    );
  }
};

const getLength = (start: number, end: number) => end - start + 1;

export default UnsplicedTranscript;
