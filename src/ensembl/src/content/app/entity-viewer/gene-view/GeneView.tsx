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
import { replace } from 'connected-react-router';
import { useQuery, gql } from '@apollo/client';
import { useParams, useLocation } from 'react-router-dom';

import usePrevious from 'src/shared/hooks/usePrevious';
import {
  getSelectedGeneViewTabs,
  getGeneViewName
} from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';
import { setGeneViewName } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewActions';
import { GeneViewTabName } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';
import { parseFocusIdFromUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import GeneOverviewImage from './components/gene-overview-image/GeneOverviewImage';
import DefaultTranscriptslist from './components/default-transcripts-list/DefaultTranscriptsList';
import GeneViewTabs from './components/gene-view-tabs/GeneViewTabs';
import GeneFunction from 'src/content/app/entity-viewer/gene-view/components/gene-function/GeneFunction';
import GeneRelationships from 'src/content/app/entity-viewer/gene-view/components/gene-relationships/GeneRelationships';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import { CircleLoader } from 'src/shared/components/loader/Loader';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';

import styles from './GeneView.scss';

type GeneViewWithDataProps = {
  gene: Gene;
};

const QUERY = gql`
  query Gene($id: String!) {
    gene(byId: { id: $id }) {
      id
      slice {
        location {
          start
          end
        }
        region {
          strand {
            code
          }
        }
      }
      transcripts {
        id
        symbol
        biotype
        slice {
          location {
            start
            end
          }
          region {
            name
            strand {
              code
            }
          }
        }
        exons {
          slice {
            location {
              start
              end
            }
          }
        }
        cds {
          start
          end
        }
      }
    }
  }
`;

const GeneView = () => {
  const params: { [key: string]: string } = useParams();
  const { entityId } = params;
  const { objectId: geneId } = parseFocusIdFromUrl(entityId);

  const { loading, data } = useQuery<{ gene: Gene }>(QUERY, {
    variables: { id: geneId }
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

const GeneViewWithData = (props: GeneViewWithDataProps) => {
  const [
    basePairsRulerTicks,
    setBasePairsRulerTicks
  ] = useState<TicksAndScale | null>(null);

  const { genomeId, geneId, selectedTabs } = useGeneViewRouting();
  const focusId = buildFocusIdForUrl({ type: 'gene', objectId: geneId });
  const gbUrl = urlFor.browser({ genomeId, focus: focusId });

  return (
    <div className={styles.geneView}>
      <div className={styles.featureImage}>
        <GeneOverviewImage
          gene={props.gene}
          onTicksCalculated={setBasePairsRulerTicks}
        />
      </div>
      <div className={styles.viewInLinks}>
        <ViewInApp links={{ genomeBrowser: gbUrl }} />
      </div>

      <div className={styles.geneViewTabs}>
        <GeneViewTabs />
      </div>
      <div className={styles.geneViewTabContent}>
        {selectedTabs.primaryTab === GeneViewTabName.TRANSCRIPTS &&
          basePairsRulerTicks && (
            <DefaultTranscriptslist
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
  const view = new URLSearchParams(search).get('view');
  const viewInRedux = useSelector(getGeneViewName);
  const previousGenomeId = usePrevious(genomeId); // genomeId during previous render
  const selectedTabs = useSelector(getSelectedGeneViewTabs);

  useEffect(() => {
    if (previousGenomeId !== genomeId) {
      if (viewInRedux && viewInRedux !== view) {
        const url = urlFor.entityViewer({
          genomeId,
          entityId,
          view: viewInRedux
        });
        dispatch(replace(url));
      }
    } else if (viewInRedux !== view) {
      dispatch(setGeneViewName(view));
    }
  }, [view, viewInRedux, genomeId, previousGenomeId]);

  return {
    genomeId,
    geneId,
    selectedTabs
  };
};

export default GeneView;
