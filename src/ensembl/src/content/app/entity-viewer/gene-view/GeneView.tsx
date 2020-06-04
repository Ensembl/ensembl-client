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

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { parseFocusIdFromUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import { getEntityViewerActiveEnsObject } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getEntityViewerActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewSelectors';

import GeneOverviewImage from './components/gene-overview-image/GeneOverviewImage';
import DefaultTranscriptslist from './components/default-transcripts-list/DefaultTranscriptsList';
import GeneViewTabs from './components/gene-view-tabs/GeneViewTabs';
import GeneFunction from 'src/content/app/entity-viewer/gene-view/components/gene-function/GeneFunction';
import GeneRelationships from 'src/content/app/entity-viewer/gene-view/components/gene-relationships/GeneRelationships';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import { CircleLoader } from 'src/shared/components/loader/Loader';

import { GeneViewTabName } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState.ts';
import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { RootState } from 'src/store';

import styles from './GeneView.scss';

type GeneViewProps = {
  geneId: string | null;
  selectedGeneTabName: GeneViewTabName;
};

type GeneViewWithDataProps = {
  gene: Gene;
  selectedGeneTabName: GeneViewTabName;
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

const GeneView = (props: GeneViewProps) => {
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

  return (
    <GeneViewWithData
      gene={data.gene}
      selectedGeneTabName={props.selectedGeneTabName}
    />
  );
};

const GeneViewWithData = (props: GeneViewWithDataProps) => {
  const [
    basePairsRulerTicks,
    setBasePairsRulerTicks
  ] = useState<TicksAndScale | null>(null);

  const params: { [key: string]: string } = useParams();
  const { genomeId, entityId } = params;
  const gbUrl = urlFor.browser({ genomeId, focus: entityId });

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
        {props.selectedGeneTabName === GeneViewTabName.TRANSCRIPTS &&
          basePairsRulerTicks && (
            <DefaultTranscriptslist
              gene={props.gene}
              rulerTicks={basePairsRulerTicks}
            />
          )}

        {props.selectedGeneTabName === GeneViewTabName.GENE_FUNCTION && (
          <GeneFunction gene={props.gene} />
        )}

        {props.selectedGeneTabName === GeneViewTabName.GENE_RELATIONSHIPS && (
          <GeneRelationships />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  // FIXME: this will have to be superseded with a proper way we get ids
  geneId: getEntityViewerActiveEnsObject(state)?.stable_id || null,
  selectedGeneTabName: getEntityViewerActiveGeneTab(state)
});

export default connect(mapStateToProps)(GeneView);
