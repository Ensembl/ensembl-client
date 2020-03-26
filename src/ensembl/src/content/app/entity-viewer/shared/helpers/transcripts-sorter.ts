import sortBy from 'lodash/sortby';

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
  const transcriptsWithCds = transcripts
    .filter((transcript) => transcript.cds)
    .sort(compareTranscriptLengths);

  const transcriptsWithoutCds = transcripts.filter(
    (transcript) => !transcript.cds
  );

  const proteinCodingTranscripts = transcriptsWithoutCds
    .filter((transcript) => transcript.biotype === 'protein_coding')
    .sort(compareTranscriptLengths);

  const nonProteinCodingTranscripts = sortBy(
    transcriptsWithoutCds.filter(
      (transcript) => transcript.biotype !== 'protein_coding'
    ),
    ['biotype']
  );

  return [
    ...transcriptsWithCds,
    ...proteinCodingTranscripts,
    ...nonProteinCodingTranscripts
  ];
}
