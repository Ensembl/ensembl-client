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

import classNames from 'classnames';

import {
  DISPLAYED_REFERENCE_SEQUENCE_LENGTH,
  MAX_REFERENCE_ALLELE_DISPLAY_LENGTH
} from '../../variant-image/variantImageConstants';

import SequenceLetterBlock from 'src/content/app/entity-viewer/variant-view/variant-image/sequence-letter-block/SequenceLetterBlock';
import VariantAlleleDirection from '../variant-allele-direction/VariantAlleleDirection';

import styles from './TranscriptVariantGenomicSequence.module.css';

type Props = {
  variantSequence: string;
  leftFlankingSequence: string;
  rightFlankingSequence: string;
  variantType: string;
  alleleType: string;
  alleleSequence: string;
  variantToTranscriptStartDistance: number;
  variantToTranscriptEndDistance: number;
};

const SEQUENCE_LETTER_WIDTH = 16;
const SEQUENCE_LETTER_RIGHT_MARGIN = 1;

const TranscriptVariantGenomicSequence = (props: Props) => {
  const {
    leftFlankingSequence,
    rightFlankingSequence,
    variantToTranscriptStartDistance,
    variantToTranscriptEndDistance,
    variantSequence,
    alleleSequence,
    variantType,
    alleleType
  } = props;

  const leftOffsetInLetters = calculateLeftOffset({
    flankingSequence: leftFlankingSequence,
    variantSequence
  });
  const leftOffsetInPx = leftOffsetInLetters
    ? leftOffsetInLetters * SEQUENCE_LETTER_WIDTH +
      leftOffsetInLetters * SEQUENCE_LETTER_RIGHT_MARGIN
    : undefined;
  const leftOffset = leftOffsetInPx ? `${leftOffsetInPx}px` : undefined;

  return (
    <div className={styles.diagramContainer}>
      <div style={{ marginLeft: leftOffset }}>
        <LeftFlankingSequence
          flankingSequence={leftFlankingSequence}
          variantToTranscriptStartDistance={variantToTranscriptStartDistance}
        />
        <ReferenceAlleleSequence sequence={variantSequence} />
        <RightFlankingSequence
          flankingSequence={rightFlankingSequence}
          variantToTranscriptEndDistance={variantToTranscriptEndDistance}
        />
      </div>
      <AltAlleleSequence
        sequence={alleleSequence}
        refAlleleSequence={variantSequence}
        variantType={variantType}
        alleleType={alleleType}
      />
    </div>
  );
};

const LeftFlankingSequence = ({
  flankingSequence,
  variantToTranscriptStartDistance
}: {
  flankingSequence: string;
  variantToTranscriptStartDistance: number;
}) => {
  const letters = flankingSequence.split('');

  const letterClasses = classNames(
    styles.letter,
    styles.letterFlankingSequence
  );

  const ellipsisClasses = classNames(
    styles.letter,
    styles.letterFlankingSequence,
    styles.ellipsis
  );

  const hasEllipsis = variantToTranscriptStartDistance > letters.length;

  if (hasEllipsis) {
    letters[0] = '...';
  }

  return letters.map((letter, index) => (
    <SequenceLetterBlock
      letter={letter}
      key={index}
      className={hasEllipsis && index === 0 ? ellipsisClasses : letterClasses}
    />
  ));
};

const RightFlankingSequence = ({
  flankingSequence,
  variantToTranscriptEndDistance
}: {
  flankingSequence: string;
  variantToTranscriptEndDistance: number;
}) => {
  const letters = flankingSequence.split('');

  const hasEllipsis = variantToTranscriptEndDistance > letters.length;

  if (hasEllipsis) {
    letters[letters.length - 1] = '...';
  }

  const letterClasses = classNames(
    styles.letter,
    styles.letterFlankingSequence
  );

  const ellipsisClasses = classNames(
    styles.letter,
    styles.letterFlankingSequence,
    styles.ellipsis
  );

  return letters.map((letter, index) => (
    <SequenceLetterBlock
      letter={letter}
      key={index}
      className={
        hasEllipsis && index === letters.length - 1
          ? ellipsisClasses
          : letterClasses
      }
    />
  ));
};

