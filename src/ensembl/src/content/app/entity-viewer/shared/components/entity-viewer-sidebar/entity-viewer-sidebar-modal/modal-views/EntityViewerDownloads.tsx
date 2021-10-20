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
import { isProteinCodingGene } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import InstantDownloadGene from 'src/shared/components/instant-download/instant-download-gene/InstantDownloadGene';

import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';

import styles from './EntityViewerDownloads.scss';

const QUERY = gql`
  query Gene($genomeId: String!, $entityId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $entityId }) {
      stable_id
      transcripts {
        product_generating_contexts {
          product_type
        }
      }
    }
  }
`;

type Transcript = {
  product_generating_contexts: Pick<
    FullProductGeneratingContext,
    'product_type'
  >[];
};

const EntityViewerSidebarDownloads = () => {
  const genomeId = useSelector(getEntityViewerActiveGenomeId);
  const geneId = useSelector(getEntityViewerActiveEntityId);

  const entityId = geneId ? parseEnsObjectId(geneId).objectId : null;

  const { data } = useQuery<{
    gene: { stable_id: string; transcripts: Transcript[] };
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
          isProteinCoding: isProteinCodingGene(data.gene)
        }}
      />
    </section>
  );
};

export default EntityViewerSidebarDownloads;
