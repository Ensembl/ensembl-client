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
  sortBySplicedLengthDesc,
  sortBySplicedLengthAsc,
  sortByExonCountDesc,
  sortByExonCountAsc
} from '../transcripts-sorter';

import { createProteinCodingTranscript } from 'tests/fixtures/entity-viewer/transcript';

/* Creating dummy transcritps with different spliced length */
const createTranscriptWithGreatestSplicedLength = () => {
  const transcript = createProteinCodingTranscript();
  const splicedExon = transcript.spliced_exons[0];
  transcript.stable_id = 'transcript_with_greatest_spliced_length';
  splicedExon.exon.slice.location.length = 15_000;
  transcript.spliced_exons = [splicedExon, splicedExon, splicedExon];
  return transcript;
};
const createTranscriptWithMediumSplicedLength = () => {
  const transcript = createProteinCodingTranscript();
  transcript.stable_id = 'transcript_with_medium_spliced_length';
  const splicedExon = transcript.spliced_exons[0];
  splicedExon.exon.slice.location.length = 10_000;
  transcript.spliced_exons = [splicedExon, splicedExon, splicedExon];
  return transcript;
};
const createTranscriptWithSmallestSplicedLength = () => {
  const transcript = createProteinCodingTranscript();
  transcript.stable_id = 'transcript_with_smallest_spliced_length';
  const splicedExon = transcript.spliced_exons[0];
  splicedExon.exon.slice.location.length = 5_000;
  transcript.spliced_exons = [splicedExon, splicedExon, splicedExon];
  return transcript;
};

/* Creating dummy transcritps with different numbers of Exons */
const createTranscriptWithGreatestExons = () => {
  const transcript = createProteinCodingTranscript();
  const splicedExon = transcript.spliced_exons[0];
  transcript.stable_id = 'transcript_with_greatest_exons';
  transcript.spliced_exons = [
    splicedExon,
    splicedExon,
    splicedExon,
    splicedExon
  ];
  return transcript;
};
const createTranscriptWithMediumExons = () => {
  const transcript = createProteinCodingTranscript();
  transcript.stable_id = 'transcript_with_medium_exons';
  const splicedExon = transcript.spliced_exons[0];
  splicedExon.exon.slice.location.length = 10_000;
  transcript.spliced_exons = [splicedExon, splicedExon, splicedExon];
  return transcript;
};
const createTranscriptWithSmallestExons = () => {
  const transcript = createProteinCodingTranscript();
  transcript.stable_id = 'transcript_with_smallest_exons';
  const splicedExon = transcript.spliced_exons[0];
  transcript.spliced_exons = [splicedExon, splicedExon];
  return transcript;
};

const transcriptWithGreatestSplicedLength =
  createTranscriptWithGreatestSplicedLength();
const transcriptWithMediumSplicedLength =
  createTranscriptWithMediumSplicedLength();
const transcriptWithSmallestSplicedLength =
  createTranscriptWithSmallestSplicedLength();
const transcriptWithGreatestExons = createTranscriptWithGreatestExons();
const transcriptWithMediumExons = createTranscriptWithMediumExons();
const transcriptWithSmallestExons = createTranscriptWithSmallestExons();

describe('sortBySplicedLengthDesc', () => {
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
      sortBySplicedLengthDesc(unsortedTranscripts).map(
        ({ stable_id }) => stable_id
      )
    ).toEqual(expectedTranscriptIds);
  });
});

describe('sortBySplicedLengthAsc', () => {
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
      sortBySplicedLengthAsc(unsortedTranscripts).map(
        ({ stable_id }) => stable_id
      )
    ).toEqual(expectedTranscriptIds);
  });
});

describe('sortByExonCountDesc', () => {
  it('sorts transcripts correctly(Exon count high to low)', () => {
    const unsortedTranscripts = [
      transcriptWithMediumExons,
      transcriptWithSmallestExons,
      transcriptWithGreatestExons
    ];
    const expectedTranscriptIds = [
      'transcript_with_greatest_exons',
      'transcript_with_medium_exons',
      'transcript_with_smallest_exons'
    ];

    expect(
      sortByExonCountDesc(unsortedTranscripts).map(({ stable_id }) => stable_id)
    ).toEqual(expectedTranscriptIds);
  });
});

describe('sortByExonCountAsc', () => {
  it('sorts transcripts correctly(Exon count low to high)', () => {
    const unsortedTranscripts = [
      transcriptWithMediumExons,
      transcriptWithGreatestExons,
      transcriptWithSmallestExons
    ];
    const expectedTranscriptIds = [
      'transcript_with_smallest_exons',
      'transcript_with_medium_exons',
      'transcript_with_greatest_exons'
    ];

    expect(
      sortByExonCountAsc(unsortedTranscripts).map(({ stable_id }) => stable_id)
    ).toEqual(expectedTranscriptIds);
  });
});
