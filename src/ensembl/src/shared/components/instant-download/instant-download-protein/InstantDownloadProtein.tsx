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

import React, { useState } from 'react';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import InstantDownloadButton from 'src/shared/components/instant-download/instant-download-button/InstantDownloadButton';

import { fetchForProtein } from '../instant-download-fetch/fetchForProtein';

import { TranscriptOptions } from '../instant-download-transcript/InstantDownloadTranscript';

import styles from './InstantDownloadProtein.scss';

type InstantDownloadProteinProps = {
  transcriptId: string;
  proteinId: string;
};

export type ProteinOptions = Pick<TranscriptOptions, 'proteinSequence' | 'cds'>;

export type ProteinOption = keyof Partial<ProteinOptions>;

export const proteinOptionsOrder: ProteinOption[] = ['proteinSequence', 'cds'];

const proteinOptionLabels: Record<keyof ProteinOptions, string> = {
  proteinSequence: 'Protein sequence',
  cds: 'CDS'
};

const InstantDownloadProtein = (props: InstantDownloadProteinProps) => {
  const [isProteinSeqSelected, setProteinSeqSelected] = useState(false);
  const [isCdsSeqSelected, setCdsSeqSelected] = useState(false);

  const onProteinCheckboxChange = () =>
    setProteinSeqSelected(!isProteinSeqSelected);
  const onCdsCheckboxChange = () => setCdsSeqSelected(!isCdsSeqSelected);

  const onSubmit = () => {
    const payload = {
      transcriptId: props.transcriptId,
      proteinId: props.proteinId,
      options: {
        proteinSequence: isProteinSeqSelected,
        cds: isCdsSeqSelected
      }
    };

    fetchForProtein(payload);
  };

  const isDownloadDisabled = () => !isProteinSeqSelected && !isCdsSeqSelected;

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <Checkbox
          label={proteinOptionLabels.proteinSequence}
          checked={isProteinSeqSelected}
          onChange={onProteinCheckboxChange}
        />
      </div>
      <div className={styles.inputGroup}>
        <Checkbox
          label="CDS"
          checked={isCdsSeqSelected}
          onChange={onCdsCheckboxChange}
        />
      </div>
      <div className={styles.inputGroup}>
        <InstantDownloadButton
          className={
            isDownloadDisabled() ? styles.downloadButtonDisabled : undefined
          }
          isDisabled={isDownloadDisabled()}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};

export default InstantDownloadProtein;
