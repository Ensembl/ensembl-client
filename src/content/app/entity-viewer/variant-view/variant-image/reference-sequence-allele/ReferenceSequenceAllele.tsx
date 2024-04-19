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
  MAX_REFERENCE_ALLELE_DISPLAY_LENGTH,
  REFERENCE_ALLELE_GAP_LENGTH
} from '../variantImageConstants';

import { getVariantGroupCSSColour } from 'src/shared/helpers/variantHelpers';

import SequenceLetterBlock from '../sequence-letter-block/SequenceLetterBlock';

import styles from './ReferenceSequenceAllele.module.css';

type Props = {
  sequence: string;
  regionSliceStart: number;
  variantStart: number; // accounts for anchor base in appropriate variant types
  variantLength: number; // accounts for anchor base in appropriate variant types
  variantType: string;
  mostSevereConsequence: string;
  hasAnchorBase: boolean;
  isSelectedAllele: boolean;
  onClick: () => void;
};

const ReferenceSequenceAllele = (props: Props) => {
  const {
    sequence,
    regionSliceStart,
    variantStart,
    variantLength,
    variantType,
    mostSevereConsequence,
    isSelectedAllele,
    onClick
  } = props;

  if (variantType === 'insertion') {
    return null;
  }

  const shouldDisplayGap = variantLength > MAX_REFERENCE_ALLELE_DISPLAY_LENGTH;

  const letterBlockClasses = classNames(styles.letter);

  const sequenceSliceStart = variantStart - regionSliceStart;
  const letters = sequence
    .slice(sequenceSliceStart, sequenceSliceStart + variantLength)
    .split('');

  const defaultLetterColour = 'var(--color-grey)'; // this is a fallback colour that should never be displayed if everything is working correctly
  const letterBlockColour = isSelectedAllele
    ? getVariantGroupCSSColour(mostSevereConsequence) ?? defaultLetterColour
    : 'var(--color-blue)';
  const letterColour = isSelectedAllele
    ? 'var(--color-black)'
    : 'var(--color-white)';
  const sequenceLetterStyle: Record<string, string> = {
    '--sequence-block-color': letterBlockColour,
    '--sequence-block-letter-color': letterColour
  };

  if (!shouldDisplayGap) {
    return (
      <button onClick={onClick} disabled={isSelectedAllele}>
        {letters.map((letter, index) => (
          <SequenceLetterBlock
            key={index}
            letter={letter}
            className={letterBlockClasses}
            style={sequenceLetterStyle}
          />
        ))}
      </button>
    );
  } else {
    // the total number of displayed nucleotides is 21 - 5 = 16
    const numDisplayedNucleotides =
      MAX_REFERENCE_ALLELE_DISPLAY_LENGTH - REFERENCE_ALLELE_GAP_LENGTH;
    const numHalfDisplayedNucleotides = numDisplayedNucleotides / 2;

    const lettersLeft = letters
      .slice(0, numHalfDisplayedNucleotides)
      .map((letter, index) => (
        <SequenceLetterBlock
          key={index}
          letter={letter}
          className={letterBlockClasses}
          style={sequenceLetterStyle}
        />
      ));
    const lettersRight = letters
      .slice(letters.length - numHalfDisplayedNucleotides)
      .map((letter, index) => (
        <SequenceLetterBlock
          key={index}
          letter={letter}
          className={letterBlockClasses}
          style={sequenceLetterStyle}
        />
      ));

    return (
      <button
        className={styles.referenceAllele}
        onClick={onClick}
        disabled={isSelectedAllele}
      >
        {lettersLeft}
        <ReferenceSequenceGap />
        {lettersRight}
        <SequenceLengthMeasure length={letters.length} />
      </button>
    );
  }
};

const ReferenceSequenceGap = () => {
  const dotsCount = REFERENCE_ALLELE_GAP_LENGTH;

  return (
    <div className={styles.referenceSequenceGap}>
      {[...Array(dotsCount)].map((_, index) => (
        <span key={index}>.</span>
      ))}
    </div>
  );
};

// a ruler-like element that is displayed under a long sequence of the reference allele,
// and shows its length
const SequenceLengthMeasure = (props: {
  length: number; // total length of the reference allele sequence
}) => {
  return (
    <div className={styles.lengthMeasure}>
      <span>{props.length}</span>
    </div>
  );
};

export default ReferenceSequenceAllele;
