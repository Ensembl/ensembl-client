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

import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';

import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';

import RadioGroup from 'src/shared/components/radio-group/RadioGroup';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';

import type { SequenceType } from 'src/content/app/genome-browser/state/drawer/drawer-sequence/drawerSequenceSlice';

import styles from './DrawerSequenceView.scss';

const sequenceLabelsMap: Record<SequenceType, string> = {
  genomic: 'Genomic sequence',
  cdna: 'cDNA',
  cds: 'CDS',
  protein: 'Protein sequence'
};

// TODO: we probably also want to pass a sequence header in order to be able to blast it
type Props = {
  isExpanded: boolean;
  toggleSequenceVisibility: () => void;
  sequence?: string;
  isError: boolean;
  isLoading: boolean;
  refetch: () => void;
  sequenceTypes: SequenceType[];
  selectedSequenceType: SequenceType;
  isReverseComplement: boolean;
  onSequenceTypeChange: (sequenceType: SequenceType) => void;
  onReverseComplementChange: (isReverseComplement: boolean) => void;
};

const DrawerSequenceView = (props: Props) => {
  const {
    isExpanded,
    isError,
    isLoading,
    refetch,
    toggleSequenceVisibility,
    sequence,
    sequenceTypes,
    selectedSequenceType,
    onSequenceTypeChange,
    isReverseComplement,
    onReverseComplementChange
  } = props;

  const sequenceTypeOptions = sequenceTypes.map((sequenceType) => ({
    value: sequenceType,
    label: sequenceLabelsMap[sequenceType]
  }));

  const canHaveReverseComplement = selectedSequenceType === 'genomic';

  const showHideStyleProps = isExpanded
    ? {
        classNames: { wrapper: styles.showHide }
      }
    : {};

  return (
    <div>
      <ShowHide
        label="Sequences"
        isExpanded={isExpanded}
        onClick={toggleSequenceVisibility}
        {...showHideStyleProps}
      />
      {isExpanded && (
        <div className={styles.layout}>
          {sequence && (
            <Sequence
              sequence={sequence}
              sequenceType={selectedSequenceType}
              isReverseComplement={isReverseComplement}
            />
          )}
          {isLoading && <Loading />}
          {isError && <LoadFailure refetch={refetch} />}
          {/* The BLAST button will go here when ready

              <div className={styles.asideTop}>
                BLAST BUTTON HERE!
              </div>
          */}
          <div className={styles.asideBottom}>
            <div className={styles.sequenceTypeSelection}>
              <RadioGroup
                options={sequenceTypeOptions}
                onChange={(sequenceType) =>
                  onSequenceTypeChange(sequenceType as SequenceType)
                }
                selectedOption={selectedSequenceType}
              />
              {canHaveReverseComplement && (
                <div className={styles.reverseComplement}>
                  <Checkbox
                    label="Reverse complement"
                    checked={isReverseComplement}
                    onChange={onReverseComplementChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Sequence = (props: {
  sequence: string;
  isReverseComplement: boolean;
  sequenceType: SequenceType;
}) => {
  const { sequence, sequenceType, isReverseComplement } = props;

  const displaySequence = useMemo(() => {
    return isReverseComplement ? getReverseComplement(sequence) : sequence;
  }, [sequence, isReverseComplement]);

  const sequenceLengthUnits = sequenceType === 'protein' ? 'aa' : 'bp';

  return (
    <>
      <div className={styles.mainTop}>
        <span>
          {displaySequence.length}
          <span className={styles.sequenceLengthUnits}>
            {sequenceLengthUnits}
          </span>
        </span>
        <Copy value={displaySequence} />
      </div>

      {/*
        NOTE: the dangerouslySetInnerHTML on the line below shouldn't be necessary;
        but for some reason, Chrome has problems wrapping the sequence
        if it is just passed to the div as a child.
      */}
      <div
        className={styles.sequence}
        dangerouslySetInnerHTML={{ __html: displaySequence }}
      />
    </>
  );
};

// QUESTION: is this going to become a a standalone component?
const Copy = (props: { value: string }) => {
  const [copied, setCopied] = useState(false);

  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    return () => timeout && clearTimeout(timeout);
  }, []);

  const copy = () => {
    setCopied(true);
    navigator.clipboard.writeText(props.value);

    timeout = setTimeout(() => setCopied(false), 1500);
  };

  const componentStyles = classNames(styles.copyLozenge, {
    [styles.copyLozengeCopied]: copied
  });

  return (
    <span className={componentStyles}>
      {copied ? (
        'Copied'
      ) : (
        <span className={styles.copy} onClick={copy}>
          Copy
        </span>
      )}
    </span>
  );
};

const LoadFailure = (props: { refetch: () => void }) => {
  return (
    <div className={styles.loadFailureContainer}>
      <div className={styles.errorMessage}>Failed to get data</div>
      <PrimaryButton onClick={props.refetch}>Try again</PrimaryButton>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <CircleLoader size="small" />
    </div>
  );
};

export default DrawerSequenceView;
