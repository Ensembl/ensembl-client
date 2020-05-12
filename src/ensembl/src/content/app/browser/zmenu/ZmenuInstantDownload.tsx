import React from 'react';

import useApiService from 'src/shared/hooks/useApiService';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import { CircleLoader } from 'src/shared/components/loader/Loader';
import { TranscriptInResponse } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

import { LoadingState } from 'src/shared/types/loading-state';

import styles from './Zmenu.scss';

type Props = {
  id: string;
};

const ZmenuInstantDownload = (props: Props) => {
  const transcriptId = getStableId(props.id);
  const params = {
    endpoint: `/lookup/id/${transcriptId}?content-type=application/json;expand=1`,
    host: 'https://rest.ensembl.org'
  };
  const { loadingState, data } = useApiService<TranscriptInResponse>(params);

  if (loadingState === LoadingState.LOADING) {
    return (
      <div className={styles.zmenuInstantDowloadLoading}>
        <CircleLoader />
      </div>
    );
  }

  return (
    <InstantDownloadTranscript
      {...preparePayload(data as TranscriptInResponse)}
      layout="vertical"
    />
  );
};

// TODO: we may want to move this to a common helper file that deals with messaging with Genome Browser
const getStableId = (id: string) => id.split(':').pop();

const preparePayload = (transcript: TranscriptInResponse) => {
  const geneId = transcript.Parent;
  const transcriptId = transcript.id;
  const so_term = transcript.biotype;

  return {
    transcript: {
      id: transcriptId,
      so_term
    },
    gene: {
      id: geneId
    }
  };
};

export default ZmenuInstantDownload;
