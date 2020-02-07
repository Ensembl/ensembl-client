import pick from 'lodash/pick';

import {
  GeneInResponse,
  FeatureWithParent,
  ExonInResponse,
  FeatureInResponse
} from 'src/content/app/entity-viewer/rest/rest-data-fetchers/transcriptData';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

// transform ensembl rest /overlap data into a gene data structure
export const restGeneAdaptor = (geneId: string, data: FeatureInResponse[]) => {
  const gene = data.find((feature) => feature.id === geneId) as GeneInResponse;
  const exons = data.filter((feature) => feature.feature_type === 'exon');
  const transcripts = data
    .filter((feature) => (feature as FeatureWithParent).Parent === geneId)
    .map((feature) => {
      const transcriptExons = exons.filter(
        (exon) => (exon as ExonInResponse).Parent === feature.id
      );
      return {
        type: 'transcript',
        id: feature.id,
        start: feature.start,
        end: feature.end,
        exons: transcriptExons.map((exon) =>
          pick(exon, ['id', 'start', 'end'])
        ),
        cds: buildCDS(feature.id, data)
      };
    }) as TranscriptData[];

  return {
    id: geneId,
    type: 'gene',
    start: gene.start,
    end: gene.end,
    transcripts
  };
};
