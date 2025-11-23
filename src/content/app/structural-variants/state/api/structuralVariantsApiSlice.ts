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

import config from 'config';

import type { GenomeGroupForStructuralVariants } from 'src/content/app/structural-variants/types/genomeGroup';
import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

type GenomeGroupsResponse = {
  genome_groups: GenomeGroupForStructuralVariants[];
};

type GenomesInGroupResponse = {
  genomes: BriefGenomeSummary[];
};

const structuralVariantsApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    genomeGroups: builder.query<GenomeGroupsResponse, void>({
      query: () => ({
        url: `${config.metadataApiBaseUrl}/genome_groups?group_type=structural_variant`
      })
    }),
    genomesInGroup: builder.query<GenomesInGroupResponse, string>({
      query: (groupId: string) => ({
        url: `${config.metadataApiBaseUrl}/genome_groups/${groupId}/genomes`
      })
    })
  })
});

export const { useGenomeGroupsQuery, useGenomesInGroupQuery } =
  structuralVariantsApiSlice;
