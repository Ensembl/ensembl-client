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
import { LocationWithinRegion } from './location';

export type Exon = {
  stable_id: string;
  slice: Slice;
};

// exon viewed from the perspective of how it is located in the transcript
export type SplicedExon = {
  index: number; // position of current exon in the array of exons
  relative_location: LocationWithinRegion;
  exon: Exon;
};

type ExonPhase =
  | -1 // for non-coding genes
  | 0
  | 1
  | 2;

// exon viewed from the perspective of how it corresponds to the product
export type PhasedExon = {
  index: number; // position of current exon in the array of exons
  start_phase: ExonPhase;
  end_phase: ExonPhase;
  exon: Exon;
};
