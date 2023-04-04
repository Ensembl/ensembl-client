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

import type { ExternalDB } from '../thoas/externalDb';

export type VariantAllelePhenotypeAssertion = {
  feature: string;
  feature_type: string;
  phenotype: Phenotype;
  evidence: PhenotypeAssertionEvidence[];
};

type Phenotype = {
  term: string;
};

type PhenotypeAssertionEvidence = {
  source: ExternalDB;
  citations: unknown[]; // will be an array of Publication data types submitted to CDM
  attributes: Attribute[];
};

// NOTE: this might turn out to be a more global type; not just for VariantAllelePhenotypeAssertion
type Attribute = {
  type: string;
  value: string;
};
