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
import classNames from 'classnames';

import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import defaultStyles from './SpeciesStats.scss';

type PrimaryDataProps = {
  primaryValue: string | number;
  primaryUnit?: string;
  helpText?: string;
};

type PropsWithSecondaryData = {
  secondaryValue: string | number;
  secondaryUnit?: string;
};

type PropsWithoutSecondaryData = {
  secondaryValue?: never;
  secondaryUnit?: never;
};

type ClassNamesProps = {
  classNames?: {
    wrapper?: string;
    preLabel?: string;
    label?: string;
    primaryValue?: string | number;
    primaryUnit?: string;
    secondaryValue?: string | number;
    secondaryUnit?: string;
    link?: string;
  };
};

export type SpeciesStatsProps = PrimaryDataProps &
  (PropsWithSecondaryData | PropsWithoutSecondaryData) &
  ClassNamesProps & {
    preLabel?: string;
    label: string;
    link?: React.ReactElement;
  };

const SpeciesStats = (props: SpeciesStatsProps) => {
  const styles = {
    wrapper: classNames(defaultStyles.wrapper, props.classNames?.wrapper),
    preLabel: classNames(defaultStyles.preLabel, props.classNames?.preLabel),
    label: classNames(defaultStyles.label, props.classNames?.label),
    primaryValue: classNames(
      defaultStyles.primaryValue,
      props.classNames?.primaryValue
    ),
    primaryUnit: classNames(
      defaultStyles.primaryUnit,
      props.classNames?.primaryUnit
    ),
    secondaryValue: classNames(
      defaultStyles.secondaryValue,
      props.classNames?.secondaryValue
    ),
    secondaryUnit: classNames(
      defaultStyles.secondaryUnit,
      props.classNames?.secondaryUnit
    ),
    link: classNames(defaultStyles.link, props.classNames?.link)
  };

  return (
    <div className={styles.wrapper}>
      {props.preLabel && (
        <span className={styles.preLabel}>{props.preLabel}</span>
      )}
      {props.helpText && (
        <span className={defaultStyles.questionButton}>
          <QuestionButton helpText={props.helpText} />
        </span>
      )}

      <div className={styles.label}>{props.label}</div>

      <div>
        <span className={styles.primaryValue}>{props.primaryValue}</span>
        {props.primaryUnit && (
          <span className={styles.primaryUnit}>{props.primaryUnit}</span>
        )}
      </div>

      {props.secondaryValue && (
        <div>
          <span className={styles.secondaryValue}>{props.secondaryValue}</span>

          {props.secondaryUnit && (
            <span className={styles.secondaryUnit}>{props.secondaryUnit}</span>
          )}
        </div>
      )}

      <span className={styles.link}>{props.link}</span>
    </div>
  );
};

export default SpeciesStats;
