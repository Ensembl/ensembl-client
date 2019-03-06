import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';

import SpeciesSearchField from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';

import * as searchMatchObjects from 'tests/data/species-selector/species-search';
import { SearchMatches } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSearchField.stories.scss';

// onChange={action('on-input-change')}

const searchMatches = Object.values(searchMatchObjects) as SearchMatches;

storiesOf('Components|Species Selector/Species search field', module)
  .add('empty', () => (
    <div className={styles.searchFieldContainer}>
      <SpeciesSearchField />
    </div>
  ))
  .add('with search matches', () => (
    <div className={styles.searchFieldContainer}>
      <SpeciesSearchField matches={searchMatches} />
    </div>
  ));
