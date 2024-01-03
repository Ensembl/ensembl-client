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
import SpeciesStats from 'src/content/app/species/components/species-stats/SpeciesStats';

import ExpandableSection from 'src/shared/components/expandable-section/ExpandableSection';

import styles from './ExpandableSection.stories.module.css';

export default {
  title: 'Components/Shared Components/ExpandableSection'
};

const getCollapsedContent = () => {
  return (
    <div className={styles.collapsedContent}>
      <span className={styles.title}>Coding Genes</span>
      <div className={styles.primary}>
        <span className={styles.primaryValue}>20,438</span>
        <span className={styles.primaryUnit}>671 readthrough</span>
      </div>

      <div className={styles.secondary}>
        <span className={styles.secondaryValue}>35,191</span>
        <span className={styles.secondaryUnit}>promoters</span>
      </div>

      <span className={styles.exampleLink}>Example Gene</span>
    </div>
  );
};

const getExpandedContent = () => {
  return (
    <div className={styles.expandedContent}>
      <div className={styles.statsGroup}>
        <span className={styles.title}>Coding Genes</span>
        <div className={styles.stats}>
          <SpeciesStats
            label="Coding genes"
            primaryValue="20,438"
            secondaryValue="671"
            secondaryUnit="readthrough"
          />
          <SpeciesStats
            label="Shortest coding gene"
            primaryValue="189"
            primaryUnit="bp"
          />
          <SpeciesStats
            label="Longest coding gene"
            primaryValue="2,473,559"
            primaryUnit="bp"
          />
        </div>

        <span className={styles.exampleLink}>Example Gene</span>
      </div>

      <div className={styles.statsGroup}>
        <span className={styles.title}>Analysis</span>
        <div className={styles.stats}>
          <SpeciesStats
            label="Coding gene density"
            primaryValue="9"
            primaryUnit="/mb"
          />
          <SpeciesStats
            label="Total coding gene complement"
            primaryValue="~3%"
          />
          <SpeciesStats
            label="Average coding gene length"
            primaryValue="66,577"
            primaryUnit="bp"
          />

          <SpeciesStats
            preLabel="Average coding sequence length"
            label="Biological process"
            primaryValue="23,881"
            primaryUnit="bp"
          />
        </div>
      </div>
    </div>
  );
};

export const DefaultExpandableSection = () => {
  return (
    <div className={styles.wrapper}>
      <ExpandableSection
        collapsedContent={getCollapsedContent()}
        expandedContent={getExpandedContent()}
      />
    </div>
  );
};

DefaultExpandableSection.storyName = 'default';

export const MultipleExpandableSection = () => {
  return (
    <div className={styles.wrapper}>
      <ExpandableSection
        collapsedContent={getCollapsedContent()}
        expandedContent={getExpandedContent()}
      />
      <ExpandableSection
        collapsedContent={getCollapsedContent()}
        expandedContent={getExpandedContent()}
      />
    </div>
  );
};

MultipleExpandableSection.storyName = 'multiple';
