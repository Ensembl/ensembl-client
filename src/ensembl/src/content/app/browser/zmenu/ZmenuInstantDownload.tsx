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

import useApiService from 'src/shared/hooks/useApiService';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import { CircleLoader } from 'ensemblRoot/src/shared/components/loader';
import { TranscriptInResponse } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

import { LoadingState } from 'src/shared/types/loading-state';

import styles from './Zmenu.scss';

type Props = {
  id: string;
};

const ZmenuInstantDownload = (props: Props) => {
  const genomeId = getGenomeId(props.id);
  const transcriptId = getStableId(props.id);
  const params = {
    endpoint: `/lookup/id/${transcriptId}?content-type=application/json;expand=1`,
    host: 'https://rest.ensembl.org'
  };
  const { loadingState, data, error } =
    useApiService<TranscriptInResponse>(params);

  if (
    loadingState === LoadingState.NOT_REQUESTED ||
    loadingState === LoadingState.LOADING
  ) {
    return (
      <div className={styles.zmenuInstantDowloadLoading}>
        <CircleLoader />
      </div>
    );
  }

  if (error) {
    // TODO: decide how we handle errors in this case
    return null;
  }

  return (
    <InstantDownloadTranscript
      genomeId={genomeId}
      {...preparePayload(data as TranscriptInResponse)}
      layout="vertical"
    />
  );
};

// TODO: we may want to move this to a common helper file that deals with messaging with Genome Browser
const getGenomeId = (id: string) => id.split(':').shift();
const getStableId = (id: string) => id.split(':').pop();

const preparePayload = (transcript: TranscriptInResponse) => {
  const geneId = transcript.Parent;
  const transcriptId = transcript.id;
  const biotype = transcript.biotype;

  return {
    transcript: {
      id: transcriptId,
      biotype
    },
    gene: {
      id: geneId
    }
  };
};

export default ZmenuInstantDownload;
