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

import type { Strand } from 'src/shared/types/core-api/strand';

type SearchMatchType = 'Gene'; // so far, search only returns genes

export type SearchMatch = {
  type: SearchMatchType;
  stable_id: string;
  unversioned_stable_id: string;
  biotype: string;
  symbol: string | null;
  name: string;
  genome_id: string;
  transcript_count: number;
  slice: {
    location: {
      start: number;
      end: number;
    };
    region: {
      name: string;
    };
    strand: {
      code: Strand;
    };
  };
};
