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

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Pick2 } from 'ts-multipick';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import { CircleLoader } from 'src/shared/components/loader/Loader';

import styles from './Zmenu.scss';
import { FullTranscript } from 'ensemblRoot/src/shared/types/thoas/transcript';
import { ZmenuContentFeature } from './zmenu-types';
import { parseFeatureId } from '../browserHelper';

type Props = {
  features: ZmenuContentFeature[];
};

const TRANSCRIPT_QUERY = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      metadata {
        biotype {
          value
        }
      }
    }
  }
`;

type Transcript = Pick2<FullTranscript, 'metadata', 'biotype'>;

const ZmenuInstantDownload = (props: Props) => {
  const { genomeId, geneId, transcriptId } = getFeatureIds(props.features);

  const { data, loading } = useQuery<{
    transcript: Transcript;
  }>(TRANSCRIPT_QUERY, {
    variables: {
      genomeId,
      transcriptId
    },
    skip: !transcriptId
  });

  if (loading) {
    return (
      <div className={styles.zmenuInstantDowloadLoading}>
        <CircleLoader />
      </div>
    );
  }

  if (!data || !geneId || !transcriptId) {
    return null;
  }

  const payload = {
    transcript: {
      id: transcriptId,
      biotype: data.transcript.metadata.biotype.value
    },
    gene: {
      id: geneId
    }
  };

  return (
    <InstantDownloadTranscript
      genomeId={genomeId}
      {...payload}
      layout="vertical"
    />
  );
};

const getFeatureIds = (content: ZmenuContentFeature[]) => {
  const featureObject = {
    genomeId: '',
    geneId: '',
    transcriptId: ''
  };
  if (content?.length === 2) {
    content.forEach((feature) => {
      const { genomeId, type, objectId } = parseFeatureId(feature.id);
      if (type === 'gene' || type === 'transcript') {
        featureObject.genomeId = genomeId;
        if (type === 'gene') {
          featureObject.geneId = objectId;
        } else if (type === 'transcript') {
          featureObject.transcriptId = objectId;
        }
      }
    });
  }
  return featureObject;
};

export default ZmenuInstantDownload;
