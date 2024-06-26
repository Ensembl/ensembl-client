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

import * as urlFor from 'src/shared/helpers/urlHelper';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';

import { Strand } from 'src/shared/types/core-api/strand';

export type SequenceQueryParams = {
  checksum: string;
  start?: number; // In Ensembl (1-based) coordinate system!
  end?: number;
  strand?: Strand;
};

const refgetApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    refgetSequence: builder.query<string, SequenceQueryParams>({
      query: (params) => {
        const refgetUrl = urlFor.refget(params);
        return {
          url: refgetUrl,
          responseHandler: 'text'
        };
      },
      transformResponse: (sequence: string, _, params) => {
        const { strand = Strand.FORWARD } = params;
        return strand === Strand.REVERSE
          ? getReverseComplement(sequence)
          : sequence;
      }
    })
  })
});

export const { useRefgetSequenceQuery } = refgetApiSlice;
