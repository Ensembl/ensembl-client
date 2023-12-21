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

import {
  TOP_HIT_MARK_RADIUS,
  HIT_MARK_RADIUS
} from './blastGenomicHitsDiagramConstants';

import styles from './BlastGenomicHitsDiagram.module.css';

const BlastGenomicHitsDiagramLegend = () => {
  return (
    <div className={styles.diagramLegend}>
      <Image />
      <span className={styles.diagramLegendLabel}>
        Top 5 hits by E-value - chromosomes only
      </span>
    </div>
  );
};

const Image = () => (
  <svg viewBox="0 0 13 13">
    <circle
      cx={TOP_HIT_MARK_RADIUS}
      cy={TOP_HIT_MARK_RADIUS}
      r={HIT_MARK_RADIUS}
      className={styles.hit}
    />
    <circle
      cx={TOP_HIT_MARK_RADIUS}
      cy={TOP_HIT_MARK_RADIUS}
      r={TOP_HIT_MARK_RADIUS}
      className={styles.topHit}
    />
  </svg>
);

export default BlastGenomicHitsDiagramLegend;
