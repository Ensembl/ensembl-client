import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import speciesData from '../species-tab-bar/speciesData';
import juneSpeciesData from '../species-tab-bar//juneSpeciesData';

import {
  SimpleSelectedSpecies,
  FocusableSelectedSpecies
} from 'src/shared/components/selected-species';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';

import styles from './SpeciesTabsWrapper.stories.scss';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

type StatefulStoryWrapperProps = {
  species: CommittedItem[];
};

type StatelessStoryWrapperProps = {
  children: React.ReactNode;
};

// const StatefulStoryWrapper = (props: StatefulStoryWrapperProps) => {
//   const [activeGenomeId, setActiveGenomeId] = useState(
//     speciesData[0].genome_id
//   );
//   const onTabSelect = (genomeId: string) => {
//     setActiveGenomeId(genomeId);
//   };

//   return (
//     <div className={styles.wrapper}>
//       <SpeciesTabsWrapper
//         species={props.species}
//         activeGenomeId={activeGenomeId}
//         onTabSelect={onTabSelect}
//       />
//     </div>
//   );
// };

const StatelessStoryWrapper = (props: StatelessStoryWrapperProps) => {
  return <div className={styles.multilineWrapper}>{props.children}</div>;
};

storiesOf(
  'Components|Shared Components/SpeciesTabsWrapper/wrappable',
  module
).add('allow species to wrap', () => {
  const speciesTabs = speciesData.map((species, index) => (
    <SimpleSelectedSpecies key={index} species={species} />
  ));
  return (
    <StatelessStoryWrapper>
      <SpeciesTabsWrapper speciesTabs={speciesTabs} />
    </StatelessStoryWrapper>
  );
});

storiesOf(
  'Components|Shared Components/SpeciesTabsWrapper/non-wrappable',
  module
).add('few species', () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const speciesTabs = speciesData.map((species, index) => (
    <FocusableSelectedSpecies
      key={index}
      species={species}
      isActive={index === activeIndex}
      onClick={() => setActiveIndex(index)}
      onMouseEnter={() => console.log('mouseenter')}
      onMouseLeave={() => console.log('mouseleave')}
    />
  ));
  return (
    <StatelessStoryWrapper>
      <SpeciesTabsWrapper isWrappable={false} speciesTabs={speciesTabs} />
    </StatelessStoryWrapper>
  );
});

// .add('more species', () => <Wrapper species={juneSpeciesData} />)
// .add('multiple species', () => <Wrapper species={speciesData} />);
