import React from 'react';
import { storiesOf } from '@storybook/react';

import ChromosomeNavigator from 'src/content/app/browser/chromosome-navigator/ChromosomeNavigator';

import styles from './ChromosomeNavigator.stories.scss';

storiesOf('Components|Genome Browser/ChromosomeNavigator', module).add(
  'default',
  () => (
    <div className={styles.chromosomeNavigatorContainer}>
      <ChromosomeNavigator />
    </div>
  )
);
