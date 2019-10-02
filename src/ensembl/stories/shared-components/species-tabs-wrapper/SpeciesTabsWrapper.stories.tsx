import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import speciesData from './speciesData';

import {
  SimpleSelectedSpecies,
  FocusableSelectedSpecies
} from 'src/shared/components/selected-species';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';

import styles from './SpeciesTabsWrapper.stories.scss';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

type StatelessStoryWrapperProps = {
  children: React.ReactNode;
};

const StatelessStoryWrapper = (props: StatelessStoryWrapperProps) => {
  return <div className={styles.multilineWrapper}>{props.children}</div>;
};

const StatefulStoryWrapper = (props: { species: CommittedItem[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const speciesTabs = props.species.map((species, index) => (
    <FocusableSelectedSpecies
      key={index}
      species={species}
      isActive={index === activeIndex}
      onClick={() => setActiveIndex(index)}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
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

storiesOf('Components|Shared Components/SpeciesTabsWrapper/wrappable', module)
  .add('few species', () => {
    const speciesTabs = speciesData
      .slice(0, 3)
      .map((species, index) => (
        <SimpleSelectedSpecies key={index} species={species} />
      ));
    return (
      <StatelessStoryWrapper>
        <SpeciesTabsWrapper speciesTabs={speciesTabs} link={mockLink} />
      </StatelessStoryWrapper>
    );
  })
  .add('many species', () => {
    const speciesTabs = speciesData.map((species, index) => (
      <SimpleSelectedSpecies key={index} species={species} />
    ));
    return (
      <StatelessStoryWrapper>
        <SpeciesTabsWrapper speciesTabs={speciesTabs} link={mockLink} />
      </StatelessStoryWrapper>
    );
  });

storiesOf(
  'Components|Shared Components/SpeciesTabsWrapper/non-wrappable',
  module
)
  .add('few species', () => {
    return <StatefulStoryWrapper species={speciesData.slice(0, 3)} />;
  })
  .add('many species', () => {
    return <StatefulStoryWrapper species={speciesData} />;
  });
