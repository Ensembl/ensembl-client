import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { getEntityViewerActiveEnsObject } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import GeneOverviewImage from './components/gene-overview-image/GeneOverviewImage';
import DefaultTranscriptslist from './components/default-transcripts-list/DefaultTranscriptsList';
import GeneViewTabs from './components/gene-view-tabs/GeneViewTabs';
import { getEntityViewerActiveGeneTab } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneSelectors';
import GeneFunction from 'src/content/app/entity-viewer/gene-view/components/gene-function/GeneFunction';
import GeneRelationships from 'src/content/app/entity-viewer/gene-view/components/gene-relationships/GeneRelationships';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { TicksAndScale } from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import { RootState } from 'src/store';

import styles from './GeneView.scss';

type GeneViewProps = {
  geneId: string | null;
  selectedGeneTabName: string | null;
};

type GeneViewWithDataProps = {
  gene: Gene;
  selectedGeneTabName: string | null;
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
        slice {
          location {
            start
            end
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
      }
    }
  }
`;

const GeneView = (props: GeneViewProps) => {
  const { data } = useQuery<{ gene: Gene }>(QUERY, {
    variables: { id: props.geneId },
    skip: !props.geneId
  });

  // TODO decide about the loader and possibly about error handling

  if (!data) {
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

  return (
    <div className={styles.geneView}>
      <div className={styles.featureImage}>
        <GeneOverviewImage
          gene={props.gene}
          onTicksCalculated={setBasePairsRulerTicks}
        />
      </div>
      <div className={styles.viewInLinks}>View in GB</div>

      <div className={styles.geneViewTabs}>
        <GeneViewTabs />
      </div>
      <div className={styles.geneViewTabbedContent}>
        {props.selectedGeneTabName === 'Transcripts' && (
          <div className={styles.geneViewTable}>
            {basePairsRulerTicks && (
              <DefaultTranscriptslist
                gene={props.gene}
                rulerTicks={basePairsRulerTicks}
              />
            )}
          </div>
        )}

        {props.selectedGeneTabName === 'Gene function' && <GeneFunction />}

        {props.selectedGeneTabName === 'Gene relationships' && (
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
