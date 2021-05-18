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
  ProteinOptions,
  ProteinOption,
  proteinOptionsOrder
} from 'src/shared/components/instant-download/instant-download-protein/InstantDownloadProtein';
import {
  fetchTranscriptSequenceMetadata,
  TranscriptSequenceMetadata
} from './fetchSequenceChecksums';

// @ts-expect-error There is in fact no default export in the worker
import SequenceFetcherWorker, {
  WorkerApi,
  SingleSequenceFetchParams
} from 'src/shared/workers/sequenceFetcher.worker';

type FetchPayload = {
  genomeId: string;
  transcriptId: string;
  options: ProteinOptions;
};

export const fetchForProtein = async (payload: FetchPayload) => {
  const { genomeId, transcriptId, options } = payload;
  const transcriptSequenceData = await fetchTranscriptSequenceMetadata({
    genomeId,
    transcriptId
  });

  const sequenceDownloadParams = prepareDownloadParameters({
    transcriptSequenceData,
    options
  });

  try {
    const worker = new SequenceFetcherWorker();

    const service = wrap<WorkerApi>(worker);

    const sequences = await service.downloadSequences(sequenceDownloadParams);

    worker.terminate();

    downloadAsFile(sequences, `${transcriptId}.fasta`, {
      type: 'text/x-fasta'
    });
    return true;
  } catch (e) {
    return false;
  }
};

type PrepareDownloadParametersParams = {
  transcriptSequenceData: TranscriptSequenceMetadata;
  options: ProteinOptions;
};

// map of field names received from component to field names returned when fetching checksums
const labelTypeToSequenceType: Record<
  ProteinOption,
  keyof Omit<TranscriptSequenceMetadata, 'stable_id' | 'unversioned_stable_id'>
> = {
  proteinSequence: 'protein',
  cds: 'cds'
};

const prepareDownloadParameters = (params: PrepareDownloadParametersParams) => {
  const { transcriptSequenceData } = params;
  return proteinOptionsOrder
    .filter((option) => params.options[option])
    .map((option) => labelTypeToSequenceType[option]) // 'protein', 'cds'
    .map((option) => {
      const dataForSingleSequence = transcriptSequenceData[option];
      if (!dataForSingleSequence) {
        // shouldn't happen; but to keep typescript happy
        return null;
      }
      return {
        label: dataForSingleSequence.label,
        url: `/api/refget/sequence/${dataForSingleSequence.checksum}?accept=text/plain`
      };
    })
    .filter(Boolean) as SingleSequenceFetchParams[];
};
