import React, { FunctionComponent } from 'react';

import { SearchMatch } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSearchField.scss';

type Props = {
  onSearchChange: (search: string) => void;
  matches?: SearchMatch[];
};

const SpeciesSearchField = (props: Props) => {
  const handleSearchChange = (search: string) => {
    if (search.length >= 3) {
      props.onSearchChange(search);
    }
    console.log('search', search);
  };
  const onQuestionButtonHover = () =>
    console.log('hovering over question button');
  const onMatchSelected = (match: SearchMatch) =>
    console.log('match selected', match);

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
        <SpeciesAutosuggestionPanel
          matches={props.matches}
          onMatchSelected={onMatchSelected}
        />
      )}
    </div>
  );
};

export default SpeciesSearchField;
