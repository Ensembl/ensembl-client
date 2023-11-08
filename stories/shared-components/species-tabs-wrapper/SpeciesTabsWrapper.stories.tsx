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

import React, { useState } from 'react';
import noop from 'lodash/noop';

import speciesData from './speciesData';

import SelectedSpecies from 'src/shared/components/selected-species/SelectedSpecies';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SpeciesTabsWrapper.stories.scss';

type StatelessStoryWrapperProps = {
  children: React.ReactNode;
};

const StatelessStoryWrapper = (props: StatelessStoryWrapperProps) => {
  return <div className={styles.multilineWrapper}>{props.children}</div>;
};

const StatefulStoryWrapper = (props: { species: CommittedItem[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const speciesTabs = props.species.map((species, index) => (
    <SelectedSpecies
      key={index}
      species={species}
      isActive={index === activeIndex}
      onClick={() => setActiveIndex(index)}
    />
  ));
  return (
    <StatelessStoryWrapper>
      <SpeciesTabsWrapper
        isWrappable={false}
        speciesTabs={speciesTabs}
        link={mockLink}
      />
    </StatelessStoryWrapper>
  );
};

const mockLink = <span className={styles.mockLink}>Change species</span>;

export const FewSpeciesWrappableStory = () => {
  const speciesTabs = speciesData
    .slice(0, 3)
    .map((species, index) => (
      <SelectedSpecies key={index} species={species} onClick={noop} />
    ));
  return (
    <StatelessStoryWrapper>
      <SpeciesTabsWrapper speciesTabs={speciesTabs} link={mockLink} />
    </StatelessStoryWrapper>
  );
};

FewSpeciesWrappableStory.storyName = 'wrappable, few species';

export const ManySpeciesWrappableStory = () => {
  const speciesTabs = speciesData.map((species, index) => (
    <SelectedSpecies key={index} species={species} onClick={noop} />
  ));
  return (
    <StatelessStoryWrapper>
      <SpeciesTabsWrapper speciesTabs={speciesTabs} link={mockLink} />
    </StatelessStoryWrapper>
  );
};

ManySpeciesWrappableStory.storyName = 'wrappable, many species';

export const FewSpeciesNonWrappableStory = () => (
  <StatefulStoryWrapper species={speciesData.slice(0, 3)} />
);

FewSpeciesNonWrappableStory.storyName = 'non-wrappable, few species';

export const ManySpeciesNonWrappableStory = () => (
  <StatefulStoryWrapper species={speciesData} />
);

ManySpeciesNonWrappableStory.storyName = 'non-wrappable, many species';

export default {
  title: 'Components/Shared Components/SpeciesTabsWrapper'
};
