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

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import styles from './CircularFractionIndicator.scss';

type Props = {
  value: number;
  valueFormatOptions?: Intl.NumberFormatOptions;
};

const defaultValueFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
};

const CircularFractionIndicator = (props: Props) => {
  const { value, valueFormatOptions = defaultValueFormatOptions } = props;

  const diagramStyles = {
    ['--circular-fraction-indicator-value' as string]: `${props.value}%`
  };
  const formattedValue = formatNumber(value, valueFormatOptions);

  return (
    <div className={styles.grid}>
      <div className={styles.diagram} style={diagramStyles} />
      <span className={styles.label}>{formattedValue}</span>
    </div>
  );
};

export default CircularFractionIndicator;
