import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SpeciesSearchField from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';

import styles from './SpeciesSearchField.stories.scss';

// onChange={action('on-input-change')}

storiesOf('Components|Species Selector/Species search field', module).add(
  'default',
  () => (
    <div className={styles.searchFieldContainer}>
      <SpeciesSearchField />
    </div>
  )
);
