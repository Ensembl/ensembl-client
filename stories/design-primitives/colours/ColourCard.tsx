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

import React, { FunctionComponent } from 'react';

import styles from './ColourCard.scss';

type Props = {
  name: string;
  variableName: string;
  value: string;
};

const ColourCard: FunctionComponent<Props> = (props) => {
  return (
    <div className={styles.colourCard}>
      <div
        className={styles.colourArea}
        style={{ backgroundColor: props.value }}
      />
      <div className={styles.colourInfo}>
        <div className={styles.colourName}>{props.name}</div>
        <div>{props.variableName}</div>
        <div>{props.value}</div>
      </div>
    </div>
  );
};

export default ColourCard;
