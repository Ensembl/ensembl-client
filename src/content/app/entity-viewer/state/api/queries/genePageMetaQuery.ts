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

export const genePageMetaQuery = gql`
  query GenePageMeta($genomeId: String!, $geneId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      symbol
    }
  }
`;

export type GenePageMetaQueryResult = {
  gene: {
    stable_id: string;
    symbol: string;
  };
};

/**
 * TODO in the future:
 * - Add information for page description meta tag
 * - Add information for a bioschema
 *   - see https://bioschemas.org/profiles/Gene/1.0-RELEASE
 *   - see also an `application/ld+json` script on current Ensembl gene page
 */

export type GenePageMeta = {
  title: string;
};
