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

import { parseFeatureId } from '../browserHelper';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import { CircleLoader } from 'src/shared/components/loader';

import { FullTranscript } from 'src/shared/types/thoas/transcript';

import styles from './Zmenu.scss';

type Props = {
  id: string;
};

const TRANSCRIPT_QUERY = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      metadata {
        biotype {
          value
        }
      }
      gene {
        stable_id
      }
    }
  }
`;

type Transcript = Pick2<FullTranscript, 'metadata', 'biotype'> &
  Pick2<FullTranscript, 'gene', 'stable_id'>;

const ZmenuInstantDownload = (props: Props) => {
  const { genomeId, objectId: transcriptId } = parseFeatureId(props.id);

  const { data, loading } = useQuery<{
    transcript: Transcript;
  }>(TRANSCRIPT_QUERY, {
    variables: {
      genomeId,
      transcriptId
    }
  });

  if (loading) {
    return (
      <div className={styles.zmenuInstantDowloadLoading}>
        <CircleLoader />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const payload = {
    transcript: {
      id: transcriptId,
      biotype: data.transcript.metadata.biotype.value
    },
    gene: {
      id: data.transcript.gene.stable_id
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

export default ZmenuInstantDownload;
