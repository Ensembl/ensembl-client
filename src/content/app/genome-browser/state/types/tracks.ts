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

/**
 * NOTE ON THE TRIGGER FIELD ON THE GenomicTrack TYPE
 *
 * Tracks are stored in genome browser's memory in a tree-like structure,
 * and a trigger is an array that represents the path to a given track node.
 * Sadly, the client needs to be aware of this implementation detail,
 * because it needs to use this trigger to toggle a track, or its settings
 * (which are represented as tree nodes inside the track node) on and off.
 *
 * The contents of a trigger array for a given track are vaguely predictable,
 * but not certain. For some tracks, the trigger to toggle the track on/off
 * will be ["track", track_id]. For other tracks, it will be ["track", expansion_node, track_id].
 * Since there is no way for the client to know which is which, it has
 * to rely on track api to tell it.
 *
 * The content of trigger arrays for track settings is predictable,
 * and consist of the contents of the track trigger followed by
 * the name of the setting. Thus, triggers for settings can be generated
 * on the client.
 */

type GenomicTrackType = 'gene' | 'variant' | 'regular';

export type GenomicTrack = {
  track_id: string;
  type: GenomicTrackType;
  trigger: string[]; // <-- see the note about triggers above
  label: string;
  colour: string; // NOTE: the backend will want to get rid of this field
  additional_info: string;
  description: string;
  on_by_default: boolean;
  display_order: number;
  sources: Array<{
    name: string;
    url: string | null;
  }>;
};

export type GenomeTrackCategory = {
  label: string;
  track_category_id: string;
  track_list: GenomicTrack[];
  types: TrackSet[]; // shows which groups of tracks this category belongs to
};
