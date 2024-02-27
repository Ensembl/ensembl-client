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
  transcriptQueryForProtein,
  type TranscriptQueryForProteinResponse
} from './queries/transcriptQueryForProtein';

import { type ProteinDownloadOptions } from './featureSequenceDownload.worker';

export async function* getProteinRelatedSequences(
  params: ProteinDownloadOptions
) {
  const metadata = await fetchTranscriptMetadata(params);
  const transcript = metadata.transcript;
  // TODO: here, we are assuming that the transcript will only have one product-generating context.
  // This assumption is correct for now; but if we entered the graph via the product instead of through the transcript,
  // we wouldn't have had to assume anything.
  const productGeneratingContext = transcript.product_generating_contexts[0];

  // since we are inside of code that is downloading protein sequences,
  // we should be able to make an assumption that the product-generating context has both protein and cds
  if (params.sequences.protein) {
    const proteinId = productGeneratingContext.product!.stable_id;
    const checksum = productGeneratingContext.product!.sequence.checksum;
    const refgetUrl = urlFor.refget({ checksum });
    const sequence = await fetch(refgetUrl).then((response) => response.text());
    yield {
      label: `${proteinId} pep`,
      sequence
    };
  }
  if (params.sequences.cds) {
    const checksum = productGeneratingContext.cds!.sequence.checksum;
    const refgetUrl = urlFor.refget({ checksum });
    const sequence = await fetch(refgetUrl).then((response) => response.text());
    yield {
      label: `${transcript.stable_id} cds`,
      sequence
    };
  }
}

const fetchTranscriptMetadata = async (variables: {
  genomeId: string;
  transcriptId: string;
}) => {
  // Creating a client below instead of just calling "request",
  // so that it would be possible to inject a JSON serializer,
  // because either webpack, or comlink break the import of the default json serializer
  const graphQLClient = new GraphQLClient('/api/graphql/core', {
    jsonSerializer: JSON
  });

  return await graphQLClient.request<TranscriptQueryForProteinResponse>(
    transcriptQueryForProtein,
    variables
  );
};
