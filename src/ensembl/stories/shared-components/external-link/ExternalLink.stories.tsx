import React from 'react';
import { storiesOf } from '@storybook/react';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import styles from './ExternalLink.stories.scss';

storiesOf('Components|Shared Components/ExternalLink', module)
  .add('default', () => (
    <ExternalLink
      label={'Source name'}
      linkText={'LinkText'}
      linkUrl={''}
      classNames={{ containerClass: styles.wrapper }}
    />
  ))
  .add('without label', () => (
    <ExternalLink
      linkText={'LinkText'}
      linkUrl={''}
      classNames={{ containerClass: styles.wrapper }}
    />
  ));
