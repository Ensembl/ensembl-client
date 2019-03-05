import React, { useState } from 'react';

import Input from 'src/shared/input/Input';
import QuestionButton from 'src/shared/question-button/QuestionButton';

import styles from './SpeciesSearchField.scss';

type Props = {};

const SpeciesSearchField = (props: Props) => {
  const handleSearchChange = (search: string) => {
    console.log('search', search);
  };

  return (
    <div className={styles.speciesSearchField}>
      <Input
        placeholder="Common or scientific name..."
        className={styles.speciesSearchFieldInput}
        onChange={handleSearchChange}
      />
      <div className={styles.speciesSearchFieldRightCorner}>
        <QuestionButton />
      </div>
    </div>
  );
};

export default SpeciesSearchField;
