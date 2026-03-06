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

import { useState, type InputEvent, type SubmitEvent } from 'react';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';
import { getFeatureSearchQueries } from 'src/shared/state/feature-search/featureSearchSelectors';
import {
  updateGeneQuery,
  updateVariantQuery
} from 'src/shared/state/feature-search/featureSearchSlice';
import {
  useLazySearchGenesQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';
import {
  getErrorMessage,
  isNotFoundError
} from 'src/shared/helpers/fetchHelper';
import {
  getFeatureSearchLabelsByMode,
  getFeatureSearchModes,
  type FeatureSearchMode,
  type FeatureSearchAppName
} from 'src/shared/helpers/featureSearchHelpers';

import { PrimaryButton } from 'src/shared/components/button/Button';
import {
  CollapsibleSection,
  CollapsibleSectionBody,
  CollapsibleSectionHead
} from 'src/shared/components/collapsible-section/CollapsibleSection';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import { CircleLoader } from '../loader';
import GeneSearchMatch from 'src/shared/components/search-match/GeneSearchMatch';
import VariantSearchMatch from 'src/shared/components/search-match/VariantSearchMatch';
import NavigateLeftIcon from 'static/icons/navigate-left.svg';
import NavigateRightIcon from 'static/icons/navigate-right.svg';

import type { SearchResults } from 'src/shared/types/search-api/search-results';
import { Status } from 'src/shared/types/status';

import styles from './SidebarSearch.module.css';

type Props = {
  app: FeatureSearchAppName;
  genomeId: string;
  genomeIdForUrl: string;
  trackSidebarSearch?: (query: string) => void;
  onMatchNavigation?: () => void;
};

const SidebarSearch = (props: Props) => {
  const {
    app,
    genomeId,
    genomeIdForUrl,
    trackSidebarSearch,
    onMatchNavigation
  } = props;
  const dispatch = useAppDispatch();
  const searchModes = getFeatureSearchModes();
  const submittedQueries = useAppSelector((state) =>
    getFeatureSearchQueries(state, app, genomeId)
  );

  const [searchInputs, setSearchInputs] = useState<
    Record<FeatureSearchMode, string>
  >({
    gene: submittedQueries.gene ?? '',
    variant: submittedQueries.variant ?? ''
  });
  const [disableSubmitByMode, setDisableSubmitByMode] = useState<
    Record<FeatureSearchMode, boolean>
  >({
    gene: !(submittedQueries.gene ?? '').trim(),
    variant: !(submittedQueries.variant ?? '').trim()
  });

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();

  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const {
    currentData: currentVariantSearchResults,
    error: variantSearchError
  } = variantSearchResults;

  const submitSearch = (
    searchMode: FeatureSearchMode,
    query: string,
    page: number,
    per_page: number
  ) => {
    const searchParams = {
      genome_ids: [genomeId],
      query,
      page: page,
      per_page: per_page
    };

    if (searchMode === 'gene') {
      dispatch(updateGeneQuery({ app, genomeId, query }));

      if (!query.trim()) {
        geneSearchResults.reset();
        return;
      }

      triggerGeneSearch(searchParams);
      return;
    }

    if (searchMode === 'variant') {
      dispatch(updateVariantQuery({ app, genomeId, query }));

      if (!query.trim()) {
        variantSearchResults.reset();
        return;
      }

      triggerVariantSearch(searchParams);
    }
  };

  const onFormSubmit = (
    event: SubmitEvent<HTMLFormElement>,
    searchMode: FeatureSearchMode
  ) => {
    event.preventDefault();
    const query = searchInputs[searchMode] || '';

    setDisableSubmitByMode((currentDisableSubmitByMode) => ({
      ...currentDisableSubmitByMode,
      [searchMode]: true
    }));

    submitSearch(searchMode, query, 1, 20);

    if (trackSidebarSearch) {
      trackSidebarSearch(query);
    }
  };

  const onQueryChange = (
    event: InputEvent<HTMLInputElement>,
    searchMode: FeatureSearchMode
  ) => {
    const newQuery = event.currentTarget.value;
    setSearchInputs((currentSearchInputs) => ({
      ...currentSearchInputs,
      [searchMode]: newQuery
    }));
    setDisableSubmitByMode((currentDisableSubmitByMode) => ({
      ...currentDisableSubmitByMode,
      [searchMode]: !newQuery.trim()
    }));

    if (!newQuery.trim()) {
      submitSearch(searchMode, '', 1, 20);
    }
  };

  const getPageDetails = (searchMode: FeatureSearchMode) => {
    if (searchMode === 'gene' && currentGeneSearchResults) {
      const { page, per_page, total_hits } = currentGeneSearchResults.meta;
      const hasPreviousPage = page > 1;
      const hasNextPage = total_hits > page * per_page;
      const query = submittedQueries.gene ?? '';

      return (
        <PageDetails
          results={currentGeneSearchResults}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          onPreviousClick={() =>
            submitSearch(searchMode, query, page - 1, per_page)
          }
          onNextClick={() =>
            submitSearch(searchMode, query, page + 1, per_page)
          }
        />
      );
    }

    if (searchMode === 'variant' && currentVariantSearchResults) {
      const { page, per_page, total_hits } = currentVariantSearchResults.meta;
      const hasPreviousPage = page > 1;
      const hasNextPage = total_hits > page * per_page;
      const query = submittedQueries.variant ?? '';

      return (
        <PageDetails
          results={currentVariantSearchResults}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          onPreviousClick={() =>
            submitSearch(searchMode, query, page - 1, per_page)
          }
          onNextClick={() =>
            submitSearch(searchMode, query, page + 1, per_page)
          }
        />
      );
    }

    return null;
  };

  const getResultsContent = (searchMode: FeatureSearchMode) => {
    const isCurrentModeLoading =
      searchMode === 'gene'
        ? geneSearchResults.isFetching
        : variantSearchResults.isFetching;

    if (isCurrentModeLoading) {
      return <CircleLoader size="small" />;
    }

    if (searchMode === 'gene' && currentGeneSearchResults) {
      if (currentGeneSearchResults.matches.length === 0) {
        return (
          <span>
            <span className={styles.bold}>Tip:</span> Enter a valid gene symbol
            or ID to find a gene in the species.
          </span>
        );
      }

      return (
        <GeneSearchMatch
          results={currentGeneSearchResults}
          app={app}
          mode="sidebar"
          genomeIdForUrl={genomeIdForUrl}
          onMatchNavigation={onMatchNavigation}
        />
      );
    }

    if (searchMode === 'variant') {
      if (isNotFoundError(variantSearchError)) {
        return (
          <span className={styles.warning}>
            {getErrorMessage(variantSearchError)}
          </span>
        );
      }

      if (
        currentVariantSearchResults &&
        currentVariantSearchResults.matches.length === 0
      ) {
        return (
          <span>
            <span className={styles.bold}>Tip:</span> This may not be a valid
            variant ID for the species.
          </span>
        );
      }

      if (currentVariantSearchResults) {
        return (
          <VariantSearchMatch
            results={currentVariantSearchResults}
            app={app}
            mode="sidebar"
            genomeIdForUrl={genomeIdForUrl}
            onMatchNavigation={onMatchNavigation}
          />
        );
      }
    }

    return null;
  };

  return (
    <div className={styles.sections}>
      {searchModes.map((searchMode) => {
        const searchModeLabels = getFeatureSearchLabelsByMode(searchMode);
        const resultsContent = getResultsContent(searchMode);

        return (
          <div key={searchMode} className={styles.section}>
            <CollapsibleSection isOpen={searchMode === 'gene'}>
              <CollapsibleSectionHead className={styles.sectionHead}>
                {searchModeLabels.label}
              </CollapsibleSectionHead>
              <CollapsibleSectionBody className={styles.sectionBody}>
                <form
                  className={styles.searchFormSidebar}
                  onSubmit={(event) => onFormSubmit(event, searchMode)}
                >
                  <ShadedInput
                    onInput={(event) => onQueryChange(event, searchMode)}
                    value={searchInputs[searchMode] || ''}
                    help={searchModeLabels.help}
                    placeholder={searchModeLabels.placeholder}
                    type="search"
                    autoFocus={true}
                    size="small"
                  />
                  <div className={styles.sidebarBottomRow}>
                    {getPageDetails(searchMode)}
                    <PrimaryButton
                      type="submit"
                      className={styles.submitSidebar}
                      disabled={disableSubmitByMode[searchMode]}
                    >
                      Go
                    </PrimaryButton>
                  </div>
                </form>
                {resultsContent && (
                  <div className={styles.resultsSection}>
                    <div className={styles.matchesSection}>
                      {resultsContent}
                    </div>
                  </div>
                )}
              </CollapsibleSectionBody>
            </CollapsibleSection>
          </div>
        );
      })}
      <SidebarHelpSection />
    </div>
  );
};

const SidebarHelpSection = () => {
  return (
    <div className={styles.section}>
      <CollapsibleSection isOpen={false}>
        <CollapsibleSectionHead className={styles.sectionHead}>
          Help
        </CollapsibleSectionHead>
        <CollapsibleSectionBody
          className={classNames(styles.sectionBody, styles.helpSectionBody)}
        >
          <p>
            You can search for genes or variants by selecting the options above.
          </p>
          <p>
            Genes can be searched for by symbol (e.g. MAPK10) or stable ID (e.g.
            ENSG00000109339.24).
          </p>
          <p>
            You can search for a variant by rsID (only exact matches will be
            shown).
          </p>
        </CollapsibleSectionBody>
      </CollapsibleSection>
    </div>
  );
};

const PageDetails = (props: {
  results: SearchResults;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPreviousClick: () => void;
  onNextClick: () => void;
}) => {
  const {
    results,
    hasPreviousPage,
    hasNextPage,
    onPreviousClick,
    onNextClick
  } = props;
  const { meta } = results;
  const { total_hits, page, per_page } = meta;

  const from = formatNumber((page - 1) * per_page + 1);
  const to = formatNumber(Math.min(page * per_page, total_hits));
  const totalHitsFormatted = formatNumber(total_hits);

  if (total_hits === 0) {
    return (
      <div>
        <span className={styles.totalHits}>{totalHitsFormatted}</span>
        <span className={styles.resultsText}> results</span>
      </div>
    );
  }

  return (
    <div className={styles.pageDetails}>
      <div>
        <span className={styles.pageRange}>
          {from}-{to}
        </span>
        <span className={styles.totalHits}> /{totalHitsFormatted}</span>
        <span className={styles.resultsText}> results</span>
      </div>
      <div>
        <ImageButton
          status={hasPreviousPage ? Status.DEFAULT : Status.DISABLED}
          description="Previous page"
          className={styles.pageNavButton}
          onClick={onPreviousClick}
          image={NavigateLeftIcon}
        />
        <ImageButton
          status={hasNextPage ? Status.DEFAULT : Status.DISABLED}
          description="Next page"
          className={classNames(styles.pageNavButton, styles.pageNavNextButton)}
          onClick={onNextClick}
          image={NavigateRightIcon}
        />
      </div>
    </div>
  );
};

export default SidebarSearch;
