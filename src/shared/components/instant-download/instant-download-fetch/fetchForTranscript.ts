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
  fetchGeneAndTranscriptSequenceMetadata,
  TranscriptSequenceMetadata
} from './fetchSequenceChecksums';

import type {
  WorkerApi,
  SingleSequenceFetchParams
} from 'src/shared/workers/sequenceFetcher.worker';
import { Strand } from 'src/shared/types/thoas/strand';

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
  const { transcript: transcriptSequenceData, gene: geneSequenceData } =
    await fetchGeneAndTranscriptSequenceMetadata({
      genomeId,
      geneId,
      transcriptId
    });
  const sequenceDownloadParams = prepareDownloadParameters({
    transcriptSequenceData,
    options: transcriptOptions
  });

  if (geneOptions.genomicSequence) {
    sequenceDownloadParams.unshift(
      prepareGenomicDownloadParameters(geneSequenceData.genomic)
    );
  }

  const worker = new Worker(
    new URL('src/shared/workers/sequenceFetcher.worker.ts', import.meta.url)
  );

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
        return prepareGenomicDownloadParameters(
          params.transcriptSequenceData.genomic
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

export const prepareGenomicDownloadParameters = (params: {
  label: string;
  checksum: string;
  start: number;
  end: number;
  strand: Strand;
}) => {
  const { label, start, end, checksum, strand } = params;
  const url = `/api/refget/sequence/${checksum}?start=${start}&end=${end}&accept=text/plain`;
  return {
    label,
    url,
    reverseComplement: strand === Strand.REVERSE
  };
};
