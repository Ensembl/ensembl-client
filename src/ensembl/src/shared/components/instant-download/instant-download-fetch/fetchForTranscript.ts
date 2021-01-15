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

import downloadAsFile from 'src/shared/helpers/downloadAsFile';

import {
  TranscriptOptions,
  TranscriptOption,
  transcriptOptionsOrder
} from 'src/shared/components/instant-download/instant-download-transcript/InstantDownloadTranscript';
import { ProductGeneratingContext } from 'src/content/app/entity-viewer/types/productGeneratingContext';

type Options = {
  transcript: Partial<TranscriptOptions>;
  gene: {
    genomicSequence: boolean;
  };
};

type FetchPayload = {
  transcriptId: string;
  geneId: string;
  options: Options;
};

type ProductGeneratingContextFragment = Pick<
  ProductGeneratingContext,
  'product' | 'cdna' | 'cds'
>;

export const fetchForTranscript = async (
  productGeneratingContext: ProductGeneratingContextFragment,
  payload: FetchPayload
) => {
  const {
    geneId,
    transcriptId,
    options: { transcript: transcriptOptions, gene: geneOptions }
  } = payload;
  const urls = buildUrlsForTranscript(
    { geneId, productGeneratingContext },
    transcriptOptions
  );

  if (geneOptions.genomicSequence) {
    urls.push(buildFetchUrl({ geneId }, 'genomicSequence'));
  }

  const sequencePromises = urls.map((url) =>
    fetch(url as string).then((response) => response.text())
  );
  const sequences = await Promise.all(sequencePromises);
  const combinedFasta = sequences.join('\n\n');

  downloadAsFile(combinedFasta, `${transcriptId}.fasta`, {
    type: 'text/x-fasta'
  });
};

const buildUrlsForTranscript = (
  data: {
    geneId: string;
    productGeneratingContext: ProductGeneratingContextFragment;
  },
  options: Partial<TranscriptOptions>
) => {
  return options
    ? transcriptOptionsOrder
        .filter((option) => options[option])
        .map((option) => buildFetchUrl(data, option))
    : [];
};

const buildFetchUrl = (
  data: {
    geneId: string;
    productGeneratingContext?: ProductGeneratingContextFragment;
  },
  sequenceType: TranscriptOption
) => {
  const sequenceTypeToContextType: Record<TranscriptOption, string> = {
    genomicSequence: 'genomic',
    proteinSequence: 'product',
    cdna: 'cdna',
    cds: 'cds'
  };

  if (sequenceType === 'genomicSequence') {
    return `https://rest.ensembl.org/sequence/id/${data.geneId}?content-type=text/x-fasta&type=${sequenceTypeToContextType.genomicSequence}`;
  }

  if (data.productGeneratingContext) {
    const contextType = sequenceTypeToContextType[
      sequenceType
    ] as keyof ProductGeneratingContextFragment;
    const sequenceChecksum =
      data.productGeneratingContext &&
      data.productGeneratingContext[contextType]?.sequence_checksum;

    return `http://refget.review.ensembl.org/refget/sequence/${sequenceChecksum}?accept=text/plain`;
  }
};
