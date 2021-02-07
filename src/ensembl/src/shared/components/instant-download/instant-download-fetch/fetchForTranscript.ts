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

import { wrap } from 'comlink';

import downloadAsFile from 'src/shared/helpers/downloadAsFile';

import {
  TranscriptOptions,
  TranscriptOption,
  transcriptOptionsOrder
} from 'src/shared/components/instant-download/instant-download-transcript/InstantDownloadTranscript';
import {
  fetchTranscriptSequenceData,
  TranscriptSequenceData
} from './fetchSequenceChecksums';

import {
  WorkerApi,
  SingleSequenceFetchParams
} from 'src/shared/workers/sequenceFetcher.worker';

type Options = {
  transcript: Partial<TranscriptOptions>;
  gene: {
    genomicSequence: boolean;
  };
};

type FetchPayload = {
  genomeId: string;
  geneId: string;
  transcriptId: string;
  options: Options;
};

export const fetchForTranscript = async (payload: FetchPayload) => {
  const {
    genomeId,
    geneId,
    transcriptId,
    options: { transcript: transcriptOptions, gene: geneOptions }
  } = payload;
  const transcriptSequenceData = await fetchTranscriptSequenceData({
    genomeId,
    transcriptId
  });
  const sequenceDownloadParams = prepareDownloadParameters({
    transcriptId,
    transcriptSequenceData,
    options: transcriptOptions
  });

  if (geneOptions.genomicSequence) {
    sequenceDownloadParams.push(getGenomicSequenceData(geneId));
  }

  const worker = new Worker('src/shared/workers/sequenceFetcher.worker', {
    type: 'module'
  });

  const service = wrap<WorkerApi>(worker);

  const sequences = await service.downloadSequences(sequenceDownloadParams);

  worker.terminate();

  downloadAsFile(sequences, `${transcriptId}.fasta`, {
    type: 'text/x-fasta'
  });
};

type PrepareDownloadParametersParams = {
  transcriptId: string;
  transcriptSequenceData: TranscriptSequenceData;
  options: Partial<TranscriptOptions>;
};

// map of field names received from component to field names returned when fetching checksums
const labelTypeToSequenceType: Record<
  TranscriptOption,
  keyof TranscriptSequenceData | 'genomic'
> = {
  genomicSequence: 'genomic',
  proteinSequence: 'protein',
  cdna: 'cdna',
  cds: 'cds'
};

const prepareDownloadParameters = (params: PrepareDownloadParametersParams) => {
  return transcriptOptionsOrder
    .filter((option) => params.options[option])
    .map((option) => labelTypeToSequenceType[option]) // 'genomic', 'protein', 'cdna', 'cds'
    .map((option) => {
      if (option === 'genomic') {
        return getGenomicSequenceData(params.transcriptId);
      } else {
        const dataForSingleSequence = params.transcriptSequenceData[option];
        if (!dataForSingleSequence) {
          // shouldn't happen; but to keep typescript happy
          return null;
        }
        return {
          label: dataForSingleSequence.label,
          url: `/api/refget/sequence/${dataForSingleSequence.checksum}?accept=text/plain`
        };
      }
    })
    .filter(Boolean) as SingleSequenceFetchParams[];
};

const getGenomicSequenceData = (id: string) => {
  return {
    label: `${id} genomic`,
    url: `https://rest.ensembl.org/sequence/id/${id}?content-type=text/plain&type=genomic`
  };
};
