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
import CloseButton from 'src/shared/close-button/CloseButton';

import {
  SearchMatch,
  SearchMatches
} from 'src/content/app/species-selector/types/species-search';
import { RootState } from 'src/store';

import styles from './SpeciesSearchField.scss';

const MINIMUM_SEARCH_LENGTH = 3;

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

  const rightCornerStatus = Boolean(props.selectedItemText || search)
    ? RightCornerStatus.CLEAR
    : RightCornerStatus.EMPTY;

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
      notFound={Boolean(props.matches && props.matches.length === 0)}
      notFoundText="Sorry, we have no data for this species"
      rightCorner={<RightCorner status={rightCornerStatus} clear={clear} />}
    />
  );
};

const RightCorner = (props: RightCornerProps) => {
  switch (props.status) {
    case RightCornerStatus.CLEAR:
      return <CloseButton onClick={props.clear} />;
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
