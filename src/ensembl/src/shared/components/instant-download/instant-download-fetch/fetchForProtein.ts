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
  ProteinOptions,
  ProteinOption,
  proteinOptionsOrder
} from 'src/shared/components/instant-download/instant-download-protein/InstantDownloadProtein';
import {
  fetchTranscriptSequenceChecksums,
  TranscriptSequenceChecksums
} from './fetchSequenceChecksums';

type FetchPayload = {
  genomeId: string;
  transcriptId: string;
  options: ProteinOptions;
};

export const fetchForProtein = async (payload: FetchPayload) => {
  const { genomeId, transcriptId, options } = payload;
  const productGeneratingContext = await fetchTranscriptSequenceChecksums({
    genomeId,
    transcriptId
  });

  const urls = buildUrlsForProtein(productGeneratingContext, options);
  const sequencePromises = urls.map((url) =>
    fetch(url).then((response) => response.text())
  );

  const sequences = await Promise.all(sequencePromises);
  const combinedFasta = sequences.join('\n\n');

  downloadAsFile(combinedFasta, `${transcriptId}.fasta`, {
    type: 'text/x-fasta'
  });
};

const buildUrlsForProtein = (
  productGeneratingContext: TranscriptSequenceChecksums,
  options: ProteinOptions
) => {
  return options
    ? proteinOptionsOrder
        .filter((option) => options[option])
        .map((option) => buildFetchUrl(productGeneratingContext, option))
    : [];
};

const buildFetchUrl = (
  productGeneratingContext: TranscriptSequenceChecksums,
  sequenceType: ProteinOption
) => {
  const sequenceTypeToContextType: Record<ProteinOption, string> = {
    proteinSequence: 'product',
    cds: 'cds'
  };
  const contextType = sequenceTypeToContextType[
    sequenceType
  ] as keyof TranscriptSequenceChecksums;
  const sequenceChecksum =
    productGeneratingContext[contextType]?.sequence_checksum;

  return `/refget/sequence/${sequenceChecksum}?accept=text/x-fasta`;
};
