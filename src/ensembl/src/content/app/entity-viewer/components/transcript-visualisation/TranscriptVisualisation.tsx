import React from 'react';
import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';

import { getFeatureCoordinates } from 'src/content/app/entity-viewer/helpers/entity-helpers';

import { Transcript as TranscriptType } from 'src/content/app/entity-viewer/types/transcript';
import { Exon } from 'src/content/app/entity-viewer/types/exon';
import { CDS } from 'src/content/app/entity-viewer/types/cds';

import styles from './TranscriptVisualisation.scss';

export type Props = {
  transcript: TranscriptType;
  width: number; // available width for drawing, in pixels
  classNames?: {
    transcript?: string;
    backbone?: string;
    exon?: string;
  };
  standalone: boolean;
};

// TODO: untranslated regions
const Transcript = (props: Props) => {
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

Transcript.defaultProps = {
  standalone: false
};

const Backbone = (props: Props & { scale: ScaleLinear<number, number> }) => {
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
  // if no exons...

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

  return (
    <g>
      {intervals.map(([start, end]) => (
        <rect
          key={start}
          className={backboneClasses}
          y={0}
          height={1}
          x={scale(start - transcriptStart)}
          width={scale(end - start)}
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

// FIXME: handle circular chromosomes correctly; probably by asking backend to include the length property
const getLength = (start: number, end: number) => end - start;

export { Transcript };
