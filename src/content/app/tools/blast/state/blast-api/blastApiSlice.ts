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

import restApiSlice from 'src/shared/state/api-slices/restSlice';

// import { setBlastSettingsConfig } from '../blast-form/blastFormSlice';

import type { BlastSettingsConfig } from 'src/content/app/tools/blast/types/blastSettings';

const blastApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    blastConfig: builder.query<BlastSettingsConfig, void>({
      query: () => ({
        url: `api/tools/blast/config`
      }),
      keepUnusedDataFor: 60 * 60 // one hour
    })
  })
});

export const { useBlastConfigQuery } = blastApiSlice;
