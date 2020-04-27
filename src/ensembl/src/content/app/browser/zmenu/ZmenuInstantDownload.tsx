import React, { useState, useEffect } from 'react';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import { CircleLoader } from 'src/shared/components/loader/Loader';
// import {
//   TranscriptInResponse
// } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

// homo_sapiens_GCA_000001405_27:transcript:ENSG00000073910

type Props = {
  id: string;
};

// FIXME this type should come from InstantDownload component
type InstantDownloadProps = {
  gene: {
    id: string;
  };
  transcript: {
    id: string;
    so_term: string;
  };
};

const ZmenuInstantDownload = (props: Props) => {
  const [payload, setPayload] = useState<InstantDownloadProps | null>(null);

  useEffect(() => {
    // FIXME: genome browser erroneously reports gene id instead of transcript id; change this when ENSWBSITES-590 is done
    const geneId = getStableId(props.id);
    const url = `https://rest.ensembl.org/lookup/id/${geneId}?content-type=application/json;expand=1`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => preparePayload(data))
      .then((payload) => setPayload(payload));
  }, [props.id]);

  if (!payload) {
    return <CircleLoader />;
  }

  return <InstantDownloadTranscript {...payload} layout="vertical" />;
};

const getStableId = (id: string) => id.split(':').pop();

// FIXME: this should be transcript
const preparePayload = (data: any) => {
  const geneId = data.id;
  const transcript = data.Transcript.find(
    ({ is_canonical }: any) => is_canonical === 1
  );
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
