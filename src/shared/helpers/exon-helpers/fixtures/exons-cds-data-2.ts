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

/**
 * A simple example: a transcript of a human gene (ENSG00000151846.9),
 * with a transcript consisting of a single exon, with a 5' and a 3' UTR
 */

// transcript ENST00000281589.5
export const exons = [
  {
    index: 1,
    relative_location: {
      start: 1,
      end: 3119
    }
  }
];

export const cds = {
  relative_start: 64,
  relative_end: 1959,
  nucleotide_length: 1896
};

// The expected result
export const exonsWithRelativeLocationInCDS = [
  {
    index: 1,
    relative_location: { start: 1, end: 3119 },
    relative_location_in_cds: { start: 1, end: 1896, length: 1896 }
  }
];
