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

import { faker } from '@faker-js/faker';
import set from 'lodash/fp/set';
import pipe from 'lodash/fp/pipe';
import shuffle from 'lodash/shuffle';

import {
  defaultSort,
  sortBySplicedLengthDesc,
  sortBySplicedLengthAsc,
  sortByExonCountDesc,
  sortByExonCountAsc
} from '../transcripts-sorter';

import {
  createProteinCodingTranscript,
  createTranscriptMetadata
} from 'tests/fixtures/entity-viewer/transcript';

/* Creating dummy transcritps with different protein coding and non coding length  to test default sort*/
const createLongProteinCodingTranscript = () => {
  const transcript = createProteinCodingTranscript();
  transcript.slice.location.length = 100_000;
  return transcript;
};
const createLongNonCodingTranscript = () => {
  const transcript = createProteinCodingTranscript();
  transcript.slice.location.length = 150_000;
  transcript.product_generating_contexts = [];
  return transcript;
};
const createShortNonCodingTranscript = () => {
  const transcript = createProteinCodingTranscript();
  transcript.slice.location.length = 5_000;
  transcript.product_generating_contexts = [];
  return transcript;
};

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

const createMANETranscript = () => {
  const metadata = createTranscriptMetadata({
    biotype: {
      label: 'Protein coding',
      value: 'protein_coding',
      definition: faker.lorem.sentence()
    },
    canonical: {
      label: 'Ensembl canonical',
      value: true,
      definition: faker.lorem.sentence()
    },
    mane: {
      label: 'MANE Select',
      value: 'select',
      definition: faker.lorem.sentence(),
      ncbi_transcript: {
        id: faker.lorem.word(),
        url: faker.lorem.sentence()
      }
    }
  });

  const transcript = createProteinCodingTranscript({ metadata });
  return transcript;
};

const createOtherMANETranscript = () => {
  const metadata = createTranscriptMetadata({
    biotype: {
      label: 'Protein coding',
      value: 'protein_coding',
      definition: faker.lorem.sentence()
    },
    mane: {
      label: 'MANE Plus Clinical',
      value: 'plus_clinical',
      definition: faker.lorem.sentence(),
      ncbi_transcript: {
        id: faker.lorem.word(),
        url: faker.lorem.sentence()
      }
    }
  });
  const transcript = createProteinCodingTranscript({ metadata });
  return transcript;
};

const longProteinCodingTranscript = createLongProteinCodingTranscript();
const longNonCodingTranscript = createLongNonCodingTranscript();
const shortNonCodingTranscript = createShortNonCodingTranscript();
const transcriptWithGreatestSplicedLength =
  createTranscriptWithGreatestSplicedLength();
const transcriptWithMediumSplicedLength =
  createTranscriptWithMediumSplicedLength();
const transcriptWithSmallestSplicedLength =
  createTranscriptWithSmallestSplicedLength();
const transcriptWithGreatestExons = createTranscriptWithGreatestExons();
const transcriptWithMediumExons = createTranscriptWithMediumExons();
const transcriptWithSmallestExons = createTranscriptWithSmallestExons();
const maneSelectTranscript = createMANETranscript();
const otherManeTranscript = createOtherMANETranscript();

describe('default sort', () => {
  it('sorts transcripts correctly', () => {
    /*
      Sorting is done in the below order
      - canonical transcript
      - MANE transcripts
      - protein-coding biotype, ordered by translation length and transcript length
      - nonsense-mediated decay biotype, ordered by translation length and transcript length
      - non-stop decay biotype, ordered by translation length and transcript length
      - IG biotypes, ordered by translation length and transcript length
      - polymorphic pseudogenes, ordered by translation length and transcript length
      - non-coding transcripts sorted by length
    */

    const generatePCTranscript = set(
      'metadata.biotype.value',
      'protein_coding'
    );
    const generateNMDTranscript = set(
      'metadata.biotype.value',
      'nonsense_mediated_decay'
    );
    const withProteinLength = set(
      'product_generating_contexts.0.product.length'
    );
    const withLength = set('slice.location.length');

    const t1 = maneSelectTranscript;
    const t2 = otherManeTranscript;
    const t3 = pipe(
      withProteinLength(1000),
      withLength(5000),
      generatePCTranscript
    )(longProteinCodingTranscript); // protein-coding transcript, 5000bp long, with protein 1000aa long
    const t4 = pipe(
      withProteinLength(1000),
      withLength(3000),
      generatePCTranscript
    )(longProteinCodingTranscript); // protein-coding transcript, 3000bp long, with protein 1000aa long
    const t5 = pipe(
      withProteinLength(500),
      withLength(5000),
      generatePCTranscript
    )(longProteinCodingTranscript); // protein-coding transcript, 5000bp long, with protein 500aa long
    const t6 = pipe(
      withProteinLength(1000),
      withLength(5000),
      generateNMDTranscript
    )(longProteinCodingTranscript); // nonsense-mediated decay transcript, 5000bp long, with protein 1000aa long (impossible, but just testing the algo)
    const t7 = longNonCodingTranscript;
    const t8 = shortNonCodingTranscript;

    // notice that t3 and t4 both have protein-coding biotype and the same protein length, but t3 is a longer transcript
    const expectedSortedOrder = [t1, t2, t3, t4, t5, t6, t7, t8];
    const shuffledTranscripts = shuffle(expectedSortedOrder);

    expect(defaultSort(shuffledTranscripts)).toEqual(expectedSortedOrder);
  });
});

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
