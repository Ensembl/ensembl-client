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

export type AnnotatedSequenceRequestPayload = {
  genome_uuid: string;

  focus_location?: { region_name: string; start: number; end: number };
  focus_gene?: { stable_id: string };
  focus_transcript?: { stable_id: string };

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
    metadata?: TranscriptMetadata;
  }[];
};

export type TranscriptMetadata = {
  type: 'transcript';
  id: string;
  start: number;
  end: number;
};

export type SequenceOptionsSection = {
  label: string;
  children: Array<SequenceBooleanOption | SequenceMultiselectOption>;
};

export type FlankingInfo = {
  default: number; // how many flanking bases upstream and downstream to show by default
  max: number; // maximum limit of the length of the flanking sequence
};

export type AnnotatedSequenceOptionsResponsePayload = {
  sections: SequenceOptionsSection[];
  flanking?: FlankingInfo;
};
