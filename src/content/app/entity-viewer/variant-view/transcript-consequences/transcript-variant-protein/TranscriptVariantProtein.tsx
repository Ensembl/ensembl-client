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
import classNames from 'classnames';

import {
  DISPLAYED_REFERENCE_SEQUENCE_LENGTH,
  MAX_REFERENCE_ALLELE_DISPLAY_LENGTH
} from '../../variant-image/variantImageConstants';

import SequenceLetterBlock from 'src/content/app/entity-viewer/variant-view/variant-image/sequence-letter-block/SequenceLetterBlock';

import type { PredictedMolecularConsequenceInResponse } from 'src/content/app/entity-viewer/state/api/queries/variantPredictedMolecularConsequencesQuery';

import commonStyles from '../TranscriptConsequences.module.css';
import styles from './TranscriptVariantProtein.module.css';

type Props = {
  alleleType: string;
  proteinId: string;
  proteinSequence: string;
  proteinLength: number;
  variantSequence: string | null;
  variantStart: number;
  variantEnd: number;
  distanceToProteinSliceStart: number;
  distanceToProteinSliceEnd: number;
  consequences: PredictedMolecularConsequenceInResponse['consequences'];
};

const SEQUENCE_LETTER_WIDTH = 16;

const TranscriptVariantProtein = (props: Props) => {
  return (
    <div className={commonStyles.row}>
      <div className={commonStyles.left}>Protein</div>
      <div className={commonStyles.middle}>
        <div className={styles.diagramContainer}>
          <ProteinSequence {...props} />
          <ProteinImpact {...props} />
        </div>
      </div>
      <div className={commonStyles.right}>{props.proteinId}</div>
    </div>
  );
};

const ProteinSequence = (props: Props) => {
  const {
    proteinSequence,
    distanceToProteinSliceStart,
    distanceToProteinSliceEnd,
    proteinLength,
    variantStart,
    variantEnd
  } = props;

  const offsetLeft = getSequenceOffsetLeft({
    variantStart,
    variantEnd,
    distanceToProteinSliceStart
  });

  const variantStartIndex = distanceToProteinSliceStart;
  const variantLength = variantEnd - variantStart + 1;
  const variantEndIndex = variantStartIndex + variantLength - 1;

  const flankingSequenceLeft = proteinSequence.slice(0, variantStartIndex);
  const flankingSequenceRight = proteinSequence.slice(variantEndIndex + 1);
  const referenceVariantSequence = proteinSequence.slice(
    variantStartIndex,
    variantEndIndex + 1
  );

  const containerStyles = {
    marginLeft: `${offsetLeft}px`
  };

  return (
    <div style={containerStyles}>
      <FlankingSequence
        sequence={flankingSequenceLeft}
        position="left"
        hasEllipsis={variantStart - distanceToProteinSliceStart > 1}
      />
      <ReferenceVariantSequence sequence={referenceVariantSequence} />
      <FlankingSequence
        sequence={flankingSequenceRight}
        position="right"
        hasEllipsis={variantEnd + distanceToProteinSliceEnd < proteinLength}
      />
    </div>
  );
};

const FlankingSequence = ({
  sequence,
  position,
  hasEllipsis
}: {
  sequence: string;
  position: 'left' | 'right';
  hasEllipsis: boolean;
}) => {
  const letters = sequence.split('');
  if (hasEllipsis && position === 'left') {
    letters[0] = '...';
  } else if (hasEllipsis && position === 'right') {
    letters[letters.length - 1] = '...';
  }

  const letterBlocks = letters.map((letter, index) => {
    // NOTICE: we are using individual dot characters instead of a single ellipsis character,
    // so that we can control the distance between the dots

    const letterBlockClasses = classNames(
      styles.letter,
      styles.letterFlankingSequence,
      {
        [styles.ellipsis]: letter === '...'
      }
    );

    return (
      <SequenceLetterBlock
        key={index}
        letter={letter}
        className={letterBlockClasses}
      />
    );
  });

  return letterBlocks;
};

const ReferenceVariantSequence = ({ sequence }: { sequence: string }) => {
  const letters = sequence.split('');

  if (sequence.length <= MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) {
    return <ReferenceVariantLetterBlocks letters={letters} />;
  }

  const variantHalfWidth = Math.floor(MAX_REFERENCE_ALLELE_DISPLAY_LENGTH / 2);
  const lettersLeft = letters.slice(0, variantHalfWidth - 2); // expect eight letters
  const lettersRight = letters.slice(letters.length - (variantHalfWidth - 2)); // expect eight letters

  const letterBlocksLeft = (
    <ReferenceVariantLetterBlocks letters={lettersLeft} />
  );
  const letterBlocksRight = (
    <ReferenceVariantLetterBlocks letters={lettersRight} />
  );

  const middleBlock = (
    <>
      <ReferenceVariantLetterBlocks letters={['.']} />
      <span>
        <span className={styles.referenceVariantSequenceLength}>
          {/**
           * showing the length of the full variant sequence here,
           * despite slices of the sequence shown to the left and the right
           */}
          {sequence.length}
        </span>{' '}
        <span className={styles.referenceVariantSequenceLabel}>altered</span>
      </span>
      <ReferenceVariantLetterBlocks letters={['.']} />
    </>
  );

  return (
    <>
      {letterBlocksLeft}
      {middleBlock}
      {letterBlocksRight}
    </>
  );
};

