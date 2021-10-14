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
import { useQuery, gql } from '@apollo/client';

import { GeneSummaryStrip } from 'src/shared/components/feature-summary-strip';

import { Slice } from 'src/shared/types/thoas/slice';

import styles from './EntityViewerTopbar.scss';
import { GeneMetadata } from 'src/shared/types/thoas/metadata';

export type EntityViewerTopbarProps = {
  genomeId: string;
  entityId: string;
};

const QUERY = gql`
  query Gene($genomeId: String!, $entityId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $entityId }) {
      stable_id
      unversioned_stable_id
      symbol
      slice {
        location {
          start
          end
        }
        strand {
          code
        }
        region {
          name
        }
      }
      metadata {
        biotype {
          label
        }
      }
    }
  }
`;

type Gene = {
  stable_id: string;
  unversioned_stable_id: string;
  symbol: string;
  metadata: GeneMetadata;
  slice: Slice;
};

export const EntityViewerTopbar = (props: EntityViewerTopbarProps) => {
  const { genomeId } = props;
  const entityId = props.entityId.split(':').pop();
  const { data } = useQuery<{ gene: Gene }>(QUERY, {
    variables: { entityId, genomeId }
  });

  return (
    <div className={styles.container}>
      {data ? (
        <GeneSummaryStrip gene={geneToEnsObjectFields(data.gene)} />
      ) : null}
    </div>
  );
};

// NOTE: temporary adaptor
const geneToEnsObjectFields = (gene: Gene) => {
  return {
    stable_id: gene.unversioned_stable_id,
    versioned_stable_id: gene.stable_id,
    label: gene.symbol,
    bio_type: gene.metadata.biotype.label,
    strand: gene.slice.strand.code,
    location: {
      chromosome: gene.slice.region.name,
      start: gene.slice.location.start,
      end: gene.slice.location.end
    }
  };
};

export default EntityViewerTopbar;
