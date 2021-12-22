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

export type SingleSequenceFetchParams = {
  label: string;
  url: string;
};

export type SequenceFetcherParams = Array<SingleSequenceFetchParams>;

const downloadSequences = async (params: SequenceFetcherParams) => {
  const sequencePromises = params.map(({ label, url }) => {
    return fetch(url)
      .then((response) => response.text())
      .then((sequence) => toFasta({ header: label, value: sequence }));
  });

  const sequences = await Promise.all(sequencePromises);

  // start new sequence on a new line; no empty lines allowed in FASTA files
  return sequences.join('\n');
};

const workerApi = {
  downloadSequences
};

export type WorkerApi = typeof workerApi;

expose(workerApi);
