import React from 'react';

// import SpeciesSearchField from 'src/content/app/custom-download/components/species-search-field/SpeciesSearchField';

import styles from './PreFilterPanel.scss';

const SearchPanel = () => {
  return (
    <section className={styles.preFilterPanel}>
      <div className={styles.panelTitle}>Select pre-filters</div>
    </section>
  );
};

export default SearchPanel;
