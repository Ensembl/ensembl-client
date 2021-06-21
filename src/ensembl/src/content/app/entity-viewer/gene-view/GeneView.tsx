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
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { replace } from 'connected-react-router';
import { useQuery, gql } from '@apollo/client';
import { useParams, useLocation } from 'react-router-dom';

import { useRestoreScrollPosition } from 'src/shared/hooks/useRestoreScrollPosition';
import usePrevious from 'src/shared/hooks/usePrevious';
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
import { closeSidebarModal } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import {
  getFilters,
  getSortingRule
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';
import { parseFocusIdFromUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import GeneOverviewImage, {
  GeneOverviewImageProps
} from './components/gene-overview-image/GeneOverviewImage';
import DefaultTranscriptsList, {
  Props as DefaultTranscriptsListProps
} from './components/default-transcripts-list/DefaultTranscriptsList';
import GeneViewTabs from './components/gene-view-tabs/GeneViewTabs';
import TranscriptsFilter from 'src/content/app/entity-viewer/gene-view/components/transcripts-filter/TranscriptsFilter';
import GeneFunction, {
  Props as GeneFunctionProps
} from 'src/content/app/entity-viewer/gene-view/components/gene-function/GeneFunction';
import GeneRelationships from 'src/content/app/entity-viewer/gene-view/components/gene-relationships/GeneRelationships';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import { CircleLoader } from 'src/shared/components/loader/Loader';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';

import { FullGene } from 'src/shared/types/thoas/gene';
import { SortingRule } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import { ReactComponent as ChevronDown } from 'static/img/shared/chevron-down.svg';

import styles from './GeneView.scss';

type Gene = Pick<FullGene, 'symbol'> &
  GeneOverviewImageProps['gene'] &
  DefaultTranscriptsListProps['gene'] &
  GeneFunctionProps['gene'];

type GeneViewWithDataProps = {
  gene: Gene;
};

const QUERY = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      symbol
      unversioned_stable_id
      version
      slice {
        location {
          start
          end
        }
        strand {
          code
        }
      }
      transcripts {
        stable_id
        unversioned_stable_id
        so_term
        slice {
          location {
            start
            end
            length
          }
          region {
            name
          }
          strand {
            code
          }
        }
        relative_location {
          start
          end
        }
        spliced_exons {
          relative_location {
            start
            end
          }
          exon {
            stable_id
            slice {
              location {
                length
              }
            }
          }
        }
        product_generating_contexts {
          product_type
          cds {
            relative_start
            relative_end
          }
          cdna {
            length
          }
          phased_exons {
            start_phase
            end_phase
            exon {
              stable_id
            }
          }
          product {
            stable_id
            unversioned_stable_id
            length
            external_references {
              accession_id
              name
              description
              source {
                id
              }
            }
          }
        }
      }
    }
  }
`;

const GeneView = () => {
  const params: { [key: string]: string } = useParams();
  const { genomeId, entityId } = params;
  const { objectId: geneId } = parseFocusIdFromUrl(entityId);

  const { loading, data } = useQuery<{ gene: Gene }>(QUERY, {
    variables: { geneId, genomeId }
  });

  // TODO decide about error handling
  if (loading) {
    return (
      <div className={styles.geneViewLoadingContainer}>
        <CircleLoader />
      </div>
    );
  } else if (!data) {
    return null;
  }

  return <GeneViewWithData gene={data.gene} />;
};

const COMPONENT_ID = 'entity_viewer_gene_view';

const GeneViewWithData = (props: GeneViewWithDataProps) => {
  const [basePairsRulerTicks, setBasePairsRulerTicks] =
    useState<TicksAndScale | null>(null);

  const [isFilterOpen, setFilterOpen] = useState(false);

  const sortingRule = useSelector(getSortingRule);
  const filters = useSelector(getFilters);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const view = new URLSearchParams(search).get('view');

  const uniqueScrollReferenceId = `${COMPONENT_ID}_${props.gene.stable_id}_${view}`;

  const { targetElementRef } = useRestoreScrollPosition({
    referenceId: uniqueScrollReferenceId
  });

  const { genomeId, geneId, selectedTabs } = useGeneViewRouting();
  const focusId = buildFocusIdForUrl({ type: 'gene', objectId: geneId });
  const gbUrl = urlFor.browser({ genomeId, focus: focusId });

  const isSidebarOpen = useSelector(isEntityViewerSidebarOpen);

  const shouldShowFilterIndicator =
    sortingRule !== SortingRule.DEFAULT || Object.values(filters).some(Boolean);

  const filterLabel = (
    <span
      className={classNames({
        [styles.labelWithActivityIndicator]: shouldShowFilterIndicator
      })}
    >
      Filter & sort
    </span>
  );

  const toggleFilter = () => {
    setFilterOpen(!isFilterOpen);
  };

  useEffect(() => {
    if (!genomeId || !props.gene) {
      return;
    }

    if (isSidebarOpen) {
      dispatch(closeSidebarModal());
    }

    dispatch(
      updatePreviouslyViewedEntities({
        genomeId,
        gene: props.gene
      })
    );
  }, [genomeId, geneId]);

  return (
    <div className={styles.geneView} ref={targetElementRef}>
      <div className={styles.featureImage}>
        <GeneOverviewImage
          gene={props.gene}
          onTicksCalculated={setBasePairsRulerTicks}
        />
      </div>
      <div className={styles.viewInLinks}>
        <ViewInApp links={{ genomeBrowser: { url: gbUrl } }} />
      </div>
      <div className={styles.geneViewTabs}>
        <div
          className={classNames([styles.filterLabelContainer], {
            [styles.openFilterLabelContainer]: isFilterOpen
          })}
        >
          {props.gene.transcripts.length > 5 && (
            <div className={styles.filterLabelWrapper}>
              <div
                className={classNames([styles.filterLabel], {
                  [styles.openFilterLabel]: isFilterOpen
                })}
                onClick={toggleFilter}
              >
                {filterLabel}
                <ChevronDown
                  className={classNames([styles.chevron], {
                    [styles.chevronUp]: isFilterOpen
                  })}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.tabWrapper}>
          <GeneViewTabs isFilterOpen={isFilterOpen} />
        </div>
        {isFilterOpen && (
          <div className={styles.filtersWrapper}>
            <TranscriptsFilter
              toggleFilter={toggleFilter}
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

const useGeneViewRouting = () => {
  const dispatch = useDispatch();
  const params: { [key: string]: string } = useParams();
  const { genomeId, entityId } = params;
  const { objectId: geneId } = parseFocusIdFromUrl(entityId);
  const { search } = useLocation();
  // TODO: discuss – is using URLSearchParams better than using the querystring package?

  const urlSearchParams = new URLSearchParams(search);
  const view = urlSearchParams.get('view');
  const proteinId = urlSearchParams.get('protein_id');
  const viewInRedux = useSelector(getCurrentView) || View.TRANSCRIPTS;
  const previousGenomeId = usePrevious(genomeId); // genomeId during previous render
  const selectedTabs = useSelector(getSelectedGeneViewTabs);

  useEffect(() => {
    if (view && viewInRedux !== view) {
      dispatch(updateView(view as View));
    } else {
      const url = urlFor.entityViewer({
        genomeId,
        entityId,
        view: viewInRedux,
        proteinId
      });
      dispatch(replace(url));
    }
  }, [view, viewInRedux, genomeId, previousGenomeId]);

  return {
    genomeId,
    geneId,
    selectedTabs
  };
};

export default GeneView;
