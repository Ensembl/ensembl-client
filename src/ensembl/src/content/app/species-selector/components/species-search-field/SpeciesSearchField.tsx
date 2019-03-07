import React from 'react';

import SpeciesAutosuggestionPanel from '../species-autosuggestion-panel/SpeciesAutosuggestionPanel';

import Input from 'src/shared/input/Input';
import QuestionButton from 'src/shared/question-button/QuestionButton';

import { SearchMatches } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSearchField.scss';

type Props = {
  matches?: SearchMatches;
};

const SpeciesSearchField = (props: Props) => {
  const handleSearchChange = (search: string) => {
    console.log('search', search);
  };
  const onQuestionButtonHover = () =>
    console.log('hovering over question button');

  return (
    <div className={styles.speciesSearchField}>
      <Input
        placeholder="Common or scientific name..."
        className={styles.speciesSearchFieldInput}
        onChange={handleSearchChange}
      />
      <div className={styles.speciesSearchFieldRightCorner}>
        <QuestionButton onHover={onQuestionButtonHover} />
      </div>
      {props.matches && props.matches.length && (
        <SpeciesAutosuggestionPanel matches={props.matches} />
      )}
    </div>
  );
};

export default SpeciesSearchField;
