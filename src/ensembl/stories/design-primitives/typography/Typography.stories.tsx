import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from 'src/styles/main.scss';
import storyStyles from '../../common.scss';
import dummyText from '../../../tests/data/json/LoremIpsum.json';

storiesOf('Design Primitives|Typography', module).add(
  'fonts',
  () => {
    return (
      <React.Fragment>
        <div className={storyStyles.page}>
          <p>
            The font shown as 'preferred' is the first one listed in the CSS,
            but that may not be the font rendered by your browser.
          </p>
          <h2>Body font</h2>
          <p>
            <b>Preferred</b>: Lato Regular
          </p>
          <p>{dummyText.medium}</p>
          <h2>Monospace</h2>
          <p>
            <b>Preferred</b>: Consolas
          </p>
          <code>{dummyText.medium}</code>
        </div>
      </React.Fragment>
    );
  },
  {
    notes: 'Consolas is not currently installed locally.'
  }
);