const ReferenceVariantLetterBlocks = ({ letters }: { letters: string[] }) => {
  const letterBlockClasses = classNames(
    styles.letter,
    styles.letterReferenceAllele
  );
  return letters.map((letter, index) => (
    <SequenceLetterBlock
      key={index}
      letter={letter}
      className={letterBlockClasses}
    />
  ));
};

const ProteinImpact = (props: Props) => {
  const {
    variantSequence,
    alleleType,
    variantStart,
    variantEnd,
    consequences
  } = props;
  // For protein sequences, only treat in-frame insertions as insertions
  // An insertion that has caused a frame shift will be treated differently (with a consequence being marked as "uncertain").
  const isInframeInsertion = consequences.some(
    (conseq) => conseq.value === 'inframe_insertion'
  );

  let changedSequence: React.ReactNode; // can show modified amino acids, number of amino acids, or a special label such as "uncertain" depending on situation
  let modificationTypeLabel: React.ReactNode = null;

  if (!variantSequence || variantSequence.match(/X/i)) {
    // A sequence containing the letter X is interpreted as an unknown sequence.
    // When no sequence is provided, the result is also unknown
    changedSequence = (
      <div className={styles.changedSequenceBlock}>uncertain</div>
    );
  } else if (
    variantSequence.length > MAX_REFERENCE_ALLELE_DISPLAY_LENGTH &&
    alleleType !== 'deletion'
  ) {
    /* show the number of inserted / changed amino acids */
    changedSequence = (
      <div className={styles.changedSequenceBlock}>
        {variantSequence.length}
      </div>
    );
  } else if (alleleType === 'deletion') {
    /* deletion shows the number of deleted amino acids */
    changedSequence = (
      <div className={styles.changedSequenceBlock}>
        {variantEnd - variantStart + 1}
      </div>
    );
  } else {
    const letterBlocks = variantSequence
      .split('')
      .map((letter, index) => (
        <SequenceLetterBlock
          key={index}
          className={classNames(styles.letter, styles.altAlleleLetter)}
          letter={letter}
        />
      ));
    changedSequence = <div>{letterBlocks}</div>;
  }

  if (alleleType === 'deletion') {
    modificationTypeLabel = <span>deleted</span>;
  } else if (isInframeInsertion) {
    modificationTypeLabel = <span>inserted</span>;
  }

  const numLettersToSequenceMid = Math.floor(
    DISPLAYED_REFERENCE_SEQUENCE_LENGTH / 2
  );
  let leftOffset =
    SEQUENCE_LETTER_WIDTH * numLettersToSequenceMid +
    numLettersToSequenceMid +
    SEQUENCE_LETTER_WIDTH / 2;
  const variantLength = variantEnd - variantStart - 1;
  if (variantLength % 2 === 0) {
    leftOffset -= SEQUENCE_LETTER_WIDTH / 2;
  }

  const componentStyles = {
    marginLeft: `${leftOffset}px`
  };

  return (
    <div className={styles.changedSequenceContainer} style={componentStyles}>
      <AltAlleleArrow direction={isInframeInsertion ? 'up' : 'down'} />
      <span className={styles.proteinImpactLabel}>Protein impact</span>
      {changedSequence}
      {modificationTypeLabel && (
        <span className={styles.modificationTypeLabel}>
          {modificationTypeLabel}
        </span>
      )}
    </div>
  );
};

// FIXME: extract in a reusable component
const AltAlleleArrow = ({ direction }: { direction: 'up' | 'down' }) => {
  const arrowDirectionClassName =
    direction === 'up' ? styles.altAlleleArrowUp : styles.altAlleleArrowDown;

  const classes = classNames(styles.altAlleleArrow, arrowDirectionClassName);

  return <div className={classes} />;
};

const getSequenceOffsetLeft = (params: {
  variantStart: number;
  variantEnd: number;
  distanceToProteinSliceStart: number;
}) => {
  const { variantStart, variantEnd, distanceToProteinSliceStart } = params;
  const variantLength = variantEnd - variantStart + 1;

  const variantSeqLeftHalfLength = Math.floor(
    Math.min(variantLength, MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) / 2
  );
  const halfMaxDisplayedSequenceLength = Math.floor(
    DISPLAYED_REFERENCE_SEQUENCE_LENGTH / 2
  );

  const offsetLettersCount =
    halfMaxDisplayedSequenceLength -
    (variantSeqLeftHalfLength + distanceToProteinSliceStart);

  return offsetLettersCount * SEQUENCE_LETTER_WIDTH + offsetLettersCount;
};

export default TranscriptVariantProtein;
