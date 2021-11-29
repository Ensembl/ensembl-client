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

/**
 * See fasta-format.md for the description of the format
 */

export const parseFasta = (input: string) => {
  input = input.trim(); // clear white spaces and empty lines before and after the input
  const results = [];
  let sequence: { header?: string; value?: string } | null = null;

  const lines = input.split('\n');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.startsWith('>')) {
      // this is a header line indicating the beginning of a new sequence
      sequence && results.push(sequence);
      sequence = { header: line };
    } else {
      line = line.replace(/\s/g, ''); // remove all white spaces from the line
      if (!sequence) {
        sequence = { value: line };
      } else {
        sequence.value ? (sequence.value += line) : (sequence.value = line);
      }
    }

    // if this is the last line, add the current sequence object to the list of results
    if (i === lines.length - 1) {
      results.push(sequence);
    }
  }

  return results;
};
