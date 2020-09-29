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
  Slice,
  SliceWithLocationOnly
} from 'src/content/app/entity-viewer/types/slice';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { ProductType } from 'src/content/app/entity-viewer/types/product';

export const getFeatureCoordinates = (feature: {
  slice: SliceWithLocationOnly;
}) => {
  const { start, end } = feature.slice.location;
  return { start, end };
};

export const getRegionName = (feature: { slice: Slice }) =>
  feature.slice.region.name;

export const getFeatureStrand = (feature: { slice: Slice }) =>
  feature.slice.region.strand.code;

// FIXME: remove this when we can get the length from the API
export const getFeatureLength = (feature: { slice: Slice }) => {
  return feature.slice.location.length;
};

export const isProteinCodingTranscript = (transcript: Transcript) => {
  const { product_generating_contexts } = transcript;
  const firstProductGeneratingContext = product_generating_contexts[0];

  return (
    firstProductGeneratingContext &&
    firstProductGeneratingContext.product_type === ProductType.PROTEIN
  );
};

export const getNumberOfCodingExons = (transcript: Transcript) => {
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

export const getProductAminoAcidLength = (transcript: Transcript) => {
  if (!isProteinCodingTranscript(transcript)) {
    return 0;
  }
  const { product_generating_contexts } = transcript;
  const firstProductGeneratingContext = product_generating_contexts[0];

  // TODO: use product.length directly when api response becomes more reliable
  return firstProductGeneratingContext.cds?.protein_length;
};

export const getSplicedRNALength = (transcript: Transcript) =>
  transcript.spliced_exons.reduce((length, { exon }) => {
    return length + exon.slice.location.length;
  }, 0);

export const getLongestProteinLength = (gene: Gene) => {
  const proteinLengths = gene.transcripts.map(
    (transcript) =>
      transcript.product_generating_contexts[0]?.cds?.protein_length || 0
  );

  return Math.max(...proteinLengths);
};

export enum ExternalSource {
  INTERPRO = 'Interpro',
  UNIPROT = 'UniProt',
  PDBE = 'PDBe-KB'
}

export const externalSourceLinks = {
  [ExternalSource.INTERPRO]: 'https://www.ebi.ac.uk/interpro/protein/UniProt/',
  [ExternalSource.UNIPROT]: 'https://www.uniprot.org/uniprot/',
  [ExternalSource.PDBE]: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/'
};
