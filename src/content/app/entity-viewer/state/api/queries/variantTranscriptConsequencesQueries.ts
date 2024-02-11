import { gql } from 'graphql-request';
import type { Pick2, Pick3, Pick4 } from 'ts-multipick';

import type { FullGene } from 'src/shared/types/core-api/gene';
import type { FullTranscript } from 'src/shared/types/core-api/transcript';
import type { FullProductGeneratingContext } from 'src/shared/types/core-api/productGeneratingContext';

/**
 * As a temporary solution, this query fetches gene
 * using the transcript stable id
 */


// NOTE: transcriptId as an input parameter will later be replaced with gene stable id
export const geneForVariantTranscriptConsequencesQuery = gql`
  query GeneForVariantTranscriptConsequences($genomeId: String!, $transcriptId: String!) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      gene {
        stable_id
        symbol
        slice {
          location {
            start
            end
            length
          }
          region {
            sequence {
              checksum
            }
            length
          }
          strand {
            code
          }
        }
      }
    }
  }
`;


export const transcriptForVariantTranscriptConsequencesQuery = gql`
  query TranscriptForVariantTranscriptConsequences($genomeId: String!, $transcriptId: String!) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      slice {
        location {
          start
          end
          length
        }
      }
      relative_location {
        start
        end
        length
      }
      spliced_exons {
        relative_location {
          start
          end
          length
        } 
      }
      product_generating_contexts {
        cds {
          relative_start
          relative_end
        }
      }
    }
  }
`;


type GeneInResponse = Pick<FullGene, 'stable_id' | 'symbol'> &
  Pick3<FullGene, 'slice', 'location', 'start' | 'end' | 'length'> &
  Pick3<FullGene, 'slice', 'region', 'length'> &
  Pick4<FullGene, 'slice', 'region', 'sequence', 'checksum'> &
  Pick3<FullGene, 'slice', 'strand', 'code'>


type SplicedExonInTranscript = Pick2<FullTranscript['spliced_exons'][number], 'relative_location', 'start' | 'end' | 'length'>;
type ProducGeneratingContextInTranscript = {
  cds: {
    relative_start: NonNullable<
      FullProductGeneratingContext['cds']
    >['relative_start'];
    relative_end: NonNullable<
      FullProductGeneratingContext['cds']
    >['relative_end'];
  } | null;
};

type TranscriptInResponse = Pick3<FullTranscript, 'slice', 'location', 'start' | 'end' | 'length'> &
  Pick2<FullTranscript, 'relative_location', 'start' | 'end'> & {
    spliced_exons: SplicedExonInTranscript[];
    product_generating_contexts: ProducGeneratingContextInTranscript[];
  };


export type GeneForVariantTranscriptConsequencesResponse = {
  transcript: {
    gene: GeneInResponse; // NOTE: later on, gene will be the top-level field
  }
};


export type TranscriptForVariantTranscriptConsequencesResponse = {
  transcript: TranscriptInResponse
};


