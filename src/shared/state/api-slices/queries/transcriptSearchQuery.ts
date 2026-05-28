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

import type { FullTranscript } from 'src/shared/types/core-api/transcript';
import type { SearchMeta } from 'src/shared/types/search-api/search-meta';

export const transcriptSearchQuery = gql`
  query TranscriptSearch(
    $query: String!
    $genome_ids: [String!]!
    $page: Int!
    $per_page: Int!
  ) {
    transcript_search(
      search_payload: {
        query: $query
        genome_ids: $genome_ids
        page: $page
        per_page: $per_page
      }
    ) {
      meta {
        total_hits
        page
        per_page
      }
      matches {
        type
        stable_id
        unversioned_stable_id
        symbol
        genome_id
      }
    }
  }
`;

type TranscriptSearchMatchResponse = Pick<
  FullTranscript,
  'type' | 'stable_id' | 'unversioned_stable_id' | 'symbol'
> & {
  genome_id: string;
};

export type TranscriptSearchQueryResponse = {
  transcript_search: {
    meta: SearchMeta;
    matches: TranscriptSearchMatchResponse[];
  };
};