const ReferenceAlleleSequence = ({ sequence }: { sequence: string }) => {
  const letters = sequence.split('');

  if (letters.length <= MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) {
    return <ReferenceAlleleLetterBlocks letters={letters} />;
  }

  const variantHalfWidth = Math.floor(MAX_REFERENCE_ALLELE_DISPLAY_LENGTH / 2);
  const lettersLeft = letters.slice(0, variantHalfWidth - 2); // expect eight letters
  const lettersRight = letters.slice(letters.length - (variantHalfWidth - 2)); // expect eight letters

  const letterBlocksLeft = (
    <ReferenceAlleleLetterBlocks letters={lettersLeft} />
  );
  const letterBlocksRight = (
    <ReferenceAlleleLetterBlocks letters={lettersRight} />
  );

  const middleBlock = (
    <>
      <ReferenceAlleleLetterBlocks letters={['.']} />
      <span>
        <span className={styles.referenceAlleleSequenceLength}>
          {/**
           * showing the length of the full reference allele sequence here,
           * despite slices of the sequence shown to the left and the right
           */}
          {sequence.length}
        </span>{' '}
        <span className={styles.referenceAlleleSequenceLabel}>altered</span>
      </span>
      <ReferenceAlleleLetterBlocks letters={['.']} />
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

const ReferenceAlleleLetterBlocks = ({ letters }: { letters: string[] }) => {
  const letterClasses = classNames(styles.letter, styles.refAlleleLetter);

  return letters.map((letter, index) => (
    <SequenceLetterBlock
      letter={letter}
      key={index}
      className={letterClasses}
    />
  ));
};

const AltAlleleSequence = ({
  sequence,
  refAlleleSequence,
  variantType,
  alleleType
}: {
  sequence: string;
  refAlleleSequence: string;
  variantType: string;
  alleleType: string;
}) => {
  const offsetLeft = getAltAlleleAnchorPosition({
    refAlleleSequence,
    variantType
  });

  let alleleRepresentation;

  if (alleleType === 'deletion') {
    alleleRepresentation = (
      <Deletion sequenceLength={refAlleleSequence.length} />
    );
  } else if (sequence.length > MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) {
    alleleRepresentation = <AltAlleleSequenceLength length={sequence.length} />;
  } else {
    alleleRepresentation = sequence
      .split('')
      .map((letter, index) => (
        <SequenceLetterBlock
          className={styles.altAlleleLetter}
          letter={letter}
          key={index}
        />
      ));
  }

  const elementStyles = {
    left: offsetLeft
  };

  return (
    <div className={styles.alternativeAllele} style={elementStyles}>
      {alleleRepresentation}
      <VariantAlleleDirection
        direction={
          alleleType === 'indel'
            ? 'both'
            : alleleType === 'insertion'
              ? 'up'
              : 'down'
        }
        className={styles.arrow}
      />
    </div>
  );
};

const Deletion = ({ sequenceLength }: { sequenceLength: number }) => {
  if (sequenceLength > MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) {
    return <AltAlleleSequenceLength length={sequenceLength} />;
  }

  return [...Array(sequenceLength)].map((_, index) => (
    <SequenceLetterBlock
      letter="-"
      className={styles.altAlleleLetter}
      key={index}
    />
  ));
};

const AltAlleleSequenceLength = ({ length }: { length: number }) => {
  return <span className={styles.altAlleleSequenceLength}>{length}</span>;
};

/**
 * A left offset would be necessary when the variant is too close to the start
 * of the genomic slice; so that the left flanking sequence is shorter than
 * the space (in terms of the number of nucleotides) available to it.
 *
 * In that case, the variant still needs to be positioned in the center of the image;
 * and the left flanking sequence shoud start somewhat to the right:
 *
 * Typical scenario:
 *        |--------------------*--------------------|
 *
 * Rare scenario: variant too close to slice start, requiring a left offset:
 *        |         -----------*--------------------|
 *
 */
const calculateLeftOffset = ({
  flankingSequence,
  variantSequence
}: {
  flankingSequence: string;
  variantSequence: string;
}) => {
  const flankingSequenceLength = flankingSequence.length;
  const variantHalfLength = getVariantLeftHalfLength(variantSequence);
  const availableSpaceInNucleotides = Math.ceil(
    DISPLAYED_REFERENCE_SEQUENCE_LENGTH / 2
  );

  return Math.max(
    availableSpaceInNucleotides - (flankingSequenceLength + variantHalfLength),
    0
  );
};

/**
 * The variant is positioned such that its middle nucleotide is
 * in the middle of the image. The allotted space has an odd number of nucleotides.
 * Thus, when the variant's length is an odd number, it sits exactly
 * in the middle of the allotted space; but when its length is an even number,
 * more of its nucleotides are to the left than to the right of the midline.
 */
const getVariantLeftHalfLength = (sequence: string) => {
  return Math.floor(sequence.length / 2) + 1;
};

// calculate position, in pixels, for the midpoint of the alternative allele
const getAltAlleleAnchorPosition = ({
  refAlleleSequence,
  variantType
}: {
  refAlleleSequence: string;
  variantType: string;
}) => {
  const letterWidth = SEQUENCE_LETTER_WIDTH;
  const halfGenomicSequenceLength = Math.ceil(
    DISPLAYED_REFERENCE_SEQUENCE_LENGTH / 2
  );
  // 1px space between letter blocks
  const totalSpaceBetweenLetters = halfGenomicSequenceLength - 1;

  const offsetForOddLengthVariant =
    halfGenomicSequenceLength * letterWidth +
    totalSpaceBetweenLetters -
    letterWidth / 2;
  const offsetForEvenLengthVariant =
    halfGenomicSequenceLength * letterWidth +
    totalSpaceBetweenLetters -
    letterWidth;

  if (variantType === 'insertion') {
    // insertions behave similar to even-length variants
    return offsetForEvenLengthVariant;
  }

  return refAlleleSequence.length > MAX_REFERENCE_ALLELE_DISPLAY_LENGTH
    ? offsetForOddLengthVariant
    : refAlleleSequence.length % 2 === 0
      ? offsetForEvenLengthVariant
      : offsetForOddLengthVariant;
};

export default TranscriptVariantGenomicSequence;
