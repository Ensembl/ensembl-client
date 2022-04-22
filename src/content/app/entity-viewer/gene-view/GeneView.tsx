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
import classNames from 'classnames';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store';
import { useRestoreScrollPosition } from 'src/shared/hooks/useRestoreScrollPosition';
import usePrevious from 'src/shared/hooks/usePrevious';
import { useDefaultEntityViewerGeneQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import {
  getSelectedGeneViewTabs,
  getCurrentView
} from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSelectors';
import {
  updateView,
  View,
  GeneViewTabName
} from 'src/content/app/entity-viewer/state/gene-view/view/geneViewViewSlice';
import { updatePreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSlice';
import { setFilterPanel } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';
import {
  getFilters,
  getSortingRule,
  getFilterPanelOpen
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { parseFocusIdFromUrl } from 'src/shared/helpers/focusObjectHelpers';

import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import GeneOverviewImage from './components/gene-overview-image/GeneOverviewImage';
import DefaultTranscriptsList from './components/default-transcripts-list/DefaultTranscriptsList';
import GeneViewTabs from './components/gene-view-tabs/GeneViewTabs';
import TranscriptsFilter from 'src/content/app/entity-viewer/gene-view/components/transcripts-filter/TranscriptsFilter';
import GeneFunction from 'src/content/app/entity-viewer/gene-view/components/gene-function/GeneFunction';
import GeneRelationships from 'src/content/app/entity-viewer/gene-view/components/gene-relationships/GeneRelationships';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import { CircleLoader } from 'src/shared/components/loader';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import { SortingRule } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';
import type { DefaultEntityViewerGeneQueryResult } from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

import styles from './GeneView.scss';

type GeneViewWithDataProps = {
  gene: DefaultEntityViewerGeneQueryResult['gene'];
};

const GeneView = () => {
  const params = useParams<'genomeId' | 'entityId'>();
  const { genomeId, entityId } = params;
  const { objectId: geneId } = parseFocusIdFromUrl(entityId as string);

  const { currentData, isFetching } = useDefaultEntityViewerGeneQuery({
    geneId,
    genomeId: genomeId as string
  });

  // TODO decide about error handling
  if (isFetching) {
    return (
      <div className={styles.geneViewLoadingContainer}>
        <CircleLoader />
      </div>
    );
  } else if (!currentData) {
    return null;
  }

  return <GeneViewWithData gene={currentData.gene} />;
};

const COMPONENT_ID = 'entity_viewer_gene_view';

const GeneViewWithData = (props: GeneViewWithDataProps) => {
  const [basePairsRulerTicks, setBasePairsRulerTicks] =
    useState<TicksAndScale | null>(null);

  const isFilterPanelOpen = useAppSelector(getFilterPanelOpen);
  const sortingRule = useAppSelector(getSortingRule);
  const filters = useAppSelector(getFilters);
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const { trackFiltersPanelOpen } = useEntityViewerAnalytics();
  const view = new URLSearchParams(search).get('view');
  const geneStableId = props.gene.stable_id;
  const uniqueScrollReferenceId = `${COMPONENT_ID}_${geneStableId}_${view}`;

  const { targetElementRef } = useRestoreScrollPosition({
    referenceId: uniqueScrollReferenceId
  });

  const { genomeId, geneId, selectedTabs } = useGeneViewRouting();
  const focusId = buildFocusIdForUrl({ type: 'gene', objectId: geneId });
  const gbUrl = urlFor.browser({ genomeId, focus: focusId });

  const shouldShowFilterIndicator =
    sortingRule !== SortingRule.DEFAULT ||
    Object.values(filters).some((filter) => filter.selected);

  const filterLabel = (
    <span
      className={classNames({
        [styles.labelWithActivityIndicator]: shouldShowFilterIndicator
      })}
    >
      Filter & sort
    </span>
  );

  const toggleFilterPanel = () => {
    if (!isFilterPanelOpen) {
      trackFiltersPanelOpen();
    }
    dispatch(setFilterPanel(!isFilterPanelOpen));
  };

  const filterLabelClass = isFilterPanelOpen ? styles.openFilterLabel : '';

  useEffect(() => {
    if (!genomeId || !props.gene) {
      return;
    }

    return () => {
      dispatch(
        updatePreviouslyViewedEntities({
          genomeId,
          gene: props.gene
        })
      );
    };
  }, [genomeId, geneStableId]);

  return (
    <div className={styles.geneView} ref={targetElementRef}>
      <div className={styles.featureImage}>
        <GeneOverviewImage
          gene={props.gene}
          onTicksCalculated={setBasePairsRulerTicks}
        />
      </div>
      <div className={styles.viewInLinks}>
        <ViewInApp
          links={{ genomeBrowser: { url: gbUrl } }}
          classNames={{ label: styles.viewInAppLabel }}
        />
      </div>
      <div className={styles.geneViewTabs}>
        <div
          className={classNames([styles.filterLabelContainer], {
            [styles.openFilterLabelContainer]: isFilterPanelOpen
          })}
        >
          {props.gene.transcripts.length > 5 && (
            <div className={styles.filterLabelWrapper}>
              <ShowHide
                classNames={{
                  label: filterLabelClass
                }}
                onClick={toggleFilterPanel}
                isExpanded={isFilterPanelOpen}
                label={filterLabel}
              />
            </div>
          )}
        </div>
        <div className={styles.tabWrapper}>
          <GeneViewTabs isFilterPanelOpen={isFilterPanelOpen} />
        </div>
        {isFilterPanelOpen && (
          <div className={styles.filtersWrapper}>
            <TranscriptsFilter
              toggleFilterPanel={toggleFilterPanel}
              transcripts={props.gene.transcripts}
            />
          </div>
        )}
      </div>

      <div className={styles.geneViewTabContent}>
        {selectedTabs.primaryTab === GeneViewTabName.TRANSCRIPTS &&
          basePairsRulerTicks && (
            <DefaultTranscriptsList
              gene={props.gene}
              rulerTicks={basePairsRulerTicks}
            />
          )}

        {selectedTabs.primaryTab === GeneViewTabName.GENE_FUNCTION && (
          <GeneFunction gene={props.gene} />
        )}

        {selectedTabs.primaryTab === GeneViewTabName.GENE_RELATIONSHIPS && (
          <GeneRelationships />
        )}
      </div>
    </div>
  );
};

const isViewParameterValid = (view: string) =>
  Object.values(View).some((value) => value === view);

const useGeneViewRouting = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams<'genomeId' | 'entityId'>();
  const { genomeId, entityId } = params;
  const { objectId: geneId } = parseFocusIdFromUrl(entityId as string);
  const { search } = useLocation();
  // TODO: discuss – is using URLSearchParams better than using the querystring package?

  const urlSearchParams = new URLSearchParams(search);
  const view = urlSearchParams.get('view');
  const proteinId = urlSearchParams.get('protein_id');
  const viewInRedux = useAppSelector(getCurrentView) || View.TRANSCRIPTS;
  const previousGenomeId = usePrevious(genomeId); // genomeId during previous render
  const selectedTabs = useAppSelector(getSelectedGeneViewTabs);

  useEffect(() => {
    if (view && isViewParameterValid(view) && viewInRedux !== view) {
      dispatch(updateView(view as View));
    } else {
      const url = urlFor.entityViewer({
        genomeId,
        entityId,
        view: viewInRedux,
        proteinId
      });
      navigate(url, { replace: true });
    }
  }, [view, viewInRedux, genomeId, previousGenomeId]);

  return {
    genomeId,
    geneId,
    selectedTabs
  };
};

export default GeneView;
