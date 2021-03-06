/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
  updateSearch,
  handleSelectedSpecies,
  clearSelectedSearchResult,
  clearSearch
} from 'src/content/app/species-selector/state/speciesSelectorActions';

import {
  getSearchText,
  getSearchResults,
  getSelectedItemText
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import SpeciesSearchMatch from '../species-search-match/SpeciesSearchMatch';

import AutosuggestSearchField from 'src/shared/components/autosuggest-search-field/AutosuggestSearchField';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import QuestionButton, {
  QuestionButtonOption
} from 'src/shared/components/question-button/QuestionButton';

import {
  SearchMatch,
  SearchMatches
} from 'src/content/app/species-selector/types/species-search';

import analyticsTracking from 'src/services/analytics-service';
import { getSpeciesAnalyticsName } from 'src/content/app/species-selector/speciesSelectorHelper';

import { RootState } from 'src/store';
import { MINIMUM_SEARCH_LENGTH } from 'src/content/app/species-selector/constants/speciesSelectorConstants';

import styles from './SpeciesSearchField.scss';

export const NOT_FOUND_TEXT = 'Sorry, we have no data for this species';

type Props = {
  onSearchChange: (search: string) => void;
  onMatchSelected: (match: SearchMatch) => void;
  clearSelectedSearchResult: () => void;
  clearSearch: () => void;
  matches: SearchMatches[] | null;
  searchText: string;
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
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    return () => clear();
  }, []);

  const onMatchSelected = (match: SearchMatch) => {
    props.onMatchSelected(match);

    const speciesName = getSpeciesAnalyticsName(match);

    analyticsTracking.setSpeciesDimension(match.genome_id);

    analyticsTracking.trackEvent({
      category: 'species_search',
      action: 'preselect',
      label: speciesName
    });
  };

  const canShowSuggesions =
    props.selectedItemText === null &&
    props.searchText.trim().length >= MINIMUM_SEARCH_LENGTH;

  const matchGroups = props.matches ? buildMatchGroups(props.matches) : [];

  const clear = () => {
    props.clearSearch();
    props.clearSelectedSearchResult();
  };

  const hasText = Boolean(props.selectedItemText || props.searchText);

  const rightCornerStatus = hasText
    ? RightCornerStatus.CLEAR
    : isFocused
    ? RightCornerStatus.EMPTY
    : RightCornerStatus.INFO;

  const isNotFound = Boolean(props.matches && props.matches.length === 0);

  return (
    <AutosuggestSearchField
      search={props.selectedItemText || props.searchText}
      placeholder="Common or scientific name..."
      className={styles.speciesSearchFieldWrapper}
      onChange={props.onSearchChange}
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
      return (
        <QuestionButton
          helpText={helpText}
          styleOption={QuestionButtonOption.INPUT}
        />
      );
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
  searchText: getSearchText(state),
  matches: getSearchResults(state),
  selectedItemText: getSelectedItemText(state)
});

const mapDispatchToProps = {
  onSearchChange: updateSearch,
  onMatchSelected: handleSelectedSpecies,
  clearSelectedSearchResult,
  clearSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeciesSearchField);
