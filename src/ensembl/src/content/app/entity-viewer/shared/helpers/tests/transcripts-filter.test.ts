import { filterTranscriptsBySOTerm } from '../transcripts-filter';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

/* Creating filters with different filter set to true */
const proteinCodingfilters = {
  protein_coding: true,
  retained_intron: false,
  processed_transcript: false,
  nonsense_mediated_decay: false
};

const retainedIntronfilters = {
  protein_coding: false,
  retained_intron: true,
  processed_transcript: false,
  nonsense_mediated_decay: false
};

const processedTranscriptfilters = {
  protein_coding: false,
  retained_intron: false,
  processed_transcript: true,
  nonsense_mediated_decay: false
};

const nonsenseMediatedDecayfilters = {
  protein_coding: false,
  retained_intron: false,
  processed_transcript: false,
  nonsense_mediated_decay: true
};

/* Creating dummy transcripts with different different so_term  to test so_term filtering */
const createProteinCodingTranscript = () => {
  const transcript = createTranscript();
  transcript.so_term = 'protein_coding';
  return transcript;
};

const createProcessedTranscript = () => {
  const transcript = createTranscript();
  transcript.so_term = 'processed_transcript';
  return transcript;
};

const createRetainedIntronTranscript = () => {
  const transcript = createTranscript();
  transcript.so_term = 'retained_intron';
  return transcript;
};

const createNonsenseMediatedDecayTranscript = () => {
  const transcript = createTranscript();
  transcript.so_term = 'nonsense_mediated_decay';
  return transcript;
};

const ProteinCodingTranscript = createProteinCodingTranscript();
const ProcessedTranscript = createProcessedTranscript();
const RetainedIntronTranscript = createRetainedIntronTranscript();
const NonsenseMediatedDecayTranscript = createNonsenseMediatedDecayTranscript();

describe('filter transcripts by so_term', () => {
  it('filters transcripts by protein_coding correctly', () => {
    const Transcripts = [
      ProteinCodingTranscript,
      ProcessedTranscript,
      RetainedIntronTranscript,
      NonsenseMediatedDecayTranscript
    ];

    const expectedTranscripts = [ProteinCodingTranscript];

    const filteredTranscripts = filterTranscriptsBySOTerm(
      Transcripts,
      proteinCodingfilters
    );

    expect(filteredTranscripts).toEqual(expectedTranscripts);
  });

  it('filters transcripts by retained_intron correctly', () => {
    const Transcripts = [
      ProteinCodingTranscript,
      ProcessedTranscript,
      RetainedIntronTranscript,
      NonsenseMediatedDecayTranscript
    ];

    const expectedTranscripts = [RetainedIntronTranscript];

    const filteredTranscripts = filterTranscriptsBySOTerm(
      Transcripts,
      retainedIntronfilters
    );

    expect(filteredTranscripts).toEqual(expectedTranscripts);
  });

  it('filters transcripts by processed_transcript correctly', () => {
    const Transcripts = [
      ProteinCodingTranscript,
      ProcessedTranscript,
      RetainedIntronTranscript,
      NonsenseMediatedDecayTranscript
    ];

    const expectedTranscripts = [ProcessedTranscript];

    const filteredTranscripts = filterTranscriptsBySOTerm(
      Transcripts,
      processedTranscriptfilters
    );

    expect(filteredTranscripts).toEqual(expectedTranscripts);
  });

  it('filters transcripts by nonsense_mediated_decay correctly', () => {
    const Transcripts = [
      ProteinCodingTranscript,
      ProcessedTranscript,
      RetainedIntronTranscript,
      NonsenseMediatedDecayTranscript
    ];

    const expectedTranscripts = [NonsenseMediatedDecayTranscript];

    const filteredTranscripts = filterTranscriptsBySOTerm(
      Transcripts,
      nonsenseMediatedDecayfilters
    );

    expect(filteredTranscripts).toEqual(expectedTranscripts);
  });
});
