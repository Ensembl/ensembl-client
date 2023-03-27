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

import { useAppSelector, useAppDispatch } from 'src/store';
import useSpeciesSelectorAnalytics from 'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics';

import {
  updateSearch,
  setSelectedSpecies,
  clearSelectedSearchResult,
  clearSearch
} from 'src/content/app/species-selector/state/speciesSelectorSlice';

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

import type {
  SearchMatch,
  SearchMatches
} from 'src/content/app/species-selector/types/species-search';

import { MINIMUM_SEARCH_LENGTH } from 'src/content/app/species-selector/constants/speciesSelectorConstants';

import styles from './SpeciesSearchField.scss';

export const NOT_FOUND_TEXT = 'Sorry, we have no data for this species';

enum RightCornerStatus {
  INFO,
  CLEAR,
  EMPTY
}

type RightCornerProps = {
  status: RightCornerStatus;
  clear: () => void;
};

export const SpeciesSearchField = () => {
  const [isFocused, setIsFocused] = useState(false);
  const searchText = useAppSelector(getSearchText);
  const matches = useAppSelector(getSearchResults);
  const selectedItemText = useAppSelector(getSelectedItemText);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => clear();
  }, []);

  const { trackAutocompleteSpeciesSelect } = useSpeciesSelectorAnalytics();

  const onMatchSelected = (match: SearchMatch) => {
    dispatch(setSelectedSpecies(match));
    trackAutocompleteSpeciesSelect(match);
  };

  const onSearchChange = (search: string) => {
    dispatch(updateSearch(search));
  };

  const canShowSuggesions =
    selectedItemText === null &&
    searchText.trim().length >= MINIMUM_SEARCH_LENGTH;

  const matchGroups = matches ? buildMatchGroups(matches) : [];

  const clear = () => {
    dispatch(clearSearch());
    dispatch(clearSelectedSearchResult());
  };

  const hasText = Boolean(selectedItemText || searchText);

  const rightCornerStatus = hasText
    ? RightCornerStatus.CLEAR
    : isFocused
    ? RightCornerStatus.EMPTY
    : RightCornerStatus.INFO;

  const isNotFound = Boolean(matches && matches.length === 0);

  return (
    <>
      <label className={styles.speciesSearchLabel}>Find a species</label>
      <AutosuggestSearchField
        search={selectedItemText || searchText}
        placeholder="Common or scientific name..."
        className={styles.speciesSearchFieldWrapper}
        onChange={onSearchChange}
        onSelect={onMatchSelected}
        matchGroups={matchGroups}
        searchFieldClassName={styles.speciesSearchField}
        size="large"
        canShowSuggestions={canShowSuggesions}
        notFound={isNotFound}
        notFoundText={NOT_FOUND_TEXT}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rightCorner={<RightCorner status={rightCornerStatus} clear={clear} />}
      />
    </>
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

export default SpeciesSearchField;
