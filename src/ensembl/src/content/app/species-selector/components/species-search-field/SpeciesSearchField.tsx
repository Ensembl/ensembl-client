import React, { FunctionComponent } from 'react';

import { SearchMatches } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSearchField.scss';

type Props = {
  matches?: SearchMatches;
};

const SpeciesSearchField: FunctionComponent<Props> = () => {
  return (
    <div className={styles.speciesSearchField}>
      It&rsquo;s a stub. See the feature/species-selector-screen branch for
      implementation
    </div>
  );
};

export default SpeciesSearchField;
