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

import SequenceLetterBlock from '../sequence-letter-block/SequenceLetterBlock';

import styles from './FlankingSequence.module.css';

type Props = {
  sequence: string;
  position: 'left' | 'right';
  hasEllipsis?: boolean;
};

const FlankingSequence = (props: Props) => {
  const { sequence, position, hasEllipsis } = props;

  const hasEllipsisAtStart = hasEllipsis && position === 'left';
  const hasEllipsisAtEnd = hasEllipsis && position === 'right';

  const letters = sequence.split('');

  if (hasEllipsisAtStart) {
    letters[0] = '…';
  }
  if (hasEllipsisAtEnd) {
    letters[letters.length - 1] = '…';
  }

  const getLetterClasses = (letterIndex: number) => {
    return classNames(styles.letter, {
      [styles.firstRightSequenceLetter]:
        position === 'right' && letterIndex === 0
    });
  };

  return (
    <>
      {letters.map((letter, index) => (
        <SequenceLetterBlock
          key={index}
          letter={letter}
          className={getLetterClasses(index)}
        />
      ))}
    </>
  );
};

export default FlankingSequence;
