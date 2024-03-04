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

import { gql } from 'graphql-request';
import { Pick2 } from 'ts-multipick';

import type { FullTranscript } from 'src/shared/types/core-api/transcript';
import type { FullProductGeneratingContext } from 'src/shared/types/core-api/productGeneratingContext';

export const transcriptQueryForProtein = gql`
  query TranscriptProteinChecksums($genomeId: String!, $transcriptId: String!) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      stable_id
      product_generating_contexts {
        cds {
          sequence {
            checksum
          }
        }
        product {
          stable_id
          sequence {
            checksum
          }
        }
      }
    }
  }
`;

type ProductInResponse = Pick<
  NonNullable<FullProductGeneratingContext['product']>,
  'stable_id'
> &
  Pick2<
    NonNullable<FullProductGeneratingContext['product']>,
    'sequence',
    'checksum'
  >;

type ProductGeneratingContextInResponse = {
  cds: Pick2<
    NonNullable<FullProductGeneratingContext['cds']>,
    'sequence',
    'checksum'
  > | null;
  product: ProductInResponse | null;
};

export type TranscriptInResponse = Pick<FullTranscript, 'stable_id'> & {
  product_generating_contexts: ProductGeneratingContextInResponse[];
};

export type TranscriptQueryForProteinResponse = {
  transcript: TranscriptInResponse;
};
