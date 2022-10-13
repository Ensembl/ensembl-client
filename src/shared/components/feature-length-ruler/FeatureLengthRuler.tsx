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

/*
This component is a ruler for displaying alongside visualisation of a nucleic acid

It follows the following rules for displaying labelled and unlabelled ticks
1. The ruler starts at 1 and ends at the length of the feature.
  Both the start and the end positions of the ruler are labelled.
2. Apart from the start and the end positions, there should be at least one label, but no greater than 5 labels
3. There may also be some unlabelled ticks. The total number of ticks (both labelled and unlabelled)
  between the start and the end positions should not be greater than 10.
4. Last tick cannot be labelled if it is at a less than 10% distance from the end of the ruler
5. Ticks can be either:
  a) multiple of the same power of 10 as the length of the feature, or
  b) half of this power of 10
*/

import React, { useEffect } from 'react';
import { scaleLinear, ScaleLinear } from 'd3';

import { getTicks } from './featureLengthRulerHelper';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import styles from './FeatureLengthRuler.scss';

type Ticks = {
  ticks: number[];
  labelledTicks: number[];
};

export type TicksAndScale = Ticks & {
  scale: ScaleLinear<number, number>;
};

type Props = {
  length: number; // number of biological building blocks (e.g. nucleotides) in the feature
  width: number; // number of pixels allotted to the axis on the screen
  unitsLabel?: string; // optional label showing what the ruler is measuring; will be displayed at the start of the ruler if present
  onTicksCalculated?: (payload: TicksAndScale) => void; // way to pass the ticks to the parent if it is interested in them
  standalone?: boolean; // wrap the component in an svg element if true
};

const FeatureLengthRuler = (props: Props) => {
  const domain = [1, props.length];
  const range = [0, props.width];
  const scale = scaleLinear().domain(domain).rangeRound(range);
  const { ticks, labelledTicks } = getTicks(scale);

  useEffect(() => {
    if (props.onTicksCalculated) {
      props.onTicksCalculated({ ticks, labelledTicks, scale });
    }
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
      <g>
        <rect className={styles.tick} width={1} height={6} />
        <text className={styles.label} x={0} y={20} textAnchor="end">
          {props.unitsLabel && (
            <tspan className={styles.rulerName}>{props.unitsLabel}</tspan>
          )}
          <tspan>1</tspan>
        </text>
      </g>
      {ticks.map((tick) => (
        <g key={tick} transform={`translate(${scale(tick)})`}>
          <rect className={styles.tick} width={1} height={6} />
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
    <svg className={styles.containerSvg} width={props.width} height={30}>
      {renderedAxis}
    </svg>
  ) : (
    renderedAxis
  );
};

export default FeatureLengthRuler;
