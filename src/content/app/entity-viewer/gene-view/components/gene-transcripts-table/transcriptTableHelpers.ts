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

import type { Pick2, Pick3 } from 'ts-multipick';

import type {
  DefaultEntityViewerTranscript,
  ExternalReferenceInProduct
} from 'src/content/app/entity-viewer/state/api/queries/defaultGeneQuery';

export const getTranscriptBiotype = (
  transcript: Pick3<
    DefaultEntityViewerTranscript,
    'metadata',
    'biotype',
    'label'
  >
) => {
  return transcript.metadata.biotype.label;
};

export const getCCDSXref = (
  transcript: Pick<DefaultEntityViewerTranscript, 'external_references'>
) => {
  return transcript.external_references.find(
    (xref) => xref.source.name === 'CCDS'
  );
};

export const getNCBITranscriptData = (
  transcript: Pick2<DefaultEntityViewerTranscript, 'metadata', 'mane'>
) => {
  return transcript.metadata.mane?.ncbi_transcript;
};

export const getUniprotXref = (transcript: {
  product_generating_contexts: Array<{
    product_type: string;
    product: {
      external_references: ExternalReferenceInProduct[];
    } | null;
  }>;
}) => {
  const productGeneratingContext = transcript.product_generating_contexts.find(
    (context) => context.product_type === 'product'
  );
  if (!productGeneratingContext) {
    return null;
  }
  const xrefs = productGeneratingContext.product!.external_references;
  return xrefs.find((xref) => xref.source.id === 'Uniprot/SWISSPROT');
};

export const getTranscriptFlags = (
  transcript: Pick<DefaultEntityViewerTranscript, 'metadata'>
) => {
  const isCanonical = !!transcript.metadata.canonical?.value;
  const canonicalLabel = isCanonical ? 'Ensembl canonical' : undefined;
  const maneLabel = transcript.metadata.mane?.label;
  const gencodeBasicLabel = transcript.metadata.gencode_basic?.label;
  const apprisLabel = transcript.metadata.appris?.label;
  const tslLabel = transcript.metadata.tsl?.label;

  return [
    canonicalLabel,
    maneLabel,
    gencodeBasicLabel,
    apprisLabel,
    tslLabel
  ].filter((label) => !!label) as string[];
};
