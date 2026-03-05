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
import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
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
import { getInAppFeatureQueries } from 'src/shared/state/feature-search/featureSearchSelectors';
import {
  updateGeneQuery,
  updateVariantQuery
} from 'src/shared/state/feature-search/featureSearchSlice';
import {
  useLazySearchGenesQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';
import { PrimaryButton } from '../button/Button';
import {
  CollapsibleSection,
  CollapsibleSectionBody,
  CollapsibleSectionHead
} from '../collapsible-section/CollapsibleSection';
import ShadedInput from '../input/ShadedInput';
import { CircleLoader } from '../loader';

import sharedStyles from '../feature-search-form/FeatureSearchForm.module.css';
import styles from './SidebarSearchForm.module.css';
import GeneSearchMatch from '../search-match/GeneSearchMatch';
import VariantSearchMatch from '../search-match/VariantSearchMatch';

type Props = {
  app: FeatureSearchAppName;
  genomeId: string;
  genomeTag: string;
  trackSidebarSearch?: (query: string) => void;
  onMatchNavigation?: () => void;
};

const SidebarSearchForm = (props: Props) => {
  const { app, genomeId, genomeTag, trackSidebarSearch, onMatchNavigation } =
    props;
  const dispatch = useAppDispatch();
  const searchModes = getFeatureSearchModes();
  const initialQueries = useAppSelector((state) =>
    getInAppFeatureQueries(state, app, genomeId)
  );

  const [searchInputs, setSearchInputs] = useState<
    Record<FeatureSearchMode, string>
  >({
    gene: initialQueries.gene ?? '',
    variant: initialQueries.variant ?? ''
  });
  const [disableSubmitByMode, setDisableSubmitByMode] = useState<
    Record<FeatureSearchMode, boolean>
  >({
    gene: !(initialQueries.gene ?? '').trim(),
    variant: !(initialQueries.variant ?? '').trim()
  });

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();

  const submitSearch = (searchMode: FeatureSearchMode, query: string) => {
    const searchParams = {
      genome_ids: [genomeId],
      query,
      page: 1,
      per_page: 50
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

    submitSearch(searchMode, query);

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
      submitSearch(searchMode, '');
    }
  };

  const getTotalHits = (searchMode: FeatureSearchMode) => {
    if (searchMode === 'gene' && geneSearchResults.currentData) {
      return (
        <div>
          <span>
            {formatNumber(geneSearchResults.currentData.meta.total_hits)}
          </span>{' '}
          {pluralise('gene', geneSearchResults.currentData.meta.total_hits)}
        </div>
      );
    }

    if (searchMode === 'variant' && variantSearchResults.currentData) {
      return (
        <div>
          <span>
            {formatNumber(variantSearchResults.currentData.meta.total_hits)}
          </span>{' '}
          {pluralise(
            'variant',
            variantSearchResults.currentData.meta.total_hits
          )}
        </div>
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

    if (searchMode === 'gene' && geneSearchResults.currentData) {
      return (
        <GeneSearchMatch
          results={geneSearchResults.currentData}
          app={app}
          mode="sidebar"
          genomeTag={genomeTag}
          onMatchNavigation={onMatchNavigation}
        />
      );
    }

    if (searchMode === 'variant') {
      if (isNotFoundError(variantSearchResults.error)) {
        return (
          <span className={styles.warning}>
            {getErrorMessage(variantSearchResults.error)}
          </span>
        );
      }

      if (variantSearchResults.currentData) {
        return (
          <VariantSearchMatch
            results={variantSearchResults.currentData}
            app={app}
            mode="sidebar"
            genomeTag={genomeTag}
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
        const totalHits = getTotalHits(searchMode);
        const resultsContent = getResultsContent(searchMode);

        return (
          <div key={searchMode} className={styles.section}>
            <CollapsibleSection isOpen={searchMode === 'gene'}>
              <CollapsibleSectionHead className={styles.sectionHead}>
                {searchModeLabels.label}
              </CollapsibleSectionHead>
              <CollapsibleSectionBody className={styles.sectionBody}>
                <form
                  className={sharedStyles.searchFormSidebar}
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
                  <div className={sharedStyles.sidebarBottomRow}>
                    {totalHits && (
                      <div className={sharedStyles.resultsInfo}>
                        {totalHits}
                      </div>
                    )}
                    <PrimaryButton
                      type="submit"
                      className={sharedStyles.submitSidebar}
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
      <div className={styles.section}>
        <CollapsibleSection isOpen={false}>
          <CollapsibleSectionHead className={styles.sectionHead}>
            Help
          </CollapsibleSectionHead>
          <CollapsibleSectionBody
            className={classNames(styles.sectionBody, styles.helpSectionBody)}
          >
            <p>
              You can search for genes or variants by selecting from the options
              above.
            </p>
            <p>
              You can search for a gene by symbol (eg MAPK10) or ID
              (ENSG00000109339.24).
            </p>
            <p>Or you can search for a variant by Ensembl ID.</p>
            <p>
              Please note, you will need to enter at least 3 characters, and
              only exact matches will be shown.
            </p>
          </CollapsibleSectionBody>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default SidebarSearchForm;
