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

import { TrackSet } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';

export type GenomicTrack = {
  colour: string; // NOTE: the backend will want to get rid of this field
  label: string;
  track_id: string;
  additional_info: string;
};

export type GenomeTrackCategory = {
  label: string;
  track_category_id: string;
  track_list: GenomicTrack[];
  types: TrackSet[]; // shows which groups of tracks this category belongs to
};
