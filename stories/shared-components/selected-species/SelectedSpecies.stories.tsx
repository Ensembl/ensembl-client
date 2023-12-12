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

import styles from './SelectedSpecies.stories.scss';

export default {
  title: 'Components/Shared Components/Selected Species',
  argTypes: { onClick: { action: 'Clicked' } }
};

type StoryArgs = {
  onClick: () => void;
};

export const SelectedSpeciesStory = (args: StoryArgs) => {
  const species = speciesData[0];

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.innerWrapper}>
          <SpeciesLozenge theme="blue" species={species} />
          <span>blue theme</span>
        </div>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge theme="black" species={species} />
          <span>black theme</span>
        </div>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge theme="ice-blue" species={species} />
          <span>ice-blue theme</span>
        </div>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge theme="grey" species={species} />
          <span>grey theme</span>
        </div>

        <div className={styles.innerWrapper}>
          <SpeciesLozenge theme="red" species={species} />
          <span>red theme</span>
        </div>
      </div>
      <p>A clickable lozenge will change the cursor to hover, like so:</p>
      <div>
        <SpeciesLozenge theme="blue" species={species} onClick={args.onClick} />
      </div>
    </>
  );
};

SelectedSpeciesStory.storyName = 'Lozenge';
