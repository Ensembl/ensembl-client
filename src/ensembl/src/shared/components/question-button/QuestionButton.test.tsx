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
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import QuestionButton from './QuestionButton';
import { TOOLTIP_TIMEOUT } from 'src/shared/components/tooltip/tooltip-constants';

describe('<QuestionButton />', () => {
  const helpMessage = 'I am a helpful message that will appear in the tooltip';
  const helpText = <span>{helpMessage}</span>;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  describe('on hover', () => {
    it('shows the tooltip after a delay', async () => {
      const { container, queryByText } = render(
        <QuestionButton helpText={helpText} />
      );
      const questionButton = container.querySelector(
        '.questionButton'
      ) as HTMLElement;

      userEvent.hover(questionButton);
      expect(questionButton.querySelector('.pointerBox')).toBeFalsy();

      act(() => {
        jest.advanceTimersByTime(TOOLTIP_TIMEOUT + 10);
      });
      expect(queryByText(helpMessage)).toBeTruthy();
    });

    it('hides the tooltip on mouseleave', async () => {
      const { container, queryByText } = render(
        <QuestionButton helpText={helpText} />
      );
      const questionButton = container.querySelector(
        '.questionButton'
      ) as HTMLElement;

      userEvent.hover(questionButton);

      act(() => {
        jest.advanceTimersByTime(TOOLTIP_TIMEOUT + 10);
      });

      userEvent.unhover(questionButton);
      expect(queryByText(helpMessage)).toBeFalsy();
    });
  });

  describe('on click', () => {
    it('toggles the tooltip', () => {
      const { container, queryByText } = render(
        <QuestionButton helpText={helpText} />
      );
      const questionButton = container.querySelector(
        '.questionButton'
      ) as HTMLElement;

      userEvent.click(questionButton);

      act(() => {
        // give the Tooltip component a little time to complete its async tasks
        jest.advanceTimersByTime(10);
      });
      expect(queryByText(helpMessage)).toBeTruthy();

      // clicking again to hide the tooltip
      userEvent.click(questionButton);
      expect(queryByText(helpMessage)).toBeFalsy();
    });

    it('takes precedence over hover', () => {
      const { container, queryByText } = render(
        <QuestionButton helpText={helpText} />
      );
      const questionButton = container.querySelector(
        '.questionButton'
      ) as HTMLElement;

      userEvent.hover(questionButton); // would start the timer
      userEvent.click(questionButton); // would clear the timer and toggle the state to show the tooltip

      act(() => {
        // give the Tooltip component a little time to complete its async tasks
        jest.advanceTimersByTime(10);
      });
      expect(queryByText(helpMessage)).toBeTruthy();
    });

    it('does not hide the tooltip on mouseleave', () => {
      const { container, queryByText } = render(
        <QuestionButton helpText={helpText} />
      );
      const questionButton = container.querySelector(
        '.questionButton'
      ) as HTMLElement;

      userEvent.click(questionButton);

      act(() => {
        jest.advanceTimersByTime(TOOLTIP_TIMEOUT + 10);
      });

      userEvent.unhover(questionButton); // <-- should have no effect on the tooltip
      expect(queryByText(helpMessage)).toBeTruthy();
    });

    it('prevents a new hover from registering', () => {
      const { container, queryByText } = render(
        <QuestionButton helpText={helpText} />
      );
      const questionButton = container.querySelector(
        '.questionButton'
      ) as HTMLElement;

      userEvent.click(questionButton);

      userEvent.hover(questionButton); // <-- notice that the hover starts after a click; we expect it not to have any effect

      act(() => {
        jest.advanceTimersByTime(TOOLTIP_TIMEOUT + 10);
      });

      userEvent.unhover(questionButton); // <-- should have no effect on the tooltip
      expect(queryByText(helpMessage)).toBeTruthy();
    });
  });
});
