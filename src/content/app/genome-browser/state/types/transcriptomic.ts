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

export type TranscriptomicSelection = {
  selection_id: string;
  parent_sample_id?: string | null;
  display_label: string;
  selection_level: string;
  data_type: string;
  metadata: Record<string, string | null>;
  track_products: { track_type: string; track_id: string }[];
};

export type TranscriptomicConfiguration = {
  track_count: number;
  selections: TranscriptomicSelection[];
  filters: Record<string, { value: string; count: number }[]>;
};

export type TranscriptomicFilters = Record<string, string[]>;
