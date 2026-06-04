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

import { Pick3 } from 'ts-multipick';

import { gql } from 'graphql-request';

import {
  transcriptFieldsFragment,
  type DefaultEntityViewerTranscript
} from './defaultGeneQuery';

import type { FullGene } from 'src/shared/types/core-api/gene';
import type { Slice } from 'src/shared/types/core-api/slice';
import type { Exon } from 'src/shared/types/core-api/exon';
import type { Intron as FullIntron } from 'src/shared/types/core-api/intron';

const geneFieldsFragment = gql`
  fragment geneFields on Gene {
    stable_id
    unversioned_stable_id
    symbol
    alternative_symbols
    name
    slice {
      location {
        start
        end
        length
      }
      strand {
        code
      }
    }
    metadata {
      name {
        accession_id
        url
      }
      biotype {
        value
      }
    }
  }
`;

export const defaultTranscriptQuery = gql`
  query DefaultEntityViewerTranscript(
    $genomeId: String!
    $transcriptId: String!
  ) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      ...transcriptFields
      slice {
        region {
          sequence {
            checksum
          }
        }
      }
      spliced_exons {
        index
        exon {
          slice {
            location {
              start
              end
            }
            strand {
              code
            }
          }
        }
      }
      introns {
        index
        slice {
          location {
            start
            end
            length
          }
          strand {
            code
          }
        }
        relative_location {
          start
          end
        }
      }
      gene {
        ...geneFields
      }
    }
  }
  ${transcriptFieldsFragment}
  ${geneFieldsFragment}
`;

type GeneInDefaultTranscriptRequest = Pick<
  FullGene,
  | 'stable_id'
  | 'unversioned_stable_id'
  | 'symbol'
  | 'alternative_symbols'
  | 'name'
> &
  Pick3<FullGene, 'slice', 'location', 'start' | 'end' | 'length'> &
  Pick3<FullGene, 'slice', 'strand', 'code'> & {
    metadata: {
      name: Pick<
        NonNullable<FullGene['metadata']['name']>,
        'accession_id' | 'url'
      > | null;
      biotype: Pick<FullGene['metadata']['biotype'], 'value'>;
    };
  };

type SliceInTranscript = DefaultEntityViewerTranscript['slice'] &
  Pick3<Slice, 'region', 'sequence', 'checksum'>;
type SplicedExon = DefaultEntityViewerTranscript['spliced_exons'][number] & {
  index: number;
  exon: Pick3<Exon, 'slice', 'location', 'start' | 'end' | 'length'> &
    Pick3<Exon, 'slice', 'strand', 'code'>;
};
type Intron = Pick<FullIntron, 'index' | 'relative_location'> &
  Pick3<FullIntron, 'slice', 'location', 'start' | 'end' | 'length'> &
  Pick3<FullIntron, 'slice', 'strand', 'code'>;

export type DefaultEntityViewerTranscriptQueryResult = {
  transcript: Omit<DefaultEntityViewerTranscript, 'slice' | 'spliced_exons'> & {
    slice: SliceInTranscript;
    spliced_exons: SplicedExon[];
    introns: Intron[];
    gene: GeneInDefaultTranscriptRequest;
  };
};
