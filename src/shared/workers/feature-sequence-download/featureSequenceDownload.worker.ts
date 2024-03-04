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

import { expose } from 'comlink';

import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';

import {
  geneAndTranscriptsSequences,
  transcriptAndGeneSequences
} from './geneAndTranscriptsDownload';
import { getProteinRelatedSequences } from './proteinDownload';
import { getGenomicSliceSequence } from './genomicSliceDownload';

/**
 * This is a worker whose purpose it is to fetch and appropriately format
 * different kinds of sequences for a given feature; and then pass the formatted string
 * over to the main thread, where it will be downloaded.
 *
 * Q: Why is this responsibility delegated to a web worker?
 * A: Good question. Maybe it shouldn't have been. The reasoning was that fetching and formatting
 *    a sequence for download is a task that has nothing to do with UI, and thus
 *    does not need to run on the main thread;
 *    and since sequences can exceed 1MB in size, the thinking was that this may prevent any long tasks
 *    arising during the formatting of the sequences from blocking the main thread.
 *    Whethere there indeed are any perceptible wins from moving this downloader code into a worker
 *    has not been tested.
 */

export type GeneDownloadOptions = {
  genomeId: string;
  geneId: string;
  geneSequenceTypes?: Partial<{
    genomic: boolean;
    exons: boolean;
  }>;
  transcriptSequenceTypes?: Partial<{
    genomic: boolean;
    cdna: boolean;
    cds: boolean;
    exons: boolean;
    protein: boolean;
  }>;
};

export type TranscriptDownloadOptions = Omit<GeneDownloadOptions, 'geneId'> & {
  transcriptId: string;
};

// Ideally, we should be able to use a protein id instead of the transcript id when downloading sequences for protein,
// but the core api is currently unable to traverse the graph in the direction product->product_generating_context->transcript
export type ProteinDownloadOptions = {
  genomeId: string;
  transcriptId: string;
  sequenceTypes: {
    protein: boolean;
    cds: boolean;
  };
};

// The download function that uses these options is going to be simple and generic;
// and will expect the caller to provide it with the label.
// It can be used, for example, to download regulatory feature sequences
export type GenomicSliceDownloadOptions = {
  genomeId: string;
  regionName: string;
  label: string;
  start: number;
  end: number;
};

const downloadSequencesForGene = async (options: GeneDownloadOptions) => {
  let body = '';

  for await (const sequenceData of geneAndTranscriptsSequences(options)) {
    if (!sequenceData) {
      continue;
    }
    body = growFastaString({ data: sequenceData, body });
  }

  return body;
};

const downloadSequencesForTranscript = async (
  options: TranscriptDownloadOptions
) => {
  let body = '';

  for await (const sequenceData of transcriptAndGeneSequences(options)) {
    if (!sequenceData) {
      continue;
    }
    body = growFastaString({ data: sequenceData, body });
  }

  return body;
};

const downloadSequencesForProtein = async (options: ProteinDownloadOptions) => {
  let body = '';

  for await (const sequenceData of getProteinRelatedSequences(options)) {
    if (!sequenceData) {
      continue;
    }
    body = growFastaString({ data: sequenceData, body });
  }

  return body;
};

const downloadGenomicSlice = async (options: GenomicSliceDownloadOptions) => {
  const { label, sequence } = await getGenomicSliceSequence(options);
  return toFasta({ header: label, value: sequence });
};

const growFastaString = (params: {
  data: {
    label: string;
    sequence: string;
  };
  body: string;
}) => {
  const {
    data: { label, sequence },
    body
  } = params;

  const fastaString = toFasta({ header: label, value: sequence });

  if (!body) {
    return fastaString;
  } else {
    // Start new sequence on the next line; no empty lines allowed in FASTA files
    return body + '\n' + fastaString;
  }
};

const workerApi = {
  downloadSequencesForGene,
  downloadSequencesForTranscript,
  downloadSequencesForProtein,
  downloadGenomicSlice
};

export type WorkerApi = typeof workerApi;

expose(workerApi);
