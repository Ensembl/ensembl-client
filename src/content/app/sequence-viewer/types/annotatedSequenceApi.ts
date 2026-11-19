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

import { Strand } from 'src/shared/types/core-api/strand';

export type AnnotatedSequenceRequestPayload = {
  genome_uuid: string;

  focus_location?: { region_name: string; start: number; end: number };
  focus_gene?: { stable_id: string };
  focus_transcript?: { stable_id: string };

  sequence_type?: string; // only relevant for transcript sequence requests

  options?: Record<string, string | number | boolean | string[] | number[]>;
};

// Type corresponding to a single checkbox
export type SequenceBooleanOption = {
  type: 'checkbox';
  id: string; // key in key/value dictionary of options sent in request to the server
  label: string; // human-readable label
  value: string | number | boolean; // value in key/value dictionary of options sent in request to the server
  checked: boolean; // whether is selected by default
};

// Type corresponding to a group of checkboxes
export type SequenceMultiselectOption = {
  id: string; // key in key / array of values dictionary
  type: 'checkbox-group';
  values: {
    label: string;
    value: string | number | boolean; // value in the array of values
    checked: boolean; // whether this is selected by default
    metadata?: GeneMetadata | TranscriptMetadata;
  }[];
};

export type TranscriptMetadata = {
  type: 'transcript';
  id: string;
  additional_info: string;
  start: number;
  end: number;
};

export type GeneMetadata = {
  type: 'gene';
  id: string;
  start: number;
  end: number;
  symbol: string | null;
  biotype: string;
};

type SidebarPanelBase = {
  label: string;
  is_collapsible: boolean;
  expanded_by_default: boolean;
};

export type SequenceOptionsPanel = SidebarPanelBase & {
  type: 'sequence_options';
  children: Array<SequenceBooleanOption | SequenceMultiselectOption>;
};

export type FlankingPanel = SidebarPanelBase & {
  type: 'flanking';
  settings: FlankingInfo;
};

export type LegendPanel = SidebarPanelBase & {
  type: 'legend';
  value: string | null;
};

export type SequenceSidebarPanel =
  SequenceOptionsPanel | FlankingPanel | LegendPanel;

export type FlankingInfo = {
  default: number; // how many flanking bases upstream and downstream to show by default
  max: number; // maximum limit of the length of the flanking sequence
  upstream_id: string;
  downstream_id: string;
};

export type SequenceSidebarPanelsResponsePayload = {
  panels: SequenceSidebarPanel[];
};

export type DownloadOption = Omit<SequenceBooleanOption, 'value'> & {
  value: boolean;
};

export type DownloadOptionsSection = {
  label: string;
  children: Array<DownloadOption>;
};

export type DownloadFileFormatWithOptions = {
  id: string;
  label: string;
  sections: DownloadOptionsSection[];
  use_sequence_options: boolean;
};

export type SequenceDownloadOptionsResponsePayload = {
  formats: DownloadFileFormatWithOptions[];
};

/* Feature endpoint */

// The "exceptions" field contains a list of exceptions (i.e. characteristics of the sequence that
// prevent us from displaying some of its views or annotations)
// Two notable exceptions that should stop us from displaying the genomic sequence of a feature
// are strings "trans_spliced" and "circular_cross_origin"

export type GeneInFeatureResponse = {
  stable_id: string;
  unversioned_stable_id: string;
  symbol: string | null;
  biotype: string;
  region_name: string;
  start: number;
  end: number;
  strand: Strand;
  exceptions: string[];
};

export type TranscriptInFeatureResponse = {
  stable_id: string;
  unversioned_stable_id: string;
  biotype: string;
  has_protein: boolean;
  gene_stable_id: string;
  gene_unversioned_stable_id: string;
  gene_symbol: string | null;
  region_name: string;
  start: number;
  end: number;
  strand: Strand;
  exceptions: string[];
};

export type GeneFeatureResponsePayload = {
  gene: GeneInFeatureResponse;
};

export type TranscriptFeatureResponsePayload = {
  transcript: TranscriptInFeatureResponse;
};
