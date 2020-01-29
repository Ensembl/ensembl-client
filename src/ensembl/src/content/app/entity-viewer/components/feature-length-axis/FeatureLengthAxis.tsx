import React, { useEffect } from 'react';
import { scaleLinear } from 'd3';

import { getTicks } from './featureLengthAxisHelper';

import styles from './FeatureLengthAxis.scss';

import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

type Ticks = {
  ticks: number[];
  labelledTicks: number[];
};

type Props = {
  length: number; // number of biological building blocks (e.g. nucleotides) in the feature
  width: number; // number of pixels allotted to the axis on the screen
  onTicksCalculated?: (ticks: Ticks) => void;
  standalone: boolean; // wrap the component in an svg element if true
};

const FeatureLengthAxis = (props: Props) => {
  const domain = [1, props.length];
  const range = [0, props.width];
  const scale = scaleLinear()
    .domain(domain)
    .range(range);
  const { ticks, labelledTicks } = getTicks(scale);

  useEffect(() => {
    props.onTicksCalculated &&
      props.onTicksCalculated({ ticks, labelledTicks });
  }, [props.length]);

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

  return props.standalone ? (
    <svg className={styles.containerSvg} width={props.width}>
      {renderedAxis}
    </svg>
  ) : (
    renderedAxis
  );
};

FeatureLengthAxis.defaultProps = {
  standalone: false
};

export default FeatureLengthAxis;
