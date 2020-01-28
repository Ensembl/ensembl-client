import React from 'react';
import { scaleLinear } from 'd3';

import styles from './FeatureLengthAxis.scss';

import {
  getStepLengthInNucleotides,
  chooseTickForLabel
} from './featureLengthAxisHelper';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

type Props = {
  length: number; // number of biological building blocks (e.g. nucleotides) in the feature
  width: number; // number of pixels allotted to the axis on the screen
  standalone: boolean; // wrap the component in an svg element if true
};

const getScale = (length: number, width: number) => (x: number) =>
  Math.round((x * width) / length);

const FeatureLengthAxis = (props: Props) => {
  const domain = [1, props.length];
  const range = [0, props.width];
  const scale = scaleLinear()
    .domain(domain)
    .range(range);
  const ticks = scale.ticks(10);
  const firstTick = ticks[ticks.length - 1];
  const exponent = Number(
    (firstTick.toExponential().match(/e\+(\d+)/) as string[])[1]
  );
  const base = 10 ** exponent;
  console.log(scale.ticks(10));
  console.log('base', base);
  console.log(ticks.filter((number) => number % ((base * 10) / 2) === 0));

  return null;
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
