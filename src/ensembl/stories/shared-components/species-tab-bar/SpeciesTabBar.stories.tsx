import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import speciesData from './speciesData';

import styles from './SpeciesTabBar.stories.scss';

import SpeciesTabBar from 'src/shared/species-tab-bar/SpeciesTabBar';

const Wrapper = () => {
  const [activeGenomeId, setActiveGenomeId] = useState(
    speciesData[0].genome_id
  );
  const onTabSelect = (genomeId: string) => {
    setActiveGenomeId(genomeId);
  };

  return (
    <div className={styles.wrapper}>
      <SpeciesTabBar
        species={speciesData}
        activeGenomeId={activeGenomeId}
        onTabSelect={onTabSelect}
      />
    </div>
  );
};

storiesOf('Components|Shared Components/SpeciesTabBar', module).add(
  'default',
  () => <Wrapper />
);
