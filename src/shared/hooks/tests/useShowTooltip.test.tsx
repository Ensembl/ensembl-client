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

import { useShowTooltip } from '../useShowTooltip';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { TOOLTIP_TIMEOUT } from 'src/shared/components/tooltip/tooltip-constants';

// userEvent has an internal delay function that defaults to a setTimeout of 0ms
// This confuses fake timers.
// One way of dealing with this is to pass a delay: null option; the other is to pass a fake advanceTimers function
// (see https://testing-library.com/docs/user-event/options)
const userEventWithoutDelay = userEvent.setup({
  delay: null
});

const TestComponent = () => {
  const { elementRef, onClick, onTooltipCloseSignal, shouldShowTooltip } =
    useShowTooltip();

  return (
    <div className="test-element" ref={elementRef} onClick={onClick}>
      Element with tooltip
      {shouldShowTooltip && (
        <Tooltip
          anchor={elementRef.current}
          autoAdjust={true}
          onClose={onTooltipCloseSignal}
          delay={0}
        >
          TooltipText
        </Tooltip>
      )}
    </div>
  );
};

describe('useShowTooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  describe('useShowTooltip with on click', () => {
    it('toggles the tooltip', async () => {
      const { container, queryByText } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithoutDelay.click(testElement);

      act(() => {
        jest.advanceTimersByTime(0);
      });
      expect(queryByText('TooltipText')).toBeTruthy();
    });

    it('takes precedence over hover', async () => {
      const { container, queryByText } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithoutDelay.hover(testElement); // would start the timer
      await userEventWithoutDelay.click(testElement); // would clear the timer and toggle the state to show the tooltip

      act(() => {
        jest.advanceTimersByTime(0); // the tooltip should appear instantaneously
      });
      expect(queryByText('TooltipText')).toBeTruthy();
    });

    it('does not hide the tooltip on mouseleave', async () => {
      const { container, queryByText } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithoutDelay.click(testElement);

      act(() => {
        jest.advanceTimersByTime(0);
      });

      await userEventWithoutDelay.unhover(testElement); // <-- should have no effect on the tooltip
      expect(queryByText('TooltipText')).toBeTruthy();
    });
  });

  describe('useShowTooltip with on hover', () => {
    it('shows the tooltip after a delay', async () => {
      const { container, queryByText } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithoutDelay.hover(testElement);
      expect(testElement.querySelector('.pointerBox')).toBeFalsy();

      // moving the timer to simulate the delay before the tooltip is shown
      act(() => {
        jest.advanceTimersByTime(TOOLTIP_TIMEOUT);
      });

      // moving the timer to allow the tooltip to appear
      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(queryByText('TooltipText')).toBeTruthy();
    });

    it('hides the tooltip on mouseleave', async () => {
      const { container, queryByText } = render(<TestComponent />);
      const testElement = container.querySelector(
        '.test-element'
      ) as HTMLElement;

      await userEventWithoutDelay.hover(testElement);

      // making sure that the tooltip got shown
      await waitFor(() => {
        expect(queryByText('TooltipText')).toBeTruthy();
      });

      await userEventWithoutDelay.unhover(testElement);
      expect(queryByText('TooltipText')).toBeFalsy();
    });
  });
});
