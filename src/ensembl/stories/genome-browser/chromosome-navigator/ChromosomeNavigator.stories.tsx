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
          start: 0,
          end: 20000
        }}
        centromere={{
          start: 240000,
          end: 160000
        }}
      />
    </div>
  )
);
