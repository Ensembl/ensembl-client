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

import { TranscriptOptions } from '../instant-download-transcript/InstantDownloadTranscript';
import { fetchGeneSequenceMetadata } from './fetchSequenceChecksums';

import {
  prepareGeneDownloadParameters,
  prepareDownloadParameters
} from './fetchForTranscript';

import type { WorkerApi } from 'src/shared/workers/sequenceFetcher.worker';

type GeneOptions = {
  transcript: Partial<TranscriptOptions>;
  gene: {
    genomicSequence: boolean;
  };
};

type FetchPayload = {
  genomeId: string;
  geneId: string;
  options: GeneOptions;
};

export const fetchForGene = async (payload: FetchPayload) => {
  const {
    genomeId,
    geneId,
    options: { transcript: transcriptOptions, gene: geneOptions }
  } = payload;

  const geneSequenceData = await fetchGeneSequenceMetadata({
    genomeId,
    geneId
  });

  const sequenceDownloadParams = geneSequenceData.transcripts.flatMap(
    (transcript) =>
      prepareDownloadParameters({
        transcriptSequenceData: transcript,
        options: transcriptOptions
      })
  );

  if (geneOptions.genomicSequence) {
    sequenceDownloadParams.unshift(
      prepareGeneDownloadParameters(geneSequenceData)
    );
  }

  const worker = new Worker(
    new URL('src/shared/workers/sequenceFetcher.worker.ts', import.meta.url)
  );

  const service = wrap<WorkerApi>(worker);
  const sequences = await service.downloadSequences(sequenceDownloadParams);

  worker.terminate();

  downloadAsFile(sequences, `${geneId}.fasta`, {
    type: 'text/x-fasta'
  });
};
