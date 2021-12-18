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

type Sequence = {
  header?: string;
  value: string;
};

type Options = {
  lineLength?: number;
};

export const toFasta = (sequence: Sequence, options: Options = {}) => {
  const { header, value: rawSequence } = sequence;
  const { lineLength = LINE_LENGTH } = options;

  const formattedSequence = [];

  if (header) {
    formattedSequence.push(`>${header}`);
  }

  let row = '';

  for (let i = 0; i < rawSequence.length; i++) {
    row += rawSequence[i];

    const isAtEndOfLine = (i + 1) % lineLength === 0;
    if (i === rawSequence.length - 1 || isAtEndOfLine) {
      formattedSequence.push(row);
      row = '';
    }
  }

  return formattedSequence.join('\n');
};
