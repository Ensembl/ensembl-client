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

type BookmarksDrawerView = {
  name: 'bookmarks';
};

export type GeneDrawerView = {
  name: 'gene_summary';
  geneId: string; // in focusObjectId format
};

export type TranscriptDrawerView = {
  name: 'transcript_summary';
  transcriptId: string; // transcript stable id
};

export type VariantDrawerView = {
  name: 'variant_summary';
  variantId: string;
};

export type GenericTrackView = {
  name: 'track_details';
  trackId: string;
};

export type VariantLegendView = {
  name: 'variant_group_legend';
  group: string;
};

export type RegulationLegendView = {
  name: 'regulation_legend';
  group: string;
};

export type DrawerView =
  | BookmarksDrawerView
  | GeneDrawerView
  | TranscriptDrawerView
  | VariantDrawerView
  | GenericTrackView
  | VariantLegendView
  | RegulationLegendView;
