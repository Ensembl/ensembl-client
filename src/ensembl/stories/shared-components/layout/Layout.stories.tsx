import React from 'react';
import { storiesOf } from '@storybook/react';

import { StandardAppLayout } from 'src/shared/components/layout';

import styles from './Layout.stories.scss';

storiesOf('Components|Shared Components/Layout/StandardAppLayout', module).add(
  'default',
  () => {
    return (
      <div className={styles.wrapper}>
        <StandardAppLayout />
      </div>
    );
  }
);
