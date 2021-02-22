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

import { flattenDeep } from 'lodash';

import downloadAsFile from 'src/shared/helpers/downloadAsFile';

import {
  TranscriptOption,
  TranscriptOptions,
  transcriptOptionsOrder
} from '../instant-download-transcript/InstantDownloadTranscript';
import {
  fetchGeneChecksums,
  TranscriptChecksums,
  TranscriptFragment
} from './fetchSequenceChecksums';

type Options = {
  transcript: Partial<TranscriptOptions>;
  gene: {
    genomicSequence: boolean;
  };
};

type FetchPayload = {
  genomeId: string;
  geneId: string;
  options: Options;
};

export const fetchForGene = async (payload: FetchPayload) => {
  const {
    genomeId,
    geneId,
    options: { transcript: transcriptOptions, gene: geneOptions }
  } = payload;
  const transcripts = await fetchGeneChecksums({
    genomeId,
    geneId
  });
  const urls = buildUrlsForGene(transcripts, transcriptOptions);

  console.log(urls);

  if (geneOptions.genomicSequence) {
    urls.push(buildFetchUrl({ geneId }, 'genomicSequence'));
  }

  const sequencePromises = urls.map((url) =>
    fetch(url).then((response) => response.text())
  );
  const sequences = await Promise.all(sequencePromises);
  const combinedFasta = sequences.join('\n\n');

  downloadAsFile(combinedFasta, `${geneId}.fasta`, {
    type: 'text/x-fasta'
  });
};

const buildUrlsForGene = (
  transcripts: TranscriptFragment[],
  options: Partial<TranscriptOptions>
) =>
  flattenDeep(
    transcripts.map((transcript) =>
      options
        ? transcriptOptionsOrder
            .filter((option) => options[option])
            .map((option) => buildFetchUrl({ transcript }, option))
        : []
    )
  );

const buildFetchUrl = (
  data: {
    geneId?: string;
    transcript?: TranscriptFragment;
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
    return `https://rest.ensembl.org/sequence/id/${data.transcript?.stable_id}?content-type=text/x-fasta&type=${sequenceTypeToContextType.genomicSequence}`;
  } else {
    const contextType = sequenceTypeToContextType[
      sequenceType
    ] as keyof TranscriptChecksums;
    const checksum =
      data.transcript &&
      data.transcript.product_generating_contexts[0][contextType]
        ?.sequence_checksum;

    return `/refget/sequence/${checksum}?accept=text/x-fasta`;
  }
};
