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

import SpeciesLozenge from 'src/shared/components/selected-species/SpeciesLozenge';

import speciesData from './speciesData';

import { humanGenome } from 'src/shared/components/selected-species/fixtures/speciesTestData';

import styles from './SelectedSpecies.stories.module.css';

export default {
  title: 'Components/Shared Components/Selected Species'
};

export const SpeciesLozengeStory = () => {
  const species = speciesData[0];
  return (
    <>
      <div className={styles.wrapper}>
        <p>Lozenges with different labels</p>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge
            speciesNameDisplayOption="common-name_assembly-name"
            theme="blue"
            species={humanGenome}
          />
          <span>Common name and Assembly, both available</span>
        </div>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge
            speciesNameDisplayOption="common-name_assembly-name"
            theme="blue"
            species={{ ...humanGenome, common_name: null }}
          />
          <span>No common name</span>
        </div>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge
            speciesNameDisplayOption="common-name_type_assembly-name"
            theme="blue"
            species={humanGenome}
          />
          <span>Common name, Type and Assembly</span>
        </div>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge
            speciesNameDisplayOption="scientific-name_assembly-name"
            theme="blue"
            species={species}
          />
          <span>Scientific name and Assembly</span>
        </div>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge
            speciesNameDisplayOption="scientific-name_type_assembly-name"
            theme="blue"
            species={species}
          />
          <span>Scientific name, Type and Assembly</span>
        </div>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge
            speciesNameDisplayOption="assembly-accession-id"
            theme="blue"
            species={humanGenome}
          />
          <span>Assembly accession</span>
        </div>
      </div>
    </>
  );
};

SpeciesLozengeStory.storyName = 'Lozenge';
