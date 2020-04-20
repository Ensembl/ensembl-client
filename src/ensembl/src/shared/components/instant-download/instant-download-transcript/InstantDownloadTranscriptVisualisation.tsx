import React from 'react';
import classNames from 'classnames';
import times from 'lodash/times';

import styles from './InstantDownloadTranscriptVisualisation.scss';

/*

Schematic representation of transcript:

@@##--####--####--####--##@@

if width of a single exon is x,
and width of section between exons is x/2

then

5x + (4 * 0.5x) = totalWidth
x = totalWidth / 7

*/

export type Props = {
  isGenomicSequenceEnabled: boolean;
  isCDNAEnabled: boolean;
  isCDSEnabled: boolean;
  isProteinSequenceEnabled: boolean;
  width: number;
};

const InstantDownloadTranscriptVisualisation = (props: Props) => {
  const exonsCount = 5;
  const exonHeight = 5;
  const proteinHeight = 3;
  const verticalGap = 5;
  const totalHeight = exonHeight + proteinHeight + verticalGap;
  const exonWidth = Math.floor(props.width / 7);
  const halfExonWidth = Math.floor(exonWidth / 2);
  const intronsCount = exonsCount - 1;

  const getExonClasses = (exonIndex: number, exonsCount: number) => {
    const isOuterExon = exonIndex === 0 || exonIndex === exonsCount - 1;
    const isInnerExon = !isOuterExon;
    const isHighlighted = isInnerExon
      ? props.isGenomicSequenceEnabled ||
        props.isCDNAEnabled ||
        props.isCDSEnabled
      : props.isGenomicSequenceEnabled || props.isCDNAEnabled;

    return classNames({
      [styles.outerExon]: isOuterExon,
      [styles.innerExon]: isInnerExon,
      [styles.highlighted]: isHighlighted,
    });
  };

  const intronStyles = classNames(styles.intron, {
    [styles.highlighted]: props.isGenomicSequenceEnabled,
  });
  const halfOuterExonStyles = classNames(styles.halfOuterExon, {
    [styles.highlighted]:
      props.isGenomicSequenceEnabled ||
      props.isCDNAEnabled ||
      props.isCDSEnabled,
  });

  const exons = times(exonsCount, (index) => {
    return (
      <rect
        key={index}
        className={getExonClasses(index, exonsCount)}
        x={index * (exonWidth + halfExonWidth)}
        y={0}
        width={exonWidth}
        height={exonHeight}
      />
    );
  });

  const halfOuterExons = (
    <>
      <rect
        className={halfOuterExonStyles}
        x={halfExonWidth}
        y={0}
        width={halfExonWidth}
        height={exonHeight}
      />
      <rect
        className={halfOuterExonStyles}
        x={4 * (exonWidth + halfExonWidth)}
        y={0}
        width={halfExonWidth}
        height={exonHeight}
      />
    </>
  );

  const introns = times(intronsCount, (index) => {
    const xStart = index * (exonWidth + halfExonWidth) + exonWidth;
    const xEnd = xStart + halfExonWidth;
    const y = Math.round(exonHeight / 2);
    return (
      <line
        key={index}
        className={intronStyles}
        x1={xStart}
        x2={xEnd}
        y1={y}
        y2={y}
      />
    );
  });

  const proteinSegments = times(exonsCount, (index) => {
    const isOuterSegment = index === 0 || index === exonsCount - 1;
    return (
      <rect
        key={index}
        className={styles.protein}
        x={index === 0 ? halfExonWidth : index * (exonWidth + halfExonWidth)}
        y={exonHeight + verticalGap}
        width={isOuterSegment ? halfExonWidth : exonWidth}
        height={proteinHeight}
      />
    );
  });

  return (
    <svg
      style={{ overflow: 'visible' }}
      width={props.width}
      height={totalHeight}
    >
      {exons}
      {halfOuterExons}
      {introns}
      {props.isProteinSequenceEnabled && proteinSegments}
    </svg>
  );
};

InstantDownloadTranscriptVisualisation.defaultProps = {
  isGenomicSequenceEnabled: false,
  isCDNAEnabled: false,
  isCDSEnabled: false,
  isProteinSequenceEnabled: false,
  width: 210,
} as Partial<Props>;

export default InstantDownloadTranscriptVisualisation;
