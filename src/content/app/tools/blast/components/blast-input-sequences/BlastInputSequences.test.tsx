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

describe('<BlastInputSequences />', () => {
  describe('initial state', () => {
    it.todo('shows a single empty input');
  });

  describe('header', () => {
    it.todo('shows sequence counter, starting with 0');

    it.todo('has a control to clear all sequences');
  });

  describe('with added sequences', () => {
    it.todo('shows multiple inputs, each containing a sequence');

    it.todo(
      'shows a button for adding another sequence and tries to classify sequence'
    );

    it.todo('correctly accepts a FASTA input containing a single sequence');

    it.todo('correctly accepts a FASTA input containing multiple sequences');

    it.todo('updates the sequence counter in the header');

    /**
     * QUESTIONS
     *
     * WHAT SHOULD HAPPEN IF USER ADDS INADMISSIBLE SEQUECE?
     * - a sequence different from the predicted (and do we need this prediction at all?)
     * - a sequence with inadmissible characters?
     * - a sequence with only a FASTA header
     * - too short a sequence?
     *
     * WHAT SHOULD HAPPEN IF USER ADDS MORE SEQUENCES THAN WE ARE LIMITING THEM TO?
     *
     * WHAT HAPPENS TO THE FILE INPUT ELEMENT WHEN THE USER STARTS TYPING?
     */
  });
});
