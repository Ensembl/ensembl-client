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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import RadioGroup, {
  OptionValue,
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';

import { TranscriptSummaryQueryResult } from 'src/content/app/genome-browser/state/api/queries/transcriptSummaryQuery';

import styles from './SequenceView.scss';

type Transcript = {
  slice: TranscriptSummaryQueryResult['transcript']['slice'];
  product_generating_contexts: TranscriptSummaryQueryResult['transcript']['product_generating_contexts'];
};
type Props = {
  transcript: Transcript;
};

const TranscriptSequenceView = (props: Props) => {
  const [sequenceType, setSequenceType] = useState('genomicSequence');

  const { checksum } = props.transcript.slice.region.sequence;
  const { start, end } = props.transcript.slice.location;
  const genomicURL = urlFor.refget({ checksum, start, end });
  const [sequenceURL, setSequenceURL] = useState(genomicURL);

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

  const handleRadioChange = (value: OptionValue) => {
    setSequenceType(value as string);

    if (value === 'genomicSequence') {
      setSequenceURL(genomicURL);
    } else if (value === 'proteinSequence') {
      const product = props.transcript.product_generating_contexts[0].product;
      setSequenceURL(
        urlFor.refget({ checksum: product?.sequence.checksum as string })
      );
    } else {
      const productType = value as 'cdna' | 'cds';
      const product =
        props.transcript.product_generating_contexts[0][productType];
      setSequenceURL(
        urlFor.refget({ checksum: product?.sequence.checksum as string })
      );
    }
  };

  if (!isProteinCodingTranscript(props.transcript)) {
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

export default TranscriptSequenceView;
