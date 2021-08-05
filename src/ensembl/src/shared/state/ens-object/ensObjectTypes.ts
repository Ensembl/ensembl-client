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

export type EnsObjectLocation = {
  chromosome: string;
  end: number;
  start: number;
};

export type EnsObjectType = 'gene' | 'region';

type BasicEnsObject = {
  object_id: string;
  genome_id: string;
  label: string;
  location: EnsObjectLocation;
  type: EnsObjectType;
};

export type EnsObjectGene = BasicEnsObject & {
  type: 'gene';
  stable_id: string | null;
  versioned_stable_id: string | null;
  bio_type: string;
  strand: Strand;
  description: string | null;
  track: EnsObjectTrack | null;
};

export type EnsObjectRegion = BasicEnsObject & {
  type: 'region';
};

export type EnsObject = EnsObjectGene | EnsObjectRegion;

export type EnsObjectTrack = {
  additional_info?: string;
  child_tracks?: EnsObjectTrack[];
  colour?: string;
  label: string;
  support_level?: string | null;
  track_id: string;
  stable_id: string | null;
  description: string | null;
};

/*
TODO: discuss with BE whether they want to put ensObject data inside
a root-level namespace key, so the response type becomes:
{
  ens_object: EnsObject
}
*/
export type EnsObjectResponse = EnsObjectGene;
