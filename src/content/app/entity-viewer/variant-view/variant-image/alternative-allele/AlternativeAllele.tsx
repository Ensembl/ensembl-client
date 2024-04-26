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

import {
  DISPLAYED_REFERENCE_SEQUENCE_LENGTH,
  MAX_REFERENCE_ALLELE_DISPLAY_LENGTH
} from '../variantImageConstants';

import { getVariantGroupCSSColour } from 'src/shared/helpers/variantHelpers';

import SequenceLetterBlock from '../sequence-letter-block/SequenceLetterBlock';

import styles from './AlternativeAllele.module.css';

type AlleleData = {
  allele_type: {
    value: string;
  };
  allele_sequence: string;
  urlId: string;
};

type Props = {
  regionSliceStart: number;
  variantStart: number; // accounts for anchor base in appropriate variant types
  variantLength: number; // length of reference allele; accounts for anchor base in appropriate variant types
  allele: AlleleData;
  mostSevereConsequence: string;
  hasAnchorBase: boolean;
  activeAlleleId: string;
  isReferenceAlleleSelected: boolean;
  onClick: (alleleId: string) => void;
};

const AlternativeAllele = (props: Props) => {
  const {
    variantStart,
    regionSliceStart,
    allele,
    variantLength,
    hasAnchorBase,
    activeAlleleId,
    isReferenceAlleleSelected,
    mostSevereConsequence
  } = props;
  const {
    allele_type: { value: alleleType },
    urlId: alleleId
  } = allele;
  const isSelectedAllele = alleleId === activeAlleleId;
  let { allele_sequence: sequence } = allele;

  const onClick = () => {
    props.onClick(alleleId);
  };

  if (hasAnchorBase) {
    sequence = sequence.slice(1); // exclude the first (anchor) base of the allele
  }

  const { sequenceLetters, shouldShowEllipsis } = getAltAlleleSequenceLetters({
    variantStart,
    regionSliceStart,
    sequence
  });

  const defaultLetterColour = 'var(--color-grey)'; // this is a fallback colour that should never be displayed if everything is working correctly
  const letterColour = isReferenceAlleleSelected
    ? 'var(--color-blue)'
    : getVariantGroupCSSColour(mostSevereConsequence) ?? defaultLetterColour;

  const sequenceLetterStyle = {
    ['--sequence-block-color' as string]: letterColour
  };
  // if the sequence should end in ellipsis, make the letter block transparent
  const lastSequenceLetterStyle = shouldShowEllipsis
    ? {
        ['--sequence-block-color' as string]: 'transparent',
        ['--sequence-block-letter-color' as string]: letterColour,
        letterSpacing: '-3px'
      }
    : sequenceLetterStyle;

  if (isReferenceAlleleSelected) {
    sequenceLetterStyle['--sequence-block-letter-color'] = 'var(--color-white)';
  } else if (!isSelectedAllele) {
    sequenceLetterStyle.opacity = '50%';
    lastSequenceLetterStyle.opacity = '50%';
  }

  if (alleleType === 'deletion') {
    return (
      <Deletion
        variantLength={variantLength}
        letterStyle={sequenceLetterStyle}
        disabled={isSelectedAllele}
        onClick={onClick}
      />
    );
  } else {
    return (
      <button
        className={styles.allele}
        onClick={onClick}
        disabled={isSelectedAllele}
      >
        {sequenceLetters.map((letter, index) => (
          <SequenceLetterBlock
            key={index}
            letter={letter}
            style={
              index === sequenceLetters.length - 1
                ? lastSequenceLetterStyle
                : sequenceLetterStyle
            }
            className={styles.letterBlock}
          />
        ))}
      </button>
    );
  }
};

/**
 * Rules for how many letters of the alternative allele sequence to display,
 * according to design:
 * - Alternative allele sequence is allowed to extend past the end of the reference sequence
 *   by five nucleotides.
 * - However, this "extra five nucleotides" rule only applies to the alternative alleles
 *   whose whole sequence can fit into this space.
 * - If the alternative allele's sequence is longer than the distance to the end of the
 *   reference sequence + 5 nucleotides, then it should be truncated at the same point
 *   where the reference sequence is truncated (i.e. the space for 5 extra nucleotides is not added)
 */
const getAltAlleleSequenceLetters = ({
  variantStart,
  regionSliceStart,
  sequence
}: {
  variantStart: number;
  regionSliceStart: number;
  sequence: string;
}) => {
  // The start of the alternative allele has to be aligned with the start of the reference allele.
  // This means that the maximum alt allele display length is dynamic,
  // and depends on the distance between the variant start and the region slice start
  const distanceToVariantStart = variantStart - regionSliceStart;
  const distanceToRefSequenceEnd =
    DISPLAYED_REFERENCE_SEQUENCE_LENGTH - distanceToVariantStart;

  // Alt allele's sequence length is allowed to extend by 5 nucleotides
  // past the reference sequence; but only if the alt allele's sequence can fully fit into this space
  const displayedSequenceLength =
    sequence.length <= distanceToRefSequenceEnd + 5
      ? sequence.length
      : distanceToRefSequenceEnd;

  const sequenceLetters = sequence.split('').slice(0, displayedSequenceLength);

  const shouldShowEllipsis = sequence.length > displayedSequenceLength;

  if (shouldShowEllipsis) {
    // according to design requirements, using three individual dots instead of a single ellipsis character (…)
    sequenceLetters[sequenceLetters.length - 1] = '...';
  }

  return {
    sequenceLetters,
    shouldShowEllipsis
  };
};

const Deletion = (props: {
  variantLength: number; // length of the reference allele, including the "anchor" nucleotide
  letterStyle: Record<string, string>;
  disabled: boolean;
  onClick: () => void;
}) => {
  const { variantLength, letterStyle, disabled, onClick } = props;

  if (variantLength <= MAX_REFERENCE_ALLELE_DISPLAY_LENGTH) {
    const letterBlocks = [...Array(variantLength)].map((_, index) => (
      <SequenceLetterBlock
        key={index}
        letter="-"
        style={letterStyle}
        className={styles.letterBlock}
      />
    ));
    return (
      <button className={styles.allele} onClick={onClick} disabled={disabled}>
        {letterBlocks}
      </button>
    );
  } else {
    const flankingBlocksCount = 8;
    const blocksGapCount = 5;

    const gapLetterStyle: Record<string, string> = {
      '--sequence-block-letter-color': letterStyle['--sequence-block-color'],
      '--sequence-block-color': 'transparent'
    };

    const sequenceLeft = Array(flankingBlocksCount).fill('-').join('');
    const sequenceMid = Array(blocksGapCount).fill('.').join('');
    const sequenceRight = Array(flankingBlocksCount).fill('-').join('');

    return (
      <button className={styles.allele} onClick={onClick} disabled={disabled}>
        <Sequence sequence={sequenceLeft} letterStyle={letterStyle} />
        <Sequence sequence={sequenceMid} letterStyle={gapLetterStyle} />
        <Sequence sequence={sequenceRight} letterStyle={letterStyle} />
      </button>
    );
  }
};

const Sequence = (props: {
  sequence: string;
  letterStyle: Record<string, string>;
}) => {
  return props.sequence
    .split('')
    .map((letter, index) => (
      <SequenceLetterBlock
        key={index}
        letter={letter}
        style={props.letterStyle}
        className={styles.letterBlock}
      />
    ));
};

export default AlternativeAllele;
