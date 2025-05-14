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

import type { Release } from 'src/shared/types/release';

export type ExampleFocusObject = {
  id: string;
  type: string;
};

type Provider = {
  name: string;
  url: string | null;
};

export type GenomeInfo = {
  genome_id: string;
  genome_tag: string | null;
  common_name: string | null;
  scientific_name: string;
  taxonomy_id: string;
  species_taxonomy_id: string;
  type: {
    kind: string; // e.g. "population"
    value: string; // e.g. "European"
  } | null;
  is_reference: boolean; // whether this is a genome for an assembly that is reference for a given organism
  assembly: {
    accession_id: string;
    name: string;
    url: string;
  };
  release: Release;
  assembly_provider: Provider | null;
  assembly_level: string;
  assembly_date: string | null;
  annotation_provider: Provider | null;
  annotation_method: string | null;
  annotation_version: string | null;
  annotation_date: string | null;
  number_of_genomes_in_group: number;
};

// Response received by querying the api with a string that can be either a genome id
// or a genome tag. Contains minimal necessary information about a genome used across different apps
export type BriefGenomeSummary = Pick<
  GenomeInfo,
  | 'genome_id'
  | 'genome_tag'
  | 'common_name'
  | 'scientific_name'
  | 'species_taxonomy_id'
  | 'type'
  | 'release'
  | 'is_reference'
  | 'number_of_genomes_in_group'
> & {
  assembly: Pick<GenomeInfo['assembly'], 'name' | 'accession_id'>;
};

export enum GenomeKaryotypeItemType {
  CHROMOSOME = 'chromosome'
}

export type GenomeKaryotypeItem = {
  is_circular: boolean;
  length: number;
  name: string;
  type: GenomeKaryotypeItemType;
};
