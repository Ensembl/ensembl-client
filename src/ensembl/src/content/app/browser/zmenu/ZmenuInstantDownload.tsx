import React, { useEffect, useContext } from 'react';

import { ZmenuContext } from './ZmenuContext';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import { CircleLoader } from 'src/shared/components/loader/Loader';
import { TranscriptInResponse } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

import styles from './Zmenu.scss';

type Props = {
  id: string;
};

const ZmenuInstantDownload = (props: Props) => {
  const { instantDownloadCache, updateInstantDownloadCache } = useContext(
    ZmenuContext
  );
  const instantDownloadPayload = instantDownloadCache[props.id];

  useEffect(() => {
    if (instantDownloadPayload) {
      return;
    }

    const transcriptId = getStableId(props.id);
    const url = `https://rest.ensembl.org/lookup/id/${transcriptId}?content-type=application/json;expand=1`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => preparePayload(data))
      .then((payload) => updateInstantDownloadCache({ [props.id]: payload }));
  }, [props.id]);

  if (!instantDownloadPayload) {
    return (
      <div className={styles.zmenuInstantDowloadLoading}>
        <CircleLoader />
      </div>
    );
  }

  return (
    <InstantDownloadTranscript {...instantDownloadPayload} layout="vertical" />
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
