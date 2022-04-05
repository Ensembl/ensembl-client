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

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import RadioGroup, {
  OptionValue,
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';

import {
  fetchTranscriptSequenceMetadata,
  fetchGeneSequenceMetadata
} from 'src/shared/components/instant-download/instant-download-fetch/fetchSequenceChecksums';
import {
  prepareDownloadParameters,
  prepareGenomicDownloadParameters
} from 'src/shared/components/instant-download/instant-download-fetch/fetchForTranscript';

import { getBrowserActiveFocusObject } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { FocusGene } from 'src/shared/types/focus-object/focusObjectTypes';

import styles from './SequenceView.scss';

type Props = {
  isProteinCodingTranscript?: boolean;
  transcriptId?: string;
};

const SequenceView = (props: Props) => {
  const focusGene = useSelector(getBrowserActiveFocusObject) as FocusGene;

  const [sequenceType, setSequenceType] = useState('genomicSequence');
  const [sequenceURL, setSequenceURL] = useState('');

  const genomeId = focusGene.genome_id;
  const transcriptId = props.transcriptId;

  let radioOptions: RadioOptions = [
    {
      value: 'genomicSequence',
      label: 'Genomic sequence'
    },
    {
      value: 'cdna',
      label: 'cDNA'
    },
    {
      value: 'cds',
      label: 'CDS'
    },
    {
      value: 'proteinSequence',
      label: 'Protein sequence'
    }
  ];

  const buildSequenceURL = async () => {
    if (transcriptId) {
      const transcriptSequenceData = await fetchTranscriptSequenceMetadata({
        genomeId,
        transcriptId
      });

      const sequenceDownloadParams = prepareDownloadParameters({
        transcriptSequenceData,
        options: {
          [sequenceType]: true
        }
      });
      setSequenceURL(sequenceDownloadParams[0].url);
    } else {
      const geneId = focusGene.stable_id;
      const geneSequenceData = await fetchGeneSequenceMetadata({
        genomeId,
        geneId
      });

      const sequenceDownloadParams = prepareGenomicDownloadParameters(
        geneSequenceData.genomic
      );
      setSequenceURL(sequenceDownloadParams.url);
    }
  };
  useEffect(() => {
    buildSequenceURL();
  }, [transcriptId, sequenceType]);

  const handleRadioChange = (value: OptionValue) => {
    setSequenceType(value as string);
  };

  if (!props.transcriptId) {
    radioOptions = radioOptions.filter(
      (item) => item.value === 'genomicSequence'
    );
  }

  if (!props.isProteinCodingTranscript) {
    radioOptions = radioOptions.filter(
      (item) => item.value === 'genomicSequence' || item.value === 'cdna'
    );
  }

  return (
    <div className={styles.layout}>
      <div>
        <div>XXXX bp</div>
        <div className={styles.sequenceWrapper}>
          Fetching sequence for {sequenceType} : {sequenceURL}
        </div>
      </div>
      <div>
        <div>blast control</div>
        <div className={styles.selectionWrapper}>
          <RadioGroup
            options={radioOptions}
            onChange={handleRadioChange}
            selectedOption={sequenceType}
          />
          <div className={styles.reverseWrapper}>
            Reverse complement checkbox
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceView;
