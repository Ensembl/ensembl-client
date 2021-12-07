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
import { useSelector } from 'react-redux';
import { gql, useQuery } from '@apollo/client';
import { Pick2 } from 'ts-multipick';

import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import { CircleLoader } from 'src/shared/components/loader';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-entity/browserEntitySelectors';

import { FullTranscript } from 'src/shared/types/thoas/transcript';
import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';

import styles from './Zmenu.scss';

type Props = {
  id: string;
};

const TRANSCRIPT_QUERY = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      product_generating_contexts {
        product_type
      }
      gene {
        stable_id
      }
    }
  }
`;

type Transcript = Pick2<FullTranscript, 'gene', 'stable_id'> & {
  product_generating_contexts: Pick<
    FullProductGeneratingContext,
    'product_type'
  >[];
};

const ZmenuInstantDownload = (props: Props) => {
  const transcriptId = props.id;

  const genomeId = useSelector(getBrowserActiveGenomeId);

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

  if (!data || !genomeId) {
    return null;
  }

  const payload = {
    transcript: {
      id: transcriptId,
      isProteinCoding: isProteinCodingTranscript(data.transcript)
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
