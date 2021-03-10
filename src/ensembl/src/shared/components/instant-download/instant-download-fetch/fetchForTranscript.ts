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
import { gql } from '@apollo/client';

import { client } from 'src/gql-client';

import downloadAsFile from 'src/shared/helpers/downloadAsFile';

import {
  TranscriptOptions,
  TranscriptOption,
  transcriptOptionsOrder
} from 'src/shared/components/instant-download/instant-download-transcript/InstantDownloadTranscript';
import {
  fetchTranscriptSequenceMetadata,
  TranscriptSequenceMetadata
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
  const transcriptSequenceData = await fetchTranscriptSequenceMetadata({
    genomeId,
    transcriptId
  });
  const sequenceDownloadParams = await prepareDownloadParameters({
    genomeId,
    transcriptId,
    transcriptSequenceData,
    options: transcriptOptions
  });

  if (geneOptions.genomicSequence) {
    const unversioned_gene_stable_id = await getUnversionedStableId({
      genomeId,
      stableId: geneId,
      type: 'gene'
    });
    sequenceDownloadParams.push(
      getGenomicSequenceData(unversioned_gene_stable_id)
    );
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
  genomeId: string;
  transcriptId: string;
  transcriptSequenceData: TranscriptSequenceMetadata;
  options: Partial<TranscriptOptions>;
};

// map of field names received from component to field names returned when fetching checksums
const labelTypeToSequenceType: Record<
  TranscriptOption,
  keyof TranscriptSequenceMetadata | 'genomic'
> = {
  genomicSequence: 'genomic',
  proteinSequence: 'protein',
  cdna: 'cdna',
  cds: 'cds'
};

const prepareDownloadParameters = async (
  params: PrepareDownloadParametersParams
) => {
  const unversionedStableId = await getUnversionedStableId({
    genomeId: params.genomeId,
    stableId: params.transcriptId,
    type: 'transcript'
  });
  return transcriptOptionsOrder
    .filter((option) => params.options[option])
    .map((option) => labelTypeToSequenceType[option]) // 'genomic', 'protein', 'cdna', 'cds'
    .map((option) => {
      if (option === 'genomic') {
        return getGenomicSequenceData(unversionedStableId);
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

type UnversionedStableIdQueryVariables = {
  genomeId: string;
  stableId: string;
  type: 'gene' | 'transcript';
};

type TranscriptQueryResult = {
  transcript: {
    unversioned_stable_id: string;
  };
};

type GeneQueryResult = {
  gene: {
    unversioned_stable_id: string;
  };
};

const getUnversionedStableId = async (
  variables: UnversionedStableIdQueryVariables
): Promise<string> => {
  let query;
  if (variables.type === 'transcript') {
    query = gql`
      query Transcript($genomeId: String!, $stableId: String!) {
        transcript(byId: { genome_id: $genomeId, stable_id: $stableId }) {
          unversioned_stable_id
        }
      }
    `;
  } else {
    query = gql`
      query Gene($genomeId: String!, $stableId: String!) {
        gene(byId: { genome_id: $genomeId, stable_id: $stableId }) {
          unversioned_stable_id
        }
      }
    `;
  }

  return client
    .query<TranscriptQueryResult | GeneQueryResult>({
      query,
      variables
    })
    .then(({ data }) => {
      if ('transcript' in data) {
        return data.transcript.unversioned_stable_id;
      } else {
        return data.gene.unversioned_stable_id;
      }
    });
};

const getGenomicSequenceData = (id: string) => {
  return {
    label: `${id} genomic`,
    url: `https://rest.ensembl.org/sequence/id/${id}?content-type=text/plain&type=genomic`
  };
};
