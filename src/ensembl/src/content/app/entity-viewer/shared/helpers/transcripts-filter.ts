import { Filters } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

import { FullTranscript } from 'src/shared/types/thoas/transcript';

type TranscriptSOTerm = Pick<FullTranscript, 'so_term'>;

export function filterTranscriptsBySOTerm(
  transcripts: TranscriptSOTerm[],
  filters: Filters
) {
  const soTerms = Object.keys(filters).filter((key) => filters[key]);
  const filteredTranscripts = transcripts.filter((transcript) => {
    return soTerms.includes(transcript.so_term);
  });

  return filteredTranscripts;
}
