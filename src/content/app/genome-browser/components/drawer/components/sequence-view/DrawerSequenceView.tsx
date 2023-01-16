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

import React, { useMemo } from 'react';

import { useAppSelector } from 'src/store';
import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import BlastSequenceButton from 'src/shared/components/blast-sequence-button/BlastSequenceButton';
import RadioGroup from 'src/shared/components/radio-group/RadioGroup';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';
import Copy from 'src/shared/components/copy/Copy';

import type { SequenceType } from 'src/content/app/genome-browser/state/drawer/drawer-sequence/drawerSequenceSlice';
import type { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './DrawerSequenceView.scss';

const sequenceLabelsMap: Record<SequenceType, string> = {
  genomic: 'Genomic sequence',
  cdna: 'cDNA',
  cds: 'CDS',
  protein: 'Protein sequence'
};

// TODO: we probably also want to pass a sequence header in order to be able to blast it
type Props = {
  genomeId: string;
  featureId: string;
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
    genomeId,
    featureId,
    isExpanded,
    isError,
    isLoading,
    refetch,
    toggleSequenceVisibility,
    sequence,
    sequenceTypes,
    selectedSequenceType,
    isReverseComplement,
    onReverseComplementChange
  } = props;

  const species = useAppSelector((state) =>
    getCommittedSpeciesById(state, genomeId)
  ) as CommittedItem;

  const { trackDrawerSequenceViewed } = useGenomeBrowserAnalytics();

  // BLAST has a different labelling for sequence types than what is passed with props
  const sequenceTypeForBlast =
    selectedSequenceType === 'protein' ? 'protein' : 'dna';

  const sequenceTypeOptions = sequenceTypes.map((sequenceType) => ({
    value: sequenceType,
    label: sequenceLabelsMap[sequenceType]
  }));

  const canHaveReverseComplement = selectedSequenceType === 'genomic';

  const onShowHideClick = () => {
    toggleSequenceVisibility();

    // Track only when it is opened
    if (!isExpanded) {
      trackDrawerSequenceViewed(selectedSequenceType);
    }
  };

  const onSequenceTypeChange = (sequenceType: SequenceType) => {
    trackDrawerSequenceViewed(sequenceType);
    props.onSequenceTypeChange(sequenceType);
  };

  return (
    <div>
      <ShowHide
        label="Sequences"
        isExpanded={isExpanded}
        onClick={onShowHideClick}
        className={isExpanded ? styles.showHide : undefined}
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
          <div className={styles.asideTop}>
            <BlastSequenceButton
              className={styles.blastSequenceButton}
              sequence={sequence}
              header={getBlastHeader({
                featureId,
                sequenceType: selectedSequenceType,
                isReverseComplement
              })}
              species={species}
              sequenceType={sequenceTypeForBlast}
            />
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
  const { trackDrawerSequenceCopied } = useGenomeBrowserAnalytics();

  const onCopy = () => {
    trackDrawerSequenceCopied(sequenceType);
  };

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
        <Copy value={displaySequence} onCopy={onCopy} />
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

const getBlastHeader = (params: {
  featureId: string;
  sequenceType: SequenceType;
  isReverseComplement: boolean;
}) => {
  const { featureId, sequenceType, isReverseComplement } = params;
  const sequenceTypeLabel = sequenceLabelsMap[sequenceType];

  const blasttHeader = `${featureId} ${sequenceTypeLabel}`;

  return isReverseComplement
    ? `${blasttHeader} Reverse complement`
    : blasttHeader;
};

export default DrawerSequenceView;
