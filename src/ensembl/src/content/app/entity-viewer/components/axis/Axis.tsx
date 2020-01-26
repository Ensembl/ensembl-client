import React from 'react';

import styles from './FeatureLengthAxis.scss';

import {
  getStepLengthInNucleotides,
  chooseTickForLabel
} from './featureLengthAxisHelper';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

type Props = {
  start: number;
  end: number;
  width: number;
};

const getScale = (length: number, width: number) => (x: number) =>
  Math.round((x * width) / length);

const FeatureLengthAxis = (props: Props) => {
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
};

export default FeatureLengthAxis;
