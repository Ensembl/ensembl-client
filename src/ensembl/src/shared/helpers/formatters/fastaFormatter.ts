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

export const LINE_LENGTH = 60; // line length in Ensembl refget implementations

export const toFasta = (sequenceLabel: string, sequence: string) => {
  const formattedSequence = [];
  formattedSequence.push(`>${sequenceLabel}`);

  let row = '';

  for (let i = 0; i < sequence.length; i++) {
    row += sequence[i];

    const isAtEndOfLine = (i + 1) % LINE_LENGTH === 0;
    if (i === sequence.length - 1 || isAtEndOfLine) {
      formattedSequence.push(row);
      row = '';
    }
  }

  return formattedSequence.join('\n');
};
