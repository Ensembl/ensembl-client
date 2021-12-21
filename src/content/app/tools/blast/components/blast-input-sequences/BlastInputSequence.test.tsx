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
import { setTimeout } from 'timers/promises';
import { render, fireEvent, createEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import random from 'lodash/random';

import BlastInputSequence from './BlastInputSequence';

const testInput = 'AGCT'; // it shouldn't even matter for testing purposes

const commonProps = {
  onCommitted: jest.fn()
};

describe('<BlastInputSequence />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when empty', () => {
    it('accepts a pasted input', () => {
      const { container } = render(<BlastInputSequence {...commonProps} />);
      const textarea = container.querySelector(
        'textarea'
      ) as HTMLTextAreaElement;

      // TODO: change this to userEvent.paste after @testing-library/user-event is updated to v.14
      const pasteEvent = createEvent.paste(textarea, {
        clipboardData: {
          getData: () => testInput
        }
      });

      fireEvent(textarea, pasteEvent);

      expect(commonProps.onCommitted).toHaveBeenCalledWith(testInput, null);
    });

    it('can read input from a file', async () => {
      const testFasta = `
      > This is test sequence
      AGCT
      `;
      const file = new File([testFasta], 'test-sequence.fasta', {
        type: 'text/x-fasta'
      });
      const { container } = render(<BlastInputSequence {...commonProps} />);
      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      await act(async () => {
        userEvent.upload(fileInput, file);
        await setTimeout(0); // parsing file input is an asynchronous process; jumping to the back of event loop
      });

      expect(commonProps.onCommitted).toHaveBeenCalledWith(testFasta, null);
    });

    it('does not contain a control for clearing the input', () => {
      const { container } = render(<BlastInputSequence {...commonProps} />);
      const deleteButton = container.querySelector('.deleteButton');

      expect(deleteButton).toBe(null);
    });
  });

  describe('interaction with parent', () => {
    it('renders a title controlled by the parent', () => {
      const title = 'This is test title';
      const { container } = render(
        <BlastInputSequence {...commonProps} title={title} />
      );
      const inputHeader = container.querySelector('.header') as HTMLElement;

      expect(inputHeader.innerHTML).toMatch(title);
    });

    it('respects the sequence coming with the props', () => {
      let sequence = {
        header: 'this is my sequence header',
        value: 'AGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCT'
      };
      const { container, rerender } = render(
        <BlastInputSequence {...commonProps} sequence={sequence} />
      );
      const textarea = container.querySelector(
        'textarea'
      ) as HTMLTextAreaElement;

      let expectedTextareaContent = `>${sequence.header}\n${sequence.value}`;
      expect(textarea.value).toBe(expectedTextareaContent);

      // rerender with a different sequence
      sequence = {
        header: 'this sequence has been updated',
        value: 'AAACCCTTT'
      };

      rerender(<BlastInputSequence {...commonProps} sequence={sequence} />);

      expectedTextareaContent = `>${sequence.header}\n${sequence.value}`; // the sequence has been updated
      expect(textarea.value).toBe(expectedTextareaContent);
    });

    it('accepts typed-in input, and passes it to parent when user leaves the textarea', () => {
      const elementIndex = random(0, 5);
      const { container, rerender } = render(
        <BlastInputSequence {...commonProps} index={elementIndex} />
      );
      const textarea = container.querySelector(
        'textarea'
      ) as HTMLTextAreaElement;
      const typedInSequence = 'AGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCT';

      userEvent.type(textarea, typedInSequence);
      expect(commonProps.onCommitted).not.toHaveBeenCalled();

      textarea.blur();
      expect(commonProps.onCommitted).toHaveBeenCalledWith(
        typedInSequence,
        elementIndex
      );
      jest.clearAllMocks();

      // if index is not passed at all
      rerender(<BlastInputSequence {...commonProps} />);
      textarea.focus();
      textarea.blur();
      expect(commonProps.onCommitted).toHaveBeenCalledWith(
        typedInSequence,
        null
      );
    });
  });

  describe('when filled', () => {
    // it.only('can clear the input locally if the input has not yet been passed to the parent', () => {
    //   const
    //   const { container, rerender } = render(
    //     <BlastInputSequence {...commonProps} />
    //   );
    // });

    it.todo('correctly updates the input after a paste event');

    it.todo('can hide or show the body containing the sequence');
  });
});
