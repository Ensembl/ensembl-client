import React from 'react';
import { scaleLinear } from 'd3';

import { getTicks } from './featureLengthAxisHelper';

import styles from './FeatureLengthAxis.scss';

// import {
//   getStepLengthInNucleotides,
//   chooseTickForLabel
// } from './featureLengthAxisHelper';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

type Props = {
  length: number; // number of biological building blocks (e.g. nucleotides) in the feature
  width: number; // number of pixels allotted to the axis on the screen
  standalone: boolean; // wrap the component in an svg element if true
};

// const getScale = (length: number, width: number) => (x: number) =>
//   Math.round((x * width) / length);

const FeatureLengthAxis = (props: Props) => {
  const domain = [1, props.length];
  const range = [0, props.width];
  const scale = scaleLinear()
    .domain(domain)
    .range(range);
  const { ticks, labelledTicks } = getTicks(scale);

  const renderedAxis = (
    <g>
      <rect
        className={styles.axis}
        x={0}
        y={0}
        width={props.width}
        height={1}
      />
      <text className={styles.label} x={0} y={20} textAnchor="end">
        bp 1
      </text>
      {ticks.map((tick) => (
        <g key={tick} transform={`translate(${scale(tick)})`}>
          <rect className={styles.tick} key={tick} width={1} height={6} />
          {labelledTicks.includes(tick) && (
            <text className={styles.label} x={0} y={20} textAnchor="middle">
              {getCommaSeparatedNumber(tick)}
            </text>
          )}
        </g>
      ))}
      <text
        className={styles.label}
        x={0}
        y={20}
        textAnchor="start"
        transform={`translate(${scale(props.length)})`}
      >
        {getCommaSeparatedNumber(props.length)}
      </text>
    </g>
  );
  return (
    <svg className={styles.containerSvg} width={props.width}>
      {renderedAxis}
    </svg>
  );
};

FeatureLengthAxis.defaultProps = {
  standalone: false
};

export default FeatureLengthAxis;

/*

const totalLength = props.end - props.start; // FIXME: circular chromosomes
const scale = getScale(totalLength, props.width);
const stepLength = getStepLengthInNucleotides(props.start, props.end);
const numberOfSteps = Math.floor(totalLength / stepLength);
const tickValues = [...Array(numberOfSteps)].map(
  (stuff, index) => stepLength * (index + 1)
);
const tickPositions = tickValues.map(scale);
const { index: indexOfLabel, value: tickLabel } = chooseTickForLabel(
  tickValues,
  props.start,
  props.end
);

return (
  <div className={styles.axis}>
    <svg width={props.width} height={20}>
      <rect x={0} y={2} width={props.width} height={1} />
      <g>
        <rect x={0} y={3} width={1} height={4} />
        <text className={styles.labelText} x={0} y={20}>
          {1}
        </text>
      </g>
      <g>
        {tickPositions.map((x, index) => (
          <g key={index}>
            <rect x={x} y={3} width={1} height={4} />
            {index === indexOfLabel && (
              <text className={styles.labelText} x={x} y={20}>
                {getCommaSeparatedNumber(tickLabel)}
              </text>
            )}
          </g>
        ))}
      </g>
      <text className={styles.labelText} x={props.width} y={20}>
        {getCommaSeparatedNumber(totalLength)}
      </text>
    </svg>
  </div>
);

*/
