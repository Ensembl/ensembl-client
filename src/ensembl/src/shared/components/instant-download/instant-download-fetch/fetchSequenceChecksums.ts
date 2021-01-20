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

import { gql } from '@apollo/client';

import { client } from 'src/gql-client';

import { ProductGeneratingContext } from 'src/content/app/entity-viewer/types/productGeneratingContext';

type GeneFragment = {
  transcript: {
    product_generating_contexts: ProductGeneratingContextFragment[];
  };
};

export type ProductGeneratingContextFragment = Pick<
  ProductGeneratingContext,
  'cdna' | 'cds' | 'product'
>;

const query = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      product_generating_contexts {
        cds {
          sequence_checksum
        }
        cdna {
          sequence_checksum
        }
        product {
          sequence_checksum
        }
      }
    }
  }
`;

type Variables = {
  genomeId: string;
  transcriptId: string;
};

export const fetchSequenceChecksums = (variables: Variables) =>
  client
    .query<GeneFragment>({
      query,
      variables
    })
    .then(({ data }) => data.transcript.product_generating_contexts[0]);
