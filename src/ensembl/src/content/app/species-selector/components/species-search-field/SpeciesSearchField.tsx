import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  fetchSpeciesSearchResults,
  setSelectedSearchResult
} from 'src/content/app/species-selector/state/speciesSelectorActions';
import { getSearchResults } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

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
  onMatchSelected: (match: SearchMatch) => void;
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

  const onMatchSelected = (match: SearchMatch) => {
    props.onMatchSelected(match);
  };

  return (
    <div>
      <AutosuggestSearchField
        search={search}
        placeholder="Common or scientific name..."
        className={styles.speciesSearchFieldWrapper}
        onChange={handleSearchChange}
        onSelect={onMatchSelected}
        rightCorner={<RightCorner />}
        matchGroups={buildMatchGroups(props.matches)}
        searchFieldClassName={styles.speciesSearchField}
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

const buildMatchGroups = (groups: SearchMatches[]) => {
  return groups.map((group) => {
    const matches = group.map((match) => {
      const renderedMatch = <SpeciesSearchMatch match={match} />;
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
  onSearchChange: fetchSpeciesSearchResults.request,
  onMatchSelected: setSelectedSearchResult
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesSearchField);
