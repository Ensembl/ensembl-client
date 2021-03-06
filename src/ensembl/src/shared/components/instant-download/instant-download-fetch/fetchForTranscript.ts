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
  fetchTranscriptSequenceMetadata,
  fetchGeneWithoutTranscriptsSequenceMetadata,
  TranscriptSequenceMetadata
} from './fetchSequenceChecksums';

// @ts-expect-error There is in fact no default export in the worker
import SequenceFetcherWorker, {
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
  const transcriptSequenceData = await fetchTranscriptSequenceMetadata({
    genomeId,
    transcriptId
  });
  const sequenceDownloadParams = prepareDownloadParameters({
    transcriptSequenceData,
    options: transcriptOptions
  });

  if (geneOptions.genomicSequence) {
    const metadata = await fetchGeneWithoutTranscriptsSequenceMetadata({
      genomeId,
      geneId
    });
    sequenceDownloadParams.unshift(
      getGenomicSequenceData(metadata.stable_id, metadata.unversioned_stable_id)
    );
  }

  const worker = new SequenceFetcherWorker();

  const service = wrap<WorkerApi>(worker);

  const sequences = await service.downloadSequences(sequenceDownloadParams);

  worker.terminate();

  downloadAsFile(sequences, `${transcriptId}.fasta`, {
    type: 'text/x-fasta'
  });
};

type PrepareDownloadParametersParams = {
  transcriptSequenceData: TranscriptSequenceMetadata;
  options: Partial<TranscriptOptions>;
};

// map of field names received from component to field names returned when fetching checksums
const labelTypeToSequenceType: Record<
  TranscriptOption,
  | keyof Omit<
      TranscriptSequenceMetadata,
      'stable_id' | 'unversioned_stable_id'
    >
  | 'genomic'
> = {
  genomicSequence: 'genomic',
  cdna: 'cdna',
  cds: 'cds',
  proteinSequence: 'protein'
};

export const prepareDownloadParameters = (
  params: PrepareDownloadParametersParams
) =>
  transcriptOptionsOrder
    .filter((option) => params.options[option])
    .map((option) => labelTypeToSequenceType[option]) // 'genomic', 'cdna', 'cds', 'protein'
    .map((option) => {
      if (option === 'genomic') {
        return getGenomicSequenceData(
          params.transcriptSequenceData.stable_id,
          params.transcriptSequenceData.unversioned_stable_id
        );
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

export const getGenomicSequenceData = (
  versionedStableId: string,
  unversionedStableId: string
) => ({
  label: `${versionedStableId} genomic`,
  url: `https://rest.ensembl.org/sequence/id/${unversionedStableId}?content-type=text/plain&type=genomic`
});
