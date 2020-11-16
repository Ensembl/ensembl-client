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

import {
  defaultSort,
  sortBySplicedLengthLongestToShortest,
  sortBySplicedLengthShortestToLongest
} from '../transcripts-sorter';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

const createLongProteinCodingTranscript = () => {
  const transcript = createTranscript();
  transcript.slice.location.length = 100_000;
  return transcript;
};
const createShortProteinCodingTranscript = () => {
  const transcript = createTranscript();
  transcript.slice.location.length = 10_000;
  return transcript;
};
const createLongNonCodingTranscript = () => {
  const transcript = createTranscript();
  transcript.slice.location.length = 150_000;
  transcript.so_term = 'xyz'; // <- to make sure that during default sorting we put this last
  transcript.product_generating_contexts = [];
  return transcript;
};
const createShortNonCodingTranscript = () => {
  const transcript = createTranscript();
  transcript.slice.location.length = 5_000;
  transcript.so_term = 'abc'; // <- to make sure that during default sorting we put this first
  transcript.product_generating_contexts = [];
  return transcript;
};
const createTranscriptWithGreatestSplicedLength = () => {
  const transcript = createTranscript();
  const splicedExon = transcript.spliced_exons[0];
  transcript.stable_id = 'transcript_with_greatest_spliced_length';
  splicedExon.exon.slice.location.length = 15_000;
  transcript.spliced_exons = [splicedExon, splicedExon, splicedExon];
  return transcript;
};
const createTranscriptWithMediumSplicedLength = () => {
  const transcript = createTranscript();
  transcript.stable_id = 'transcript_with_medium_spliced_length';
  const splicedExon = transcript.spliced_exons[0];
  splicedExon.exon.slice.location.length = 10_000;
  transcript.spliced_exons = [splicedExon, splicedExon, splicedExon];
  return transcript;
};
const createTranscriptWithSmallestSplicedLength = () => {
  const transcript = createTranscript();
  transcript.stable_id = 'transcript_with_smallest_spliced_length';
  const splicedExon = transcript.spliced_exons[0];
  splicedExon.exon.slice.location.length = 5_000;
  transcript.spliced_exons = [splicedExon, splicedExon, splicedExon];
  return transcript;
};

const longProteinCodingTranscript = createLongProteinCodingTranscript();
const shortProteinCodingTranscript = createShortProteinCodingTranscript();
const longNonCodingTranscript = createLongNonCodingTranscript();
const shortNonCodingTranscript = createShortNonCodingTranscript();
const transcriptWithGreatestSplicedLength = createTranscriptWithGreatestSplicedLength();
const transcriptWithMediumSplicedLength = createTranscriptWithMediumSplicedLength();
const transcriptWithSmallestSplicedLength = createTranscriptWithSmallestSplicedLength();

describe('default sort', () => {
  it('sorts transcripts correctly', () => {
    /*
      - puts protein-coding transcripts first
      - sorts protein-coding transcripts by length
      - sorts non-coding transcripts by so_term term alphabetically
    */

    const unsortedTranscripts = [
      shortNonCodingTranscript,
      shortProteinCodingTranscript,
      longNonCodingTranscript, // this is the longest
      longProteinCodingTranscript
    ];

    const expectedTranscripts = [
      longProteinCodingTranscript,
      shortProteinCodingTranscript,
      shortNonCodingTranscript, // its so_term is "abc"
      longNonCodingTranscript // its so_term is "xyz"
    ];

    const sortedTranscripts = defaultSort(unsortedTranscripts);

    expect(sortedTranscripts).toEqual(expectedTranscripts);
  });
});

describe('sortBySplicedLengthLongestToShortest', () => {
  it('sorts transcripts correctly', () => {
    const unsortedTranscripts = [
      transcriptWithMediumSplicedLength,
      transcriptWithSmallestSplicedLength,
      transcriptWithGreatestSplicedLength
    ];
    const expectedTranscriptIds = [
      'transcript_with_greatest_spliced_length',
      'transcript_with_medium_spliced_length',
      'transcript_with_smallest_spliced_length'
    ];

    expect(
      sortBySplicedLengthLongestToShortest(unsortedTranscripts).map(
        ({ stable_id }) => stable_id
      )
    ).toEqual(expectedTranscriptIds);
  });
});

describe('sortBySplicedLengthShortestToLongest', () => {
  it('sorts transcripts correctly', () => {
    const unsortedTranscripts = [
      transcriptWithMediumSplicedLength,
      transcriptWithSmallestSplicedLength,
      transcriptWithGreatestSplicedLength
    ];
    const expectedTranscriptIds = [
      'transcript_with_smallest_spliced_length',
      'transcript_with_medium_spliced_length',
      'transcript_with_greatest_spliced_length'
    ];

    expect(
      sortBySplicedLengthShortestToLongest(unsortedTranscripts).map(
        ({ stable_id }) => stable_id
      )
    ).toEqual(expectedTranscriptIds);
  });
});
