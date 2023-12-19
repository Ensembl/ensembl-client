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

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Step.module.css';

type StepProps = {
  count: number;
  label: string;
  children?: ReactNode;
};

export const Step = (props: StepProps) => {
  const wrapperClassname = classNames(styles.wrapper, {
    [styles.wrapperWithChildren]: props.children
  });

  return (
    <div className={wrapperClassname}>
      <div className={styles.stepIcon}>
        <span>{props.count}</span>
      </div>
      <div className={styles.stepLabel}>{props.label}</div>
      {props.children && (
        <div className={styles.childrenContainer}>{props.children}</div>
      )}
    </div>
  );
};
