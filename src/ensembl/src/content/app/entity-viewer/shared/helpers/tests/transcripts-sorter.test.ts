import { defaultSort } from '../transcripts-sorter';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

/*
const longProteinCodingTranscript
const shortProteinCodingTranscript
const longNonCodingTranscript
const shortNonCodingTranscript
const transcriptWithManyExons
const transcriptWithFewExons
*/

console.log(JSON.stringify(createTranscript(), null, 2));


describe('default sort', () => {

  it('puts protein-coding transcripts first', () => {

  });

  it('sorts protein-coding transcripts by length, putting the longest first', () => {

  });

  it('sorts non-coding transcripts by so_term alphabetically', () => {

  });

});
