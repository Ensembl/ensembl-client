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

import styles from './ScaleSwitcher.scss';

const ScaleSwitcher = () => {
  return (
    <div className={styles.container}>
      {renderEmptyDots(3)}
      <div className={styles.selectedNode}>Gene</div>
      {renderEmptyDots(3)}
    </div>
  );
};

const renderEmptyDots = (number: number) => {
  return [...Array(number)].map((_, index) => (
    <div key={index} className={styles.emptyNode} />
  ));
};

export default ScaleSwitcher;
