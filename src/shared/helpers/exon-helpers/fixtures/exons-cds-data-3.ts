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
 * A transcript of a human gene, with two exons, both have UTRs
 */

// Exons of transcript ENST00000381033.5
export const exons = [
  {
    index: 1,
    relative_location: {
      start: 1,
      end: 545
    }
  },
  {
    index: 2,
    relative_location: {
      start: 4257,
      end: 6314
    }
  }
];

export const cds = {
  relative_start: 140,
  relative_end: 4702,
  nucleotide_length: 852
};

// The expected result
export const exonsWithRelativeLocationInCDS = [
  {
    index: 1,
    relative_location: { start: 1, end: 545 },
    relative_location_in_cds: { start: 1, end: 406, length: 406 }
  },
  {
    index: 2,
    relative_location: { start: 4257, end: 6314 },
    relative_location_in_cds: { start: 406, end: 851, length: 446 }
  }
];
