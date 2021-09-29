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
import { parseEnsObjectIdFromUrl } from 'src/shared/state/ens-object/ensObjectHelpers';
import { getGeneName } from 'src/shared/helpers/formatters/geneFormatter';

import GenePublications from '../publications/GenePublications';
import MainAccordion from './MainAccordion';
import ExternalReference from 'src/shared/components/external-reference/ExternalReference';

import { EntityViewerParams } from 'src/content/app/entity-viewer/EntityViewer';
import { FullGene } from 'src/shared/types/thoas/gene';

import styles from './GeneOverview.scss';

/*  
  TODO: When more data becomes available
  Please refer to the PR https://github.com/Ensembl/ensembl-client/pull/422
  and check if some of the deleted code segments can be reused to display the new data.
*/
export const GENE_OVERVIEW_QUERY = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      alternative_symbols
      name
      stable_id
      symbol
      metadata {
        name {
          accession_id
          url
        }
      }
    }
  }
`;

type Gene = Required<
  Pick<
    FullGene,
    'stable_id' | 'symbol' | 'name' | 'alternative_symbols' | 'metadata'
  >
>;

const GeneOverview = () => {
  const params: EntityViewerParams = useParams();
  const { entityId, genomeId } = params;
  const geneId = entityId ? parseEnsObjectIdFromUrl(entityId).objectId : null;

  const { data, loading } = useQuery<{ gene: Gene }>(GENE_OVERVIEW_QUERY, {
    variables: {
      geneId,
      genomeId
    },
    skip: !geneId
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
      <section>
        <div className={styles.sectionContent}>
          {!!gene.symbol && (
            <span className={styles.geneSymbol}>{gene.symbol}</span>
          )}
          <span>{gene.stable_id}</span>
        </div>
      </section>

      <section>
        <div className={styles.sectionHead}>Gene name</div>
        <div className={styles.sectionContent}>
          <div className={styles.geneName}>{getGeneName(gene.name)}</div>
          {gene.metadata.name && (
            <ExternalReference
              classNames={{
                container: styles.externalRefContainer,
                link: styles.externalRefLink
              }}
              to={gene.metadata.name.url}
              linkText={gene.metadata.name.accession_id}
            />
          )}
        </div>
      </section>

      <section>
        <div className={styles.sectionHead}>Synonyms</div>
        <div className={styles.sectionContent}>
          <div className={styles.synonyms}>
            {gene.alternative_symbols.length
              ? gene.alternative_symbols.join(', ')
              : 'None'}
          </div>
        </div>
      </section>

      <MainAccordion />

      <GenePublications gene={gene} />
    </div>
  );
};

export default GeneOverview;
