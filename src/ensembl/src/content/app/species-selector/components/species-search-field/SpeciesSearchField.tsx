import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  fetchSpeciesSearchResults,
  handleSelectedSpecies,
  clearSelectedSearchResult,
  clearSearchResults
} from 'src/content/app/species-selector/state/speciesSelectorActions';

import {
  getSearchResults,
  getSelectedItemText
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import SpeciesSearchMatch from '../species-search-match/SpeciesSearchMatch';

import AutosuggestSearchField from 'src/shared/autosuggest-search-field/AutosuggestSearchField';
import ClearButton from 'src/shared/clear-button/ClearButton';
import QuestionButton from 'src/shared/question-button/QuestionButton';

import {
  SearchMatch,
  SearchMatches
} from 'src/content/app/species-selector/types/species-search';
import { RootState } from 'src/store';

import styles from './SpeciesSearchField.scss';

const MINIMUM_SEARCH_LENGTH = 3;
export const NOT_FOUND_TEXT = 'Sorry, we have no data for this species';

type Props = {
  onSearchChange: (search: string) => void;
  onMatchSelected: (match: SearchMatch) => void;
  clearSelectedSearchResult: () => void;
  clearSearchResults: () => void;
  matches: SearchMatches[] | null;
  selectedItemText: string | null;
};

enum RightCornerStatus {
  INFO,
  CLEAR,
  EMPTY
}

type RightCornerProps = {
  status: RightCornerStatus;
  clear: () => void;
};

export const SpeciesSearchField = (props: Props) => {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (search: string) => {
    setSearch(search);
    if (props.selectedItemText) {
      props.clearSelectedSearchResult();
    }

    search = search.trim();
    if (search.length >= MINIMUM_SEARCH_LENGTH) {
      props.onSearchChange(search); // onSearchChange will clear search results
    } else {
      // clear search results if user is deleting their query
      props.matches && props.clearSearchResults();
    }
  };

  const onMatchSelected = (match: SearchMatch) => {
    props.onMatchSelected(match);
    setSearch('');
  };

  const canShowSuggesions =
    props.selectedItemText === null &&
    search.trim().length >= MINIMUM_SEARCH_LENGTH;

  const matchGroups = props.matches ? buildMatchGroups(props.matches) : [];

  const clear = () => {
    props.clearSearchResults();
    props.clearSelectedSearchResult();
    setSearch('');
  };

  const hasText = Boolean(props.selectedItemText || search);

  const rightCornerStatus = hasText
    ? RightCornerStatus.CLEAR
    : isFocused
    ? RightCornerStatus.EMPTY
    : RightCornerStatus.INFO;

  const isNotFound = Boolean(props.matches && props.matches.length === 0);

  return (
    <AutosuggestSearchField
      search={props.selectedItemText || search}
      placeholder="Common or scientific name..."
      className={styles.speciesSearchFieldWrapper}
      onChange={handleSearchChange}
      onSelect={onMatchSelected}
      matchGroups={matchGroups}
      searchFieldClassName={styles.speciesSearchField}
      canShowSuggestions={canShowSuggesions}
      notFound={isNotFound}
      notFoundText={NOT_FOUND_TEXT}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      rightCorner={<RightCorner status={rightCornerStatus} clear={clear} />}
    />
  );
};

const helpText = (
  <>
    Search for a species using a common name, scientific name or assembly. If no
    results are shown, please try a different spelling or attribute.
  </>
);

const RightCorner = (props: RightCornerProps) => {
  switch (props.status) {
    case RightCornerStatus.INFO:
      return <QuestionButton helpText={helpText} />;
    case RightCornerStatus.CLEAR:
      return <ClearButton onClick={props.clear} />;
    default:
      return null;
  }
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
  matches: getSearchResults(state),
  selectedItemText: getSelectedItemText(state)
});

const mapDispatchToProps = {
  onSearchChange: fetchSpeciesSearchResults.request,
  onMatchSelected: handleSelectedSpecies,
  clearSelectedSearchResult,
  clearSearchResults
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesSearchField);
