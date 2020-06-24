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

import { EnsObjectTrack } from 'src/shared/state/ens-object/ensObjectTypes';
import { TrackSet } from 'src/content/app/browser/track-panel/trackPanelConfig';

export type ExampleFocusObject = {
  id: string;
  type: string;
};

export type GenomeInfo = {
  genome_id: string;
  reference_genome_id: string | null;
  common_name: string;
  assembly_name: string;
  scientific_name: string;
  example_objects: ExampleFocusObject[];
};

export type GenomeInfoData = {
  [key: string]: GenomeInfo;
};

export type GenomeTrackCategory = {
  label: string;
  track_category_id: string;
  track_list: EnsObjectTrack[];
  types: TrackSet[];
};

export type GenomeInfoResponse = {
  genome_info: GenomeInfo[];
};

export type GenomeTrackCategories = {
  [genomeId: string]: GenomeTrackCategory[];
};

export enum GenomeKaryotypeItemType {
  CHROMOSOME = 'chromosome'
}

export type GenomeKaryotypeItem = {
  is_chromosome: boolean;
  is_circular: boolean;
  length: number;
  name: string;
  type: GenomeKaryotypeItemType;
};
