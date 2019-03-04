import React, { useState } from 'react';

import Input from 'src/shared/input/Input';

import styles from './SpeciesSearchField.scss';

type Props = {};

const SpeciesSearchField = (props: Props) => {
  const handleSearchChange = (search: string) => {
    console.log('search', search);
  };

  return (
    <div className={styles.speciesSearchField}>
      <Input
        className={styles.speciesSearchFieldInput}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SpeciesSearchField;
