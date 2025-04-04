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

import config from 'config';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { Release } from './releaseTypes';

const releaseApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // query intended to discover whether a string available to the client is a genome id or a genome tag
    releases: builder.query<Release[], void>({
      query: () => ({
        url: `${config.metadataApiBaseUrl}/releases`
      })
    })
  })
});

export const { useReleasesQuery } = releaseApiSlice;
