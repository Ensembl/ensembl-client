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

import type { HotspotPayload } from './hotspot';

export enum Markup {
  STRONG = 'strong',
  EMPHASIS = 'emphasis',
  FOCUS = 'focus',
  LIGHT = 'light'
}

export enum ZmenuFeatureType {
  GENE = 'gene',
  TRANSCRIPT = 'transcript',
  VARIANT = 'variant',
  REGULATORY_FEATURE = 'regulatory_feature'
}

export type ZmenuContentItem = {
  text: string;
  markup: Markup[];
};

export type ZmenuContentBlock = {
  type: 'block';
  items: ZmenuContentItem[];
};

export type ZmenuContentLine = ZmenuContentBlock[];

export type ZmenuContentTranscriptMetadata = {
  versioned_id: string;
  unversioned_id: string;
  designation: string;
  strand: string;
  transcript_biotype: string;
  track: string;
  type: ZmenuFeatureType.TRANSCRIPT;
  gene_id: string; // refers to gene's versioned stabled id
};

export type ZmenuContentGeneMetadata = {
  symbol: string;
  name: string;
  unversioned_id: string;
  versioned_id: string;
  track: string;
  type: ZmenuFeatureType.GENE;
};

export type ZmenuContentVariantMetadata = {
  alleles: string;
  consequence: string;
  id: string;
  position: string; // formatted as "region:start-end". NOTE: start and end coordinates have commas in them
  variety: string; // e.g. SNV, INS... Do we have a full list of such varieties?
  type: ZmenuFeatureType.VARIANT;
};

export type ZmenuContentRegulationMetadata = {
  id: string; // identifier of the regulatory feature
  type: ZmenuFeatureType.REGULATORY_FEATURE;
  feature_type: string; // e.g. Promoter, Enhancer, etc.
  region_name: string;
  start: number; // start coordinate of the feature bounds (always forward strand)
  end: number; // end coordinate of the feature bounds (always forward strand)
  core_start: number; // start coordinate of the feature core
  core_end: number; // end coordinate of the feature core
};

export type ZmenuContentGene = {
  data: ZmenuContentLine[];
  metadata: ZmenuContentGeneMetadata;
};

export type ZmenuContentTranscript = {
  data: ZmenuContentLine[];
  metadata: ZmenuContentTranscriptMetadata;
};

export type ZmenuContentVariant = {
  data: ZmenuContentLine[];
  metadata: ZmenuContentVariantMetadata;
};

export type ZmenuContentRegulation = {
  data: ZmenuContentLine[];
  metadata: ZmenuContentRegulationMetadata;
};

export type ZmenuContent =
  | ZmenuContentGene
  | ZmenuContentTranscript
  | ZmenuContentVariant
  | ZmenuContentRegulation;

export enum ZmenuPayloadVarietyType {
  GENE_AND_ONE_TRANSCRIPT = 'gene-and-one-transcript',
  VARIANT = 'variant',
  REGULATION = 'regulation'
}

export type ZmenuPayloadVariety = {
  type: string; //'zmenu'
  'zmenu-type': ZmenuPayloadVarietyType;
};

// Zmenu payload is a variety of a hotspot payload
export type ZmenuPayload = Omit<HotspotPayload, 'content' | 'variety'> & {
  content: ZmenuContent[];
  variety: ZmenuPayloadVariety[];
};
