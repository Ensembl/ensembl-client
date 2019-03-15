import React from 'react';
import { connect } from 'react-redux';

import { fetchSpeciesSearchResults } from 'src/content/app/species-selector/state/speciesSelectorActions';
import { getSearchResults } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import SpeciesAutosuggestionPanel from '../species-autosuggestion-panel/SpeciesAutosuggestionPanel';

import Input from 'src/shared/input/Input';
import QuestionButton from 'src/shared/question-button/QuestionButton';

import { SearchMatch } from 'src/content/app/species-selector/types/species-search';
import { RootState } from 'src/store';

import styles from './SpeciesSearchField.scss';

type Props = {
  onSearchChange: (search: string) => void;
  matches?: SearchMatch[];
};

const SpeciesSearchField = (props: Props) => {
  const handleSearchChange = (search: string) => {
    search = search.trim();
    if (search.length >= 3) {
      props.onSearchChange(search);
    }
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
      {props.matches && Boolean(props.matches.length) && (
        <SpeciesAutosuggestionPanel
          matches={props.matches}
          onMatchSelected={onMatchSelected}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  matches: getSearchResults(state)
});

const mapDispatchToProps = {
  onSearchChange: fetchSpeciesSearchResults.request
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesSearchField);
