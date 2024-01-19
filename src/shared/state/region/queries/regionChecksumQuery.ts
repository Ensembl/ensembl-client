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

import { gql } from 'graphql-request';
import type { Pick2 } from 'ts-multipick';

import type { Region } from 'src/shared/types/core-api/slice';

export const regionChecksumQuery = gql`
  query RegionChecksum($genomeId: String!, $regionName: String!) {
    region(by_name: { genome_id: $genomeId, name: $regionName }) {
      name
      length
      topology
      sequence {
        checksum
      }
    }
  }
`;

type RegionInResponse = Pick<Region, 'name' | 'length' | 'topology'> &
  Pick2<Region, 'sequence', 'checksum'>;

export type RegionChecksumQueryResult = {
  region: RegionInResponse;
};
