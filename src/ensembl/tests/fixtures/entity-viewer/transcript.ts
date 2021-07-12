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

import faker from 'faker';
import times from 'lodash/times';

import { createSlice } from './slice';
import { createProduct } from './product';
import { getFeatureCoordinates } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { Exon, SplicedExon, PhasedExon } from 'src/shared/types/thoas/exon';
import { Slice } from 'src/shared/types/thoas/slice';
import { FullCDS } from 'src/shared/types/thoas/cds';
import { CDNA } from 'src/shared/types/thoas/cdna';
import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';
import { ProductType } from 'src/shared/types/thoas/product';
import { ExternalReference } from 'src/shared/types/thoas/externalReference';
import { TranscriptMetadata } from 'ensemblRoot/src/shared/types/thoas/metadata';

type ProteinCodingProductGeneratingContext = Omit<
  FullProductGeneratingContext,
  'cds'
> & { cds: FullCDS };

type ProteinCodingTranscript = Omit<
  FullTranscript,
  'product_generating_contexts'
> & {
  product_generating_contexts: ProteinCodingProductGeneratingContext[];
};

export const createTranscript = (
  fragment: Partial<ProteinCodingTranscript> = {}
): ProteinCodingTranscript => {
  const transcriptSlice = createSlice();

  const unversionedStableId = faker.datatype.uuid();
  const version = 1;
  const stableId = `${unversionedStableId}.${version}`;

  const exons = createExons(transcriptSlice);

  return {
    type: 'Transcript',
    stable_id: stableId,
    unversioned_stable_id: unversionedStableId,
    version,
    symbol: faker.lorem.word(),
    so_term: faker.lorem.word(),
    slice: transcriptSlice,
    external_references: createExternalReferences(),
    relative_location: {
      start: 1,
      end: transcriptSlice.location.end,
      length: transcriptSlice.location.length
    },
    spliced_exons: createSplicedExons(transcriptSlice, exons),
    product_generating_contexts: [
      createProductGeneratingContext(transcriptSlice, exons)
    ],
    metadata: createTranscriptMetadata(),
    ...fragment
  };
};

const createTranscriptMetadata = (): TranscriptMetadata => {
  return {
    canonical: null,
    mane: null,
    gencode_basic: null,
    tsl: null,
    appris: null
  };
};

const createExternalReferences = (): ExternalReference[] => {
  const numberOfExternalReferences = faker.datatype.number({ min: 1, max: 10 });

  return times(numberOfExternalReferences, () => {
    return {
      accession_id: faker.datatype.uuid(),
      name: faker.random.words(),
      description: faker.random.words(),
      url: faker.internet.url(),
      source: {
        name: faker.random.words(),
        id: faker.datatype.uuid(),
        url: faker.internet.url()
      }
    };
  });
};

const createSplicedExons = (
  transcriptSlice: Slice,
  exons: Exon[]
): SplicedExon[] => {
  // exons passed into this function are expected to already be sorted by their location

  const { start: transcriptStart } = getFeatureCoordinates({
    slice: transcriptSlice
  });
  return exons.map((exon, index) => {
    const { start: exonStart, end: exonEnd } = getFeatureCoordinates({
      slice: exon.slice
    });
    const relativeStart = exonStart - transcriptStart + 1;
    const relativeEnd = exonEnd - transcriptStart + 1;

    return {
      index: index + 1,
      relative_location: {
        start: relativeStart,
        end: relativeEnd,
        length: relativeEnd - relativeStart + 1
      },
      exon
    };
  });
};

const createPhasedExons = (exons: Exon[]): PhasedExon[] => {
  return exons.map((exon, index) => ({
    index: index + 1,
    start_phase: -1,
    end_phase: -1,
    exon
  }));
};

const createExons = (transcriptSlice: Slice): Exon[] => {
  const { start: transcriptStart, end: transcriptEnd } = getFeatureCoordinates({
    slice: transcriptSlice
  });
  const length = transcriptEnd - transcriptStart + 1;

  const numberOfExons = faker.datatype.number({ min: 1, max: 10 });
  const maxExonLength = Math.floor(length / numberOfExons);

  return times(numberOfExons, (index: number) => {
    const minCoordinate = transcriptStart + (maxExonLength * index + 1);
    const maxCoordinate = minCoordinate + maxExonLength;
    const middleCoordinate =
      maxCoordinate - (maxCoordinate - minCoordinate) / 2;
    const exonStart = faker.datatype.number({
      min: minCoordinate,
      max: middleCoordinate
    });
    const exonEnd = faker.datatype.number({
      min: middleCoordinate + 1,
      max: maxCoordinate - 1
    });
    const startPosition = index > 0 ? exonStart : transcriptStart;
    const endPosition = index < numberOfExons - 1 ? exonEnd : transcriptEnd;
    const length = endPosition - startPosition + 1;
    const slice = {
      location: {
        start: index > 0 ? exonStart : transcriptStart,
        end: index < numberOfExons - 1 ? exonEnd : transcriptEnd,
        length
      },
      strand: transcriptSlice.strand,
      region: transcriptSlice.region
    };

    return {
      stable_id: faker.datatype.uuid(),
      slice
    };
  });
};

const createCDS = (transcriptSlice: Slice): FullCDS => {
  const { start, end } = getFeatureCoordinates({ slice: transcriptSlice });
  const nucleotideLength = end - start + 1;
  const proteinLength = Math.floor(nucleotideLength / 3);

  return {
    start: start,
    end: end,
    relative_start: 1,
    relative_end: nucleotideLength,
    nucleotide_length: nucleotideLength,
    protein_length: proteinLength
  };
};

const createCDNA = (transcriptSlice: Slice): CDNA => {
  const { start, end } = getFeatureCoordinates({ slice: transcriptSlice });

  return {
    start,
    end,
    length: end - start + 1
  };
};

const createProductGeneratingContext = (
  transcriptSlice: Slice,
  exons: Exon[]
): ProteinCodingProductGeneratingContext => {
  return {
    product_type: ProductType.PROTEIN,
    default: true,
    cds: createCDS(transcriptSlice),
    five_prime_utr: null,
    three_prime_utr: null,
    cdna: createCDNA(transcriptSlice),
    phased_exons: createPhasedExons(exons),
    product: createProduct({
      length: Math.floor(transcriptSlice.location.length / 3)
    })
  };
};
