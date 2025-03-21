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

export type CommittedItem = {
  genome_id: string;
  genome_tag: string | null;
  common_name: string | null;
  scientific_name: string;
  species_taxonomy_id: string;
  type: {
    kind: string; // e.g. "population"
    value: string; // e.g. "European"
  } | null;
  is_reference: boolean;
  assembly: {
    accession_id: string;
    name: string;
  };
  release?: Release; // Release is going to be mandatory; but making it optional temporarily for dev purposes
  isEnabled: boolean;
};
