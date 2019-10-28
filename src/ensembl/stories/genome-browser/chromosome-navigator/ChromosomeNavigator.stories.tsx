import React from 'react';
import { storiesOf } from '@storybook/react';

import ChromosomeNavigator from 'src/content/app/browser/chromosome-navigator/ChromosomeNavigator';

import styles from './ChromosomeNavigator.stories.scss';

storiesOf('Components|Genome Browser/ChromosomeNavigator', module).add(
  'default',
  () => (
    <div className={styles.chromosomeNavigatorContainer}>
      <ChromosomeNavigator
        length={1000000}
        viewportStart={200000}
        viewportEnd={500000}
        focusRegion={{
          start: 250000,
          end: 255000
        }}
        centromere={{
          start: 150000,
          end: 160000
        }}
      />
    </div>
  )
);
