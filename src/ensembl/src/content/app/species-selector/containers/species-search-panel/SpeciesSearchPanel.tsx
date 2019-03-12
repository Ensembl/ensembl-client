import React from 'react';

import SpeciesSearchField from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';

import styles from './SpeciesSearchPanel.scss';

const SearchPanel = () => {
  return (
    <section className={styles.searchPanel}>
      <SpeciesSearchField />
    </section>
  );
};

export default SearchPanel;
