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

// Exons of human transcript ENST00000622028.1
// It is a protein-coding transcript with no UTRs

export const exons = [
  {
    index: 1,
    relative_location: {
      start: 1,
      end: 46,
      length: 46
    }
  },
  {
    index: 2,
    relative_location: {
      start: 130,
      end: 436,
      length: 307
    }
  }
];

export const cds = {
  relative_start: 1,
  relative_end: 436,
  nucleotide_length: 353
};

// The expected result
export const exonsWithRelativeLocationInCDS = [
  {
    index: 1,
    relative_location: {
      start: 1,
      end: 46,
      length: 46
    },
    relative_location_in_cds: {
      start: 1,
      end: 46,
      length: 46
    }
  },
  {
    index: 2,
    relative_location: {
      start: 130,
      end: 436,
      length: 307
    },
    relative_location_in_cds: {
      start: 47,
      end: 353,
      length: 307
    }
  }
];
