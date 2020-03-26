import { sortBy } from 'lodash';

import { getFeatureLength } from './entity-helpers';

import { Transcript } from '../../types/transcript';

function compareTranscriptLengths(
  transcriptOne: Transcript,
  transcriptTwo: Transcript
) {
  const transcriptOneLength = getFeatureLength(transcriptOne);
  const transcriptTwoLength = getFeatureLength(transcriptTwo);

  if (transcriptOneLength < transcriptTwoLength) {
    return -1;
  }

  if (transcriptOneLength > transcriptTwoLength) {
    return 1;
  }

  return 0;
}

export function defaultSort(transcripts: Transcript[]) {
  const proteinCodingTranscripts = transcripts
    .filter((transcript) => transcript.biotype === 'protein_coding')
    .sort(compareTranscriptLengths);

  const nonProteinCodingTranscripts = sortBy(
    transcripts.filter((transcript) => transcript.biotype !== 'protein_coding'),
    ['biotype']
  );

  return [...proteinCodingTranscripts, ...nonProteinCodingTranscripts];
}
