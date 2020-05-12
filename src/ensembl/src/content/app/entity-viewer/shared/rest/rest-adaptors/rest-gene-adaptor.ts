import { buildTranscriptFromLookup } from './rest-transcript-adaptor';

import { GeneInResponse } from '../rest-data-fetchers/geneData';
import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Strand } from 'src/content/app/entity-viewer/types/strand';

export const restGeneAdaptor = (gene: GeneInResponse): Gene => {
  const transcripts = gene.Transcript.map((transcript) =>
    buildTranscriptFromLookup(transcript)
  );

  return {
    id: gene.id,
    type: 'Gene',
    symbol: gene.display_name,
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
