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

import { GraphQLClient } from 'graphql-request';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  regionChecksumQuery,
  type RegionChecksumQueryResponse
} from './queries/regionChecksumQuery';

import { type GenomicSliceDownloadOptions } from './featureSequenceDownload.worker';

export const getGenomicSliceSequence = async (
  params: GenomicSliceDownloadOptions
) => {
  const { label, start, end } = params;
  const metadata = await fetchRegionMetadata(params);
  const region = metadata.region;

  const checksum = region.sequence.checksum;
  const refgetUrl = urlFor.refget({ checksum, start, end });

  const sequence = await fetch(refgetUrl).then((response) => response.text());

  return {
    label,
    sequence
  };
};

const fetchRegionMetadata = async (variables: {
  genomeId: string;
  regionName: string;
}) => {
  // Creating a client below instead of just calling "request",
  // so that it would be possible to inject a JSON serializer,
  // because either webpack, or comlink break the import of the default json serializer
  const graphQLClient = new GraphQLClient('/api/graphql/core', {
    jsonSerializer: JSON
  });

  return await graphQLClient.request<RegionChecksumQueryResponse>(
    regionChecksumQuery,
    variables
  );
};
