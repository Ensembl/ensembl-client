import React from 'react';
import { storiesOf } from '@storybook/react';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import styles from './ExternalLink.stories.scss';

storiesOf('Components|Shared Components/ExternalLink', module).add(
  'default',
  () => (
    <div className={styles.wrapper}>
      <ExternalLink linkText={'LinkText'} to={''} />
    </div>
  )
);
