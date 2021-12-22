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
import { render, getNodeText } from '@testing-library/react';

import BlastInputSequences from './BlastInputSequences';

describe('<BlastInputSequences />', () => {
  describe('initial state', () => {
    it('shows a single empty input', () => {
      const { container } = render(<BlastInputSequences />);
      const inputBoxes = container.querySelectorAll('.inputSequenceBox');
      expect(inputBoxes.length).toBe(1);
    });
  });

  describe('header', () => {
    it('shows sequence counter, starting with 0', () => {
      const { container } = render(<BlastInputSequences />);
      const sequenceCounter = container.querySelector(
        '.header .sequenceCounter'
      );
      expect(getNodeText(sequenceCounter as HTMLElement)).toBe('0');
    });

    it('has a control to clear all sequences', () => {
      const { container } = render(<BlastInputSequences />);
      const clearAll = container.querySelector('.header .clearAll');
      expect(clearAll).toBeTruthy();
    });
  });

  describe('with added sequences', () => {
    // TODO: tests to be written after the component is connected to redux

    it.todo('shows multiple inputs, each containing a sequence');

    it.todo('shows a button for adding another sequence');

    it.todo('guesses the type of the first sequence');

    it.todo('correctly accepts a FASTA input containing multiple sequences');

    it.todo('updates the sequence counter in the header');

    /**
     * QUESTIONS
     *
     * WHAT SHOULD HAPPEN IF USER ADDS AN UNEXPECTED SEQUECE?
     * - a sequence different from the predicted
     * - a sequence with invalid characters
     * - a sequence with only a FASTA header
     * - too short a sequence?
     *
     * WHAT SHOULD HAPPEN IF USER ADDS MORE SEQUENCES THAN WE ARE LIMITING THEM TO?
     */
  });
});
