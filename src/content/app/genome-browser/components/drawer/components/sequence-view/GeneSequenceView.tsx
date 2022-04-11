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
import noop from 'lodash/noop';

import * as urlFor from 'src/shared/helpers/urlHelper';

import RadioGroup, {
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';

import { GeneSummaryQueryResult } from 'src/content/app/genome-browser/state/api/queries/geneSummaryQuery';

import styles from './SequenceView.scss';

type Gene = {
  slice: GeneSummaryQueryResult['gene']['slice'];
};

type Props = {
  gene: Gene;
};

export const GeneSequenceView = (props: Props) => {
  const sequenceType = 'genomicSequence';
  const { checksum } = props.gene.slice.region.sequence;
  const { start, end } = props.gene.slice.location;
  const sequenceURL = urlFor.refget({ checksum, start, end });

  const radioOptions: RadioOptions = [
    {
      value: 'genomicSequence',
      label: 'Genomic sequence'
    }
  ];

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
            onChange={noop}
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

export default GeneSequenceView;
