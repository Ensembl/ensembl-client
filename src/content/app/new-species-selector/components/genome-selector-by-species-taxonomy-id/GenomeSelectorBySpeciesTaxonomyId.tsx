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

import { useAppDispatch } from 'src/store';

import { useLazyGetGenomesBySpeciesTaxonomyIdQuery } from 'src/content/app/new-species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import { commitSelectedSpeciesAndSave } from 'src/content/app/new-species-selector/state/species-selector-search-slice/speciesSelectorSearchSlice';

import useSelectableGenomesTable from 'src/content/app/new-species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import SpeciesSearchResultsTable from 'src/content/app/new-species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import GenomesFilterField from 'src/content/app/new-species-selector/components/genomes-filter-field/GenomesFilterField';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';
import InfoPill from 'src/shared/components/info-pill/InfoPill';

import styles from './GenomeSelectorBySpeciesTaxonomyId.scss';

type Props = {
  speciesTaxonomyId: string | number;
  speciesImageUrl: string | null;
};

const GenomeSelectorBySpeciesTaxonomyId = (props: Props) => {
  const { speciesTaxonomyId } = props;
  const [filterQuery, setFilterQuery] = useState('');
  const [searchTrigger, result] = useLazyGetGenomesBySpeciesTaxonomyIdQuery();
  const { currentData, isLoading, isError } = result;

  const {
    genomes,
    stagedGenomes,
    isTableExpanded,
    onTableExpandToggle,
    onGenomePreselectToggle
  } = useSelectableGenomesTable({
    genomes: currentData?.matches ?? [],
    filterQuery
  });

  useEffect(() => {
    searchTrigger({ speciesTaxonomyId });
  }, []);

  return (
    <div className={styles.main}>
      {isLoading && <CircleLoader className={styles.loader} />}
      {currentData && (
        <>
          <TopSection
            {...props}
            genomes={genomes}
            stagedGenomes={stagedGenomes}
            onFilterChange={setFilterQuery}
          />
          <div className={styles.tableContainer}>
            <SpeciesSearchResultsTable
              results={genomes}
              isExpanded={isTableExpanded}
              onTableExpandToggle={onTableExpandToggle}
              onSpeciesSelectToggle={onGenomePreselectToggle}
            />
          </div>
        </>
      )}
      {isError && <div>An unexpected error has occurred</div>}
    </div>
  );
};

type TopSectionProps = Props & {
  genomes: ReturnType<typeof useSelectableGenomesTable>['genomes'];
  stagedGenomes: ReturnType<typeof useSelectableGenomesTable>['stagedGenomes'];
  onFilterChange: (filter: string) => void;
};

const TopSection = (props: TopSectionProps) => {
  const { speciesImageUrl, genomes, stagedGenomes } = props;
  const dispatch = useAppDispatch();

  const onSpeciesAdd = () => {
    dispatch(commitSelectedSpeciesAndSave(stagedGenomes));
  };

  const selectedGenomesCount = genomes.filter(
    (genome) => genome.isSelected
  ).length;
  const totalGenomesCount = genomes.length;

  return (
    <section className={styles.top}>
      {speciesImageUrl && (
        <span className={styles.speciesImage}>
          <img src={speciesImageUrl} />
        </span>
      )}
      <span className={styles.genomesCount}>
        <InfoPill>
          {selectedGenomesCount} / {totalGenomesCount}
        </InfoPill>
        alternative assemblies selected
      </span>
      <PrimaryButton
        className={styles.addButton}
        disabled={stagedGenomes.length === 0}
        onClick={onSpeciesAdd}
      >
        Add
      </PrimaryButton>
      <div className={styles.filterWrapper}>
        <GenomesFilterField onFilterChange={props.onFilterChange} />
      </div>
    </section>
  );
};

export default GenomeSelectorBySpeciesTaxonomyId;
