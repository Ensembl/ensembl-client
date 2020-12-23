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
import { Transcript } from './transcript';
import { Source } from './source';

/**
 * NOTE:
 * - According to CDM, the Gene type should have a `type` field with the value "Gene"
 *   (this should help with mixed responses, e.g. with search). But at the moment,
 *   the backend is not including this field in the response.
 * - There are ongoing conversations about the `so_term` and `biotype` field.
 *   We want the biotype; but it's not currently available; so we are using so_term instead
 */
export type Gene = {
  stable_id: string;
  unversioned_stable_id: string;
  version: number | null;
  symbol: string | null;
  name: string | null;
  source?: Source;
  so_term: string;
  slice: Slice;
  transcripts: Transcript[];
  alternative_symbols?: string[];
};
