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

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import {
  useGetPopularSpeciesQuery,
  useLazyGetGenomesBySpeciesTaxonomyIdQuery
} from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import useSelectableGenomesTable from 'src/content/app/species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import SpeciesSearchResultsTable from 'src/content/app/species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import GenomesFilterField from 'src/content/app/species-selector/components/genomes-filter-field/GenomesFilterField';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';
import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';
import InfoPill from 'src/shared/components/info-pill/InfoPill';

import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';

import styles from './GenomeSelectorBySpeciesTaxonomyId.module.css';

type Props = {
  speciesTaxonomyId: string | number;
  onSpeciesAdd: (genomes: SpeciesSearchMatch[]) => void;
};

const GenomeSelectorBySpeciesTaxonomyId = (props: Props) => {
  const { speciesTaxonomyId } = props;
  const [filterQuery, setFilterQuery] = useState('');
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const [searchTrigger, result] = useLazyGetGenomesBySpeciesTaxonomyIdQuery();
  const { currentData: popularSpeciesData } = useGetPopularSpeciesQuery();
  const { currentData, isLoading, isError } = result;

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
    selectedGenomes: committedSpecies,
    filterQuery
  });

  useEffect(() => {
    searchTrigger({ speciesTaxonomyId });
  }, []);

  const speciesImageUrl = popularSpeciesData?.popular_species.find(
    (species) => species.species_taxonomy_id === speciesTaxonomyId
  )?.image;

  return (
    <div className={styles.main}>
      {isLoading && <CircleLoader className={styles.loader} />}
      {currentData && (
        <>
          <TopSection
            {...props}
            genomes={genomes}
            stagedGenomes={stagedGenomes}
            speciesImageUrl={speciesImageUrl}
            onFilterChange={setFilterQuery}
          />
          <div className={styles.tableContainer}>
            <SpeciesSearchResultsTable
              results={genomes}
              isExpanded={isTableExpanded}
              sortRule={sortRule}
              onTableExpandToggle={onTableExpandToggle}
              onSpeciesSelectToggle={onGenomeStageToggle}
              onSortRuleChange={changeSortRule}
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
  speciesImageUrl: string | undefined;
  onFilterChange: (filter: string) => void;
};

const TopSection = (props: TopSectionProps) => {
  const { genomes, stagedGenomes, speciesImageUrl } = props;
  const navigate = useNavigate();

  const onSpeciesAdd = () => {
    props.onSpeciesAdd(stagedGenomes);
  };

  const onClose = () => {
    navigate(-1);
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
        assemblies selected
      </span>
      <PrimaryButton
        className={styles.addButton}
        disabled={stagedGenomes.length === 0}
        onClick={onSpeciesAdd}
      >
        Add
      </PrimaryButton>
      <CloseButtonWithLabel className={styles.closeButton} onClick={onClose} />
      <div className={styles.filterWrapper}>
        <GenomesFilterField onFilterChange={props.onFilterChange} />
      </div>
    </section>
  );
};

export default GenomeSelectorBySpeciesTaxonomyId;
