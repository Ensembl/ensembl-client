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

import SequenceLetterBlock from 'src/content/app/entity-viewer/variant-view/variant-image/sequence-letter-block/SequenceLetterBlock';

import type { TranscriptConsequencesData } from 'src/content/app/entity-viewer/variant-view/transcript-consequences/useTranscriptConsequencesData';

import styles from './TranscriptVariantGenomicSequence.module.css';

type Props = {
  sequence: string;
  variantStart: number; // where the reference allele starts on the genomic sequence
  variantEnd: number; // where the reference allele ends on the genomic sequence
  allele: NonNullable<TranscriptConsequencesData['allele']>;
};

const TranscriptVariantGenomicSequence = (props: Props) => {
  const { sequence } = props;

  return (
    <div>
      {sequence.split('').map((letter, index) => (
        <SequenceLetterBlock
          letter={letter}
          className={styles.letter}
          key={index}
        />
      ))}
    </div>
  );
};

export default TranscriptVariantGenomicSequence;
