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

import { VariantStudyPopulation } from './variantStudyPopulation';
import { ValueSetMetadata } from '../thoas/metadata';

export type VariantAllelePopulationFrequency = {
  population: VariantStudyPopulation;
  allele_count: number; // Number of individuals/samples in the population where variant allele is found
  allele_number: number; // Total number of alleles in called genotypes
  allele_frequency: number;
  dataset: FrequencyDataset;
  qc_filter: ValueSetMetadata;
  is_minor_allele: boolean;
  is_hpmaf: boolean;
};

type FrequencyDataset = {
  version: string;
  release_date: string; // ISO date string yyyy-mm-dd
  source: unknown; // FIXME
};
