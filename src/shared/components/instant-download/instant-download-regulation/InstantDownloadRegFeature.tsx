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

import { fetchRegulatoryFeatureSequences } from '../instant-download-fetch/fetchRegulatoryFeature';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import InstantDownloadButton from '../instant-download-button/InstantDownloadButton';

import styles from './InstantDownloadRegFeature.scss';

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

    await fetchRegulatoryFeatureSequences(payload);
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
        <Checkbox
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

export default InstantDownloadRegFeature;
