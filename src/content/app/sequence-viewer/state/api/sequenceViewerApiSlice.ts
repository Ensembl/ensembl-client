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
import config from 'config';

import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';
import type { Strand } from 'src/shared/types/core-api/strand';

type Feature = {
  slice: {
    location: { start: number; end: number };
    region: { name: string; length: number; sequence: { checksum: string } };
    strand: { code: Strand };
  };
};

type TranscriptBoundary = {
  stable_id: string;
  unversioned_stable_id: string;
  metadata: {
    biotype: { label: string } | null;
  };
  slice: {
    location: { start: number; end: number; length: number };
    region: { name: string };
    strand: { code: Strand };
  };
};

type GeneFeature = Feature & {
  transcripts: TranscriptBoundary[];
};

type FeatureQueryParams = {
  genomeId: string;
  featureId: string;
};

type RegionSequenceQueryParams = {
  genomeId: string;
  regionName: string;
};

type RegionSequence = {
  name: string;
  length: number;
  sequence: { checksum: string };
};

type OverlapFeature = {
  stable_id: string;
  symbol: string | null;
  name?: string | null;
  so_term: string | null;
  slice: TranscriptBoundary['slice'];
};

type OverlapRegionQueryParams = {
  genomeId: string;
  regionName: string;
  start: number;
  end: number;
};

type OverlapRegion = {
  genes: OverlapFeature[];
  transcripts: OverlapFeature[];
};

const sequenceFields = gql`
  fragment sequenceFields on Slice {
    location {
      start
      end
    }
    region {
      name
      length
      sequence {
        checksum
      }
    }
    strand {
      code
    }
  }
`;

const geneSequenceQuery = gql`
  query SequenceViewerGene($genomeId: String!, $featureId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $featureId }) {
      slice {
        ...sequenceFields
      }
      transcripts {
        stable_id
        unversioned_stable_id
        metadata {
          biotype {
            label
          }
        }
        slice {
          location {
            start
            end
            length
          }
          region {
            name
          }
          strand {
            code
          }
        }
      }
    }
  }
  ${sequenceFields}
`;

const transcriptSequenceQuery = gql`
  query SequenceViewerTranscript($genomeId: String!, $featureId: String!) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $featureId }) {
      slice {
        ...sequenceFields
      }
    }
  }
  ${sequenceFields}
`;

const regionSequenceQuery = gql`
  query SequenceViewerRegion($genomeId: String!, $regionName: String!) {
    region(by_name: { genome_id: $genomeId, name: $regionName }) {
      name
      length
      sequence {
        checksum
      }
    }
  }
`;

const overlapRegionQuery = gql`
  query SequenceViewerOverlapRegion(
    $genomeId: String!
    $regionName: String!
    $start: Int!
    $end: Int!
  ) {
    overlap_region(
      by_slice: {
        genome_id: $genomeId
        region_name: $regionName
        start: $start
        end: $end
      }
    ) {
      genes {
        stable_id
        symbol
        name
        so_term
        slice {
          location {
            start
            end
            length
          }
          region {
            name
          }
          strand {
            code
          }
        }
      }
      transcripts {
        stable_id
        symbol
        so_term
        slice {
          location {
            start
            end
            length
          }
          region {
            name
          }
          strand {
            code
          }
        }
      }
    }
  }
`;

const sequenceViewerApiSlice = graphqlApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sequenceViewerGene: builder.query<GeneFeature, FeatureQueryParams>({
      query: ({ genomeId, featureId }) => ({
        url: config.coreApiUrl,
        body: geneSequenceQuery,
        variables: { genomeId, featureId }
      }),
      transformResponse: (response: { gene: GeneFeature }) => response.gene
    }),
    sequenceViewerTranscript: builder.query<Feature, FeatureQueryParams>({
      query: ({ genomeId, featureId }) => ({
        url: config.coreApiUrl,
        body: transcriptSequenceQuery,
        variables: { genomeId, featureId }
      }),
      transformResponse: (response: { transcript: Feature }) =>
        response.transcript
    }),
    sequenceViewerRegion: builder.query<
      RegionSequence,
      RegionSequenceQueryParams
    >({
      query: ({ genomeId, regionName }) => ({
        url: config.coreApiUrl,
        body: regionSequenceQuery,
        variables: { genomeId, regionName }
      }),
      transformResponse: (response: { region: RegionSequence }) =>
        response.region
    }),
    sequenceViewerOverlapRegion: builder.query<
      OverlapRegion,
      OverlapRegionQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: overlapRegionQuery,
        variables: params
      }),
      transformResponse: (response: { overlap_region: OverlapRegion }) =>
        response.overlap_region
    })
  })
});

export const {
  useSequenceViewerGeneQuery,
  useSequenceViewerTranscriptQuery,
  useSequenceViewerRegionQuery,
  useSequenceViewerOverlapRegionQuery
} = sequenceViewerApiSlice;
