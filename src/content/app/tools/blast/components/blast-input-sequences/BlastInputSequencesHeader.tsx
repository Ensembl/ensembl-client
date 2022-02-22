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

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  getSequences,
  getEmptyInputVisibility
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import {
  setSequences,
  updateEmptyInputDisplay,
  switchToSpeciesStep
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import { SecondaryButton } from 'src/shared/components/button/Button';
import PlusButton from 'src/shared/components/plus-button/PlusButton';

import styles from './BlastInputSequences.scss';

export type Props = {
  compact: boolean;
  container: HTMLDivElement | null;
};

const BlastInputSequencesHeader = (props: Props) => {
  const { compact, container } = props;
  const sequences = useSelector(getSequences);
  const shouldAppendEmptyInput = useSelector(getEmptyInputVisibility);

  const dispatch = useDispatch();

  useEffect(() => {
    // if(container.clientHeight > container.scrollHeight && shouldAppendEmptyInput) {
    //   window.scrollTo(0, container?.scrollHeight);
    // }
    if (container) {
      window.scrollTo(0, 100000);
    }
  }, [shouldAppendEmptyInput]);

  const onClearAll = () => {
    dispatch(
      setSequences({
        sequences: []
      })
    );
  };

  const appendEmptyInput = () => {
    dispatch(updateEmptyInputDisplay(true));
  };

  const onSwitchToSpecies = () => {
    dispatch(switchToSpeciesStep());
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerGroup}>
        <span className={styles.headerTitle}>Sequences</span>
        <span className={styles.sequenceCounter}>{sequences.length}</span>
        <span className={styles.maxSequences}>of 30</span>
      </div>
      <div className={styles.headerGroup}>
        <span className={styles.clearAll} onClick={onClearAll}>
          Clear all
        </span>
        <AddAnotherSequence
          onAdd={appendEmptyInput}
          disabled={shouldAppendEmptyInput}
        />
        {compact && (
          <SecondaryButton
            className={styles.blastAgainstButton}
            onClick={onSwitchToSpecies}
          >
            Blast against
          </SecondaryButton>
        )}
      </div>
    </div>
  );
};

type AddAnotherSequenceProps = {
  disabled?: boolean;
  onAdd: () => void;
};

const AddAnotherSequence = (props: AddAnotherSequenceProps) => {
  return (
    <div className={styles.addSequence}>
      <span className={styles.addSequenceLabel}>Add another sequence</span>
      <PlusButton onClick={props.onAdd} disabled={props.disabled} />
    </div>
  );
};

export default BlastInputSequencesHeader;
