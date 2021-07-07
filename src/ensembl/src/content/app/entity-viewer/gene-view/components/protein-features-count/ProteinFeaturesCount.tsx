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
import similarProteinsIcon from 'static/img/entity-viewer/icon_protein_similar.svg';

import styles from './ProteinFeaturesCount.scss';

type ProteinFeaturesCountProps = {
  proteinStats: ProteinStats;
};

enum FeatureCountLabel {
  ANNOTATIONS = 'Functional annotations',
  INTERACTIONS = 'Interactions',
  LIGANDS = 'Ligands',
  STRUCTURES = 'Structures',
  SIMILAR_PROTEINS = 'Similar proteins'
}

const ProteinFeaturesCount = (props: ProteinFeaturesCountProps) => {
  const { proteinStats } = props;

  return (
    <div>
      <FeatureCount
        label={FeatureCountLabel.STRUCTURES}
        count={proteinStats.structuresCount}
        icon={structuresIcon}
      />
      <FeatureCount
        label={FeatureCountLabel.LIGANDS}
        count={proteinStats.ligandsCount}
        icon={ligandsIcon}
      />
      <FeatureCount
        label={FeatureCountLabel.INTERACTIONS}
        count={proteinStats.interactionsCount}
        icon={interactionsIcon}
      />
      <FeatureCount
        label={FeatureCountLabel.ANNOTATIONS}
        count={proteinStats.annotationsCount}
        icon={annotationsIcon}
      />
      <FeatureCount
        label={FeatureCountLabel.SIMILAR_PROTEINS}
        count={proteinStats.similarProteinsCount}
        icon={similarProteinsIcon}
      />
    </div>
  );
};

type FeatureCountProps = {
  count: number;
  icon: string;
  label: string;
};

const FeatureCount = (props: FeatureCountProps) => (
  <div className={styles.feature}>
    <div className={styles.featureImg}>
      <img src={props.icon} alt={props.label} />
    </div>
    <div className={styles.featureCount}>{props.count}</div>
    <div className={styles.featureText}>{props.label}</div>
  </div>
);

export default ProteinFeaturesCount;
