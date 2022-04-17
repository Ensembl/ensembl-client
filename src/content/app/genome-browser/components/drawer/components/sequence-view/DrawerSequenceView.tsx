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

import RadioGroup from 'src/shared/components/radio-group/RadioGroup';

import type { SequenceType } from 'src/content/app/genome-browser/state/drawer/drawer-sequence/drawerSequenceSlice';

import styles from './SequenceView.scss';

const sequenceLabelsMap: Record<SequenceType, string> = {
  genomic: 'Genomic sequence',
  cdna: 'cDNA',
  cds: 'CDS',
  protein: 'Protein sequence'
};

// TODO: we probably also want to pass a sequence header in order to be able to blast it
type Props = {
  sequence: string;
  sequenceTypes: SequenceType[];
  selectedSequenceType: SequenceType;
  isReverseComplement: boolean;
  onSequenceTypeChange: (sequenceType: SequenceType) => void;
  onReverseComplementChange: (isReverseComplement: boolean) => void;
};

const DrawerSequenceView = (props: Props) => {
  const {
    sequence,
    sequenceTypes,
    selectedSequenceType,
    onSequenceTypeChange
  } = props;

  const sequenceTypeOptions = sequenceTypes.map((sequenceType) => ({
    value: sequenceType,
    label: sequenceLabelsMap[sequenceType]
  }));

  return (
    <div className={styles.layout}>
      <div className={styles.mainTop}>
        <div>
          <span>{sequence.length}</span>
          <span className={styles.basePairsLabel}>bp</span>
        </div>
      </div>
      <div className={styles.sequence}>{sequence}</div>
      <div className={styles.asideTop}>
        <div>blast control</div>
      </div>
      <div className={styles.asideBottom}>
        <div className={styles.sequenceTypeSelection}>
          <RadioGroup
            options={sequenceTypeOptions}
            onChange={(sequenceType) =>
              onSequenceTypeChange(sequenceType as SequenceType)
            }
            selectedOption={selectedSequenceType}
          />
          <div className={styles.reverseComplement}>
            Reverse complement checkbox
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerSequenceView;
