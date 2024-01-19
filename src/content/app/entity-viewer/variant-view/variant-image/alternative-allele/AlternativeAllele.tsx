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

import SequenceLetterBlock from '../sequence-letter-block/SequenceLetterBlock';

import variantGroups from 'src/content/app/genome-browser/constants/variantGroups';

import styles from './AlternativeAllele.module.css';

type Props = {
  regionSliceStart: number;
  variantStart: number; // accounts for anchor base in appropriate variant types
  variantLength: number; // length of reference allele; accounts for anchor base in appropriate variant types
  alleleType: string;
  sequence: string;
  mostSevereConsequence: string;
  hasAnchorBase: boolean;
  // onClick: () => void;
};

const AlternativeAllele = (props: Props) => {
  const {
    variantStart,
    regionSliceStart,
    alleleType,
    variantLength,
    hasAnchorBase,
    mostSevereConsequence
  } = props;
  let { sequence } = props;

  if (hasAnchorBase) {
    sequence = sequence.slice(1); // exclude the first (anchor) base of the allele
  }

  const maxReferenceSequenceLength = 41; // FIXME: import this as a constant from another file

  // Maximum alt allele display length is dynamic, and depends on where the variant starts
  // Alt alleles are allowed to exceed the length of the remaining reference sequence (after variant start)
  // by five nucleotides
  const distanceToVariantStart = variantStart - regionSliceStart;
  const maxAlternativeAlleleLength =
    maxReferenceSequenceLength - distanceToVariantStart + 5;

  const sequenceLetters = sequence
    .split('')
    .slice(0, maxAlternativeAlleleLength);
  const shouldShowEllipsis = sequence.length > maxAlternativeAlleleLength;

  if (shouldShowEllipsis) {
    sequenceLetters[sequenceLetters.length - 1] = '…';
  }

  const colourId = colourToIdMap.get(mostSevereConsequence);
  const defaultLetterColour = 'var(--color-grey)'; // this is a fallback colour that should never be displayed if everything is working correctly
  const letterColour = colourId
    ? colours.get(colourId) ?? defaultLetterColour
    : defaultLetterColour;

  const sequenceLetterStyle = {
    ['--sequence-block-color' as string]: letterColour
  };
  // if the sequence should end in ellipsis, make the letter block transparent
  const lastSequenceLetterStyle = shouldShowEllipsis
    ? {
        ['--sequence-block-color' as string]: 'transparent',
        ['--sequence-block-letter-color' as string]: letterColour
      }
    : sequenceLetterStyle;

  if (alleleType === 'deletion') {
    // for deletion, do not count the first (anchor) base of the reference sequence
    return (
      <Deletion
        variantLength={variantLength}
        letterStyle={sequenceLetterStyle}
      />
    );
  } else {
    return (
      <button className={styles.allele}>
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

const Deletion = (props: {
  variantLength: number; // length of the reference allele, including the "anchor" nucleotide
  letterStyle: Record<string, string>;
}) => {
  const { variantLength, letterStyle } = props;
  const maxReferenceAlleleDisplayLength = 21; // FIXME: use imported constant

  if (variantLength <= maxReferenceAlleleDisplayLength) {
    const letterBlocks = [...Array(variantLength)].map((_, index) => (
      <SequenceLetterBlock
        key={index}
        letter="-"
        style={letterStyle}
        className={styles.letterBlock}
      />
    ));
    return <button className={styles.allele}>{letterBlocks}</button>;
  } else {
    const flankingBlocksCount = 8;
    const blocksGapCount = 5;

    const gapLetterStyle: Record<string, string> = {
      '--sequence-block-letter-color': letterStyle['--sequence-block-color'],
      '--sequence-block-color': 'transparent'
    };

    const sequenceLeft = Array(flankingBlocksCount).fill('-').join('');
    const sequenceMid = Array(blocksGapCount).fill('-').join('');
    const sequenceRight = Array(flankingBlocksCount).fill('-').join('');

    return (
      <button className={styles.allele}>
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

const colours = new Map([
  [1, 'var(--color-dark-pink)'],
  [2, 'var(--color-dark-yellow)'],
  [3, 'var(--color-lime)'],
  [4, 'var(--color-teal)'],
  [5, 'var(--color-duckegg-blue)']
]);

// FIXME: copied the lines below from VariantColour component.
// Should move this to a common file
const buildColourToIdMap = () => {
  const colourMap = new Map<string, number>();

  for (const group of variantGroups) {
    for (const variantType of group.variant_types) {
      colourMap.set(variantType.label, group.id);
    }
  }

  return colourMap;
};

const colourToIdMap = buildColourToIdMap();

export default AlternativeAllele;
