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

import { Pick2, Pick3 } from 'ts-multipick';

import {
  SWISSPROT_SOURCE,
  SPTREMBL_SOURCE
} from 'src/content/app/entity-viewer/gene-view/components/proteins-list/protein-list-constants';

import { Slice } from 'src/shared/types/thoas/slice';
import { PhasedExon, Exon } from 'src/shared/types/thoas/exon';
import { Product, ProductType } from 'src/shared/types/thoas/product';
import { ExternalReference } from 'src/shared/types/thoas/externalReference';
import { TranscriptMetadata } from 'src/shared/types/thoas/metadata';

type GetFeatureCoordinatesParams = {
  slice: Pick2<Slice, 'location', 'start' | 'end'>;
};
export const getFeatureCoordinates = (feature: GetFeatureCoordinatesParams) => {
  const { start, end } = feature.slice.location;
  return { start, end };
};

type GetRegionNameParams = {
  slice: Pick2<Slice, 'region', 'name'>;
};
export const getRegionName = (feature: GetRegionNameParams) =>
  feature.slice.region.name;

type GetFeatureStrandParams = {
  slice: Pick2<Slice, 'strand', 'code'>;
};
export const getFeatureStrand = (feature: GetFeatureStrandParams) =>
  feature.slice.strand.code;

type GetFeatureLengthParams = {
  slice: Pick2<Slice, 'location', 'length'>;
};
export const getFeatureLength = (feature: GetFeatureLengthParams) => {
  return feature.slice.location.length;
};

export type IsProteinCodingTranscriptParam = {
  product_generating_contexts: Array<{
    product_type: ProductType;
  }>;
};

export const isProteinCodingTranscript = (
  transcript: IsProteinCodingTranscriptParam
) => {
  const { product_generating_contexts } = transcript;
  const firstProductGeneratingContext = product_generating_contexts[0];

  return (
    firstProductGeneratingContext &&
    firstProductGeneratingContext.product_type === ProductType.PROTEIN
  );
};

export type GetNumberOfCodingExonsParam = {
  product_generating_contexts: Array<{
    product_type: ProductType;
    phased_exons: Array<
      Pick<PhasedExon, 'start_phase' | 'end_phase'> & {
        exon: {
          stable_id: string;
        };
      }
    >;
  }>;
  spliced_exons: Array<{
    exon: {
      stable_id: string;
    };
  }>;
};

export const getNumberOfCodingExons = (
  transcript: GetNumberOfCodingExonsParam
) => {
  if (!isProteinCodingTranscript(transcript)) {
    return 0;
  }
  const { product_generating_contexts, spliced_exons } = transcript;
  const firstProductGeneratingContext = product_generating_contexts[0];

  const { phased_exons } = firstProductGeneratingContext;
  // coding exons will have a phase that is different from -1
  return phased_exons
    .filter(
      ({ start_phase, end_phase }) => start_phase !== -1 || end_phase !== -1
    )
    .filter((phasedExon) => {
      // to exclude the unlikely chance of trans-splicing,
      // check that all phased exons actually belong to this transcript
      return spliced_exons.find(
        (splicedExon) =>
          splicedExon.exon.stable_id === phasedExon.exon.stable_id
      );
    }).length;
};

export type GetProductAminoAcidLengthParam = {
  product_generating_contexts: Array<{
    product_type: ProductType.PROTEIN;
    product: {
      length: number;
    };
  }>;
};

export const getProductAminoAcidLength = (
  transcript: GetProductAminoAcidLengthParam
) => {
  if (!isProteinCodingTranscript(transcript)) {
    return 0;
  }
  const { product_generating_contexts } = transcript;
  const firstProductGeneratingContext = product_generating_contexts[0];
  const product = firstProductGeneratingContext.product as Product;

  return product.length;
};

export type GetSplicedRNALengthParam = {
  spliced_exons: Array<{
    exon: Pick3<Exon, 'slice', 'location', 'length'>;
  }>;
};

export const getSplicedRNALength = (transcript: GetSplicedRNALengthParam) =>
  transcript.spliced_exons.reduce((length, { exon }) => {
    return length + exon.slice.location.length;
  }, 0);

export type GetLongestProteinLengthParam = {
  transcripts: GetProductAminoAcidLengthParam[];
};

export const getLongestProteinLength = (gene: GetLongestProteinLengthParam) => {
  const proteinLengths = gene.transcripts.map(getProductAminoAcidLength);
  return Math.max(...proteinLengths);
};

export enum ExternalSource {
  INTERPRO = 'Interpro',
  UNIPROT_TREMBL = 'UniProtKB/TrEMBL',
  UNIPROT_SWISSPROT = 'UniProtKB/Swiss-Prot',
  PDBE = 'PDBe-KB'
}

export const externalSourceLinks = {
  [ExternalSource.INTERPRO]: 'https://www.ebi.ac.uk/interpro/protein/UniProt/',
  [ExternalSource.UNIPROT_TREMBL]: 'https://www.uniprot.org/uniprot/',
  [ExternalSource.UNIPROT_SWISSPROT]: 'https://www.uniprot.org/uniprot/',
  [ExternalSource.PDBE]: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/'
};

export const getProteinXrefs = <
  T extends Pick2<ExternalReference, 'source', 'id'>
>(transcript: {
  product_generating_contexts: Array<{
    product: {
      external_references: T[];
    };
  }>;
}) => {
  const xrefs =
    transcript.product_generating_contexts[0].product.external_references;
  let proteinXrefs = xrefs.filter(
    (xref) => xref.source.id === SWISSPROT_SOURCE
  );

  if (!proteinXrefs.length) {
    proteinXrefs = xrefs.filter((xref) => xref.source.id === SPTREMBL_SOURCE);
  }

  return proteinXrefs;
};

export const getTranscriptLabelFromMetadata = (
  metadata: Pick<TranscriptMetadata, 'canonical' | 'mane'>
) => {
  const { canonical, mane } = metadata;
  if (mane) {
    return {
      label: mane.label,
      definition: mane.definition
    };
  } else if (canonical) {
    return {
      label: canonical.label,
      definition: canonical.definition
    };
  }
};
