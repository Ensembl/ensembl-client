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
import { wrap } from 'comlink';

import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import InstantDownloadButton from 'src/shared/components/instant-download/instant-download-button/InstantDownloadButton';

import type { WorkerApi } from 'src/shared/workers/feature-sequence-download/featureSequenceDownload.worker';

import styles from './InstantDownloadProtein.module.css';

export type InstantDownloadProteinProps = {
  genomeId: string;
  transcriptId: string;
  proteinId: string;
  onDownloadSuccess?: (params: OnDownloadPayload) => void;
  onDownloadFailure?: (params: OnDownloadPayload) => void;
};

export type ProteinOptions = {
  protein: boolean;
  cds: boolean;
};

export type ProteinOption = keyof Partial<ProteinOptions>;

export const proteinOptionsOrder: ProteinOption[] = ['protein', 'cds'];

export type OnDownloadPayload = {
  genomeId: string;
  transcriptId: string;
  proteinId: string;
  options: ProteinOptions;
};

const proteinOptionLabels: Record<keyof ProteinOptions, string> = {
  protein: 'Protein sequence',
  cds: 'CDS'
};

const InstantDownloadProtein = (props: InstantDownloadProteinProps) => {
  const [isProteinSeqSelected, setProteinSeqSelected] = useState(false);
  const [isCdsSeqSelected, setCdsSeqSelected] = useState(false);
  const { genomeId, transcriptId, proteinId } = props;

  const onProteinCheckboxChange = () =>
    setProteinSeqSelected(!isProteinSeqSelected);
  const onCdsCheckboxChange = () => setCdsSeqSelected(!isCdsSeqSelected);

  const resetCheckboxes = () => {
    setProteinSeqSelected(false);
    setCdsSeqSelected(false);
  };

  const onSubmit = async () => {
    const payload = {
      genomeId,
      transcriptId,
      proteinId,
      options: {
        protein: isProteinSeqSelected,
        cds: isCdsSeqSelected
      }
    };

    try {
      await downloadProteinSequences(payload);
      props.onDownloadSuccess?.(payload);
    } catch {
      props.onDownloadFailure?.(payload);
    } finally {
      resetCheckboxes();
    }
  };

  const isDownloadDisabled = () => !isProteinSeqSelected && !isCdsSeqSelected;

  return (
    <div className={styles.inputGroup}>
      <Checkbox
        label={proteinOptionLabels.protein}
        checked={isProteinSeqSelected}
        onChange={onProteinCheckboxChange}
        theme="lighter"
      />
      <Checkbox
        label={proteinOptionLabels.cds}
        checked={isCdsSeqSelected}
        onChange={onCdsCheckboxChange}
        theme="lighter"
      />
      <InstantDownloadButton
        disabled={isDownloadDisabled()}
        onClick={onSubmit}
        theme="light"
      />
    </div>
  );
};

const downloadProteinSequences = async (params: OnDownloadPayload) => {
  const { proteinId } = params;

  const worker = new Worker(
    new URL(
      'src/shared/workers/feature-sequence-download/featureSequenceDownload.worker.ts',
      import.meta.url
    )
  );

  try {
    const service = wrap<WorkerApi>(worker);
    const sequences = await service.downloadSequencesForProtein({
      genomeId: params.genomeId,
      transcriptId: params.transcriptId,
      sequenceTypes: params.options
    });

    worker.terminate();

    await downloadTextAsFile(sequences, `${proteinId}.fasta`, {
      type: 'text/x-fasta'
    });
  } finally {
    worker.terminate();
  }
};

export default InstantDownloadProtein;
