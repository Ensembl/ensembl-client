import React from 'react';
import { render, fireEvent, createEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BlastInputSequence from './BlastInputSequence';

const testInput = 'AGCT'; // it shouldn't even matter for testing purposes

const commonProps = {
  onCommitted: jest.fn()
};

describe('<BlastInputSequence />', () => {

  describe('when empty', () => {

    it.only('accepts a pasted input', () => {
      const { container } = render(<BlastInputSequence {...commonProps} />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;

      // TODO: change this to userEvent.paste after @testing-library/user-event is updated to v.14
      const pasteEvent = createEvent.paste(textarea, {
        clipboardData: {
          getData: () => testInput
        },
      });
      
      fireEvent(textarea, pasteEvent);

      expect(commonProps.onCommitted).toHaveBeenCalledWith(testInput, null);
    });

    it('can read input from a file', () => {

    });

    it('does not contain a control for clearing the input', () => {

    });

  });

  describe('interaction with parent', () => {

    it('respects the sequence coming with the props', () => {

    });

    it('accepts typed-in input and passes it to parent when user leaves the textarea', () => {

    });

  });

  describe('when filled', () => {

    it('shows the control for clearing the input', () => {

    });

    it('can hide or show the body containing the sequence', () => {

    });

  });

});
