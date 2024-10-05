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

type Strand = 'forward' | 'reverse' | 'independent'; // <-- ask to remove 'independent'?

export type GeneInRegionOverview = {
  symbol: string;
  stable_id: string;
  unversioned_stable_id: string;
  biotype: string;
  start: number;
  end: number;
  strand: Strand;
  representative_transcript: RepresentativeTranscriptInRegionOverview;
  tss: TranscriptionStartSite[];
  merged_exons: ExonInRegionOverview[];
  cds_counts: OverlappingCDSFragment[];
};

type RepresentativeTranscriptInRegionOverview = {
  exons: ExonInRegionOverview[];
  cds: CDSFragment[];
};

type ExonInRegionOverview = {
  start: number;
  end: number;
};

// Section of a CDS within an exon
type CDSFragment = {
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
type OverlappingCDSFragment = {
  start: number;
  end: number;
  count: number;
};

type RegulatoryFeatureType =
  | 'promoter'
  | 'enhancer'
  | 'CTCF_binding_site'
  | 'open_chromatin_region';

type MinimalRegulatoryFeatureData = {
  id: string;
  feature_type: RegulatoryFeatureType;
  start: number;
  end: number;
};

type StrandSpecificRegulatoryFeature = MinimalRegulatoryFeatureData & {
  strand: Strand;
};

type Promoter = MinimalRegulatoryFeatureData & {
  extended_start: number;
  extended_end: number;
};

type Enhancer = MinimalRegulatoryFeatureData;

type OpenChromatinRegion = MinimalRegulatoryFeatureData;

type CTCFBindingSite = StrandSpecificRegulatoryFeature;

type RegulatoryFeature =
  | Promoter
  | Enhancer
  | CTCFBindingSite
  | OpenChromatinRegion;

export type OverviewRegion = {
  seqid: string; // <-- should rename to region name?
  locations: {
    start: number;
    end: number;
  }[]; // <-- identifies parts of the region that will be included in the diagram
  genes: GeneInRegionOverview[];
  regulatory_features: RegulatoryFeature[];
};
