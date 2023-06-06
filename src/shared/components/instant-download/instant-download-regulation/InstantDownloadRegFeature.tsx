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

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
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

  const formattedLocation = getFormattedLocation({
    chromosome: props.regionName,
    start: props.start,
    end: props.end
  });

  const onSubmit = async () => {
    const payload = {
      id: props.id,
      genomeId: props.genomeId,
      featureType: props.featureType,
      regionName: props.regionName,
      coreRegion: {
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
      <div className={styles.featurePart}>
        <span className={styles.featurePartLabel}>Core region</span>
        <span>{formattedLocation}</span>
      </div>
      <label>
        <Checkbox
          theme="dark"
          checked={isCoreSequenceSelected}
          onChange={setIsCoreSequenceSelected}
        />
        <span>Genomic sequence</span>
      </label>
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
