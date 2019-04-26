import React from 'react';
import { connect } from 'react-redux';

import SpeciesSearchField from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';
import SpeciesCommitButton from 'src/content/app/species-selector/components/species-commit-button/SpeciesCommitButton';

import styles from './SpeciesSearchPanel.scss';

const SearchPanel = () => {
  return (
    <section className={styles.speciesSearchPanel}>
      <div className={styles.speciesSearchPanelRow}>
        <SpeciesSearchField />
        <SpeciesCommitButton />
      </div>
    </section>
  );
};

export default SearchPanel;
