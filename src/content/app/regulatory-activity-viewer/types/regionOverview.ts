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

type ForwardOrReverseStrand = 'forward' | 'reverse';
type Strand = 'forward' | 'reverse' | 'independent'; // <-- ask to remove 'independent'?

export type GeneInRegionOverview = {
  symbol?: string;
  stable_id: string;
  unversioned_stable_id: string;
  biotype: string;
  start: number;
  end: number;
  strand: ForwardOrReverseStrand;
  representative_transcript: RepresentativeTranscriptInRegionOverview;
  tss: TranscriptionStartSite[];
  merged_exons: ExonInRegionOverview[];
  cds_counts: OverlappingCDSFragment[];
};

type RepresentativeTranscriptInRegionOverview = {
  exons: ExonInRegionOverview[];
  cds: CDSFragment[];
};

export type ExonInRegionOverview = {
  start: number;
  end: number;
};

// Section of a CDS within an exon
export type CDSFragment = {
  start: number;
  end: number;
};

type TranscriptionStartSite = {
  position: number;
};

/**
 * This segment represents an intersection of a given number of exons from different transcripts
 * that are within the coding sequence of that transcript.
 * The `count` field tells how many exons within a CDS are intersecting in this location.
 */
export type OverlappingCDSFragment = {
  start: number;
  end: number;
  count: number;
};

export type RegulatoryFeature = {
  id: string;
  feature_type: string; // promoter, enhancer, open_chromatin_region, CTCF_binding_site, etc. – Regulation doesn't want client to be aware of specific values
  start: number;
  end: number;
  strand: Strand;
  extended_start?: number; // <-- may have the same value as start
  extended_end?: number; // <-- may have the same value as end
};

export type RegulatoryFeatureMetadata = {
  label: string; // <-- human-readable label
  description?: string; // if there is any extra information to go along with the label
  color: string; // <-- a hexadecimal colour string
  track_index: number; // <-- where to display a feature relative to others; 0-based
};

// TODO: check if this is really needed
// type RegulatoryFeatureMetadataWithFeatureType = RegulatoryFeatureMetadata & {
//   feature_type: string;
// };

export type OverviewRegion = {
  region_name: string;
  coordinate_system: string; // <-- "chromosome", "contig", etc.; should probably be a union type of possible strings
  locations: {
    start: number;
    end: number;
  }[]; // <-- identifies parts of the region that will be included in the diagram
  genes: GeneInRegionOverview[];
  selected_gene_index: number; // <-- which gene to pick by default in absence of other indicators; 0-based
  regulatory_features: {
    feature_types: Record<string, RegulatoryFeatureMetadata>;
    data: RegulatoryFeature[];
  };
};