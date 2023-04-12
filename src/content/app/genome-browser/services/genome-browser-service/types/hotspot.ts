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

// Different elements in the genome browser behave as clickable/hoverable hotspots.
// Example hotspot varieties include "zmenu", "track-hover", and "lozenge"

export type HotspotPayload = {
  x: number;
  y: number;
  content: unknown[];
  // Note: genome browser sends floats in the hotspot-area below. Might be worth updating the genome browser to always send rounded integers
  'hotspot-area': {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  variety: [
    {
      type: string;
    }
  ];
};

export type TranscriptsLozengePayload = Omit<HotspotPayload, 'content'> & {
  content: TranscriptsLozengeContent[];
};

export type TranscriptsLozengeContent = {
  currently_all: boolean; // when true, we are supposed to show all transcripts
  focus: boolean; // whether this is the focus gene track
  id: string; // stable id of the gene
};

export type TrackLegendHotspotPayload = Omit<HotspotPayload, 'content'> & {
  content: TrackLegendHotspotContent[];
  start: boolean; // true on mouse in; false on mouse out
};

export type TrackLegendHotspotContent = {
  track: string; // track id
};
