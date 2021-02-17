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

import apiService from 'src/services/api-service';

import { ProteinDomain } from 'src/shared/types/thoas/product';

export type TranscriptInResponse = {
  object_type: 'Transcript';
  id: string;
  biotype: string;
  seq_region_name: string;
  strand: 1 | -1;
  Parent: string; // gene id
  start: number;
  end: number;
  is_canonical: number;
  Translation?: TranslationInResponse;
  logic_name: string;
  source: string;
  display_name: string;
  species: string;
  db_type: string;
  version: number;
  assembly_name: number;
  Exon: ExonInResponse[];
};

export type TranslationInResponse = {
  object_type: 'Translation';
  id: string;
  Parent: string; // transcript id
  start: number;
  end: number;
  length: number;
  db_type: string;
  species: string;
};

export type ExonInResponse = {
  object_type: 'Exon';
  id: string;
  start: number;
  end: number;
  species: string;
  db_type: string;
  strand: number;
  seq_region_name: string;
  assembly_name: string;
  version: string;
};

export type ProteinFeature = {
  translation_id: number;
  description: string;
  start: number;
  id: string;
  type: string;
  end: number;
};

export const fetchProteinDomains = async (
  proteinId: string,
  signal?: AbortSignal
): Promise<ProteinDomain[]> => {
  const url = `https://rest.ensembl.org/overlap/translation/${proteinId}?feature=protein_feature;content-type=application/json`;

  // if the fetch is aborted, apiService.fetch will return undefined
  const response: ProteinFeature[] | undefined = await apiService.fetch(url, {
    signal
  });

  return response
    ? response
        .filter((item) => ['Pfam', 'PANTHER'].includes(item.type))
        .map((item) => {
          return {
            id: item.id,
            name: item.description,
            resource_name: item.type,
            location: {
              start: item.start,
              end: item.end,
              length: item.end - item.start + 1
            }
          };
        })
    : [];
};
