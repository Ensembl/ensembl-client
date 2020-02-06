import React from 'react';
import classNames from 'classnames';
import { scaleLinear, ScaleLinear } from 'd3';

import styles from './TranscriptVisualisation.scss';

export type Exon = {
  start: number;
  end: number;
};

// this is a temporary type; the actual data will likely contain UTRs rather than CDS
export type CDS = {
  start: number;
  end: number;
};

type TranscriptBiologicalData = {
  start: number;
  end: number;
  exons: Exon[];
  cds?: CDS;
  // strand: Strand;
  // we also will need the actual length of the transcript, because for circular chromosomes if transcript spans origin length is not equal to simply end - start
};

// TODO: custom classnames for stick and blocks?
export type Props = {
  start: number;
  end: number;
  width: number; // available width for drawing, in pixels
  exons: Exon[];
  cds?: CDS;
  classNames?: {
    transcript?: string;
    backbone?: string;
    exon?: string;
  };
  standalone: boolean;
};

// TODO: untranslated regions
const Transcript = (props: Props) => {
  const length = getLength(props.start, props.end);
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
      {props.exons.map((exon, index) => (
        <ExonBlock
          key={index}
          exon={exon}
          cds={props.cds}
          transcriptStart={props.start}
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
  const backboneClasses = classNames(
    styles.backbone,
    props.classNames?.backbone
  );

  if (!props.exons.length) {
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

  for (let i = 0; i < props.exons.length; i++) {
    const exon = props.exons[i];
    if (i === 0) {
      intervals.push([props.start, exon.start]);
    } else {
      const previousExon = props.exons[i - 1];
      intervals.push([previousExon.end, exon.start]);
    }

    if (i === props.exons.length - 1) {
      intervals.push([exon.end, props.end]);
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
          x={props.scale(start - props.start)}
          width={props.scale(end - start)}
        />
      ))}
    </g>
  );
};

type ExonBlockProps = {
  exon: Exon;
  cds?: CDS;
  transcriptStart: number;
  className?: string;
  scale: ScaleLinear<number, number>;
};

const ExonBlock = (props: ExonBlockProps) => {
  const isCompletelyNonCoding =
    props.cds &&
    (props.exon.end < props.cds.start || props.exon.start > props.cds.end);
  const isNonCodingLeft =
    props.cds &&
    props.exon.start < props.cds.start &&
    props.exon.end > props.cds.start;
  const isNonCodingRight =
    props.cds &&
    props.exon.start < props.cds.end &&
    props.exon.end > props.cds.end;
  const y = -3;
  const height = 7;

  const exonClasses = classNames(styles.exon, props.className);

  if (props.cds && isNonCodingLeft) {
    const nonCodingPart = (
      <rect
        className={classNames(exonClasses, styles.emptyBlock)}
        y={y}
        height={height}
        x={props.scale(props.exon.start - props.transcriptStart)}
        width={props.scale(getLength(props.exon.start, props.cds.start))}
      />
    );
    const codingPart = (
      <rect
        className={exonClasses}
        y={y}
        height={height}
        x={props.scale(props.cds.start - props.transcriptStart)}
        width={props.scale(getLength(props.cds.start, props.exon.end))}
      />
    );
    return (
      <g key={props.exon.start}>
        {nonCodingPart}
        {codingPart}
      </g>
    );
  } else if (props.cds && isNonCodingRight) {
    const codingPart = (
      <rect
        className={exonClasses}
        y={y}
        height={height}
        x={props.scale(props.exon.start - props.transcriptStart)}
        width={props.scale(getLength(props.exon.start, props.cds.end))}
      />
    );
    const nonCodingPart = (
      <rect
        className={classNames(exonClasses, styles.emptyBlock)}
        y={y}
        height={height}
        x={props.scale(props.cds.end - props.transcriptStart)}
        width={props.scale(getLength(props.cds.end, props.exon.end))}
      />
    );

    return (
      <g key={props.exon.start}>
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
        key={props.exon.start}
        className={classes}
        y={y}
        height={height}
        x={props.scale(props.exon.start - props.transcriptStart)}
        width={props.scale(getLength(props.exon.start, props.exon.end))}
      />
    );
  }
};

// FIXME: handle circular chromosomes correctly; probably by asking backend to include the length property
const getLength = (start: number, end: number) => end - start;

export { Transcript };
