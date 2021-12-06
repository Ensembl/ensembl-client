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

import React, { useState } from 'react';

import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';

import BlastInputSequence from './BlastInputSequence';

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';

export const BlastInputSequences = () => {
  const [sequences, setSequences] = useState<ParsedInputSequence[]>([]);

  const onSequenceAdded = (input: string, index: number | null) => {
    const parsedSequences = parseBlastInput(input)
      .filter((result) => Boolean(result.value)) // <-- bad idea!
      .map((result) => ({
        ...result,
        rawInput: input
      })) as ParsedInputSequence[];
    if (typeof index === 'number') {
      const newSequences = [...sequences].splice(index, 1, ...parsedSequences);
      setSequences(newSequences);
    } else {
      setSequences(parsedSequences);
    }
  };

  return (
    <div>
      {sequences.length ? (
        sequences.map((sequence, index) => (
          <BlastInputSequence
            key={index}
            index={index}
            sequence={sequence}
            onCommitted={onSequenceAdded}
          />
        ))
      ) : (
        <BlastInputSequence onCommitted={onSequenceAdded} />
      )}
    </div>
  );
};
