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

import fs from 'fs';
import path from 'path';

import { parseBlastInput } from '../blastInputParser';

const readFile = (pathToFile: string) => {
  pathToFile = path.resolve(__dirname, pathToFile);
  return fs.readFileSync(pathToFile, 'utf-8');
};

describe('parseBlastInput', () => {
  describe('parsing FASTA input', () => {
    it('correctly parses a single sequence', () => {
      const input = readFile('./input-sequence-examples/001.txt');
      expect(parseBlastInput(input)).toMatchSnapshot();
    });

    it('correctly parses a file with multiple sequences', () => {
      const input = readFile('./input-sequence-examples/002.txt');
      expect(parseBlastInput(input)).toMatchSnapshot();
    });

    it('ignores blank lines in the input', () => {
      const input = readFile('./input-sequence-examples/003.txt');
      expect(parseBlastInput(input)).toMatchSnapshot();
    });

    it('clears white spaces from the input', () => {
      const input = readFile('./input-sequence-examples/004.txt');
      expect(parseBlastInput(input)).toMatchSnapshot();
    });
  });

  describe('parsing bare sequences', () => {
    it('correctly parses a single sequence', () => {
      const input = readFile('./input-sequence-examples/005.txt');
      expect(parseBlastInput(input)).toMatchSnapshot();
    });

    it('cleans white space in the beginning of a sequence line', () => {
      const input = readFile('./input-sequence-examples/006.txt');
      expect(parseBlastInput(input)).toMatchSnapshot();
    });
    it('does not remove non-letter characters from numbered sequence lines', () => {
      const input = readFile('./input-sequence-examples/007.txt');
      expect(parseBlastInput(input)).toMatchSnapshot();
    });
  });
});
