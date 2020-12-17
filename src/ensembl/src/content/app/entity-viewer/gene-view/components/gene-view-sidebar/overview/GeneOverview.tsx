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
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import { parseEnsObjectIdFromUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import { EntityViewerParams } from 'src/content/app/entity-viewer/EntityViewer';
import { Gene } from 'src/content/app/entity-viewer/types/gene';

import styles from './GeneOverview.scss';

const QUERY = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      alternative_symbols
      name
      stable_id
      symbol
    }
  }
`;

const GeneOverview = () => {
  const params: EntityViewerParams = useParams();
  const { entityId, genomeId } = params;
  const stableId = entityId ? parseEnsObjectIdFromUrl(entityId).objectId : null;

  const { data, loading } = useQuery<{ gene: Gene }>(QUERY, {
    variables: {
      stable_id: stableId,
      genome_id: genomeId
    },
    skip: !stableId
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.gene) {
    return <div>No data to display</div>;
  }

  const { gene } = data;

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.geneDetails}>
        <span className={styles.geneSymbol}>{gene.symbol}</span>
        <span>{gene.stable_id}</span>
      </div>

      <div className={styles.sectionHead}>Gene name</div>

      <div className={styles.geneName}>
        <ExternalReference
          label={gene.name as string}
          linkText={gene.name || ''}
          to={''}
        />
      </div>
      {gene.alternative_symbols && (
        <div>
          <div className={styles.sectionHead}>Synonyms</div>
          <div className={styles.synonyms}>
            {gene.alternative_symbols.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneOverview;
