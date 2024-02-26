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

import type { Slice } from '../core-api/slice';
import type { ExternalReference } from '../core-api/externalReference';
import type { VariantPredictionResult } from './variantPredictionResult';
import type { VariantAllelePopulationFrequency } from './variantAllelePopulationFrequency';
import type { VariantAllelePhenotypeAssertion } from './variantAllelePhenotypeAssertion';
import type { VariantPredictedMolecularConsequence } from './variantPredictedMolecularConsequence';
import type { OntologyTermMetadata } from '../core-api/metadata';

export type VariantAllele = {
  type: 'VariantAllele';
  allele_type: OntologyTermMetadata;
  name: string; // this is a SPDI identifier
  slice: Slice;
  allele_sequence: string;
  reference_sequence: string;
  alternative_names: ExternalReference[];
  prediction_results: VariantPredictionResult[];
  population_frequencies: VariantAllelePopulationFrequency[];
  phenotype_assertions: VariantAllelePhenotypeAssertion[];
  predicted_molecular_consequences: VariantPredictedMolecularConsequence[];
  citations: unknown[]; // will be an array of Publication data types submitted to CDM
};
