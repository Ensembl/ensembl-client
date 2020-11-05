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

import SelectedSpecies from 'src/shared/components/selected-species/SelectedSpecies';

import speciesData from '../species-tabs-wrapper/speciesData';

import styles from './SelectedSpecies.stories.scss';

export default {
  title: 'Components/Shared Components/Selected Species',
  argTypes: { onClick: { action: 'Clicked' } }
};

type StoryArgs = {
  onClick: () => void;
};

export const SelectedSpeciesStory = (args: StoryArgs) => {
  const enabledSpecies = speciesData[0];
  const disabledSpecies = {
    ...enabledSpecies,
    isEnabled: false
  };

  return (
    <div className={styles.wrapper}>
      <SelectedSpecies
        species={enabledSpecies}
        onClick={args.onClick}
      ></SelectedSpecies>
      <SelectedSpecies
        species={enabledSpecies}
        isActive={true}
        onClick={args.onClick}
      ></SelectedSpecies>
      <SelectedSpecies
        species={disabledSpecies}
        onClick={args.onClick}
      ></SelectedSpecies>
      <SelectedSpecies
        species={disabledSpecies}
        isActive={true}
        onClick={args.onClick}
      ></SelectedSpecies>
    </div>
  );
};

SelectedSpeciesStory.storyName = 'Lozenge';
