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

import defaultStyles from './SpeciesStats.scss';

export type SpeciesStatsProps = {
  title?: string;
  label: string;
  labelHint?: string;
  primaryValue: string;
  primaryUnit?: string;
  secondaryValue?: string;
  secondaryUnit?: string;
  link?: React.ReactElement;
  classNames?: {
    wrapper?: string;
    title?: string;
    label?: string;
    labelHint?: string;
    primaryValue?: string;
    primaryUnit?: string;
    secondaryValue?: string;
    secondaryUnit?: string;
    link?: string;
  };
};

const SpeciesStats = (props: SpeciesStatsProps) => {
  const styles = {
    wrapper: classNames(defaultStyles.wrapper, props.classNames?.wrapper),
    title: classNames(defaultStyles.title, props.classNames?.title),
    label: classNames(defaultStyles.label, props.classNames?.label),
    labelHint: classNames(defaultStyles.labelHint, props.classNames?.labelHint),
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
      <span className={styles.title}>{props.title}</span>

      <div>
        <span className={styles.label}>{props.label}</span>
        {props.labelHint && (
          <span className={styles.labelHint}>{props.labelHint}</span>
        )}
      </div>

      <div>
        <span className={styles.primaryValue}>{props.primaryValue}</span>
        {props.primaryUnit && (
          <span className={styles.primaryUnit}>{props.primaryUnit}</span>
        )}
      </div>

      {(props.secondaryValue || props.secondaryUnit) && (
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
