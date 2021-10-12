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

import React from 'react';
import { useSelector } from 'react-redux';
import { gql, useQuery } from '@apollo/client';

import {
  getEntityViewerActiveEntityId,
  getEntityViewerActiveGenomeId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import { parseEnsObjectId } from 'src/shared/state/ens-object/ensObjectHelpers';

import InstantDownloadGene from 'src/shared/components/instant-download/instant-download-gene/InstantDownloadGene';

import styles from './EntityViewerDownloads.scss';
import { GeneMetadata } from 'src/shared/types/thoas/metadata';

const QUERY = gql`
  query Gene($genomeId: String!, $entityId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $entityId }) {
      stable_id
      metadata {
        biotype {
          label
          value
        }
      }
    }
  }
`;

const EntityViewerSidebarDownloads = () => {
  const genomeId = useSelector(getEntityViewerActiveGenomeId);
  const geneId = useSelector(getEntityViewerActiveEntityId);

  const entityId = geneId ? parseEnsObjectId(geneId).objectId : null;

  const { data } = useQuery<{
    gene: { stable_id: string; metadata: GeneMetadata };
  }>(QUERY, {
    variables: { genomeId, entityId }
  });

  if (!data) {
    return null;
  }

  return (
    <section className={styles.container}>
      <h3>Download</h3>
      <InstantDownloadGene
        genomeId={genomeId as string}
        gene={{
          id: data.gene.stable_id,
          biotype: data.gene.metadata.biotype.value
        }}
      />
    </section>
  );
};

export default EntityViewerSidebarDownloads;
