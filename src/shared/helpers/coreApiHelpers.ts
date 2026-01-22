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

type GeneWithTranscriptsPage<T> = {
  transcripts_page: {
    transcripts: T;
  };
};

type GeneWithTranscripts<T> = {
  transcripts: T;
};

/**
 * A helper function for transforming response from the core graphql api
 * (aka Thoas). Its purpose is to move transcripts
 * from the gene.transcripts_page.transcripts field in the response
 * to the gene.transcripts field, such that the downstream client-side code
 * is not concerned that the transcripts were fetched as a paginated list
 * in a gene.
 */

export const transformGeneInResponse = <
  T,
  G extends GeneWithTranscriptsPage<T>
>(response: {
  gene: G;
}) => {
  const transformedResponse = {
    gene: moveTranscriptsFieldFromTranscriptsPage<T, G>(response.gene)
  };
  return transformedResponse;
};

const moveTranscriptsFieldFromTranscriptsPage = <
  T,
  G1 extends GeneWithTranscriptsPage<T>
>(
  geneWithTranscriptsPage: G1
): Omit<G1, 'transcripts_page'> & GeneWithTranscripts<T> => {
  const { transcripts_page, ...otherGeneFields } = geneWithTranscriptsPage;
  const transformedGene = {
    ...otherGeneFields,
    transcripts: transcripts_page.transcripts
  };
  return transformedGene;
};
