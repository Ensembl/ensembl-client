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

export type ProteinDomainsResources = {
  [name_of_resource: string]: {
    name: string;
    domains: [
      {
        name: string;
        source_uri: string;
        source: {
          name: string;
          uri: string;
        };
        location: {
          start: number;
          end: number;
        };
        score: number;
      }
    ];
  };
};

export enum ProductType {
  PROTEIN = 'Protein'
}

// TODO: have at least two types of products:
// one for protein, the other for RNA
export type Product = {
  type: ProductType;
  stable_id: string;
  unversioned_stable_id: string;
  version: number | null;
  length: number;
  protein_domains: ProteinDomain[];
  external_references: ExternalReference[];
  sequence_checksum?: string;
};

export type ProteinDomain = {
  id: string;
  name: string;
  resource_name: string;
  location: LocationWithinRegion;
  // there will be a couple of other properties coming from the api that we aren't interested in ATM
};
