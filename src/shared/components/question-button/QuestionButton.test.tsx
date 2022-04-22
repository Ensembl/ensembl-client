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
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import QuestionButton from './QuestionButton';

import { TOOLTIP_TIMEOUT } from 'src/shared/components/tooltip/tooltip-constants';

// userEvent has an internal delay function that defaults to a setTimeout of 0ms
// This confuses fake timers.
// One way of dealing with this is to pass a delay: null option; the other is to pass a fake advanceTimers function
// (see https://testing-library.com/docs/user-event/options)
const userEventWithoutDelay = userEvent.setup({
  delay: null
});

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

      await userEventWithoutDelay.hover(questionButton);
      expect(questionButton.querySelector('.pointerBox')).toBeFalsy();

      // moving the timer to simulate the delay before the tooltip is shown
      act(() => {
        jest.advanceTimersByTime(TOOLTIP_TIMEOUT);
      });

      // moving the timer to allow the tooltip to appear
      act(() => {
        jest.advanceTimersByTime(0);
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

      await userEventWithoutDelay.hover(questionButton);

      // making sure that the tooltip got shown
      await waitFor(() => {
        expect(queryByText(helpMessage)).toBeTruthy();
      });

      await userEvent.unhover(questionButton);
      expect(queryByText(helpMessage)).toBeFalsy();
    });
  });

  describe('on click', () => {
    it('toggles the tooltip', async () => {
      const { container, queryByText } = render(
        <QuestionButton helpText={helpText} />
      );
      const questionButton = container.querySelector(
        '.questionButton'
      ) as HTMLElement;

      await userEventWithoutDelay.click(questionButton);

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(queryByText(helpMessage)).toBeTruthy();
    });

    it('takes precedence over hover', async () => {
      const { container, queryByText } = render(
        <QuestionButton helpText={helpText} />
      );
      const questionButton = container.querySelector(
        '.questionButton'
      ) as HTMLElement;

      await userEventWithoutDelay.hover(questionButton); // would start the timer
      await userEventWithoutDelay.click(questionButton); // would clear the timer and toggle the state to show the tooltip

      act(() => {
        jest.advanceTimersByTime(0); // the tooltip should appear instantaneously
      });
      expect(queryByText(helpMessage)).toBeTruthy();
    });

    it('does not hide the tooltip on mouseleave', async () => {
      const { container, queryByText } = render(
        <QuestionButton helpText={helpText} />
      );
      const questionButton = container.querySelector(
        '.questionButton'
      ) as HTMLElement;

      await userEventWithoutDelay.click(questionButton);

      act(() => {
        jest.advanceTimersByTime(0);
      });

      await userEventWithoutDelay.unhover(questionButton); // <-- should have no effect on the tooltip
      expect(queryByText(helpMessage)).toBeTruthy();
    });
  });
});
