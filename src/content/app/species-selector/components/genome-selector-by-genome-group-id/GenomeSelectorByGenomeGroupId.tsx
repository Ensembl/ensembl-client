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

import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useAppSelector } from 'src/store';

import {
  getSortRule,
  isValidPerPageParam,
  DEFAULT_NUM_RESULTS_PER_PAGE
} from 'src/content/app/species-selector/helpers/genomeSearchHelpers';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import {
  useGenomesByGenomeGroupIdQuery,
  getSpeciesSearchLastPageNumber
} from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import useSelectableGenomesTable from 'src/content/app/species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import {
  SpeciesSearchResultsTableWrapper,
  TableControlsSection,
  TableSection
} from 'src/content/app/species-selector/components/species-search-results-table-wrapper/SpeciesSearchResultsTableWrapper';
import SpeciesSearchResultsTable from 'src/content/app/species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';
import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';
import InfoPill from 'src/shared/components/info-pill/InfoPill';
import PaginationWithPerPage from 'src/shared/components/pagination/PaginationWithPerPage';
import GenomesDownloadButton from 'src/content/app/species-selector/components/genomes-download-button/GenomesDownloadButton';

import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';
import type { SortOrderWithNone } from 'src/shared/types/sort-order';

import styles from './GenomeSelectorByGenomeGroupId.module.css';

type Props = {
  genomeGroupId: string | number;
  onSpeciesAdd: (genomes: SpeciesSearchMatch[]) => void;
};

const GenomeSelectorByGenomeGroupId = (props: Props) => {
  const { genomeGroupId } = props;
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get('page') ?? '1');
  const perPageParam = searchParams.get('per_page');
  const sortBy = searchParams.get('sort_by');
  const sortOrder = searchParams.get('order');

  const perPage =
    perPageParam && isValidPerPageParam(perPageParam)
      ? parseInt(perPageParam)
      : DEFAULT_NUM_RESULTS_PER_PAGE;

  const { data, isLoading, isError } = useGenomesByGenomeGroupIdQuery({
    genomeGroupId,
    page: pageNumber,
    perPage,
    sortBy,
    sortOrder
  });

  const { genomes, stagedGenomes, onTableExpandToggle, onGenomeStageToggle } =
    useSelectableGenomesTable({
      genomes: data?.matches ?? [],
      selectedGenomes: committedSpecies
    });

  const onResultsPageChange = (page: number) => {
    const newPageParam = new URLSearchParams(searchParams);
    newPageParam.set('page', `${page}`);
    setSearchParams(newPageParam, { replace: true });
  };

  const onSortRuleChange = useCallback(
    (sortBy: string, sortOrder: SortOrderWithNone) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (sortOrder === 'none') {
        newSearchParams.delete('sort_by');
        newSearchParams.delete('order');
      } else {
        newSearchParams.set('sort_by', sortBy);
        newSearchParams.set('order', sortOrder);
      }
      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const onResultsPerPageChange = (perPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('per_page', `${perPage}`);
    newSearchParams.set('page', `1`);
    setSearchParams(newSearchParams, { replace: true });
  };

  const sortRule = getSortRule(sortBy, sortOrder);

  return (
    <div className={styles.main}>
      {isLoading && <CircleLoader className={styles.loader} />}
      {data && (
        <>
          <TopSection
            {...props}
            genomes={genomes}
            stagedGenomes={stagedGenomes}
          />
          <SpeciesSearchResultsTableWrapper>
            <TableControlsSection>
              <PaginationWithPerPage
                currentPageNumber={pageNumber}
                lastPageNumber={getSpeciesSearchLastPageNumber({
                  data,
                  perPage: perPage
                })}
                onPageChange={onResultsPageChange}
                perPageValue={perPage}
                onPerPageChange={onResultsPerPageChange}
              />
              <GenomesDownloadButton
                searchParam={{
                  name: 'genome_group_id',
                  value: `${genomeGroupId}`
                }}
                className={styles.downloadButton}
              />
            </TableControlsSection>
            <TableSection>
              <SpeciesSearchResultsTable
                results={genomes}
                sortRule={sortRule}
                onTableExpandToggle={onTableExpandToggle}
                onSpeciesSelectToggle={onGenomeStageToggle}
                onSortRuleChange={onSortRuleChange}
              />
            </TableSection>
          </SpeciesSearchResultsTableWrapper>
        </>
      )}
      {isError && <div>An unexpected error has occurred</div>}
    </div>
  );
};

type TopSectionProps = Props & {
  genomes: ReturnType<typeof useSelectableGenomesTable>['genomes'];
  stagedGenomes: ReturnType<typeof useSelectableGenomesTable>['stagedGenomes'];
};

const TopSection = (props: TopSectionProps) => {
  const { genomes, stagedGenomes } = props;
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
    </section>
  );
};

export default GenomeSelectorByGenomeGroupId;
