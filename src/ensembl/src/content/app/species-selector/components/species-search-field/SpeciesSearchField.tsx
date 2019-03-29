import React, { useState } from 'react';
import { connect } from 'react-redux';

import { fetchSpeciesSearchResults } from 'src/content/app/species-selector/state/speciesSelectorActions';
import { getSearchResults } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import SpeciesAutosuggestionPanel from '../species-autosuggestion-panel/SpeciesAutosuggestionPanel';
import SpeciesSearchMatch from '../species-search-match/SpeciesSearchMatch';

import AutosuggestSearchField from 'src/shared/autosuggest-search-field/AutosuggestSearchField';
import QuestionButton from 'src/shared/question-button/QuestionButton';

import {
  SearchMatch,
  SearchMatches
} from 'src/content/app/species-selector/types/species-search';
import { RootState } from 'src/store';

import styles from './SpeciesSearchField.scss';

type Props = {
  onSearchChange: (search: string) => void;
  matches: SearchMatches[];
};

export const SpeciesSearchField = (props: Props) => {
  const [search, setSearch] = useState('');

  const handleSearchChange = (search: string) => {
    setSearch(search);

    search = search.trim();
    if (search.length >= 3) {
      props.onSearchChange(search);
    }
  };

  const onMatchSelected = (match: SearchMatch) =>
    console.log('match selected', match);

  return (
    <div className={styles.speciesSearchField}>
      <AutosuggestSearchField
        search={search}
        placeholder="Common or scientific name..."
        className={styles.speciesSearchFieldInput}
        onChange={handleSearchChange}
        onSelect={onMatchSelected}
        rightCorner={<RightCorner />}
        matchGroups={buildMatchGroups(props.matches, onMatchSelected)}
      />
    </div>
  );
};

const RightCorner = () => {
  // TODO build the right corner properly
  const onQuestionButtonHover = () =>
    console.log('hovering over question button');
  return <QuestionButton onHover={onQuestionButtonHover} />;
};

const buildMatchGroups = (
  groups: SearchMatches[],
  onSelect: (match: SearchMatch) => void
) => {
  return groups.map((group) => {
    const matches = group.map((match) => {
      const renderedMatch = (
        <SpeciesSearchMatch match={match} onClick={onSelect} />
      );
      return {
        data: match,
        element: renderedMatch
      };
    });
    return { matches };
  });
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
