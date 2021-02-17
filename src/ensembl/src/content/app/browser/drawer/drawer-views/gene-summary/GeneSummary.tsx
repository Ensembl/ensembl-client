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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import {
  buildFocusIdForUrl,
  getDisplayStableId
} from 'src/shared/state/ens-object/ensObjectHelpers';
import { getBrowserActiveEnsObject } from 'src/content/app/browser/browserSelectors';

import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import { EnsObjectGene } from 'src/shared/state/ens-object/ensObjectTypes';
import { Gene as GeneFromGraphql } from 'src/shared/types/thoas/gene';

import styles from './GeneSummary.scss';

const GENE_QUERY = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      alternative_symbols
      name
      stable_id
      symbol
      so_term
      transcripts {
        stable_id
      }
      slice {
        strand {
          code
          value
        }
        location {
          length
        }
      }
    }
  }
`;

type Gene = Required<
  Pick<
    GeneFromGraphql,
    | 'stable_id'
    | 'symbol'
    | 'name'
    | 'alternative_symbols'
    | 'so_term'
    | 'transcripts'
    | 'slice'
  >
>;

const GeneSummary = () => {
  const ensObjectGene = useSelector(getBrowserActiveEnsObject) as EnsObjectGene;

  const { data, loading } = useQuery<{ gene: Gene }>(GENE_QUERY, {
    variables: {
      geneId: ensObjectGene.stable_id,
      genomeId: ensObjectGene.genome_id
    },
    skip: !ensObjectGene.stable_id
  });

  if (loading || !data?.gene) {
    return null;
  }

  if (!data?.gene) {
    return <div>No data available</div>;
  }

  const { gene } = data;

  const stableId = getDisplayStableId(gene);

  const focusId = buildFocusIdForUrl({
    type: 'gene',
    objectId: gene.stable_id as string
  });
  const entityViewerUrl = urlFor.entityViewer({
    genomeId: ensObjectGene.genome_id,
    entityId: focusId
  });

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.label}>Gene</div>
        <div className={styles.value}>
          <div className={styles.featureDetails}>
            {gene.symbol && (
              <span className={styles.featureSymbol}>{gene.symbol}</span>
            )}
            <span className={styles.stableId}>{stableId}</span>
            <div>{gene.so_term.toLowerCase()}</div>
            <div>{getStrandDisplayName(gene.slice.strand.code)}</div>
            <div>{getFormattedLocation(ensObjectGene.location)}</div>
          </div>
        </div>
      </div>

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.label}>Gene name</div>
        <div className={styles.value}>{gene.name}</div>
      </div>

      {gene.alternative_symbols.length > 0 && (
        <div className={`${styles.row} ${styles.spaceAbove}`}>
          <div className={styles.label}>Synonyms</div>
          <div className={styles.value}>
            {gene.alternative_symbols.join(', ')}
          </div>
        </div>
      )}

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.value}>
          {`${gene.transcripts.length} transcripts`}
        </div>
      </div>

      <div className={`${styles.row} ${styles.spaceAbove}`}>
        <div className={styles.value}>
          <ViewInApp links={{ entityViewer: { url: entityViewerUrl } }} />
        </div>
      </div>
    </div>
  );
};

export default GeneSummary;
