import React from 'react';
import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { Exon } from 'src/content/app/entity-viewer/types/exon';
import { CDS } from 'src/content/app/entity-viewer/types/cds';

import styles from './UnsplicedTranscript.scss';

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
NOTE: here are the ways the current diagram's implementation may be different from
what we do when the api becomes mature:

1) The diagram relies on the actual start and end positions of features.
This works for forward strand of linear DNA, but does not take into account
adjustments required for drawing a feature from reverse strand or from a circular DNA.
When the backend api matures, it will likely send us relative positions of features
nested in a larger feature (e.g. relative positions of exons to the start of the transcript).
This will work both for reverse strand and for circular DNA.

2) The diagram currently uses the CDS property of the transcript
for drawing filled/empty boxes representing the exons.
It's possible that later we will switch to using UTRs for this purpose

*/

const UnsplicedTranscript = (props: UnsplicedTranscriptProps) => {
  const { start: transcriptStart, end: transcriptEnd } = getFeatureCoordinates(
    props.transcript
  );
  const { exons, cds } = props.transcript;
  const length = getLength(transcriptStart, transcriptEnd);
  const scale = scaleLinear()
    .domain([1, length])
    .range([1, props.width]);

  const transcriptClasses = classNames(
    styles.transcript,
    props.classNames?.transcript
  );

  const renderedTranscript = (
    <g className={transcriptClasses}>
      <Backbone {...props} scale={scale} />
      {exons.map((exon, index) => (
        <ExonBlock
          key={index}
          exon={exon}
          cds={cds}
          transcriptStart={transcriptStart}
          className={props.classNames?.exon}
          scale={scale}
        />
      ))}
    </g>
  );

  return props.standalone ? (
    <svg className={styles.containerSvg} width={props.width}>
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
    transcript: { exons },
    scale
  } = props;
  const { start: transcriptStart, end: transcriptEnd } = getFeatureCoordinates(
    props.transcript
  );
  const backboneClasses = classNames(
    styles.backbone,
    props.classNames?.backbone
  );

  if (!exons.length) {
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

  for (let i = 0; i < exons.length; i++) {
    const exon = exons[i];
    const { start: exonStart, end: exonEnd } = getFeatureCoordinates(exon);
    if (i === 0) {
      intervals.push([transcriptStart, exonStart]);
    } else {
      const previousExon = exons[i - 1];
      const { end: previousExonEnd } = getFeatureCoordinates(previousExon);
      intervals.push([previousExonEnd, exonStart]);
    }

    if (i === exons.length - 1) {
      intervals.push([exonEnd, transcriptEnd]);
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
          x={scale(start - transcriptStart) + 1}
          width={scale(end - start) - 2}
        />
      ))}
    </g>
  );
};

type ExonBlockProps = {
  exon: Exon;
  cds?: CDS | null;
  transcriptStart: number;
  className?: string;
  scale: ScaleLinear<number, number>;
};

const ExonBlock = (props: ExonBlockProps) => {
  const { cds, transcriptStart } = props;
  const { start: exonStart, end: exonEnd } = getFeatureCoordinates(props.exon);

  const isCompletelyNonCoding =
    cds && (exonEnd < cds.start || exonStart > cds.end);
  const isNonCodingLeft = cds && exonStart < cds.start && exonEnd > cds.start;
  const isNonCodingRight = cds && exonStart < cds.end && exonEnd > cds.end;
  const y = -3;
  const height = 7;

  const exonClasses = classNames(styles.exon, props.className);

  if (cds && isNonCodingLeft) {
    const nonCodingPart = (
      <rect
        className={classNames(exonClasses, styles.emptyBlock)}
        y={y}
        height={height}
        x={props.scale(exonStart - transcriptStart)}
        width={props.scale(getLength(exonStart, cds.start))}
      />
    );
    const codingPart = (
      <rect
        className={exonClasses}
        y={y}
        height={height}
        x={props.scale(cds.start - transcriptStart)}
        width={props.scale(getLength(cds.start, exonEnd))}
      />
    );
    return (
      <g key={exonStart}>
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
        x={props.scale(exonStart - transcriptStart)}
        width={props.scale(getLength(exonStart, cds.end))}
      />
    );
    const nonCodingPart = (
      <rect
        className={classNames(exonClasses, styles.emptyBlock)}
        y={y}
        height={height}
        x={props.scale(cds.end - props.transcriptStart)}
        width={props.scale(getLength(cds.end, exonEnd))}
      />
    );

    return (
      <g key={exonStart}>
        {codingPart}
        {nonCodingPart}
      </g>
    );
  } else {
    const classes = classNames(exonClasses, {
      [styles.emptyBlock]: isCompletelyNonCoding
    });
    return (
      <rect
        key={exonStart}
        className={classes}
        y={y}
        height={height}
        x={props.scale(exonStart - transcriptStart)}
        width={props.scale(getLength(exonStart, exonEnd))}
      />
    );
  }
};

// NOTE: provisional method; this is going to break on circular DNA and on reverse strand
const getLength = (start: number, end: number) => end - start;

export default UnsplicedTranscript;
