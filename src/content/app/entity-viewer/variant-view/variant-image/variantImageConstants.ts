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

export const DISPLAYED_REFERENCE_SEQUENCE_LENGTH = 41;

// the maximum number of letter blocks allocated to reference allele
export const MAX_REFERENCE_ALLELE_DISPLAY_LENGTH = 21;

// min 10 nucleotides should be visible on either side of the reference allele
export const MIN_FLANKING_SEQUENCE_LENGTH =
  (DISPLAYED_REFERENCE_SEQUENCE_LENGTH - MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) /
  2;

// if reference allele sequence is longer than the maximum display length,
// a gap is drawn in the middle of the sequence
export const REFERENCE_ALLELE_GAP_LENGTH = 5;
