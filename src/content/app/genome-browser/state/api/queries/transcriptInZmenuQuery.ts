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

import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';

export const transcriptZmenuQuery = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      product_generating_contexts {
        product_type
      }
      gene {
        stable_id
      }
    }
  }
`;

type TranscriptInResponse = Pick2<FullTranscript, 'gene', 'stable_id'> & {
  product_generating_contexts: Pick<
    FullProductGeneratingContext,
    'product_type'
  >[];
};

export type TranscriptZmenuQueryResult = {
  transcript: TranscriptInResponse;
};
