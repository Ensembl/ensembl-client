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

import { ProteinStats } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/proteinData';

import structuresIcon from 'static/img/entity-viewer/icon_protein_structures.svg';
import ligandsIcon from 'static/img/entity-viewer/icon_protein_ligands.svg';
import interactionsIcon from 'static/img/entity-viewer/icon_protein_interactions.svg';
import annotationsIcon from 'static/img/entity-viewer/icon_protein_annotations.svg';

import styles from './ProteinFeaturesCount.scss';

type ProteinFeaturesCountProps = {
  proteinStats: ProteinStats;
};

const ProteinFeaturesCount = (props: ProteinFeaturesCountProps) => {
  const { proteinStats } = props;

  return (
    <div>
      <div className={styles.feature}>
        <div className={styles.featureImg}>
          <img src={structuresIcon} alt="" />
        </div>
        <div className={styles.featureCount}>
          {proteinStats.structuresCount}
        </div>
        <div className={styles.featureText}>Structures</div>
      </div>
      <div className={styles.feature}>
        <div className={styles.featureImg}>
          <img src={ligandsIcon} alt="" />
        </div>
        <div className={styles.featureCount}>{proteinStats.ligandsCount}</div>
        <div className={styles.featureText}>Ligands</div>
      </div>
      <div className={styles.feature}>
        <div className={styles.featureImg}>
          <img src={interactionsIcon} alt="" />
        </div>
        <div className={styles.featureCount}>
          {proteinStats.interactionsCount}
        </div>
        <div className={styles.featureText}>Interactions</div>
      </div>
      <div className={styles.feature}>
        <div className={styles.featureImg}>
          <img src={annotationsIcon} alt="" />
        </div>
        <div className={styles.featureCount}>
          {proteinStats.annotationsCount}
        </div>
        <div className={styles.featureText}>Functional annotations</div>
      </div>
    </div>
  );
};

export default ProteinFeaturesCount;
