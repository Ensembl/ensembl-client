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
 * Simplest example: a protein-coding transcript containing a single exon,
 * with no UTRs.
 *
 * This doesn't seem to exist in human; so using an E.coli gene b2992 as an example
 */

export const exons = [
  {
    index: 1,
    relative_location: {
      start: 1,
      end: 489
    }
  }
];

export const cds = {
  relative_start: 1,
  relative_end: 489,
  nucleotide_length: 489
};

// The expected result
export const exonsWithRelativeLocationInCDS = [
  {
    index: 1,
    relative_location: { start: 1, end: 489 },
    relative_location_in_cds: { start: 1, end: 489, length: 489 }
  }
];
