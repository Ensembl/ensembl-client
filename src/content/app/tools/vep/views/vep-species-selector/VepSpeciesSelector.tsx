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

import { useState, useDeferredValue, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import { useAppDispatch } from 'src/store';

import { useLazyGetSpeciesSearchResultsQuery } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import { setSelectedSpecies } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import useSelectableGenomesTable from 'src/content/app/species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import AddSpecies from 'src/content/app/species-selector/components/species-search-field/AddSpecies';
import { SpeciesSearchField } from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';
import SpeciesSearchResultsSummary from 'src/content/app/species-selector/components/species-search-results-summary/SpeciesSearchResultsSummary';
import SpeciesSearchResultsTable from 'src/content/app/species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import ModalView from 'src/shared/components/modal-view/ModalView';
import { CircleLoader } from 'src/shared/components/loader';

import type { SpeciesSearchResponse } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import styles from './VepSpeciesSelector.module.css';

/**
 * NOTE
 * This component is similar to BLAST species selector, with the following notable differences
 * - It only allows user to select a single genome
 * - The view might have a list of popular species if/when we figure out where to get it from
 */

/**
 * TODO:
 * - Store selected species in redux state
 * - Display species information in the form
 * - Possibly, enable the "Add variants" box after species is selected
 */

const VepSpeciesSelector = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [canSubmitSearch, setCanSubmitSearch] = useState(false);
  const [searchTrigger, result] = useLazyGetSpeciesSearchResultsQuery();
  const { currentData, isLoading, isError } = result;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    genomes,
    stagedGenomes,
    isTableExpanded,
    onTableExpandToggle,
    onGenomeStageToggle,
    sortRule,
    changeSortRule
  } = useSelectableGenomesTable({
    genomes: currentData?.matches ?? [],
    selectedGenomes: []
  });

  const deferredGenomes = useDeferredValue(genomes);

  const onSearchInput = (event: FormEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value);
    if (!canSubmitSearch) {
      setCanSubmitSearch(true);
    }
  };

  const onSpeciesAdd = () => {
    const selectedGenome = stagedGenomes[0]; // user can select only one genome VEP analysis at a time

    dispatch(setSelectedSpecies({ species: selectedGenome }));
    onClose();
  };

  const onSearchSubmit = () => {
    searchTrigger({ query: searchQuery });
    setCanSubmitSearch(false);
  };

  const onClose = () => {
    navigate(-1);
  };

  return (
    <ModalView onClose={onClose}>
      <div className={styles.grid}>
        <TopSection
          query={searchQuery}
          isLoading={isLoading}
          isError={isError}
          searchResults={currentData}
          canAddGenomes={stagedGenomes.length > 0}
          canSubmitSearch={canSubmitSearch}
          onSearchSubmit={onSearchSubmit}
          onSearchInput={onSearchInput}
          onGenomesAdd={onSpeciesAdd}
          onClose={onClose}
        />

        {currentData?.matches.length ? (
          <div className={styles.tableContainer}>
            <SpeciesSearchResultsTable
              results={deferredGenomes}
              isExpanded={isTableExpanded}
              maxStagedGenomesNumber={1}
              sortRule={sortRule}
              onSortRuleChange={changeSortRule}
              onTableExpandToggle={onTableExpandToggle}
              onSpeciesSelectToggle={onGenomeStageToggle}
            />
          </div>
        ) : null}
      </div>
    </ModalView>
  );
};

type TopSectionProps = {
  query: string;
  isLoading: boolean;
  isError: boolean;
  searchResults?: SpeciesSearchResponse;
  canAddGenomes: boolean;
  canSubmitSearch: boolean;
  onSearchSubmit: () => void;
  onSearchInput: (event: FormEvent<HTMLInputElement>) => void;
  onGenomesAdd: () => void;
  onClose: () => void;
};

const TopSection = (props: TopSectionProps) => {
  if (props.isError) {
    return <div>An unexpected error happened during search.</div>;
  }

  if (props.isLoading) {
    return (
      <>
        <AddSpecies
          query={props.query}
          canAdd={false}
          onAdd={props.onGenomesAdd}
          onClose={props.onClose}
        />
        <CircleLoader className={styles.loader} />
      </>
    );
  }

  // search returned some results
  if (props.searchResults?.matches.length) {
    return (
      <section className={styles.topSection}>
        <div className={styles.searchFieldWrapper}>
          <AddSpecies
            query={props.query}
            canAdd={props.canAddGenomes}
            onAdd={props.onGenomesAdd}
            onClose={props.onClose}
          />
        </div>
        <div className={styles.resultsSummaryWrapper}>
          <SpeciesSearchResultsSummary searchResults={props.searchResults} />
        </div>
      </section>
    );
  }

  // search returned no results
  if (!props.searchResults || props.searchResults?.matches.length === 0) {
    return (
      <section>
        <div>
          <SpeciesSearchField
            query={props.query}
            onInput={props.onSearchInput}
            canSubmit={props.canSubmitSearch}
            onSearchSubmit={props.onSearchSubmit}
          />
        </div>
        {props.searchResults && (
          <div>
            <SpeciesSearchResultsSummary searchResults={props.searchResults} />
          </div>
        )}
      </section>
    );
  }

  // this shouldn't happen
  return null;
};

export default VepSpeciesSelector;
