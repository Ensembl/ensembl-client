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

import { ExternalReference } from './externalReference';
import { LocationWithinRegion } from './location';
import { Sequence } from './sequence';
import { Source } from './source';

export enum ProductType {
  PROTEIN = 'Protein'
}

type SequenceFamily = {
  name: string;
  description: string;
  url: string | null;
  source: Source;
};

export type ClosestDataProvider = {
  accession_id: string;
  description: string | null;
  url: string;
  source: Source;
};

export type FamilyMatch = {
  relative_location: LocationWithinRegion;
  sequence_family: SequenceFamily;
  via: ClosestDataProvider | null;
};

// TODO: have at least two types of products:
// one for protein, the other for RNA
export type Product = {
  type: ProductType;
  stable_id: string;
  unversioned_stable_id: string;
  version: number | null;
  length: number;
  external_references: ExternalReference[];
  sequence: Sequence;
  family_matches: FamilyMatch[];
};
