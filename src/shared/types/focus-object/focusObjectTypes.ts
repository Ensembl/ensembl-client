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

import { Strand } from 'src/shared/types/thoas/strand';

export type FocusObjectLocation = {
  chromosome: string;
  end: number;
  start: number;
};

export type FocusObjectType = 'gene' | 'region';

type BasicFocusObject = {
  object_id: string;
  genome_id: string;
  label: string;
  location: FocusObjectLocation;
  type: FocusObjectType;
};

export type FocusGene = BasicFocusObject & {
  type: 'gene';
  stable_id: string;
  versioned_stable_id: string;
  bio_type: string;
  strand: Strand;
};

export type FocusRegion = BasicFocusObject & {
  type: 'region';
};

export type FocusObject = FocusGene | FocusRegion;

export type FocusObjectTrack = {
  additional_info?: string;
  child_tracks?: FocusObjectTrack[];
  colour?: string;
  label: string;
  ensembl_object_id?: string;
  support_level?: string | null;
  track_id: string;
  stable_id: string | null;
  description: string | null;
};

export type FocusObjectResponse = FocusGene;

export type FocusObjectIdConstituents = {
  genomeId: string;
  type: string;
  objectId: string;
};

export type UrlFocusIdConstituents = {
  type: string;
  objectId: string;
};