import React from 'react';
import { storiesOf } from '@storybook/react';

import storyStyles from '../../common.scss';
import styles from './Typography.stories.scss';
import dummyText from 'tests/data/json/LoremIpsum.json';

storiesOf('Design Primitives|Typography', module).add(
  'fonts',
  () => {
    return (
      <div className={storyStyles.page}>
        <p>
          The font shown as 'preferred' is the first one listed in the CSS, but
          that may not be the font rendered by your browser.
        </p>
        <h2>Body font</h2>
        <p>
          <b>Preferred</b>: Lato Regular
        </p>
        <p>{dummyText.medium}</p>
        <h2>Monospace</h2>
        <p>
          <b>Preferred</b>: IBM Plex Mono
        </p>
        <div className={styles.monospace}>{dummyText.medium}</div>
      </div>
    );
  },
  {
    notes: 'Consolas is not currently installed locally.'
  }
);
