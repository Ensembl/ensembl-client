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

import { Pick2, Pick3 } from 'ts-multipick';

import type { FullGene } from 'src/shared/types/core-api/gene';
import type { FullTranscript } from 'src/shared/types/core-api/transcript';
import type { FullProductGeneratingContext } from 'src/shared/types/core-api/productGeneratingContext';
import type { Product } from 'src/shared/types/core-api/product';

type GeneFields = Pick<
  FullGene,
  'stable_id' | 'unversioned_stable_id' | 'symbol'
>;
type GeneMetadata = Pick3<FullGene, 'metadata', 'biotype', 'label'>;
type GeneSlice = Pick3<FullGene, 'slice', 'region', 'name'> &
  Pick3<FullGene, 'slice', 'location', 'start' | 'end'> &
  Pick3<FullGene, 'slice', 'strand', 'code'>;
type TranscriptFields = Pick<FullTranscript, 'stable_id'>;
type TranscriptSlice = Pick3<FullTranscript, 'slice', 'location', 'length'>;
type TranscriptPGCs = {
  product_generating_contexts: (Pick<
    FullProductGeneratingContext,
    'product_type'
  > & {
    product: Pick<Product, 'length'> | null;
  })[];
};
type TranscriptMetadata = Pick3<
  FullTranscript,
  'metadata',
  'biotype',
  'label' | 'value'
> &
  Pick2<FullTranscript, 'metadata', 'canonical'> & // FIXME: this is not quite right
  Pick2<FullTranscript, 'metadata', 'mane'>; // FIXME: this is not quite right

export type TrackPanelTranscript = TranscriptFields &
  TranscriptSlice &
  TranscriptPGCs &
  TranscriptMetadata;

export type TrackPanelGene = GeneFields &
  GeneMetadata &
  GeneSlice & {
    transcripts: TrackPanelTranscript[];
  };
