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

import commonStyles from '../TranscriptConsequences.module.css';
import styles from './TranscriptVariantProtein.module.css';

type Props = {
  alleleType: string;
  proteinId: string;
  proteinSequence: string;
  // TODO: proteinLength
  variantSequence: string | null;
  variantStart: number;
  variantEnd: number;
  distanceToProteinSliceStart: number;
  distanceToProteinSliceEnd: number;
};

const SEQUENCE_LETTER_WIDTH = 16;

/**
 * TODO:
 * - Ellipses
 * - Protein stable id on the right
 */

const TranscriptVariantProtein = (props: Props) => {
  return (
    <div className={commonStyles.row}>
      <div className={commonStyles.left}>Protein</div>
      <div className={commonStyles.middle}>
        <div>
          <ProteinSequence {...props} />
          <ProteinImpact {...props} />
        </div>
      </div>
    </div>
  );
};

const ProteinSequence = (props: Props) => {
  const {
    proteinSequence,
    distanceToProteinSliceStart,
    variantStart,
    variantEnd
  } = props;

  const offsetLeft = getSequenceOffsetLeft({
    variantStart,
    variantEnd,
    distanceToProteinSliceStart
  });

  const variantStartIndex = distanceToProteinSliceStart;
  const variantLength = variantEnd - variantStart; // FIXME: plus 1?
  const variantEndIndex = variantStartIndex + variantLength;

  const letterBlocks = proteinSequence.split('').map((letter, index) => {
    const isWithinVariant =
      index >= variantStartIndex && index <= variantEndIndex;

    const letterBlockClasses = classNames(styles.letter, {
      [styles.letterReferenceAllele]: isWithinVariant,
      [styles.letterFlankingSequence]: !isWithinVariant
    });

    return (
      <SequenceLetterBlock
        key={index}
        letter={letter}
        className={letterBlockClasses}
      />
    );
  });

  const containerStyles = {
    marginLeft: `${offsetLeft}px`
  };

  return <div style={containerStyles}>{letterBlocks}</div>;
};

/**
 * - different for different allele types
 * - label: "Protein impact"
 *
 * Examples:
 * - substitution (2 nucleotides; 1 AA): http://localhost:8080/entity-viewer/grch38/variant:13:32341046:rs1057517557?allele=0&view=transcript-consequences
 * - inframe insertion with protein consequence: http://localhost:8080/entity-viewer/grch38/variant:1:924510:rs1405511870?allele=0&view=transcript-consequences
 * - synonymous SNV: http://localhost:8080/entity-viewer/grch38/variant:1:2194735:rs886654766?allele=0&view=transcript-consequences
 * - insertion: http://localhost:8080/entity-viewer/grch38/variant:1:2193889:rs1688548931?allele=0&view=transcript-consequences
 */
const ProteinImpact = (props: Props) => {
  const { variantSequence, alleleType, variantStart, variantEnd } = props;
  /**
   * - uncertain
   * - number
   * -
   */
  let changedSequence: React.ReactNode; // can show modified amino acids, number of amino acids, or a special label such as "uncertain" depending on situation
  let modificationTypeLabel: React.ReactNode = null;

  if (!variantSequence || variantSequence.match(/X/i)) {
    // A sequence containing the letter X is interpreted as an unknown sequence.
    // When no sequence is provided, the result is also unknown
    changedSequence = (
      <div className={styles.changedSequenceBlock}>Uncertain</div>
    );
  } else if (
    variantSequence.length > MAX_REFERENCE_ALLELE_DISPLAY_LENGTH ||
    ['deletion', 'insertion'].includes(alleleType)
  ) {
    changedSequence = (
      <div className={styles.changedSequenceBlock}>
        {variantSequence.length}
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
  } else if (alleleType === 'insertion') {
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
      <AltAlleleArrow alleleType={alleleType} />
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
const AltAlleleArrow = ({ alleleType }: { alleleType: string }) => {
  const arrowDirectionClassName =
    alleleType === 'insertion'
      ? styles.altAlleleArrowUp
      : styles.altAlleleArrowDown;

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

  const variantSeqLeftHalfLength = Math.floor(variantLength / 2);
  const halfMaxDisplayedSequenceLength = Math.floor(
    DISPLAYED_REFERENCE_SEQUENCE_LENGTH / 2
  );

  const offsetLettersCount =
    halfMaxDisplayedSequenceLength -
    (variantSeqLeftHalfLength + distanceToProteinSliceStart);

  return offsetLettersCount * SEQUENCE_LETTER_WIDTH + offsetLettersCount;
};

export default TranscriptVariantProtein;
