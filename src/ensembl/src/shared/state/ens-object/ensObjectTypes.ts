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

import { Strand } from 'src/content/app/entity-viewer/types/strand';

export type EnsObjectLocation = {
  chromosome: string;
  end: number;
  start: number;
};

export type EnsObject = {
  bio_type: string | null;
  label: string;
  object_id: string;
  genome_id: string;
  location: EnsObjectLocation;
  object_type: string;
  stable_id: string | null;
  strand: Strand | null;
  description: string | null;
  versioned_stable_id: string | null;
  track: EnsObjectTrack | null;
};

export type EnsObjectTrack = {
  additional_info?: string;
  child_tracks?: EnsObjectTrack[];
  colour?: string;
  label: string;
  ensembl_object_id?: string;
  support_level?: string | null;
  track_id: string;
  description: string | null;
};

/*
TODO: discuss with BE whether they want to put ensObject data inside
a root-level namespace key, so the response type becomes:
{
  ens_object: EnsObject
}
*/
export type EnsObjectResponse = EnsObject;
