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

import { restGeneAdaptor } from '../rest-adaptors/rest-gene-adaptor';

import { Gene } from '../../../types/gene';
import { TranscriptInResponse } from './transcriptData';

export type GeneInResponse = {
  object_type: 'Gene';
  id: string;
  biotype: string;
  seq_region_name: string;
  strand: 1 | -1;
  start: number;
  end: number;
  Transcript: TranscriptInResponse[];
  assembly_name: string;
  description: string;
  version: number;
  db_type: string;
  species: string;
  display_name: string;
  source: string;
  logic_name: string;
};

export const fetchGene = async (
  id: string,
  signal?: AbortSignal
): Promise<Gene> => {
  const url = `https://rest.ensembl.org/lookup/id/${id}?expand=1;content-type=application/json`;

  const data: GeneInResponse = await fetch(url, { signal }).then((response) =>
    response.json()
  );

  return restGeneAdaptor(data);
};
