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

export const fetchForTranscript = async (payload: FetchPayload) => {
  const {
    geneId,
    transcriptId,
    options: { transcript: transcriptOptions, gene: geneOptions }
  } = payload;
  const urls = buildUrlsForTranscript(transcriptId, transcriptOptions);
  if (geneOptions.genomicSequence) {
    urls.push(buildFetchUrl(geneId, 'genomicSequence'));
  }
  const sequencePromises = urls.map((url) =>
    fetch(url).then((response) => response.text())
  );
  const sequences = await Promise.all(sequencePromises);
  const combinedFasta = sequences.join('\n');

  downloadAsFile(combinedFasta, `${transcriptId}.fasta`, {
    type: 'text/x-fasta'
  });
};

const buildUrlsForTranscript = (
  id: string,
  options: Partial<TranscriptOptions>
) => {
  return options
    ? transcriptOptionsOrder
        .filter((option) => options[option])
        .map((option) => buildFetchUrl(id, option))
    : [];
};

const buildFetchUrl = (id: string, sequenceType: TranscriptOption) => {
  const sequenceTypeToTypeParam: Record<TranscriptOption, string> = {
    genomicSequence: 'genomic',
    proteinSequence: 'protein',
    cdna: 'cdna',
    cds: 'cds'
  };
  const typeParam = sequenceTypeToTypeParam[sequenceType];

  return `https://rest.ensembl.org/sequence/id/${id}?content-type=text/x-fasta&type=${typeParam}`;
};
