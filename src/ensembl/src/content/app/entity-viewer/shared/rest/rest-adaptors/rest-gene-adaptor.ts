import { buildTranscript } from './rest-transcript-adaptor';

import {
  GeneInResponse,
  FeatureWithParent,
  TranscriptInResponse,
  FeatureInResponse
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';
import { Strand } from 'src/content/app/entity-viewer/types/strand';
import { Gene } from 'src/content/app/entity-viewer/types/gene';

// transform ensembl rest /overlap data into a gene data structure
export const restGeneAdaptor = (
  geneId: string,
  data: FeatureInResponse[]
): Gene => {
  const gene = data.find((feature) => feature.id === geneId) as GeneInResponse;
  const transcripts = data
    .filter((feature) => (feature as FeatureWithParent).Parent === geneId)
    .map((transcript) =>
      buildTranscript(transcript as TranscriptInResponse, data)
    );

  return {
    id: geneId,
    type: 'Gene',
    symbol: gene.external_name,
    so_term: gene.biotype,
    slice: {
      location: {
        start: gene.start,
        end: gene.end
      },
      region: {
        name: gene.seq_region_name,
        strand: {
          code: gene.strand === 1 ? Strand.FORWARD : Strand.REFVERSE
        }
      }
    },
    transcripts
  };
};
