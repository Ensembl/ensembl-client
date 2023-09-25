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

import React, { useEffect } from 'react';

import { useAppDispatch } from 'src/store';

import { useLazyGetGenomesBySpeciesTaxonomyIdQuery } from 'src/content/app/new-species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import { commitSelectedSpeciesAndSave } from 'src/content/app/new-species-selector/state/species-selector-search-slice/speciesSelectorSearchSlice';

import useSelectableGenomesTable from 'src/content/app/new-species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import SpeciesSearchResultsTable from 'src/content/app/new-species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import { PrimaryButton } from 'src/shared/components/button/Button';
import InfoPill from 'src/shared/components/info-pill/InfoPill';

import styles from './GenomeSelectorBySpeciesTaxonomyId.scss';

type Props = {
  speciesTaxonomyId: string | number;
  speciesImageUrl: string | null;
};

const GenomeSelectorBySpeciesTaxonomyId = (props: Props) => {
  const { speciesTaxonomyId } = props;
  const [searchTrigger, result] = useLazyGetGenomesBySpeciesTaxonomyIdQuery();
  const { currentData } = result;

  const {
    genomes,
    preselectedGenomes,
    isTableExpanded,
    onTableExpandToggle,
    onGenomePreselectToggle
  } = useSelectableGenomesTable(currentData?.matches ?? []);

  useEffect(() => {
    searchTrigger({ speciesTaxonomyId });
  }, []);

  return (
    <div className={styles.main}>
      {currentData && (
        <>
          <TopContent
            {...props}
            genomes={genomes}
            preselectedGenomes={preselectedGenomes}
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
    </div>
  );
};

type TopContentProps = Props & {
  genomes: ReturnType<typeof useSelectableGenomesTable>['genomes'];
  preselectedGenomes: ReturnType<
    typeof useSelectableGenomesTable
  >['preselectedGenomes'];
};

const TopContent = (props: TopContentProps) => {
  const { speciesImageUrl, genomes, preselectedGenomes } = props;
  const dispatch = useAppDispatch();

  const onSpeciesAdd = () => {
    dispatch(commitSelectedSpeciesAndSave(preselectedGenomes));
  };

  const selectedGenomesCount = genomes.filter(
    (genome) => genome.isSelected
  ).length;
  const totalGenomesCount = genomes.length;

  return (
    <div className={styles.top}>
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
        disabled={preselectedGenomes.length === 0}
        onClick={onSpeciesAdd}
      >
        Add
      </PrimaryButton>
    </div>
  );
};

export default GenomeSelectorBySpeciesTaxonomyId;
