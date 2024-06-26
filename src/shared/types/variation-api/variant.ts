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
import type { OntologyTermMetadata } from '../core-api/metadata';
import type { VariantPredictionResult } from './variantPredictionResult';
import type { VariantAllele } from './variantAllele';
import type { VariantSummaryStatistics } from './variantSummaryStatistics';

export type Variant = {
  type: 'Variant';
  name: string; // this is an rsID identifier
  slice: Slice;
  allele_type: OntologyTermMetadata;
  alternative_names: ExternalReference[];
  primary_source: ExternalReference;
  prediction_results: VariantPredictionResult[];
  alleles: VariantAllele[];
  ensembl_website_display_data: VariantSummaryStatistics;
};
