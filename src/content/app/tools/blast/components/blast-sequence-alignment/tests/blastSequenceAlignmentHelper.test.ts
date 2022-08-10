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

import { createBlastSequenceAlignment } from '../blastSequenceAlignmentHelper';
import { simpleStringBlastAlignmentFormatter } from '../formatters/simpleStringFormatter';

import {
  shortNucleotideAlignment,
  shortNucleotideAlignmentOppositeStrand
} from './blast-alignment-fixtures/shortAlignment';
import { longGenomicAlignmentOppositeStrand } from './blast-alignment-fixtures/multiLineAlignment';

describe('createBlastSequenceAlignment', () => {
  describe('short, single-line alignment', () => {
    it('produces correct output for same-strand match', () => {
      const input = shortNucleotideAlignment;
      const [alignment] = createBlastSequenceAlignment(input);

      // The input alignment was short enough not to get split into lines;
      // and as a result, the values returned from the function should be the same as what went in
      expect(alignment.queryLine).toEqual(input.querySequence);
      expect(alignment.hitLine).toEqual(input.hitSequence);
      expect(alignment.alignmentLine).toEqual(input.alignmentLine);
      expect(alignment.queryLineStart).toEqual(input.queryStart);
      expect(alignment.queryLineEnd).toEqual(input.queryEnd);
      expect(alignment.hitLineStart).toEqual(input.hitStart);
      expect(alignment.hitLineEnd).toEqual(input.hitEnd);
    });

    // same as for the previous test, really
    it('produces correct output for opposite-strand match', () => {
      const input = shortNucleotideAlignmentOppositeStrand;
      const [alignment] = createBlastSequenceAlignment(input);

      expect(alignment.queryLine).toEqual(input.querySequence);
      expect(alignment.hitLine).toEqual(input.hitSequence);
      expect(alignment.alignmentLine).toEqual(input.alignmentLine);
      expect(alignment.queryLineStart).toEqual(input.queryStart);
      expect(alignment.queryLineEnd).toEqual(input.queryEnd);
      expect(alignment.hitLineStart).toEqual(input.hitStart);
      expect(alignment.hitLineEnd).toEqual(input.hitEnd);
    });
  });

  describe('long alignments wrapping over multiple lines', () => {
    // The easiest way to test such alignments is to generate a formatted string out of it

    it('produces correct output', () => {
      const input = longGenomicAlignmentOppositeStrand;
      const alignmentLines = createBlastSequenceAlignment(input);

      const queryLineStartLabel = (position: number) => `Query ${position}`;
      const hitLineStartLabel = (position: number) => `Sbjct ${position}`;

      const formattedAlignment = simpleStringBlastAlignmentFormatter({
        alignmentLines,
        queryLineStartLabel,
        hitLineStartLabel
      });

      expect(formattedAlignment).toMatchSnapshot();
    });
  });
});
