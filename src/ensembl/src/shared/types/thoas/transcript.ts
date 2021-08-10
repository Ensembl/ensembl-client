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

import { Slice } from './slice';
import { SplicedExon } from './exon';
import { FullProductGeneratingContext } from './productGeneratingContext';
import { LocationWithinRegion } from './location';
import { ExternalReference } from './externalReference';
import { TranscriptMetadata } from './metadata';

export type FullTranscript = {
  type: 'Transcript';
  stable_id: string;
  unversioned_stable_id: string;
  version: number | null;
  symbol: string | null;
  slice: Slice;
  relative_location: LocationWithinRegion;
  spliced_exons: SplicedExon[];
  product_generating_contexts: FullProductGeneratingContext[];
  external_references: ExternalReference[];
  metadata: TranscriptMetadata;
  name?: string;
};
