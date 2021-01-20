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

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, gql } from '@apollo/client';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  getActiveDrawerTrackId,
  getActiveTrackDetails
} from 'src/content/app/browser/drawer/drawerSelectors';
import { fetchTrackDetails } from 'src/content/app/browser/drawer/drawerActions';
import { getBrowserActiveEnsObject } from 'src/content/app/browser/browserSelectors';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import {
  buildFocusIdForUrl,
  getDisplayStableId
} from 'src/shared/state/ens-object/ensObjectHelpers';

import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import { EnsObjectGene } from 'src/shared/state/ens-object/ensObjectTypes';
import { Gene as GeneFromGraphql } from 'src/content/app/entity-viewer/types/gene';
import { Transcript as TranscriptFromGraphql } from 'src/content/app/entity-viewer/types/transcript';

import styles from './TrackDetails.scss';

const TrackDetails = () => {
  const activeTrackId = useSelector(getActiveDrawerTrackId);

  if (activeTrackId === 'track:gene-feat') {
    return <GeneTrackDetails />;
  } else if (activeTrackId === 'track:gene-feat-1') {
    return <TranscriptTrackDetails />;
  }
  return <OtherTrackDetails />;
};

const GENE_QUERY = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      alternative_symbols
      name
      stable_id
      symbol
      so_term
      transcripts {
        stable_id
      }
      slice {
        strand {
          code
          value
        }
        location {
          length
        }
      }
    }
  }
`;

type Gene = Required<
  Pick<
    GeneFromGraphql,
    | 'stable_id'
    | 'symbol'
    | 'name'
    | 'alternative_symbols'
    | 'so_term'
    | 'transcripts'
    | 'slice'
  >
>;

const GeneTrackDetails = () => {
  const ensObjectGene = useSelector(getBrowserActiveEnsObject) as EnsObjectGene;

  const { data, loading } = useQuery<{ gene: Gene }>(GENE_QUERY, {
    variables: {
      geneId: ensObjectGene.stable_id,
      genomeId: ensObjectGene.genome_id
    },
    skip: !ensObjectGene.stable_id
  });

  if (loading || !data?.gene) {
    return null;
  }

  if (!data?.gene) {
    return <div>No data available</div>;
  }

  const { gene } = data;

  const stableId = getDisplayStableId(gene);

  const focusId = buildFocusIdForUrl({
    type: 'gene',
    objectId: gene.stable_id as string
  });
  const entityViewerUrl = urlFor.entityViewer({
    genomeId: ensObjectGene.genome_id,
    entityId: focusId
  });

  return (
    <div className={styles.container}>
      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Gene</div>
        <div className={styles.value}>
          <div className={styles.featureDetails}>
            {gene.symbol && (
              <span className={styles.featureSymbol}>{gene.symbol}</span>
            )}
            {gene.symbol !== stableId && (
              <span className={styles.stableId}>{stableId}</span>
            )}
            {gene.so_term && <div>{gene.so_term.toLowerCase()}</div>}
            {gene.slice.strand.code && (
              <div>{getStrandDisplayName(gene.slice.strand.code)}</div>
            )}
            <div>{getFormattedLocation(ensObjectGene.location)}</div>
          </div>
        </div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Gene name</div>
        <div className={styles.value}>{gene.name}</div>
      </div>

      {gene.alternative_symbols.length > 0 && (
        <div className={styles.standardLabelValue}>
          <div className={styles.label}>Synonyms</div>
          <div className={styles.value}>
            {gene.alternative_symbols.join(', ')}
          </div>
        </div>
      )}

      <div className={styles.standardLabelValue}>
        <div className={styles.value}>
          {`${gene.transcripts.length} transcripts`}
        </div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.value}>
          <ViewInApp links={{ entityViewer: entityViewerUrl }} />
        </div>
      </div>
    </div>
  );
};

type Transcript = Required<
  Pick<
    TranscriptFromGraphql,
    'stable_id' | 'symbol' | 'so_term' | 'slice' | 'spliced_exons'
  >
>;

const TRANSCRIPT_QUERY = gql`
  query Transcript($genomeId: String!, $stableId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $stableId }) {
      stable_id
      so_term
      symbol
      spliced_exons {
        index
      }
      slice {
        strand {
          code
          value
        }
        location {
          start
          end
          length
        }
      }
    }
  }
`;

const TranscriptTrackDetails = () => {
  const ensObjectGene = useSelector(getBrowserActiveEnsObject) as EnsObjectGene;

  const transcriptTrack = ensObjectGene?.track?.child_tracks?.[0];

  const { data, loading } = useQuery<{ transcript: Transcript }>(
    TRANSCRIPT_QUERY,
    {
      variables: {
        stableId: transcriptTrack?.stable_id,
        genomeId: ensObjectGene.genome_id
      },
      skip: !transcriptTrack?.stable_id
    }
  );

  if (loading) {
    return null;
  }

  if (!data?.transcript) {
    return <div>No data available</div>;
  }

  const { transcript } = data;

  const stableId = getDisplayStableId(transcript);

  return (
    <div className={styles.container}>
      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Gene</div>
        <div className={styles.value}>
          <div className={styles.featureDetails}>
            <span className={styles.featureSymbol}>{stableId}</span>
            {transcript.so_term && (
              <div>{transcript.so_term.toLowerCase()}</div>
            )}
            {transcript.slice.strand.code && (
              <div>{getStrandDisplayName(transcript.slice.strand.code)}</div>
            )}
            <div>{getFormattedLocation(ensObjectGene.location)}</div>
          </div>
        </div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Transcript name</div>
        <div className={styles.value}>{transcript.symbol}</div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.label}>Transcript length</div>
        <div className={styles.value}>{transcript.slice.location.length}</div>
      </div>

      <div className={styles.standardLabelValue}>
        <div className={styles.value}>
          {transcript.spliced_exons.length} exons
        </div>
      </div>
    </div>
  );
};

const OtherTrackDetails = () => {
  const trackDetails = useSelector(getActiveTrackDetails);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!trackDetails) {
      dispatch(fetchTrackDetails());
    }
  }, [trackDetails]);

  if (!trackDetails) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.standardLabelValue}>
        <div className={styles.value}>
          <span className={styles.trackName}>{trackDetails.track_name}</span>

          {trackDetails.strand && (
            <span className={styles.strand}>{trackDetails.strand} strand</span>
          )}
        </div>
      </div>

      {(trackDetails.shared_description ||
        trackDetails.specific_description) && (
        <div className={styles.standardLabelValue}>
          <div className={styles.label}>Description</div>
          <div className={styles.value}>
            <div>{trackDetails.shared_description || null}</div>
            <div>{trackDetails.specific_description || null}</div>
          </div>
        </div>
      )}

      {trackDetails.source && (
        <div className={styles.standardLabelValue}>
          <div className={styles.value}>
            <div>
              <ExternalLink
                to={trackDetails.source.url}
                linkText={trackDetails.source.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackDetails;
