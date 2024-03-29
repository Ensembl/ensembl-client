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

import type { ExternalDB } from './externalDb';
import type { Source } from './source';

export type ValueSetMetadata = {
  value: string;
  label: string;
  definition: string;
};

export type BiotypeMetadata = Omit<ValueSetMetadata, 'definition'> & {
  definition: string | null;
};

export type GeneNameMetadata = {
  accession_id: string | null;
  url: string | null;
};

type CanonicalMetadata = Omit<ValueSetMetadata, 'value'> & { value: boolean };

type NCBITranscriptMetadata = {
  id: string;
  url: string;
};
type MANEMetadata = ValueSetMetadata & {
  ncbi_transcript: NCBITranscriptMetadata;
};

export type TranscriptMetadata = {
  tsl: ValueSetMetadata | null;
  appris: ValueSetMetadata | null;
  biotype: BiotypeMetadata;
  mane: MANEMetadata | null;
  canonical: CanonicalMetadata | null;
  gencode_basic: ValueSetMetadata | null;
};

export type GeneMetadata = {
  biotype: BiotypeMetadata;
  name: GeneNameMetadata | null;
};

export type OntologyTermMetadata = {
  accession_id: string;
  value: string;
  url: string;
  source: ExternalDB | null;
  evidence_method: AssignmentMethod | null;
  evidence_source: Source | null;
};

type AssignmentMethod = {
  type: string;
  description: string;
};
