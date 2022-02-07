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

import { useGbTranscriptInZmenuQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import { InstantDownloadTranscript } from 'src/shared/components/instant-download';
import { CircleLoader } from 'src/shared/components/loader';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from './Zmenu.scss';

type Props = {
  id: string;
};

const ZmenuInstantDownload = (props: Props) => {
  const transcriptId = props.id;

  const genomeId = useSelector(getBrowserActiveGenomeId) || '';

  const { currentData, isFetching } = useGbTranscriptInZmenuQuery(
    {
      genomeId,
      transcriptId
    },
    {
      skip: !genomeId
    }
  );

  if (isFetching) {
    return (
      <div className={styles.zmenuInstantDowloadLoading}>
        <CircleLoader />
      </div>
    );
  } else if (!currentData || !genomeId) {
    return null;
  }

  const payload = {
    transcript: {
      id: transcriptId,
      isProteinCoding: isProteinCodingTranscript(currentData.transcript)
    },
    gene: {
      id: currentData.transcript.gene.stable_id
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
