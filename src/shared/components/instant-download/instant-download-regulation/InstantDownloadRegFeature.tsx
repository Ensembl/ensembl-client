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

import { useState } from 'react';
import { wrap } from 'comlink';

import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';

import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import InstantDownloadButton from '../instant-download-button/InstantDownloadButton';

import type { WorkerApi } from 'src/shared/workers/feature-sequence-download/featureSequenceDownload.worker';

import styles from './InstantDownloadRegFeature.module.css';

type Props = {
  id: string;
  genomeId: string;
  featureType: string;
  regionName: string;
  start: number;
  end: number;
};

const InstantDownloadRegFeature = (props: Props) => {
  const [isCoreSequenceSelected, setIsCoreSequenceSelected] = useState(false);

  const onSubmit = async () => {
    const payload = {
      id: props.id,
      genomeId: props.genomeId,
      featureType: props.featureType,
      regionName: props.regionName,
      boundsRegion: {
        start: props.start,
        end: props.end
      }
    };

    await downloadSequence(payload);
    resetCheckboxes();
  };

  const resetCheckboxes = () => {
    setIsCoreSequenceSelected(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.feature}>
        <span className={styles.featureType}>{props.featureType}</span>
        <span>{props.id}</span>
      </div>
      <div className={styles.checkboxContainer}>
        <CheckboxWithLabel
          theme="dark"
          checked={isCoreSequenceSelected}
          onChange={setIsCoreSequenceSelected}
          label="Genomic sequence"
        />
      </div>
      <div className={styles.download}>
        <InstantDownloadButton
          disabled={!isCoreSequenceSelected}
          onClick={onSubmit}
          theme="dark"
        />
      </div>
    </div>
  );
};

const buildFastaHeader = (params: {
  id: string;
  featureType: string;
  regionName: string;
  start: number;
  end: number;
}) => {
  const { id, featureType, regionName, start, end } = params;
  return `er|${id}|${featureType}|${regionName}:${start}-${end}`;
};

const downloadSequence = async (params: {
  id: string;
  genomeId: string;
  featureType: string;
  regionName: string;
  boundsRegion: {
    start: number;
    end: number;
  };
}) => {
  const worker = new Worker(
    new URL(
      'src/shared/workers/feature-sequence-download/featureSequenceDownload.worker.ts',
      import.meta.url
    )
  );

  const fastaHeader = buildFastaHeader({
    ...params,
    start: params.boundsRegion.start,
    end: params.boundsRegion.end
  });

  try {
    const service = wrap<WorkerApi>(worker);
    const sequences = await service.downloadGenomicSlice({
      genomeId: params.genomeId,
      regionName: params.regionName,
      label: fastaHeader,
      start: params.boundsRegion.start,
      end: params.boundsRegion.end
    });

    await downloadTextAsFile(sequences, `${params.id}.fasta`, {
      type: 'text/x-fasta'
    });
  } finally {
    worker.terminate();
  }
};

export default InstantDownloadRegFeature;
