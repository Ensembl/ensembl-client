import React from 'react';
import { storiesOf } from '@storybook/react';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import styles from './ExternalReference.stories.scss';

storiesOf('Components|Shared Components/ExternalReference', module)
  .add('default', () => (
    <ExternalReference
      label={'Source name'}
      linkText={'LinkText'}
      href={''}
      classNames={{ container: styles.wrapper }}
    />
  ))
  .add('without label', () => (
    <ExternalReference
      linkText={'LinkText'}
      href={''}
      classNames={{ container: styles.wrapper }}
    />
  ));
