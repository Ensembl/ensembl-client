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

import React, { type ReactNode } from 'react';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import styles from './CircularProportionIndicator.scss';

type Props = {
  value: number;
  valueFormatOptions?: Intl.NumberFormatOptions;
  valueFormatter?: (value: number) => ReactNode;
};

const defaultValueFormatOptions = {
  maximumFractionDigits: 2
};

/**
 * This component renders a circle that has a coloured sector
 * representing a value between 0 and 100%.
 */
export const CircularProportionIndicator = (props: { value: number }) => {
  const diagramStyles = {
    ['--circular-proportion-indicator-value' as string]: `${props.value}%`
  };

  return <div className={styles.diagram} style={diagramStyles} />;
};

/**
 * This component renders CircularProportionIndicator with a value next to it.
 * is meant to be used with values between 0 and 100
 */
export const CircularPercentageIndicator = (
  props: Props & { withPercentSign?: boolean }
) => {
  const {
    value,
    valueFormatOptions = defaultValueFormatOptions,
    withPercentSign = true,
    valueFormatter
  } = props;

  let formattedValue: ReactNode;

  if (!valueFormatter) {
    formattedValue = formatNumber(value, valueFormatOptions);

    if (withPercentSign) {
      formattedValue += '%';
    }
  } else {
    formattedValue = valueFormatter(value);
  }

  return (
    <div className={styles.grid}>
      <CircularProportionIndicator value={value} />
      <span className={styles.label}>{formattedValue}</span>
    </div>
  );
};

/**
 * This component renders CircularProportionIndicator with a value next to it.
 * It is meant to be used with values between 0 and 1
 */
export const CircularFractionIndicator = (props: Props) => {
  const {
    value,
    valueFormatOptions = defaultValueFormatOptions,
    valueFormatter
  } = props;

  const formattedValue = valueFormatter
    ? valueFormatter(value)
    : formatNumber(value, valueFormatOptions);

  return (
    <div className={styles.grid}>
      <CircularProportionIndicator value={value * 100} />
      <span className={styles.label}>{formattedValue}</span>
    </div>
  );
};
