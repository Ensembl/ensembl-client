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

// Fields that all track summaries should have
export type CommonTrackSummary = {
  'switch-id': string; // This is the track id. Genome browser calls them switches
  offset: number;
  height: number;
};

export type FocusGeneTrackSummary = Omit<CommonTrackSummary, 'switch-id'> & {
  'switch-id': 'focus';
  id: string; // Focus gene id
  'transcripts-shown': string[]; // an array of ids of visible transcripts
};

export type TrackSummary = CommonTrackSummary | FocusGeneTrackSummary;
