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
import { Exon } from './exon';
import { CDS } from './cds';
import { Source } from './source';
import { Product } from './product';

export type Transcript = {
  type: 'Transcript';
  id: string;
  symbol: string;
  so_term: string; // is there a better name for it?
  biotype?: string; // either this or so_term above need to be removed in the future
  slice: Slice;
  exons: Exon[];
  cds: CDS | null;
  product: Product | null;
  xrefs?: Source[];
};
