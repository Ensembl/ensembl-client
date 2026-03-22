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

export const genomeGroupMatches = [
  {
    name: "Darwin's finches",
    genomesCount: 17,
    type: 'taxon',
    taxonId: 123 // doesn't really matter
  },
  {
    name: 'Darwin Tree of Life (DTOL)',
    genomesCount: 23,
    type: 'genomes_group',
    groupId: 256 // whatever
  }
];

export const singleGenomeMatches = [
  {
    name: 'Dark spectacle'
  },
  {
    name: 'Dark-eyed junco'
  },
  {
    name: 'Heart and dart moth'
  },
  {
    name: 'Anopheles darlingi',
    format: 'italic'
  },
  {
    name: 'Coenonympha darwiniana',
    format: 'italic'
  }
];
