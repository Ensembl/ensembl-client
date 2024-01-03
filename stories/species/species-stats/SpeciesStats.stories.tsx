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

import styles from './SpeciesStats.stories.module.css';

export const SpeciesStatsDefaultStory = () => (
  <div className={styles.wrapper}>
    <SpeciesStats
      label="Coding genes"
      primaryValue="20,438"
      secondaryValue="671"
      secondaryUnit="readthrough"
    />
    <SpeciesStats
      preLabel="preLabel"
      label="label"
      primaryValue="primaryValue"
      primaryUnit="primaryUnit"
      secondaryValue="secondaryValue"
      secondaryUnit="secondaryUnit"
      link={<a href="/">Link</a>}
    />
    <SpeciesStats
      preLabel="No. genes in"
      label="Biological process"
      primaryValue="7,343"
      primaryUnit="xyz"
      secondaryValue="1892"
      secondaryUnit="terms"
    />
    <SpeciesStats
      label="Transcriptomic data"
      primaryValue="90%"
      link={<a href="/">View</a>}
    />
    <SpeciesStats label="SNVs" primaryValue="91%" />
  </div>
);

SpeciesStatsDefaultStory.storyName = 'default';

export default {
  title: 'Components/Species/SpeciesStats'
};
