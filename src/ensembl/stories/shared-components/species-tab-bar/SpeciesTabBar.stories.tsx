import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import speciesData from './speciesData';

import styles from './SpeciesTabBar.stories.scss';

import SpeciesTabBar from 'src/shared/species-tab-bar/SpeciesTabBar';

const Wrapper = () => {
  const activeGenomeId = speciesData[0].genome_id;

  return (
    <div className={styles.wrapper}>
      <SpeciesTabBar species={speciesData} activeGenomeId={activeGenomeId} />
    </div>
  );
};

storiesOf('Components|Shared Components/SpeciesTabBar', module).add(
  'default',
  () => <Wrapper />
);
